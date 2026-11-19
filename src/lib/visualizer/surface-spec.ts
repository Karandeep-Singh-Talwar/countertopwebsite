// Converts the editable Surface model into what the GPU needs for one draw.

import { quadToSquare, type Point, type Quad } from './homography';
import type { LightMap } from './light-map';
import { sampleMaskedLuminance, sampleSurfaceLuminance, summarizeLuminance } from './lighting';
import { apparentSize, SLAB_FACE_SPAN } from './surface-metrics';
import type { SurfaceDrawSpec } from './surface-renderer';
import type { Surface, VisualizerProduct } from './types';

/** Catalog slabs are 600x1200 mm, so width / height of the texture image. */
const TEXTURE_ASPECT = 0.5;

const quadDimensions = (surface: Surface) => apparentSize(surface.kind, surface.corners);

/**
 * Texture repeats in (s, t). Measured against the photo rather than the quad,
 * so a narrow wall and a wide one show veins at the same size; slab pixels
 * also stay square on the approximate real surface.
 */
export function computeRepeat(surface: Surface, photoWidth: number): [number, number] {
  const { width, height } = quadDimensions(surface);
  const [sLen, tLen] = surface.rotated ? [height, width] : [width, height];
  const face = SLAB_FACE_SPAN * photoWidth;
  if (face <= 0) return [surface.scale, surface.scale];
  return [(surface.scale * sLen) / face, (surface.scale * tLen * TEXTURE_ASPECT) / face];
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

function hexToRgb(hex: string | undefined): [number, number, number] {
  if (!hex || !hex.startsWith('#')) return [0.5, 0.5, 0.5]; // default #808080 grey
  const clean = hex.replace('#', '');
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;
    return [r, g, b];
  }
  return [0.5, 0.5, 0.5];
}

export function buildDrawSpec(
  surface: Surface,
  product: VisualizerProduct | undefined,
  baseLuminance: number,
  shadeStrength: number,
  photoWidth: number,
  light: LightMap,
): SurfaceDrawSpec | null {
  const toSquare = quadToSquare(surface.corners);
  if (!toSquare || !product) return null;
  const patternMode = surface.pattern === 'running_bond' ? 1 : surface.pattern === 'diamond' ? 2 : 0;
  // Normalized grout factor: 2mm -> 0.8, 4mm -> 1.3, 6mm -> 1.8, 10mm -> 2.6
  const groutWidth = ((surface.groutWidthMm ?? 4) / 4) * 1.3;
  const groutColor = hexToRgb(surface.groutColor);

  return {
    toSquare,
    textureUrl: product.texture,
    repeat: computeRepeat(surface, photoWidth),
    rotated: surface.rotated,
    tiled: surface.layout === 'tile',
    // The shader grids in (s, t); when rotated, s runs along the quad's height.
    tileGrid: surface.rotated ? [surface.tileRows, surface.tileColumns] : [surface.tileColumns, surface.tileRows],
    pattern: patternMode,
    groutWidth,
    groutColor,
    baseLuminance,
    shadeStrength,
    mask: surface.mask,
    clipToQuad: surface.clipToQuad ?? false,
    light,
  };
}
