// Surface orientation from a monocular depth model, without camera calibration.
//
// For any flat surface, disparity (inverse depth) is linear in image
// coordinates, so its gradient is constant over the surface and points along
// the image-plane part of the surface normal. Depth models return disparity up
// to an unknown scale and shift: the shift vanishes in the gradient and the
// scale is shared by the whole photo, so comparing gradient directions and
// relative sizes is enough to tell counter tops from cabinet fronts, and one
// wall plane from another. This is the in-browser stand-in for Roomvo's
// server-side depth + plane fitting.

import type { SurfaceMask } from './types';

export interface DisparityGradients {
  width: number;
  height: number;
  /** Change in normalised disparity per pixel, left to right. */
  gu: Float32Array;
  /** Change in normalised disparity per pixel, top to bottom. */
  gv: Float32Array;
  /** Blur radius used; a depth jump smears into a gradient spike about twice this wide. */
  smoothing: number;
}

/** A surface counts as a "top" when it recedes at least this fast relative to the floor. */
const TOP_GRADIENT_RATIO = 0.45;
/** A step toward the camera at least this strong (relative to the floor) marks a counter lip. */
const LIP_STEP_RATIO = 2;
/** Growing a counter accepts gentler slopes than seeding it, since it starts from sure pixels. */
const GROW_GRADIENT_RATIO = 0.3;
/** Max RGB distance from the counter's own colour for pixels the model called an object. */
const COUNTER_COLOR_TOLERANCE = 48;
/** Walls turning away faster than this (relative to the floor) are side walls. */
const SIDE_WALL_RATIO = 0.35;
/** Floor pixels needed before trusting the floor as the gradient reference. */
const MIN_FLOOR_SAMPLES = 300;
/** Typical floor gradient of a normalised disparity map, per pixel at 1px width (measured). */
const FALLBACK_REFERENCE_PER_WIDTH = 0.9;

function boxBlur(src: Float32Array, width: number, height: number, radius: number): Float32Array {
  const pass = (input: Float32Array, horizontal: boolean) => {
    const out = new Float32Array(input.length);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let sum = 0;
        let count = 0;
        for (let d = -radius; d <= radius; d++) {
          const xx = horizontal ? x + d : x;
          const yy = horizontal ? y : y + d;
          if (xx < 0 || xx >= width || yy < 0 || yy >= height) continue;
          sum += input[yy * width + xx];
          count++;
        }
        out[y * width + x] = sum / count;
      }
    }
    return out;
  };
  return pass(pass(src, true), false);
}

/** Normalises, smooths and Sobel-differentiates a disparity map. */
export function disparityGradients(disparity: Float32Array, width: number, height: number): DisparityGradients {
  let min = Infinity;
  let max = -Infinity;
  for (const v of disparity) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const range = max - min || 1;
  const normalised = Float32Array.from(disparity, (v) => (v - min) / range);
  const smoothing = Math.max(1, Math.round(width / 160));
  const smooth = boxBlur(normalised, width, height, smoothing);

  const gu = new Float32Array(width * height);
  const gv = new Float32Array(width * height);
  const at = (x: number, y: number) => smooth[y * width + x];
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x;
      gu[i] = (at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1) - at(x - 1, y - 1) - 2 * at(x - 1, y) - at(x - 1, y + 1)) / 8;
      gv[i] = (at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1) - at(x - 1, y - 1) - 2 * at(x, y - 1) - at(x + 1, y - 1)) / 8;
    }
  }
  return { width, height, gu, gv, smoothing };
}

/** How fast the floor recedes: the yardstick every other surface is measured against. */
export function floorReference(gradients: DisparityGradients, floor: SurfaceMask | null): number {
  const fallback = FALLBACK_REFERENCE_PER_WIDTH / gradients.width;
  if (!floor) return fallback;
  const samples: number[] = [];
  for (let i = 0; i < floor.data.length; i++) if (floor.data[i]) samples.push(gradients.gv[i]);
  if (samples.length < MIN_FLOOR_SAMPLES) return fallback;
  samples.sort((a, b) => a - b);
  const median = samples[Math.floor(samples.length / 2)];
  return median > 0 ? median : fallback;
}

function emptyLike(mask: SurfaceMask): SurfaceMask {
  return { width: mask.width, height: mask.height, data: new Uint8Array(mask.data.length) };
}

