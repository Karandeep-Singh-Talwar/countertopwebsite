// Geometric clean-up of detected surfaces - classic image processing only.
//
// The scene model reads busy finishes (glass mosaic, star tiles, speckled
// granite) unreliably: it leaves holes, unpainted halos around appliances,
// misses counter front edges and the backsplash band, and shatters walls into
// fragments. These passes repair that using what is known about kitchens:
// backsplashes run from the counter up to the wall cabinets, counter edges
// share the counter's colour, and walls are big continuous planes.

import type { SurfaceMask } from './types';

export const emptyMask = (width: number, height: number): SurfaceMask => ({ width, height, data: new Uint8Array(width * height) });

/** Union of masks (null-tolerant), as a new mask. */
export function unite(width: number, height: number, ...masks: (SurfaceMask | null | undefined)[]): SurfaceMask {
  const out = emptyMask(width, height);
  for (const m of masks) if (m) for (let i = 0; i < out.data.length; i++) if (m.data[i]) out.data[i] = 255;
  return out;
}

const neighbours = (i: number, width: number, length: number) => {
  const x = i % width;
  return [x > 0 ? i - 1 : -1, x < width - 1 ? i + 1 : -1, i >= width ? i - width : -1, i + width < length ? i + width : -1];
};

/**
 * Fills holes fully enclosed by the surface (not touching the photo border)
 * unless they are mostly a recognised object or fixture. Star-tile motifs,
 * mosaic gaps and granite flecks fill; a kettle standing on the counter does not.
 */
export function fillHoles(mask: SurfaceMask, keepOut: SurfaceMask, maxHoleShare: number): SurfaceMask {
  const { width, height } = mask;
  const length = width * height;
  const area = mask.data.reduce((sum, v) => sum + (v ? 1 : 0), 0);
  const out: SurfaceMask = { width, height, data: Uint8Array.from(mask.data) };
  const seen = new Uint8Array(length);
  const stack: number[] = [];
  for (let start = 0; start < length; start++) {
    if (mask.data[start] || seen[start]) continue;
    const pixels: number[] = [];
    let touchesBorder = false;
    let blocked = 0;
    seen[start] = 1;
    stack.push(start);
    while (stack.length > 0) {
      const i = stack.pop() as number;
      pixels.push(i);
      const x = i % width;
      const y = (i - x) / width;
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) touchesBorder = true;
      if (keepOut.data[i]) blocked++;
      for (const j of neighbours(i, width, length)) {
        if (j < 0 || seen[j] || mask.data[j]) continue;
        seen[j] = 1;
        stack.push(j);
      }
    }
    if (touchesBorder || pixels.length > maxHoleShare * area || blocked > pixels.length * 0.3) continue;
    for (const i of pixels) out.data[i] = 255;
  }
  return out;
}

/**
 * Grows the surface up to `radius` pixels into anything that is not a
 * barrier (objects, fixtures, other surfaces), closing the unpainted halo the
 * detector leaves around mixers, kettles and utensil holders.
 */
export function closeHalos(mask: SurfaceMask, barrier: SurfaceMask, radius: number): SurfaceMask {
  const { width, height } = mask;
  const length = width * height;
  const distance = new Int32Array(length).fill(-1);
  const queue: number[] = [];
  for (let i = 0; i < length; i++) {
    if (!mask.data[i]) continue;
    distance[i] = 0;
    queue.push(i);
  }
  const out: SurfaceMask = { width, height, data: Uint8Array.from(mask.data) };
  for (let head = 0; head < queue.length; head++) {
    const i = queue[head];
    if (distance[i] >= radius) continue;
    for (const j of neighbours(i, width, length)) {
      if (j < 0 || distance[j] !== -1 || barrier.data[j]) continue;
      distance[j] = distance[i] + 1;
      out.data[j] = 255;
      queue.push(j);
    }
  }
  return out;
}

/**
 * The backsplash band: in every column, from just above the countertop up to
 * the first wall cabinet, hood, window or ceiling. Appliances standing in
 * front are skipped (they stay in front) but do not end the band. Columns
 * that reach `maxRows` without hitting a stop are left alone - that is open
 * wall, which the wall detection already covers.
 */
export function backsplashBand(counter: SurfaceMask, stops: SurfaceMask, objects: SurfaceMask | null, maxRows: number): SurfaceMask {
  const { width, height } = counter;
  const out = emptyMask(width, height);
  for (let x = 0; x < width; x++) {
    let top = -1;
    for (let y = 0; y < height; y++) {
      if (counter.data[y * width + x]) {
        top = y;
        break;
      }
    }
    if (top <= 0) continue;
    let end = -1;
    for (let y = top - 1; y >= Math.max(0, top - maxRows); y--) {
      if (stops.data[y * width + x]) {
        end = y;
        break;
      }
    }
    if (end === -1) continue;
    for (let y = end + 1; y < top; y++) {
      const i = y * width + x;
      if (!objects?.data[i]) out.data[i] = 255;
    }
  }
  return out;
}

/** Rows at the top of a counter edge where brightness may jump (the bullnose highlight). */
const SEAM_SKIP_ROWS = 2;
/** Brightness step that marks the seam between counter edge and cabinet front. */
const SEAM_STEP = 22;

