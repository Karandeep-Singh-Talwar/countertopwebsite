// Straightens the edges of detected surfaces. Kitchens are built from
// straight lines - counter fronts, backsplash bottoms, cabinet undersides -
// but a model's masks wobble by a few pixels along them. Each boundary is
// cut into runs, a line is fitted to each run, and runs that really are
// straight are snapped exactly onto their line. Runs that are not (the
// outline of a kettle or a canister) are split and retried in smaller pieces,
// so genuine curves are left alone.

import type { SurfaceMask } from './types';

interface Run {
  start: number;
  /** Boundary position for each index from `start`. */
  values: number[];
}

/** A boundary jumping more than this many tolerances between neighbouring columns starts a new run. */
const JUMP_TOLERANCES = 2;
/** Runs shorter than this many columns are left as detected. */
const MIN_RUN = 14;
/** Share of a run that must lie within tolerance of the fitted line for it to count as straight. */
const STRAIGHT_SHARE = 0.85;

function fitLine(xs: number[], ys: number[]): { slope: number; intercept: number } {
  const n = xs.length;
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
  const slope = Math.abs(det) < 1e-9 ? 0 : (n * sxy - sx * sy) / det;
  return { slope, intercept: (sy - slope * sx) / n };
}

/** Splits a run until each piece is straight within `tolerance`; returns the fitted value per index (NaN = leave). */
function straightPieces(run: Run, tolerance: number, out: Float64Array): void {
  const n = run.values.length;
  if (n < MIN_RUN) return;
  const xs = run.values.map((_, i) => run.start + i);
  // Fit, then refit on the points near the first line so a few noisy columns cannot tilt it.
  const rough = fitLine(xs, run.values);
  const near = xs.flatMap((x, i) => (Math.abs(run.values[i] - (rough.slope * x + rough.intercept)) <= 2 * tolerance ? [i] : []));
  const line = near.length >= 2 ? fitLine(near.map((i) => xs[i]), near.map((i) => run.values[i])) : rough;
  const residuals = run.values.map((v, i) => Math.abs(v - (line.slope * xs[i] + line.intercept)));
  const within = residuals.filter((r) => r <= tolerance).length;
  if (within >= STRAIGHT_SHARE * n) {
    for (let i = 0; i < n; i++) out[run.start + i] = line.slope * xs[i] + line.intercept;
    return;
  }
  // Not straight: split at the worst point and try both halves.
  let worst = 0;
  for (let i = 1; i < n; i++) if (residuals[i] > residuals[worst]) worst = i;
  const cut = Math.min(n - MIN_RUN, Math.max(MIN_RUN, worst));
  if (cut <= 0 || cut >= n) return;
  straightPieces({ start: run.start, values: run.values.slice(0, cut) }, tolerance, out);
  straightPieces({ start: run.start + cut, values: run.values.slice(cut) }, tolerance, out);
}

/** Straight-line targets for one boundary profile (NaN where the column has no surface or stays as is). */
function straightenProfile(profile: Float64Array, tolerance: number): Float64Array {
  const out = new Float64Array(profile.length).fill(NaN);
  let start = -1;
  const flush = (end: number) => {
    if (start >= 0) straightPieces({ start, values: Array.from(profile.slice(start, end)) }, tolerance, out);
    start = -1;
  };
  for (let x = 0; x < profile.length; x++) {
    const v = profile[x];
    if (Number.isNaN(v)) {
      flush(x);
      continue;
    }
    if (start >= 0 && Math.abs(v - profile[x - 1]) > JUMP_TOLERANCES * tolerance) flush(x);
    if (start < 0) start = x;
  }
  flush(profile.length);
  return out;
}

type Accessor = { lines: number; length: number; index: (line: number, k: number) => number };

/**
 * Straightens the leading and trailing boundary of every line (columns for
 * top/bottom edges, rows for left/right edges). Pixels are added up to a
 * straight edge only where `keepOut` allows, and trimmed past it.
 */
function straightenAlong(mask: SurfaceMask, keepOut: SurfaceMask | null, acc: Accessor, tolerance: number, snap: number): SurfaceMask {
  const data = Uint8Array.from(mask.data);
  for (const leading of [true, false]) {
    const profile = new Float64Array(acc.lines).fill(NaN);
    for (let line = 0; line < acc.lines; line++) {
      for (let s = 0; s < acc.length; s++) {
        const k = leading ? s : acc.length - 1 - s;
        if (data[acc.index(line, k)]) {
          profile[line] = k;
          break;
        }
      }
    }
    const target = straightenProfile(profile, tolerance);
    for (let line = 0; line < acc.lines; line++) {
      const t = target[line];
      const v = profile[line];
      if (Number.isNaN(t) || Number.isNaN(v) || Math.abs(t - v) > snap) continue;
      const edge = Math.round(t);
      // Leading edge: surface should start at `edge`. Trailing edge: it should end at `edge`.
      const [from, to] = leading ? [Math.min(edge, v), Math.max(edge, v)] : [Math.min(edge, v) + 1, Math.max(edge, v) + 1];
      for (let k = from; k < to; k++) {
        if (k < 0 || k >= acc.length) continue;
        const i = acc.index(line, k);
        const inside = leading ? k >= edge : k <= edge;
        if (inside) {
          if (!keepOut?.data[i]) data[i] = 255;
        } else {
          data[i] = 0;
        }
      }
    }
  }
  return { width: mask.width, height: mask.height, data };
}

/**
 * Snaps nearly-straight top, bottom, left and right edges of a surface onto
 * exact lines. `tolerance` is how wobbly (pixels) an edge may be and still
 * count as straight; edges are never moved by more than `snap` pixels.
 */
export function straightenEdges(mask: SurfaceMask, keepOut: SurfaceMask | null, tolerance: number, snap: number): SurfaceMask {
  const { width, height } = mask;
  const columns: Accessor = { lines: width, length: height, index: (x, y) => y * width + x };
  const rows: Accessor = { lines: height, length: width, index: (y, x) => y * width + x };
  return straightenAlong(straightenAlong(mask, keepOut, columns, tolerance, snap), keepOut, rows, tolerance, snap);
}
