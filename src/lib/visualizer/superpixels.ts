// SLIC superpixels: splits the photo into a few thousand compact patches whose
// borders follow real colour edges (counter lips, cabinet doors, window
// frames). Detected masks are snapped to these patches for clean outlines, and
// the magic wand grows selections patch by patch. Classic image processing -
// no model involved.

export interface Superpixels {
  width: number;
  height: number;
  /** Patch index per pixel. */
  labels: Int32Array;
  count: number;
  /** Mean CIELAB colour per patch: [L, a, b, L, a, b, ...]. */
  color: Float32Array;
  /** Pixel count per patch. */
  size: Int32Array;
  /** Indices of touching patches. */
  neighbors: number[][];
}

const ITERATIONS = 6;
/** Colour vs. distance trade-off; higher keeps patches more square. */
const COMPACTNESS = 12;

function srgbToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

function toLab(rgba: Uint8ClampedArray, n: number): Float32Array {
  const lab = new Float32Array(n * 3);
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  for (let i = 0; i < n; i++) {
    const r = srgbToLinear(rgba[i * 4]);
    const g = srgbToLinear(rgba[i * 4 + 1]);
    const b = srgbToLinear(rgba[i * 4 + 2]);
    const x = f((0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047);
    const y = f(0.2126 * r + 0.7152 * g + 0.0722 * b);
    const z = f((0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883);
    lab[i * 3] = 116 * y - 16;
    lab[i * 3 + 1] = 500 * (x - y);
    lab[i * 3 + 2] = 200 * (y - z);
  }
  return lab;
}

/** Relabels so every patch is one connected piece; slivers merge into a neighbour. */
function enforceConnectivity(labels: Int32Array, width: number, height: number, minSize: number): { labels: Int32Array; count: number } {
  const out = new Int32Array(labels.length).fill(-1);
  const queue = new Int32Array(labels.length);
  let count = 0;
  for (let start = 0; start < labels.length; start++) {
    if (out[start] !== -1) continue;
    const original = labels[start];
    let head = 0;
    let tail = 0;
    queue[tail++] = start;
    out[start] = count;
    let adjacent = -1;
    while (head < tail) {
      const i = queue[head++];
      const x = i % width;
      for (const j of [x > 0 ? i - 1 : -1, x < width - 1 ? i + 1 : -1, i >= width ? i - width : -1, i + width < labels.length ? i + width : -1]) {
        if (j < 0) continue;
        if (out[j] === -1 && labels[j] === original) {
          out[j] = count;
          queue[tail++] = j;
        } else if (out[j] !== -1 && out[j] !== count) {
          adjacent = out[j];
        }
      }
    }
    if (tail < minSize && adjacent !== -1) {
      for (let k = 0; k < tail; k++) out[queue[k]] = adjacent;
    } else {
      count++;
    }
  }
  return { labels: out, count };
}

/**
 * @param step Target patch spacing in pixels (patches are roughly step x step).
 */
export function computeSuperpixels(rgba: Uint8ClampedArray, width: number, height: number, step: number): Superpixels {
  const n = width * height;
  const lab = toLab(rgba, n);
  const centers: number[][] = [];
  for (let y = step / 2; y < height; y += step) {
    for (let x = step / 2; x < width; x += step) {
      const i = Math.floor(y) * width + Math.floor(x);
      centers.push([lab[i * 3], lab[i * 3 + 1], lab[i * 3 + 2], x, y]);
    }
  }

  const labels = new Int32Array(n).fill(-1);
  const best = new Float32Array(n);
  const spatial = (COMPACTNESS / step) ** 2;
  for (let iter = 0; iter < ITERATIONS; iter++) {
    best.fill(Infinity);
    centers.forEach(([cl, ca, cb, cx, cy], k) => {
      const x0 = Math.max(0, Math.floor(cx - step));
      const x1 = Math.min(width, Math.ceil(cx + step));
      const y0 = Math.max(0, Math.floor(cy - step));
      const y1 = Math.min(height, Math.ceil(cy + step));
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = y * width + x;
          const dl = lab[i * 3] - cl;
          const da = lab[i * 3 + 1] - ca;
          const db = lab[i * 3 + 2] - cb;
          const d = dl * dl + da * da + db * db + ((x - cx) ** 2 + (y - cy) ** 2) * spatial;
          if (d < best[i]) {
            best[i] = d;
            labels[i] = k;
          }
        }
      }
    });
    const sums = centers.map(() => [0, 0, 0, 0, 0, 0]);
    for (let i = 0; i < n; i++) {
      const s = sums[labels[i]];
      if (!s) continue;
      s[0] += lab[i * 3];
      s[1] += lab[i * 3 + 1];
      s[2] += lab[i * 3 + 2];
      s[3] += i % width;
      s[4] += Math.floor(i / width);
      s[5]++;
    }
    sums.forEach((s, k) => {
      if (s[5] > 0) centers[k] = [s[0] / s[5], s[1] / s[5], s[2] / s[5], s[3] / s[5], s[4] / s[5]];
    });
  }

  const { labels: connected, count } = enforceConnectivity(labels, width, height, Math.max(4, Math.floor((step * step) / 4)));
  const color = new Float32Array(count * 3);
  const size = new Int32Array(count);
  for (let i = 0; i < n; i++) {
    const k = connected[i];
    size[k]++;
    for (let c = 0; c < 3; c++) color[k * 3 + c] += lab[i * 3 + c];
  }
  for (let k = 0; k < count; k++) for (let c = 0; c < 3; c++) color[k * 3 + c] /= Math.max(1, size[k]);

  const neighborSets = Array.from({ length: count }, () => new Set<number>());
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const k = connected[y * width + x];
      if (x + 1 < width) {
        const r = connected[y * width + x + 1];
        if (r !== k) {
          neighborSets[k].add(r);
          neighborSets[r].add(k);
        }
      }
      if (y + 1 < height) {
        const d = connected[(y + 1) * width + x];
        if (d !== k) {
          neighborSets[k].add(d);
          neighborSets[d].add(k);
        }
      }
    }
  }
  return { width, height, labels: connected, count, color, size, neighbors: neighborSets.map((s) => [...s]) };
}
