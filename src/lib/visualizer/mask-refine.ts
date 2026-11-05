// Mask clean-up and hand editing, all classic image processing. Edge
// refinement re-decides boundary pixels by local colour, so outlines hug the
// counter lip or cabinet door; the magic wand grows selections over
// edge-following superpixels.

import type { Superpixels } from './superpixels';
import { apply, quadToSquare, type Point, type Quad } from './homography';
import type { SurfaceMask } from './types';

/** The wand never grabs more than this share of the photo, so a low-contrast photo cannot flood everything. */
const MAX_WAND_SHARE = 0.35;

/** Summed-area table: any box sum in O(1). */
function integral(values: (i: number) => number, width: number, height: number): Float64Array {
  const table = new Float64Array((width + 1) * (height + 1));
  for (let y = 0; y < height; y++) {
    let row = 0;
    for (let x = 0; x < width; x++) {
      row += values(y * width + x);
      table[(y + 1) * (width + 1) + x + 1] = table[y * (width + 1) + x + 1] + row;
    }
  }
  return table;
}

function boxSum(table: Float64Array, width: number, height: number, x: number, y: number, r: number): number {
  const x0 = Math.max(0, x - r);
  const y0 = Math.max(0, y - r);
  const x1 = Math.min(width, x + r + 1);
  const y1 = Math.min(height, y + r + 1);
  const w = width + 1;
  return table[y1 * w + x1] - table[y0 * w + x1] - table[y1 * w + x0] + table[y0 * w + x0];
}

/**
 * Re-decides every pixel within `band` pixels of the mask's edge by colour:
 * is it closer to the surface's colour just inside the edge, or to what lies
 * just outside? A detection that spills a few pixels onto a cabinet door, or
 * stops short of the real wall edge, snaps to the true colour boundary.
 * (A light, local cousin of GrabCut - no model involved.)
 */
export function refineEdges(mask: SurfaceMask, rgba: Uint8ClampedArray, band: number): SurfaceMask {
  const { width, height } = mask;
  const on = (i: number) => (mask.data[i] ? 1 : 0);
  const coverage = integral(on, width, height);
  const full = (x: number, y: number) => boxSum(coverage, width, height, x, y, band);
  const area = (x: number, y: number) => {
    const w = Math.min(width, x + band + 1) - Math.max(0, x - band);
    const h = Math.min(height, y + band + 1) - Math.max(0, y - band);
    return w * h;
  };

  // "Core" pixels sit deeper than the band on either side; they define the colours to compare with.
  const core = new Int8Array(width * height); // 1 inside core, -1 outside core, 0 uncertain band
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const s = full(x, y);
      core[y * width + x] = s === area(x, y) ? 1 : s === 0 ? -1 : 0;
    }
  }
  const r = band * 2;
  const tables = [1, -1].map((side) => ({
    count: integral((i) => (core[i] === side ? 1 : 0), width, height),
    channels: [0, 1, 2].map((c) => integral((i) => (core[i] === side ? rgba[i * 4 + c] : 0), width, height)),
  }));

  const data = Uint8Array.from(mask.data);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      if (core[i] !== 0) continue;
      const [inside, outside] = tables.map((t) => {
        const n = boxSum(t.count, width, height, x, y, r);
        return n < 4 ? null : t.channels.map((ch) => boxSum(ch, width, height, x, y, r) / n);
      });
      if (!inside || !outside) continue;
      const dist = (mean: number[]) => Math.hypot(rgba[i * 4] - mean[0], rgba[i * 4 + 1] - mean[1], rgba[i * 4 + 2] - mean[2]);
      data[i] = dist(inside) <= dist(outside) ? 255 : 0;
    }
  }
  return { width, height, data };
}

const deltaE = (sp: Superpixels, a: number, b: number) =>
  Math.hypot(sp.color[a * 3] - sp.color[b * 3], sp.color[a * 3 + 1] - sp.color[b * 3 + 1], sp.color[a * 3 + 2] - sp.color[b * 3 + 2]);

/**
 * Magic wand: from the patch under `point` (photo pixels), grows through
 * touching patches whose colour stays within `tolerance` (CIELAB delta-E) of
 * the tapped patch, and that do not cross a sharp edge between neighbours.
 */
