// Main-thread side of auto-detection: sends a downscaled photo to the worker,
// then turns class masks (plus depth, when available) into ready-to-render
// surfaces - one per plane, like Roomvo's per-surface product instances.

import type { Point, Quad } from './homography';
import { describeRegions } from './mask-geometry';
import {
  closeMask,
  counterLips,
  disparityGradients,
  extendUpward,
  floorReference,
  foreignObjects,
  groundedCabinets,
  growCounter,
  splitByFacing,
  upwardFacing,
} from './plane-analysis';
import type { SegmentationMessage, SegmentationRequest } from './segmentation.worker';
import { OBJECTS_LABEL, type PaintableAreas, type SurfaceKind, type SurfaceMask } from './types';

/** Inference resolution. Masks are upsampled bilinearly in the shader. */
const DETECTION_EDGE = 640;

/** Ignore specks; walls and floors must be substantial to be worth a pin. */
const MIN_REGION_AREA: Record<SurfaceKind, number> = { countertop: 0.004, backsplash: 0.02, floor: 0.008 };
const MAX_REGIONS: Record<SurfaceKind, number> = { countertop: 3, backsplash: 4, floor: 2 };

/** How far above cabinet fronts (as a share of photo height) to look for the counter top. */
const COUNTER_BAND = 0.08;

export interface DetectedSurface {
  kind: SurfaceKind;
  corners: Quad;
  mask: SurfaceMask;
  anchor: Point;
}

export interface DetectionOutcome {
  surfaces: DetectedSurface[];
  /** Areas hand-placed surfaces are clipped to, in detection-mask resolution. */
  paintable: PaintableAreas;
}

export type DetectionProgress = Extract<SegmentationMessage, { type: 'progress' }>;

let worker: Worker | null = null;

function getWorker(): Worker {
  worker ??= new Worker(new URL('./segmentation.worker.ts', import.meta.url), { type: 'module' });
  return worker;
}

function runWorker(request: SegmentationRequest, onProgress: (p: DetectionProgress) => void) {
  return new Promise<Extract<SegmentationMessage, { type: 'result' }>>((resolve, reject) => {
    const w = getWorker();
    const handle = (event: MessageEvent<SegmentationMessage>) => {
      const message = event.data;
      if (message.type === 'progress') return onProgress(message);
      w.removeEventListener('message', handle);
      if (message.type === 'result') resolve(message);
      else reject(new Error(message.message));
    };
    w.addEventListener('message', handle);
    w.postMessage(request, [request.pixels.buffer]);
  });
}

type DetectionResult = Extract<SegmentationMessage, { type: 'result' }>;

/** Union of every segment carrying one of `labels`, or null when none were found. */
function maskOf(result: DetectionResult, labels: readonly string[]): SurfaceMask | null {
  const masks = result.segments.filter((s) => labels.includes(s.label)).map((s) => s.mask);
  if (masks.length === 0) return null;
  const data = new Uint8Array(result.width * result.height);
  for (const m of masks) for (let i = 0; i < data.length; i++) if (m[i]) data[i] = 255;
  return { width: result.width, height: result.height, data };
}

function union(a: SurfaceMask | null, b: SurfaceMask | null): SurfaceMask | null {
  if (!a || !b) return a ?? b;
  return { ...a, data: a.data.map((v, i) => (v || b.data[i] ? 255 : 0)) };
}

function subtract(a: SurfaceMask, b: SurfaceMask | null): SurfaceMask {
  if (!b) return a;
  return { ...a, data: a.data.map((v, i) => (v && !b.data[i] ? 255 : 0)) };
}

function everywhere(result: DetectionResult): SurfaceMask {
  return { width: result.width, height: result.height, data: new Uint8Array(result.width * result.height).fill(255) };
}

/**
 * A hand-placed wall may only cover wall pixels and a floor only floor; a
 * hand-placed countertop (usually the fallback when none was recognised) may
 * cover anything except objects and the floor.
 */
function paintableAreas(result: DetectionResult, countertop: SurfaceMask | null): PaintableAreas {
  const wall = maskOf(result, ['wall']);
  const floor = maskOf(result, ['floor']);
  return {
    backsplash: wall ? subtract(wall, countertop) : null,
    floor,
    countertop: subtract(everywhere(result), union(maskOf(result, [OBJECTS_LABEL]), floor)),
  };
}

