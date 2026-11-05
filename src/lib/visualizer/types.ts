import type { Point, Quad } from './homography';
import { defaultTileGrid } from './surface-metrics';

export type SurfaceKind = 'countertop' | 'backsplash' | 'floor';

/** Segmentation pseudo-label for the union of every object (stove, pots, plants...) in the photo. */
export const OBJECTS_LABEL = '__objects';

/** Segmentation pseudo-label for fixed parts of the room that are never repainted: ceiling, windows, doors. */
export const FIXTURES_LABEL = '__fixtures';

/** Horizontal surfaces are photographed foreshortened; vertical ones are not. */
export const HORIZONTAL_KINDS: ReadonlySet<SurfaceKind> = new Set(['countertop', 'floor']);

/**
 * Binary pixel mask (0 or 255) at its own resolution, addressed in normalised
 * photo coordinates. It decides exactly which pixels get the new material, so
 * pots, taps and stoves sitting on a counter stay in front of it.
 */
export interface SurfaceMask {
  width: number;
  height: number;
  data: Uint8Array;
}

/** 'slab' = one continuous book-matched slab; 'tile' = gridded tiles with grout. */
export type SurfaceLayout = 'slab' | 'tile';

export interface Surface {
  id: string;
  kind: SurfaceKind;
  corners: Quad;
  productId: string;
  layout: SurfaceLayout;
  /** How many texture repeats span the quad's longer edge. */
  scale: number;
  rotated: boolean;
  /** Tile grid (only used when layout === 'tile'). */
  tileColumns: number;
  tileRows: number;
  /** Present when the surface came from auto-detection. */
  mask?: SurfaceMask;
  /** Where the floating label pin sits, in photo pixels. */
  anchor?: Point;
  /**
   * Hand-placed surfaces: paint only where the quad AND the mask agree, so a
   * rough rectangle never spills over cabinets or objects the AI recognised.
   */
  clipToQuad?: boolean;
}

/** Where each kind may be painted, as recognised by detection. */
export type PaintableAreas = Record<SurfaceKind, SurfaceMask | null>;

export interface VisualizerProduct {
  id: string;
  name: string;
  texture: string;
  finish: string;
  priceEstimate: string;
}

export interface PhotoSize {
  width: number;
  height: number;
}

let surfaceCounter = 0;

/** Default quads as fractions of the photo: [left, top, right, bottom, bottom inset]. */
const DEFAULT_FRAMES: Record<SurfaceKind, readonly [number, number, number, number, number]> = {
  countertop: [0.22, 0.58, 0.78, 0.8, -0.14],
  backsplash: [0.22, 0.3, 0.78, 0.56, 0],
  floor: [0.25, 0.82, 0.75, 0.98, -0.2],
};

interface SurfaceOptions {
  corners?: Quad;
  mask?: SurfaceMask;
  anchor?: Point;
  clipToQuad?: boolean;
}

/**
 * Builds a surface. Without detected corners it starts from a generic frame
 * (countertops and floors as foreshortened trapezoids) that users drag onto
 * the real edges.
 */
export function createSurface(kind: SurfaceKind, productId: string, size: PhotoSize, options: SurfaceOptions = {}): Surface {
  const { width: w, height: h } = size;
  const [l, t, r, b, inset] = DEFAULT_FRAMES[kind];
  const corners: Quad = options.corners ?? [
    { x: w * l, y: h * t },
    { x: w * r, y: h * t },
    { x: w * (r - inset), y: h * b },
    { x: w * (l + inset), y: h * b },
  ];
  const { tileColumns, tileRows } = defaultTileGrid(kind, corners, size.width);

  surfaceCounter += 1;
  return {
    id: `${kind}-${Date.now()}-${surfaceCounter}`,
    kind,
    corners,
    productId,
    layout: kind === 'countertop' ? 'slab' : 'tile',
    scale: 1,
    // Catalog slabs are portrait 600x1200; rotating lays the long axis along the run.
    rotated: true,
    tileColumns,
    tileRows,
    mask: options.mask,
    anchor: options.anchor,
    clipToQuad: options.clipToQuad,
  };
}