export function magicWand(sp: Superpixels, point: Point, photoWidth: number, photoHeight: number, tolerance: number): SurfaceMask {
  const x = Math.min(sp.width - 1, Math.max(0, Math.floor((point.x / photoWidth) * sp.width)));
  const y = Math.min(sp.height - 1, Math.max(0, Math.floor((point.y / photoHeight) * sp.height)));
  const seed = sp.labels[y * sp.width + x];
  const chosen = new Uint8Array(sp.count);
  chosen[seed] = 1;
  const budget = MAX_WAND_SHARE * sp.labels.length;
  let area = sp.size[seed];
  const queue = [seed];
  while (queue.length > 0 && area < budget) {
    const k = queue.shift() as number;
    for (const n of sp.neighbors[k]) {
      if (chosen[n]) continue;
      if (deltaE(sp, n, seed) > tolerance || deltaE(sp, n, k) > tolerance * 0.6) continue;
      chosen[n] = 1;
      area += sp.size[n];
      queue.push(n);
    }
  }
  const data = new Uint8Array(sp.labels.length);
  for (let i = 0; i < data.length; i++) if (chosen[sp.labels[i]]) data[i] = 255;
  return { width: sp.width, height: sp.height, data };
}

/**
 * Grows a partial detection to whole superpixels: any patch at least `share`
 * covered becomes fully covered. Patch borders follow object outlines, so a
 * canister flagged on half its pixels is taken out whole.
 */
export function expandToSuperpixels(mask: SurfaceMask, sp: Superpixels, share: number): SurfaceMask {
  if (mask.width !== sp.width || mask.height !== sp.height) return mask;
  const hits = new Float32Array(sp.count);
  for (let i = 0; i < sp.labels.length; i++) if (mask.data[i]) hits[sp.labels[i]]++;
  const data = new Uint8Array(mask.data.length);
  for (let i = 0; i < data.length; i++) {
    const k = sp.labels[i];
    if (mask.data[i] || hits[k] >= share * sp.size[k]) data[i] = 255;
  }
  return { width: mask.width, height: mask.height, data };
}

/**
 * Pixels of a `width` x `height` mask that fall inside `corners` (photo
 * pixels) and, when given, inside `within` too: what a hand-placed surface
 * currently paints, as a plain mask the wand and eraser can edit.
 */
export function quadToMask(corners: Quad, photoWidth: number, photoHeight: number, width: number, height: number, within?: SurfaceMask): SurfaceMask {
  const data = new Uint8Array(width * height);
  const toSquare = quadToSquare(corners);
  if (!toSquare) return { width, height, data };
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const uv = apply(toSquare, { x: ((x + 0.5) / width) * photoWidth, y: ((y + 0.5) / height) * photoHeight });
      if (uv.x < 0 || uv.x > 1 || uv.y < 0 || uv.y > 1) continue;
      if (within) {
        const wx = Math.min(within.width - 1, Math.floor((x / width) * within.width));
        const wy = Math.min(within.height - 1, Math.floor((y / height) * within.height));
        if (!within.data[wy * within.width + wx]) continue;
      }
      data[y * width + x] = 255;
    }
  }
  return { width, height, data };
}

/** Adds or removes `region` from `mask`, resampling when resolutions differ. Returns a new mask. */
export function editMask(mask: SurfaceMask | undefined, region: SurfaceMask, mode: 'add' | 'erase'): SurfaceMask {
  const base = mask ?? { width: region.width, height: region.height, data: new Uint8Array(region.width * region.height) };
  const data = Uint8Array.from(base.data);
  for (let y = 0; y < base.height; y++) {
    const ry = Math.min(region.height - 1, Math.floor((y / base.height) * region.height));
    for (let x = 0; x < base.width; x++) {
      const rx = Math.min(region.width - 1, Math.floor((x / base.width) * region.width));
      if (!region.data[ry * region.width + rx]) continue;
      data[y * base.width + x] = mode === 'add' ? 255 : 0;
    }
  }
  return { width: base.width, height: base.height, data };
}
