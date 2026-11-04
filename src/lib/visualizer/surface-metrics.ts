// Apparent sizes of surfaces in the photo, shared by pattern scaling and tile
// defaults so every surface in one photo uses the same yardstick.

import type { Point, Quad } from './homography';
import type { SurfaceKind } from './types';

/**
 * A countertop or floor seen from standing height is squashed vertically in the
 * photo. Stretching its measured depth by this factor approximates the real
 * depth so the pattern is not visibly elongated front-to-back.
 */
const HORIZONTAL_FORESHORTENING = 2.5;
const HORIZONTAL: ReadonlySet<SurfaceKind> = new Set(['countertop', 'floor']);

/**
 * How wide one 600 mm slab face appears, as a share of photo width. A typical
 * kitchen photo spans 3-4 m, so 600 mm is roughly a fifth of the frame.
 */
export const SLAB_FACE_SPAN = 0.2;

/** Apparent tile cell (width share of photo width); cells are 2:1 like 1200 x 600 tiles. */
const TILE_CELL_SPAN: Record<SurfaceKind, number> = { backsplash: 0.1, countertop: 0.14, floor: 0.14 };

const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

/** Width and (foreshortening-corrected) height of a quad, in photo pixels. */
export function apparentSize(kind: SurfaceKind, corners: Quad): { width: number; height: number } {
  const [tl, tr, br, bl] = corners;
  const width = (distance(tl, tr) + distance(bl, br)) / 2;
  const rawHeight = (distance(tl, bl) + distance(tr, br)) / 2;
  return { width, height: HORIZONTAL.has(kind) ? rawHeight * HORIZONTAL_FORESHORTENING : rawHeight };
}

/** Tile counts giving the same apparent tile size on every surface of this kind. */
export function defaultTileGrid(kind: SurfaceKind, corners: Quad, photoWidth: number): { tileColumns: number; tileRows: number } {
  const { width, height } = apparentSize(kind, corners);
  const cell = TILE_CELL_SPAN[kind] * photoWidth;
  const clamp = (n: number) => Math.min(24, Math.max(1, Math.round(n)));
  return { tileColumns: clamp(width / cell), tileRows: clamp(height / (cell / 2)) };
}
