// Converts the editable Surface model into what the GPU needs for one draw.

import { quadToSquare, type Point, type Quad } from './homography';
import { sampleMaskedLuminance, sampleSurfaceLuminance, summarizeLuminance } from './lighting';
import type { SurfaceDrawSpec } from './surface-renderer';
import { HORIZONTAL_KINDS, type Surface, type VisualizerProduct } from './types';

/** Catalog slabs are 600x1200 mm, so width / height of the texture image. */
const TEXTURE_ASPECT = 0.5;

/**
 * A countertop or floor seen from standing height is squashed vertically in the
 * photo. Stretching its measured depth by this factor approximates the real
 * depth so the pattern is not visibly elongated front-to-back.
 */
const HORIZONTAL_FORESHORTENING = 2.5;

const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

function quadDimensions(surface: Surface): { width: number; height: number } {
  const [tl, tr, br, bl] = surface.corners;
  const width = (distance(tl, tr) + distance(bl, br)) / 2;
  const rawHeight = (distance(tl, bl) + distance(tr, br)) / 2;
  const height = HORIZONTAL_KINDS.has(surface.kind) ? rawHeight * HORIZONTAL_FORESHORTENING : rawHeight;
  return { width, height };
}

/** Texture repeats in (s, t) so slab pixels stay square on the approximate real surface. */
export function computeRepeat(surface: Surface): [number, number] {
  const { width, height } = quadDimensions(surface);
  const [sLen, tLen] = surface.rotated ? [height, width] : [width, height];
  if (sLen <= 0) return [surface.scale, surface.scale];
  return [surface.scale, (surface.scale * tLen * TEXTURE_ASPECT) / sLen];
}

/**
 * Tile counts for `surface` that keep tiles the same apparent size as on
 * `lead`, so styling several walls together does not give each wall a
 * different tile size just because it is wider or narrower.
 */
export function matchTileGrid(surface: Surface, lead: Surface, columns: number, rows: number): { tileColumns: number; tileRows: number } {
  const own = quadDimensions(surface);
  const ref = quadDimensions(lead);
  const ratio = (a: number, b: number) => (b > 0 ? a / b : 1);
  return {
    tileColumns: Math.max(1, Math.round(columns * ratio(own.width, ref.width))),
    tileRows: Math.max(1, Math.round(rows * ratio(own.height, ref.height))),
  };
}

/** Scales a full-resolution quad into the coordinates of a downsampled canvas. */
function scaleQuad(quad: Quad, factor: number): Quad {
  const scale = (p: Point): Point => ({ x: p.x * factor, y: p.y * factor });
  return [scale(quad[0]), scale(quad[1]), scale(quad[2]), scale(quad[3])];
}

export function estimateBaseLuminance(lumaCanvas: HTMLCanvasElement, photoWidth: number, surface: Surface): number {
  if (surface.mask && !surface.clipToQuad) return summarizeLuminance(sampleMaskedLuminance(lumaCanvas, surface.mask));
  const factor = lumaCanvas.width / photoWidth;
  return summarizeLuminance(sampleSurfaceLuminance(lumaCanvas, scaleQuad(surface.corners, factor), surface.mask));
}

export function buildDrawSpec(
  surface: Surface,
  product: VisualizerProduct | undefined,
  baseLuminance: number,
  shadeStrength: number,
): SurfaceDrawSpec | null {
  const toSquare = quadToSquare(surface.corners);
  if (!toSquare || !product) return null;
  return {
    toSquare,
    textureUrl: product.texture,
    repeat: computeRepeat(surface),
    rotated: surface.rotated,
    tiled: surface.layout === 'tile',
    // The shader grids in (s, t); when rotated, s runs along the quad's height.
    tileGrid: surface.rotated ? [surface.tileRows, surface.tileColumns] : [surface.tileColumns, surface.tileRows],
    baseLuminance,
    shadeStrength,
    mask: surface.mask,
    clipToQuad: surface.clipToQuad ?? false,
  };
}
