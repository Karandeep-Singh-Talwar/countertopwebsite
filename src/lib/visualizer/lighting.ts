// Estimates how bright the existing surface is, so the renderer can turn the
// photo's own shadows and highlights into a multiplier on the new material.

import { apply, quadToSquare, type Quad } from './homography';
import type { SurfaceMask } from './types';

const SAMPLE_GRID = 48;

function luminance(r: number, g: number, b: number): number {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/** Luminance samples (0..1) on an even grid inside the quad, skipping pixels outside `mask` when given. */
export function sampleSurfaceLuminance(photo: HTMLCanvasElement, quad: Quad, mask?: SurfaceMask): number[] {
  const ctx = photo.getContext('2d', { willReadFrequently: true });
  const toSquare = quadToSquare(quad);
  if (!ctx || !toSquare) return [];

  const xs = quad.map((p) => p.x);
  const ys = quad.map((p) => p.y);
  const minX = Math.max(0, Math.floor(Math.min(...xs)));
  const minY = Math.max(0, Math.floor(Math.min(...ys)));
  const maxX = Math.min(photo.width, Math.ceil(Math.max(...xs)));
  const maxY = Math.min(photo.height, Math.ceil(Math.max(...ys)));
  const w = maxX - minX;
  const h = maxY - minY;
  if (w <= 0 || h <= 0) return [];

  const { data } = ctx.getImageData(minX, minY, w, h);
  const samples: number[] = [];
  for (let gy = 0; gy < SAMPLE_GRID; gy++) {
    for (let gx = 0; gx < SAMPLE_GRID; gx++) {
      const x = Math.floor(((gx + 0.5) / SAMPLE_GRID) * w);
      const y = Math.floor(((gy + 0.5) / SAMPLE_GRID) * h);
      const uv = apply(toSquare, { x: x + minX, y: y + minY });
      if (uv.x < 0 || uv.x > 1 || uv.y < 0 || uv.y > 1) continue;
      if (mask) {
        const mx = Math.min(mask.width - 1, Math.floor(((x + minX) / photo.width) * mask.width));
        const my = Math.min(mask.height - 1, Math.floor(((y + minY) / photo.height) * mask.height));
        if (mask.data[my * mask.width + mx] === 0) continue;
      }
      const i = (y * w + x) * 4;
      samples.push(luminance(data[i], data[i + 1], data[i + 2]));
    }
  }
  return samples;
}

const MASK_SAMPLE_TARGET = 2500;

/**
 * Luminance samples from only the pixels a detection mask covers, so objects
 * standing on the surface never bias its brightness estimate.
 */
export function sampleMaskedLuminance(photo: HTMLCanvasElement, mask: SurfaceMask): number[] {
  const ctx = photo.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];
  const { data } = ctx.getImageData(0, 0, photo.width, photo.height);
  const stride = Math.max(1, Math.floor(Math.sqrt((mask.width * mask.height) / MASK_SAMPLE_TARGET)));
  const samples: number[] = [];
  for (let my = 0; my < mask.height; my += stride) {
    for (let mx = 0; mx < mask.width; mx += stride) {
      if (mask.data[my * mask.width + mx] === 0) continue;
      const x = Math.min(photo.width - 1, Math.floor(((mx + 0.5) / mask.width) * photo.width));
      const y = Math.min(photo.height - 1, Math.floor(((my + 0.5) / mask.height) * photo.height));
      const i = (y * photo.width + x) * 4;
      samples.push(luminance(data[i], data[i + 1], data[i + 2]));
    }
  }
  return samples;
}

/**
 * Collapses the samples into the single "normal brightness" of the surface.
 * Pixels brighter than this render as highlights, darker ones as shadows.
 *
 * TODO(you): choose the estimator. A plain mean (below) is skewed by whatever
 * sits on the counter - a black kettle or a window glare drags it away from the
 * true stone colour, so the whole new slab looks too bright or too dark.
 * Alternatives: median, or a trimmed mean that drops the darkest/brightest 10-20%.
 */
export function summarizeLuminance(samples: readonly number[]): number {
  if (samples.length === 0) return 0.5;
  const total = samples.reduce((sum, s) => sum + s, 0);
  return total / samples.length;
}
