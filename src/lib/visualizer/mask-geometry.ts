// Turns a class mask from the segmentation model into separate surfaces: one
// per connected region, each with a perspective quad and a label anchor.
// Roomvo does this with per-plane 3D fitting on its servers; a hull-based quad
// is the lightweight in-browser approximation (users can still drag corners).

import type { Point, Quad } from './homography';
import type { SurfaceMask } from './types';

export interface MaskRegion {
  mask: SurfaceMask;
  /** Fraction of all mask pixels covered by this region. */
  area: number;
  /** Corners in mask pixel coordinates: TL, TR, BR, BL. */
  quad: Quad;
  /** Centroid in mask pixel coordinates. */
  centroid: Point;
}

/** Splits a binary mask into 4-connected regions, largest first. */
export function connectedRegions(mask: SurfaceMask, minAreaFraction: number): SurfaceMask[] {
  const { width, height, data } = mask;
  const total = width * height;
  const labels = new Int32Array(total).fill(-1);
  const stack = new Int32Array(total);
  const regions: { pixels: number[]; size: number }[] = [];

  for (let start = 0; start < total; start++) {
    if (data[start] === 0 || labels[start] !== -1) continue;
    const id = regions.length;
    const pixels: number[] = [];
    let top = 0;
    stack[top++] = start;
    labels[start] = id;
    while (top > 0) {
      const i = stack[--top];
      pixels.push(i);
      const x = i % width;
      const neighbours = [x > 0 ? i - 1 : -1, x < width - 1 ? i + 1 : -1, i - width, i + width];
      for (const n of neighbours) {
        if (n < 0 || n >= total || data[n] === 0 || labels[n] !== -1) continue;
        labels[n] = id;
        stack[top++] = n;
      }
    }
    regions.push({ pixels, size: pixels.length });
  }

  return regions
    .filter((r) => r.size / total >= minAreaFraction)
    .sort((a, b) => b.size - a.size)
    .map((r) => {
      const out = new Uint8Array(total);
      for (const i of r.pixels) out[i] = 255;
      return { width, height, data: out };
    });
}

function cross(o: Point, a: Point, b: Point): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

/** Andrew's monotone chain over boundary pixels only (interior pixels never lie on the hull). */
export function convexHull(mask: SurfaceMask): Point[] {
  const { width, height, data } = mask;
  const points: Point[] = [];
  for (let y = 0; y < height; y++) {
    let first = -1;
    let last = -1;
    for (let x = 0; x < width; x++) {
      if (data[y * width + x] === 0) continue;
      if (first === -1) first = x;
      last = x;
    }
    if (first !== -1) {
      points.push({ x: first, y });
      if (last !== first) points.push({ x: last, y });
    }
  }
  if (points.length < 3) return points;

  points.sort((a, b) => a.x - b.x || a.y - b.y);
  const lower: Point[] = [];
  for (const p of points) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper: Point[] = [];
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

/**
 * Picks the hull points furthest along the four diagonals. For a surface seen
 * in perspective these approximate its real corners, which is all the
 * homography needs; the mask then trims the exact outline.
 */
export function hullToQuad(hull: readonly Point[]): Quad | null {
  if (hull.length < 3) return null;
  const pick = (score: (p: Point) => number) => hull.reduce((best, p) => (score(p) > score(best) ? p : best));
  const tl = pick((p) => -p.x - p.y);
  const tr = pick((p) => p.x - p.y);
  const br = pick((p) => p.x + p.y);
  const bl = pick((p) => -p.x + p.y);
  return [tl, tr, br, bl];
}

/**
 * Centroid snapped to the nearest pixel inside the mask: the centroid of an
 * L-shaped counter can fall in the empty corner, where a label would float
 * over the wrong thing.
 */
export function centroid(mask: SurfaceMask): Point {
  let sx = 0;
  let sy = 0;
  let n = 0;
  for (let i = 0; i < mask.data.length; i++) {
    if (mask.data[i] === 0) continue;
    sx += i % mask.width;
    sy += Math.floor(i / mask.width);
    n++;
  }
  if (n === 0) return { x: mask.width / 2, y: mask.height / 2 };
  const cx = sx / n;
  const cy = sy / n;
  let best = { x: cx, y: cy };
  let bestDistance = Infinity;
  for (let i = 0; i < mask.data.length; i++) {
    if (mask.data[i] === 0) continue;
    const x = i % mask.width;
    const y = Math.floor(i / mask.width);
    const d = (x - cx) ** 2 + (y - cy) ** 2;
    if (d < bestDistance) {
      bestDistance = d;
      best = { x, y };
    }
  }
  return best;
}

export function describeRegions(mask: SurfaceMask, minAreaFraction: number): MaskRegion[] {
  const total = mask.width * mask.height;
  return connectedRegions(mask, minAreaFraction).flatMap((region) => {
    const quad = hullToQuad(convexHull(region));
    if (!quad) return [];
    const area = region.data.reduce((sum, v) => sum + (v ? 1 : 0), 0) / total;
    return [{ mask: region, area, quad, centroid: centroid(region) }];
  });
}