/** Median RGB under a mask. */
export function medianColor(rgba: Uint8ClampedArray, mask: SurfaceMask): [number, number, number] | null {
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
 * Adds the counter's front edge: from every bottom boundary of the top
 * surface, extends downward through pixels of the counter's own colour (the
 * edge is the same stone) for at most `rows` pixels, stopping at objects and
 * at the first pixel that looks like the cabinet front instead.
 */
export function addFrontEdge(counter: SurfaceMask, rgba: Uint8ClampedArray, objects: SurfaceMask | null, rows: number, tolerance: number): SurfaceMask {
  const { width, height } = counter;
  const color = medianColor(rgba, counter);
  if (!color) return counter;
  const out: SurfaceMask = { width, height, data: Uint8Array.from(counter.data) };
  const matches = (i: number) => Math.hypot(rgba[i * 4] - color[0], rgba[i * 4 + 1] - color[1], rgba[i * 4 + 2] - color[2]) < tolerance;
  const luma = (i: number) => 0.2126 * rgba[i * 4] + 0.7152 * rgba[i * 4 + 1] + 0.0722 * rgba[i * 4 + 2];
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height - 1; y++) {
      if (!counter.data[y * width + x] || counter.data[(y + 1) * width + x]) continue;
      for (let k = 1; k <= rows && y + k < height; k++) {
        const i = (y + k) * width + x;
        if (counter.data[i] || objects?.data[i] || !matches(i)) break;
        // A white counter over white drawers matches by colour; the shadow seam
        // between them does not. Stop there (past the edge's own first rows).
        if (k > SEAM_SKIP_ROWS && Math.abs(luma(i) - luma(i - width)) > SEAM_STEP) break;
        out.data[i] = 255;
      }
    }
  }
  return out;
}

function components(mask: SurfaceMask): number[][] {
  const length = mask.data.length;
  const seen = new Uint8Array(length);
  const result: number[][] = [];
  for (let start = 0; start < length; start++) {
    if (!mask.data[start] || seen[start]) continue;
    const pixels: number[] = [];
    const stack = [start];
    seen[start] = 1;
    while (stack.length > 0) {
      const i = stack.pop() as number;
      pixels.push(i);
      for (const j of neighbours(i, mask.width, length)) {
        if (j < 0 || seen[j] || !mask.data[j]) continue;
        seen[j] = 1;
        stack.push(j);
      }
    }
    result.push(pixels);
  }
  return result;
}

/**
 * Wall planes split by facing direction shatter on noisy finishes. Fragments
 * smaller than `minPixels` join whichever other plane they touch most, rather
 * than vanishing and leaving holes.
 */
export function absorbFragments(planes: SurfaceMask[], minPixels: number): SurfaceMask[] {
  if (planes.length < 2) return planes;
  const { width, height } = planes[0];
  const length = width * height;
  const owner = new Int8Array(length).fill(-1);
  planes.forEach((p, k) => {
    for (let i = 0; i < length; i++) if (p.data[i]) owner[i] = k;
  });
  const out = planes.map((p) => ({ width, height, data: Uint8Array.from(p.data) }));
  planes.forEach((plane, k) => {
    for (const pixels of components(plane)) {
      if (pixels.length >= minPixels) continue;
      const touching = new Array(planes.length).fill(0);
      for (const i of pixels) for (const j of neighbours(i, width, length)) if (j >= 0 && owner[j] !== -1 && owner[j] !== k) touching[owner[j]]++;
      const best = touching.indexOf(Math.max(...touching));
      if (touching[best] === 0) continue;
      for (const i of pixels) {
        out[k].data[i] = 0;
        out[best].data[i] = 255;
        owner[i] = best;
      }
    }
  });
  return out;
}

/**
 * Drops horizontal runs narrower than `minRun` pixels. Counter tops are wide
 * in every row; a thin vertical sliver is a white end panel or cabinet side
 * that matched the counter's colour, not the counter itself.
 */
export function dropNarrowRuns(mask: SurfaceMask, minRun: number): SurfaceMask {
  const { width, height } = mask;
  const data = Uint8Array.from(mask.data);
  for (let y = 0; y < height; y++) {
    let start = -1;
    for (let x = 0; x <= width; x++) {
      const on = x < width && data[y * width + x] !== 0;
      if (on && start < 0) start = x;
      if (on || start < 0) continue;
      if (x - start < minRun) data.fill(0, y * width + start, y * width + x);
      start = -1;
    }
  }
  return { width, height, data };
}

/**
 * Removes `mask` pixels lying below `surface` in the same column. Nothing
 * under a countertop is wall: the model's "wall" there is a cabinet front or
 * a peninsula's end panel.
 */
export function removeBelow(mask: SurfaceMask, surface: SurfaceMask): SurfaceMask {
  const { width, height } = mask;
  const out: SurfaceMask = { width, height, data: Uint8Array.from(mask.data) };
  for (let x = 0; x < width; x++) {
    let lowest = -1;
    for (let y = height - 1; y >= 0; y--) {
      if (surface.data[y * width + x]) {
        lowest = y;
        break;
      }
    }
    if (lowest === -1) continue;
    for (let y = lowest + 1; y < height; y++) out.data[y * width + x] = 0;
  }
  return out;
}