type PlaneMasks = Record<SurfaceKind, SurfaceMask[]> & { detectedCountertop: SurfaceMask | null };

/** Candidate masks per kind; each mask may still hold several disconnected regions. */
function planeMasks(result: DetectionResult, rgba: Uint8ClampedArray): PlaneMasks {
  const floor = maskOf(result, ['floor']);
  const wall = maskOf(result, ['wall']);
  const present = (m: SurfaceMask | null) => (m ? [m] : []);

  if (!result.disparity) {
    // No depth: trust the labels alone. Counter tops hidden inside "cabinet" stay undetected.
    const labelled = maskOf(result, ['countertop', 'counter', 'kitchen island']);
    return {
      countertop: present(labelled),
      backsplash: wall ? [subtract(wall, labelled)] : [],
      floor: present(floor),
      detectedCountertop: labelled,
    };
  }

  const gradients = disparityGradients(result.disparity, result.width, result.height);
  // A rug lies in the floor plane, so it helps measure the floor without being repainted.
  const reference = floorReference(gradients, union(floor, maskOf(result, ['rug'])));
  const objects = maskOf(result, [OBJECTS_LABEL]);
  const labelledCabinets = maskOf(result, ['cabinet', 'kitchen island', 'counter', 'countertop']);
  // Only base cabinets carry counters; wall cabinets hang above a wall.
  const cabinets = labelledCabinets ? groundedCabinets(labelledCabinets, floor, objects) : null;
  const band = Math.round(result.height * COUNTER_BAND);
  // Counter tops sit right above the cabinet fronts and are often labelled "wall".
  const host = cabinets && wall ? extendUpward(cabinets, wall, band) : cabinets;
  const lips = cabinets && wall ? counterLips(wall, cabinets, gradients, reference, band) : null;
  const seeds = union(host ? upwardFacing(host, gradients, reference) : null, lips);

  let tops: SurfaceMask | null = null;
  if (seeds && cabinets) {
    const grown = growCounter(seeds, cabinets, objects, gradients, reference, rgba);
    const filled = closeMask(grown, Math.round(result.width / 320) + 1);
    // Hole-filling may bridge over a mug or a hob; put those back in front.
    tops = objects ? subtract(filled, foreignObjects(objects, grown, rgba)) : filled;
  }

  const countertop = union(tops, maskOf(result, ['countertop']));

  return {
    countertop: present(countertop),
    // Each pixel belongs to one surface: counter bands found inside "wall" leave the wall.
    backsplash: wall ? splitByFacing(subtract(wall, countertop), gradients, reference) : [],
    floor: present(floor),
    detectedCountertop: countertop,
  };
}

export async function detectSurfaces(
  photo: HTMLCanvasElement,
  onProgress: (p: DetectionProgress) => void,
): Promise<DetectionOutcome> {
  const scale = Math.min(1, DETECTION_EDGE / Math.max(photo.width, photo.height));
  const width = Math.round(photo.width * scale);
  const height = Math.round(photo.height * scale);
  const small = document.createElement('canvas');
  small.width = width;
  small.height = height;
  const ctx = small.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D is not available');
  ctx.drawImage(photo, 0, 0, width, height);
  const pixels = ctx.getImageData(0, 0, width, height).data;
  // The worker takes ownership of `pixels`; keep a copy for colour checks here.
  const rgba = new Uint8ClampedArray(pixels);

  const result = await runWorker({ type: 'segment', width, height, pixels }, onProgress);
  const toPhoto = (p: Point): Point => ({ x: p.x / scale, y: p.y / scale });

  const candidates = planeMasks(result, rgba);
  const kinds: SurfaceKind[] = ['countertop', 'backsplash', 'floor'];

  const surfaces = kinds.flatMap((kind) => {
    const regions = candidates[kind].flatMap((mask) => describeRegions(mask, MIN_REGION_AREA[kind]));
    return regions
      .sort((a, b) => b.area - a.area)
      .slice(0, MAX_REGIONS[kind])
      .map((region) => ({
        kind,
        corners: [toPhoto(region.quad[0]), toPhoto(region.quad[1]), toPhoto(region.quad[2]), toPhoto(region.quad[3])] as Quad,
        mask: region.mask,
        anchor: toPhoto(region.centroid),
      }));
  });
  return { surfaces, paintable: paintableAreas(result, candidates.detectedCountertop) };
}
