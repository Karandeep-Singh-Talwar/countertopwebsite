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

import { medianColor } from './surface-cleanup';
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
/** Objects taller than this share of the photo (a fridge) break a cabinet's link to the floor. */
const MAX_OBJECT_RUN_SHARE = 0.15;
/** Inside the counter zone, pixels this close to the counter colour (share of the tolerance) join it. */
const ZONE_COLOR_SHARE = 0.8;
/** ...and pixels this close start new growth on their own. */
const ZONE_SEED_SHARE = 0.5;
/** Cabinet-labelled pixels may differ from the counter colour this many times more (veins, glare). */
const CABINET_COLOR_SLACK = 1.8;
/** Colour checks while growing the counter compare a box-blurred photo of this radius (share of the longer side), so granite speckle averages out. */
const COLOR_SMOOTHING_SHARE = 1 / 160;
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

/** Facing is judged over a neighbourhood this wide (share of photo width), not per pixel. */
const FACING_SMOOTHING = 0.03;

/**
 * Splits wall pixels into left-facing, frontal and right-facing planes. The
 * sideways slope is averaged over nearby wall pixels first (blur of slope x
 * wall / blur of wall), so a busy mosaic or star tile does not flip single
 * pixels between planes and shatter the wall into fragments.
 */
export function splitByFacing(wall: SurfaceMask, gradients: DisparityGradients, reference: number): SurfaceMask[] {
  const { width, height } = wall;
  const radius = Math.max(2, Math.round(width * FACING_SMOOTHING));
  const weight = Float32Array.from(wall.data, (v) => (v ? 1 : 0));
  const slope = boxBlur(Float32Array.from(gradients.gu, (g, i) => g * weight[i]), width, height, radius);
  const coverage = boxBlur(weight, width, height, radius);
  const groups = [emptyLike(wall), emptyLike(wall), emptyLike(wall)];
  for (let i = 0; i < wall.data.length; i++) {
    if (!wall.data[i]) continue;
    const g = slope[i] / Math.max(coverage[i], 1e-6) / reference;
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
  // A towel or a stool may stand in front of base cabinets; a fridge is too tall to.
  const maxObjectRun = Math.round(height * MAX_OBJECT_RUN_SHARE);
  for (let x = 0; x < width; x++) {
    let grounded = true;
    let objectRun = 0;
    for (let y = height - 1; y >= 0; y--) {
      const i = y * width + x;
      if (floor?.data[i]) {
        grounded = true;
        objectRun = 0;
      } else if (cabinets.data[i]) {
        if (grounded) out.data[i] = 255;
        objectRun = 0;
      } else if (objects?.data[i]) {
        objectRun++;
        if (objectRun > maxObjectRun) grounded = false;
      } else {
        grounded = false;
      }
    }
  }
  return out;
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
  zone: SurfaceMask | null = null,
): SurfaceMask {
  const { width, height } = seeds;
  const { gu, gv } = gradients;
  const out: SurfaceMask = { ...seeds, data: Uint8Array.from(seeds.data) };
  const smooth = boxBlurRgba(rgba, width, height, Math.max(1, Math.round(Math.max(width, height) * COLOR_SMOOTHING_SHARE)));
  const color = medianColor(smooth, seeds);
  const threshold = GROW_GRADIENT_RATIO * reference;
  const distance = (i: number) =>
    color === null ? Infinity : Math.hypot(smooth[i * 4] - color[0], smooth[i * 4 + 1] - color[1], smooth[i * 4 + 2] - color[2]);
  // Cabinet-labelled pixels get a looser colour check: enough to stop the
  // counter creeping onto white cabinet or sink fronts, loose enough for veins.
  const slopesUp = (i: number) =>
    gv[i] > threshold &&
    Math.abs(gu[i]) < 1.2 * gv[i] &&
    ((cabinets.data[i] !== 0 && distance(i) < COUNTER_COLOR_TOLERANCE * CABINET_COLOR_SLACK) ||
      (objects?.data[i] && distance(i) < COUNTER_COLOR_TOLERANCE));
  // In the counter zone (just above the base cabinets) colour alone is enough:
  // a counter seen nearly edge-on has no usable depth slope.
  const inZone = (i: number) => zone !== null && zone.data[i] !== 0 && distance(i) < COUNTER_COLOR_TOLERANCE * ZONE_COLOR_SHARE;
  const accepts = (i: number) => slopesUp(i) || inZone(i);

  // Zone pixels that closely match the counter seed new growth too: counter runs
  // separated by a range or a sink are not connected to the first seeds.
  if (zone) {
    for (let i = 0; i < out.data.length; i++) {
      if (zone.data[i] && distance(i) < COUNTER_COLOR_TOLERANCE * ZONE_SEED_SHARE) out.data[i] = 255;
    }
  }
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

/** Things nearer than the surrounding wall plane by this much normalised disparity are objects, not wall. */
const PROTRUSION_MIN = 0.008;
/** Neighbourhood (share of photo width) the local wall plane is fitted over. */
const PROTRUSION_RADIUS = 0.08;
/** A wall is "facing the camera" where its depth slope is below this share of the floor's. */
const FRONTAL_SLOPE_RATIO = 0.25;

/** Running-sum box filter: O(n) whatever the radius (Float64 for the regression sums). */
function runningBoxSum(src: Float64Array, width: number, height: number, radius: number): Float64Array {
  const pass = (input: Float64Array, horizontal: boolean) => {
    const out = new Float64Array(input.length);
    const lines = horizontal ? height : width;
    const length = horizontal ? width : height;
    const at = (line: number, k: number) => (horizontal ? line * width + k : k * width + line);
    for (let line = 0; line < lines; line++) {
      let sum = 0;
      for (let k = 0; k < Math.min(radius, length); k++) sum += input[at(line, k)];
      for (let k = 0; k < length; k++) {
        if (k + radius < length) sum += input[at(line, k + radius)];
        if (k - radius - 1 >= 0) sum -= input[at(line, k - radius - 1)];
        out[at(line, k)] = sum;
      }
    }
    return out;
  };
  return pass(pass(src, true), false);
}

/** Box-blurred copy of an RGBA image (alpha left opaque), as a new array. */
function boxBlurRgba(rgba: Uint8ClampedArray, width: number, height: number, radius: number): Uint8ClampedArray {
  const n = width * height;
  const counts = runningBoxSum(new Float64Array(n).fill(1), width, height, radius);
  const out = new Uint8ClampedArray(n * 4);
  for (let c = 0; c < 3; c++) {
    const channel = new Float64Array(n);
    for (let i = 0; i < n; i++) channel[i] = rgba[i * 4 + c];
    const sums = runningBoxSum(channel, width, height, radius);
    for (let i = 0; i < n; i++) out[i * 4 + c] = sums[i] / counts[i];
  }
  for (let i = 0; i < n; i++) out[i * 4 + 3] = 255;
  return out;
}

/**
 * Fits the local wall plane over `weights` and flags pixels of `wall` standing
 * out from it. Also returns the fitted plane's slope per pixel, which - unlike
 * raw pixel slopes - is not inflated by the edges of objects on the wall.
 */
function flagAbovePlane(wall: SurfaceMask, depth: Float64Array, weights: Uint8Array, radius: number): { flags: SurfaceMask; slope: Float32Array } {
  const { width, height } = wall;
  const n = width * height;
  const w = new Float64Array(n);
  const moments = Array.from({ length: 8 }, () => new Float64Array(n));
  const [wx, wy, wxx, wxy, wyy, wd, wxd, wyd] = moments;
  for (let i = 0; i < n; i++) {
    if (!weights[i]) continue;
    const x = i % width;
    const y = (i - x) / width;
    const d = depth[i];
    w[i] = 1;
    wx[i] = x;
    wy[i] = y;
    wxx[i] = x * x;
    wxy[i] = x * y;
    wyy[i] = y * y;
    wd[i] = d;
    wxd[i] = x * d;
    wyd[i] = y * d;
  }
  const S = runningBoxSum(w, width, height, radius);
  const [Sx, Sy, Sxx, Sxy, Syy, Sd, Sxd, Syd] = moments.map((m) => runningBoxSum(m, width, height, radius));

  const out = emptyLike(wall);
  const slope = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    if (!wall.data[i] || S[i] < 12) continue;
    // Solve the 3x3 normal equations for d = a + b*x + c*y (Cramer's rule).
    const m00 = S[i], m01 = Sx[i], m02 = Sy[i], m11 = Sxx[i], m12 = Sxy[i], m22 = Syy[i];
    const r0 = Sd[i], r1 = Sxd[i], r2 = Syd[i];
    const det = m00 * (m11 * m22 - m12 * m12) - m01 * (m01 * m22 - m12 * m02) + m02 * (m01 * m12 - m11 * m02);
    const x = i % width;
    const y = (i - x) / width;
    let predicted: number;
    if (Math.abs(det) < 1e-6) {
      predicted = r0 / m00;
    } else {
      const a = (r0 * (m11 * m22 - m12 * m12) - m01 * (r1 * m22 - m12 * r2) + m02 * (r1 * m12 - m11 * r2)) / det;
      const b = (m00 * (r1 * m22 - m12 * r2) - r0 * (m01 * m22 - m12 * m02) + m02 * (m01 * r2 - r1 * m02)) / det;
      const c = (m00 * (m11 * r2 - r1 * m12) - m01 * (m01 * r2 - r1 * m02) + r0 * (m01 * m12 - m11 * m02)) / det;
      predicted = a + b * x + c * y;
      slope[i] = Math.hypot(b, c);
    }
    if (depth[i] - predicted > PROTRUSION_MIN) out.data[i] = 255;
  }
  return { flags: out, slope };
}

/**
 * Pixels of `wall` that stand out toward the camera from the wall plane
 * around them: canisters, bottles and appliances the scene model mislabels
 * as wall. Disparity is linear across any flat wall, so a weighted local
 * linear fit (box-filtered moments) predicts the wall even where it recedes
 * steeply into a corner. Two passes: a big object inside the window tilts
 * the first fit toward itself, so the second fit leaves first-pass bumps out.
 */
export function protrusions(wall: SurfaceMask, disparity: Float32Array, reference: number): SurfaceMask {
  const { width, height } = wall;
  let min = Infinity;
  let max = -Infinity;
  for (const v of disparity) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const range = max - min || 1;
  const depth = Float64Array.from(disparity, (v) => (v - min) / range);
  const radius = Math.max(3, Math.round(width * PROTRUSION_RADIUS));
  const first = flagAbovePlane(wall, depth, wall.data, radius).flags;
  const wallOnly = Uint8Array.from(wall.data, (v, i) => (v && !first.data[i] ? 255 : 0));
  const { flags: second, slope: planeSlope } = flagAbovePlane(wall, depth, wallOnly, radius);
  for (let i = 0; i < second.data.length; i++) if (first.data[i]) second.data[i] = 255;

  // Where the wall faces the camera, a plain local average is the sharper
  // test (mid-size objects cannot tilt it). On receding walls it would
  // misfire, so it only applies where the wall's own depth slope is small.
  const weight = Float32Array.from(wallOnly, (v) => (v ? 1 : 0));
  const local = boxBlur(Float32Array.from(depth, (d, i) => d * weight[i]), width, height, radius);
  const coverage = boxBlur(weight, width, height, radius);
  for (let i = 0; i < second.data.length; i++) {
    if (!wall.data[i] || coverage[i] < 1e-3) continue;
    const frontal = planeSlope[i] < FRONTAL_SLOPE_RATIO * reference;
    if (frontal && depth[i] - local[i] / coverage[i] > PROTRUSION_MIN) second.data[i] = 255;
  }
  return second;
}
