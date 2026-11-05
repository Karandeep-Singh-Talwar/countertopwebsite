// Turns a class mask from the segmentation model into separate surfaces: one
// per connected region, each with a perspective quad and a label anchor.
// Roomvo does this with per-plane 3D fitting on its servers; a hull-based quad
// is the lightweight in-browser approximation (users can still drag corners).

import { isConvexQuad, type Point, type Quad } from './homography';
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

/** Line y = slope * x + intercept. */
interface Line {
  slope: number;
  intercept: number;
}

function leastSquares(xs: readonly number[], ys: readonly number[]): Line | null {
  const n = xs.length;
  if (n < 2) return null;
  let sx = 0;
  let sy = 0;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sx += xs[i];
    sy += ys[i];
    sxx += xs[i] * xs[i];
    sxy += xs[i] * ys[i];
  }
  const det = n * sxx - sx * sx;
  if (Math.abs(det) < 1e-9) return null;
  const slope = (n * sxy - sx * sy) / det;
  return { slope, intercept: (sy - slope * sx) / n };
}

/**
 * Least squares, then refit on the 70% of points closest to the first line:
 * a pot poking above the counter or a cabinet cutting into the wall is an
 * outlier, not evidence about the edge.
 */
function robustLine(xs: readonly number[], ys: readonly number[]): Line | null {
  const first = leastSquares(xs, ys);
  if (!first) return null;
  const residuals = xs.map((x, i) => ({ i, r: Math.abs(ys[i] - (first.slope * x + first.intercept)) }));
  residuals.sort((a, b) => a.r - b.r);
  const keep = residuals.slice(0, Math.max(2, Math.floor(residuals.length * 0.7))).map((e) => e.i);
  return leastSquares(keep.map((i) => xs[i]), keep.map((i) => ys[i])) ?? first;
}

const percentile = (sorted: readonly number[], p: number) => sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))];

/** How far a horizontal surface's far corners move toward the photo's centre line. */
const FAR_EDGE_CONVERGENCE = 0.2;
/** Counters and floors get at least this much depth (share of photo height); thinner boxes smear the pattern. */
const MIN_HORIZONTAL_DEPTH = 0.08;
/** Steepest believable top/bottom edge for a wall in a level phone photo. */
const MAX_WALL_SLOPE = 0.35;
/** A wall box whose sides differ in height more than this is a bad fit, not perspective. */
const MAX_SIDE_RATIO = 3;
/** Walls narrower than this share of the photo are too thin to judge perspective from. */
const MIN_PERSPECTIVE_WIDTH = 0.06;

const clampSlope = (line: Line): Line => ({ ...line, slope: Math.max(-MAX_WALL_SLOPE, Math.min(MAX_WALL_SLOPE, line.slope)) });

/**
 * Perspective quad for a region. Walls use straight lines fitted to their top
 * and bottom boundaries with vertical sides (a phone held level keeps verticals
 * vertical); counters and floors use horizontal far/near edges and narrow
 * toward the far edge. Far steadier than hull extremes, which jump to whatever
 * odd pixel sticks out furthest.
 */
