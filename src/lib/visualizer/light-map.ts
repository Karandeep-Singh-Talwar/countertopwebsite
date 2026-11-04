// Low-frequency lighting for one surface, the stand-in for Roomvo's lightMapTexture.
//
// Multiplying the new material by the photo's raw per-pixel brightness also
// copies the old surface's pattern (grout lines, star tiles, granite flecks).
// Lighting varies slowly, patterns quickly, so a heavy blur keeps one and
// drops the other. The blur is a normalized convolution - blur(luma x mask)
// divided by blur(mask) - so light is averaged only from the surface itself
// and a dark cabinet next to a white wall does not bleed into it.

import type { SurfaceMask } from './types';

export interface LightMap {
  width: number;
  height: number;
  /** Smoothed luminance, 0..255. */
  data: Uint8Array;
}

/** Working resolution: plenty for light that varies over tens of pixels. */
const LIGHT_WIDTH = 160;
/**
 * Blur radius as a share of photo width. Two box passes approximate a Gaussian
 * of roughly this radius: soft shadows survive, tile-sized pattern does not.
 */
const BLUR_FRACTION = 0.03;

function boxBlur(src: Float32Array, width: number, height: number, radius: number): Float32Array {
  const pass = (input: Float32Array, horizontal: boolean) => {
    const out = new Float32Array(input.length);
    const lines = horizontal ? height : width;
    const length = horizontal ? width : height;
    const at = (line: number, k: number) => (horizontal ? line * width + k : k * width + line);
    for (let line = 0; line < lines; line++) {
      // Running sum: O(n) per line whatever the radius.
      let sum = 0;
      let count = 0;
      for (let k = 0; k < Math.min(radius, length); k++) {
        sum += input[at(line, k)];
        count++;
      }
      for (let k = 0; k < length; k++) {
        const add = k + radius;
        const drop = k - radius - 1;
        if (add < length) {
          sum += input[at(line, add)];
          count++;
        }
        if (drop >= 0) {
          sum -= input[at(line, drop)];
          count--;
        }
        out[at(line, k)] = sum / count;
      }
    }
    return out;
  };
  const once = (input: Float32Array) => pass(pass(input, true), false);
  // A second pass turns the box into a near-Gaussian, removing repeating patterns far better.
  return once(once(src));
}

/** Luminance (0..1) of `photo` resampled to the light-map working size. */
export function lightLuminance(photo: HTMLCanvasElement): { width: number; height: number; luma: Float32Array } {
  const width = LIGHT_WIDTH;
  const height = Math.max(1, Math.round((photo.height / photo.width) * width));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas 2D is not available');
  ctx.drawImage(photo, 0, 0, width, height);
  const { data } = ctx.getImageData(0, 0, width, height);
  const luma = new Float32Array(width * height);
  for (let i = 0; i < luma.length; i++) {
    luma[i] = (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255;
  }
  return { width, height, luma };
}

/**
 * Smoothed lighting restricted to `mask` (or the whole photo when there is
 * none). Pixels outside the mask take the light of the nearest part of the
 * surface, so the feathered edge of the new material stays correctly lit.
 */
export function buildLightMap(source: { width: number; height: number; luma: Float32Array }, mask: SurfaceMask | undefined): LightMap {
  const { width, height, luma } = source;
  const weight = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const inside = mask
        ? mask.data[Math.min(mask.height - 1, Math.floor((y / height) * mask.height)) * mask.width +
            Math.min(mask.width - 1, Math.floor((x / width) * mask.width))] !== 0
        : true;
      weight[y * width + x] = inside ? 1 : 0;
    }
  }
  const radius = Math.max(1, Math.round(width * BLUR_FRACTION));
  const weighted = boxBlur(Float32Array.from(luma, (v, i) => v * weight[i]), width, height, radius);
  const coverage = boxBlur(weight, width, height, radius);
  const global = boxBlur(luma, width, height, radius);

  const data = new Uint8Array(width * height);
  for (let i = 0; i < data.length; i++) {
    // Far from the surface there is nothing to average; fall back to the plain blur.
    const value = coverage[i] > 0.02 ? weighted[i] / coverage[i] : global[i];
    data[i] = Math.round(Math.min(1, Math.max(0, value)) * 255);
  }
  return { width, height, data };
}