/**
 * Pixels of `host` (cabinets, islands, counters) that face upward: they
 * recede downward-to-upward like the floor does. Cabinet fronts barely change
 * depth and wall-cabinet undersides recede the other way, so both drop out.
 *
 * A depth jump (say, where a cabinet edge meets the wall behind it) also
 * produces a strong gradient, but only in a spike reaching about smoothing+1
 * pixels either side. Requiring the slope to persist just beyond that, above
 * and below, keeps real surfaces (even thin counter bands) and rejects edges.
 */
export function upwardFacing(host: SurfaceMask, gradients: DisparityGradients, reference: number): SurfaceMask {
  const { width, gu, gv } = gradients;
  const out = emptyLike(host);
  const threshold = TOP_GRADIENT_RATIO * reference;
  const span = (gradients.smoothing + 2) * width;
  const slopesUp = (i: number) => i >= 0 && i < gv.length && gv[i] > threshold && Math.abs(gu[i]) < gv[i];
  for (let i = 0; i < host.data.length; i++) {
    if (host.data[i] && slopesUp(i) && slopesUp(i - span) && slopesUp(i + span)) out.data[i] = 255;
  }
  return out;
}

/**
 * Counter tops seen nearly edge-on (common for the run straight ahead) are
 * too thin for the depth model to resolve a slope; they appear as a single
 * step toward the camera where the backsplash meets the base cabinets. Only
 * steps sandwiched between wall above and cabinet below qualify: wall-cabinet
 * undersides step the other way, and upper-cabinet tops have ceiling above.
 */
export function counterLips(
  wall: SurfaceMask,
  cabinets: SurfaceMask,
  gradients: DisparityGradients,
  reference: number,
  rows: number,
): SurfaceMask {
  const { width, height } = wall;
  const { gu, gv } = gradients;
  const out = emptyLike(wall);
  const threshold = LIP_STEP_RATIO * reference;
  const wallAbove = new Int32Array(width * height);
  for (let x = 0; x < width; x++) {
    let d = Infinity;
    for (let y = 0; y < height; y++) {
      const i = y * width + x;
      d = wall.data[i] ? 0 : d + 1;
      wallAbove[i] = Math.min(d, rows + 1);
    }
  }
  for (let x = 0; x < width; x++) {
    let cabinetBelow = Infinity;
    for (let y = height - 1; y >= 0; y--) {
      const i = y * width + x;
      cabinetBelow = cabinets.data[i] ? 0 : cabinetBelow + 1;
      if (cabinetBelow <= rows && wallAbove[i] <= rows && gv[i] > threshold && Math.abs(gu[i]) < gv[i]) out.data[i] = 255;
    }
  }
  return out;
}

/**
 * Adds `candidate` pixels lying at most `rows` above a `base` pixel in the same
 * column. Seen from standing height, a counter top is a thin band directly
 * above the cabinet fronts, and scene models often call that band "wall".
 * Geometry, not the label, then decides whether it really faces up.
 */
export function extendUpward(base: SurfaceMask, candidate: SurfaceMask, rows: number): SurfaceMask {
  const { width, height } = base;
  const out: SurfaceMask = { width, height, data: Uint8Array.from(base.data) };
  for (let x = 0; x < width; x++) {
    let distanceToBase = Infinity;
    for (let y = height - 1; y >= 0; y--) {
      const i = y * width + x;
      distanceToBase = base.data[i] ? 0 : distanceToBase + 1;
      if (candidate.data[i] && distanceToBase <= rows) out.data[i] = 255;
    }
  }
  return out;
}

/** Splits wall pixels into left-facing, frontal and right-facing planes. */
export function splitByFacing(wall: SurfaceMask, gradients: DisparityGradients, reference: number): SurfaceMask[] {
  const groups = [emptyLike(wall), emptyLike(wall), emptyLike(wall)];
  for (let i = 0; i < wall.data.length; i++) {
    if (!wall.data[i]) continue;
    const g = gradients.gu[i] / reference;
    const group = g < -SIDE_WALL_RATIO ? 0 : g > SIDE_WALL_RATIO ? 2 : 1;
    groups[group].data[i] = 255;
  }
  return groups;
}

function morph(mask: SurfaceMask, grow: boolean): SurfaceMask {
  const { width, height, data } = mask;
  const out = emptyLike(mask);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let hit = !grow;
      for (let dy = -1; dy <= 1 && hit !== grow; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          const yy = y + dy;
          const on = xx >= 0 && xx < width && yy >= 0 && yy < height && data[yy * width + xx] !== 0;
          if (on === grow) {
            hit = grow;
            break;
          }
        }
      }
      if (hit) out.data[y * width + x] = 255;
    }
  }
  return out;
}