export function fitPerspectiveQuad(mask: SurfaceMask, horizontal: boolean): Quad | null {
  const { width, height, data } = mask;
  const xs: number[] = [];
  const tops: number[] = [];
  const bottoms: number[] = [];
  for (let x = 0; x < width; x++) {
    let top = -1;
    let bottom = -1;
    for (let y = 0; y < height; y++) {
      if (!data[y * width + x]) continue;
      if (top === -1) top = y;
      bottom = y;
    }
    if (top === -1) continue;
    xs.push(x);
    tops.push(top);
    bottoms.push(bottom);
  }
  if (xs.length < 4) return null;
  // Floors and counters often run diagonally (an L-shaped counter, a corridor
  // floor beside the toe-kicks), so a line fitted to their top boundary tilts
  // and shears the tile grid into a fan. Their far and near edges are taken
  // as horizontal at the area's far and near extent instead.
  const sortedTops = [...tops].sort((a, b) => a - b);
  const sortedBottoms = [...bottoms].sort((a, b) => a - b);
  const flatTop: Line = { slope: 0, intercept: percentile(sortedTops, 0.1) };
  const flatBottom: Line = { slope: 0, intercept: percentile(sortedBottoms, 0.9) };

  // Ignore a few straggler columns at either end.
  const left = percentile(xs, 0.02);
  const right = percentile(xs, 0.98) + 1;
  const at = (line: Line, x: number) => line.slope * x + line.intercept;

  let topLine: Line | null = flatTop;
  let bottomLine: Line | null = flatBottom;
  if (horizontal) {
    // A sliver of counter would otherwise get a box a few pixels deep and smear the slab.
    const minDepth = MIN_HORIZONTAL_DEPTH * height;
    if (flatBottom.intercept - flatTop.intercept < minDepth) topLine = { slope: 0, intercept: Math.max(0, flatBottom.intercept - minDepth) };
  } else if (right - left >= MIN_PERSPECTIVE_WIDTH * width) {
    const fittedTop = robustLine(xs, tops);
    const fittedBottom = robustLine(xs, bottoms);
    if (fittedTop && fittedBottom) {
      const t = clampSlope(fittedTop);
      const b = clampSlope(fittedBottom);
      // Re-anchor clamped lines through the boundary's middle so clamping does not shift them.
      const mid = (left + right) / 2;
      const anchor = (line: Line, fitted: Line): Line => ({ slope: line.slope, intercept: at(fitted, mid) - line.slope * mid });
      const top = anchor(t, fittedTop);
      const bottom = anchor(b, fittedBottom);
      const leftSide = at(bottom, left) - at(top, left);
      const rightSide = at(bottom, right) - at(top, right);
      const ratio = Math.max(leftSide, rightSide) / Math.max(1, Math.min(leftSide, rightSide));
      // Wildly unequal sides mean a fragment-skewed fit: keep the plain box instead.
      if (leftSide > 0 && rightSide > 0 && ratio <= MAX_SIDE_RATIO) {
        topLine = top;
        bottomLine = bottom;
      }
    }
  }
  const centre = width / 2;
  const farLeft = horizontal ? left + (centre - left) * FAR_EDGE_CONVERGENCE : left;
  const farRight = horizontal ? right - (right - centre) * FAR_EDGE_CONVERGENCE : right;

  const quad: Quad = [
    { x: farLeft, y: at(topLine, farLeft) },
    { x: farRight, y: at(topLine, farRight) },
    { x: right, y: at(bottomLine, right) + 1 },
    { x: left, y: at(bottomLine, left) + 1 },
  ];
  // A usable plane needs real height on both sides.
  const minHeight = Math.min(quad[3].y - quad[0].y, quad[2].y - quad[1].y);
  return minHeight >= 2 && isConvexQuad(quad) ? quad : null;
}

/** Pieces of a plane smaller than this share of the photo are specks, not surface. */
const SPECK_SHARE = 0.001;

/**
 * One surface per plane, keeping every real piece of it: shelves or a range
 * cutting a backsplash into separate patches must not make the patches
 * disappear. Specks are dropped, the perspective box is fitted to the whole
 * plane so the pattern lines up across pieces, and the label pin sits on the
 * biggest piece. Returns nothing if the plane is smaller than `minAreaFraction`.
 */
export function describeRegions(mask: SurfaceMask, minAreaFraction: number, horizontal = false): MaskRegion[] {
  const total = mask.width * mask.height;
  const pieces = connectedRegions(mask, SPECK_SHARE);
  if (pieces.length === 0) return [];
  const plane: SurfaceMask = { width: mask.width, height: mask.height, data: new Uint8Array(total) };
  for (const piece of pieces) for (let i = 0; i < total; i++) if (piece.data[i]) plane.data[i] = 255;
  const area = plane.data.reduce((sum, v) => sum + (v ? 1 : 0), 0) / total;
  if (area < minAreaFraction) return [];
  // connectedRegions returns pieces largest first.
  const quad = fitPerspectiveQuad(plane, horizontal) ?? fitPerspectiveQuad(pieces[0], horizontal) ?? hullToQuad(convexHull(pieces[0]));
  return quad ? [{ mask: plane, area, quad, centroid: centroid(pieces[0]) }] : [];
}