/** Morphological closing: bridges the small gaps a noisy per-pixel test leaves in thin counter bands. */
export function closeMask(mask: SurfaceMask, iterations: number): SurfaceMask {
  let m = mask;
  for (let k = 0; k < iterations; k++) m = morph(m, true);
  for (let k = 0; k < iterations; k++) m = morph(m, false);
  return m;
}

/**
 * Base cabinets: cabinet pixels whose column runs down to the floor (or the
 * photo's bottom edge), passing through objects such as towels or people in
 * front. Upper cabinets hang above a wall, so they never qualify - which stops
 * the tops of wall cabinets being mistaken for counter lips.
 */
export function groundedCabinets(cabinets: SurfaceMask, floor: SurfaceMask | null, objects: SurfaceMask | null): SurfaceMask {
  const { width, height } = cabinets;
  const out = emptyLike(cabinets);
  for (let x = 0; x < width; x++) {
    let grounded = true;
    for (let y = height - 1; y >= 0; y--) {
      const i = y * width + x;
      if (floor?.data[i]) {
        grounded = true;
      } else if (cabinets.data[i]) {
        if (grounded) out.data[i] = 255;
      } else if (!objects?.data[i]) {
        grounded = false;
      }
    }
  }
  return out;
}

/** Median RGB of the photo under `mask`. */
function medianColor(rgba: Uint8ClampedArray, mask: SurfaceMask): [number, number, number] | null {
  const channels: number[][] = [[], [], []];
  for (let i = 0; i < mask.data.length; i++) {
    if (!mask.data[i]) continue;
    for (let c = 0; c < 3; c++) channels[c].push(rgba[i * 4 + c]);
  }
  if (channels[0].length === 0) return null;
  const median = (a: number[]) => a.sort((p, q) => p - q)[Math.floor(a.length / 2)];
  return [median(channels[0]), median(channels[1]), median(channels[2])];
}

/**
 * Flood-fills a counter outward from sure pixels (`seeds`) through neighbours
 * that face up the same way. Cabinet-labelled pixels only need the right
 * slope; pixels labelled as an object (scene models often call the counter
 * around a hob "stove") must also match the counter's colour, so the counter
 * surface joins in while a steel hob or a white mug stays out.
 */
export function growCounter(
  seeds: SurfaceMask,
  cabinets: SurfaceMask,
  objects: SurfaceMask | null,
  gradients: DisparityGradients,
  reference: number,
  rgba: Uint8ClampedArray,
): SurfaceMask {
  const { width } = seeds;
  const { gu, gv } = gradients;
  const out: SurfaceMask = { ...seeds, data: Uint8Array.from(seeds.data) };
  const color = medianColor(rgba, seeds);
  const threshold = GROW_GRADIENT_RATIO * reference;
  const matchesCounter = (i: number) =>
    color !== null &&
    Math.hypot(rgba[i * 4] - color[0], rgba[i * 4 + 1] - color[1], rgba[i * 4 + 2] - color[2]) < COUNTER_COLOR_TOLERANCE;
  const accepts = (i: number) =>
    gv[i] > threshold && Math.abs(gu[i]) < 1.2 * gv[i] && (cabinets.data[i] !== 0 || (objects?.data[i] && matchesCounter(i)));

  const queue: number[] = [];
  for (let i = 0; i < out.data.length; i++) if (out.data[i]) queue.push(i);
  while (queue.length > 0) {
    const i = queue.pop() as number;
    const x = i % width;
    for (const j of [x > 0 ? i - 1 : -1, x < width - 1 ? i + 1 : -1, i - width, i + width]) {
      if (j < 0 || j >= out.data.length || out.data[j] || !accepts(j)) continue;
      out.data[j] = 255;
      queue.push(j);
    }
  }
  return out;
}

/** Object pixels that do not look like the counter: these must stay in front even after hole-filling. */
export function foreignObjects(objects: SurfaceMask, counter: SurfaceMask, rgba: Uint8ClampedArray): SurfaceMask {
  const out = emptyLike(objects);
  const color = medianColor(rgba, counter);
  for (let i = 0; i < objects.data.length; i++) {
    if (!objects.data[i]) continue;
    const near =
      color !== null &&
      Math.hypot(rgba[i * 4] - color[0], rgba[i * 4 + 1] - color[1], rgba[i * 4 + 2] - color[2]) < COUNTER_COLOR_TOLERANCE;
    if (!near) out.data[i] = 255;
  }
  return out;
}
