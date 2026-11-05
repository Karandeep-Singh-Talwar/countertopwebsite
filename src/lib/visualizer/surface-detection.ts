// Main-thread side of auto-detection: sends a downscaled photo to the worker,
// then turns class masks (plus depth, when available) into ready-to-render
// surfaces - one per plane, like Roomvo's per-surface product instances.

import type { Point, Quad } from './homography';
import { describeRegions } from './mask-geometry';
import { expandToSuperpixels, refineEdges } from './mask-refine';
import { computeSuperpixels, type Superpixels } from './superpixels';
import {
  closeMask,
  counterLips,
  disparityGradients,
  extendUpward,
  floorReference,
  foreignObjects,
  groundedCabinets,
  growCounter,
  protrusions,
  splitByFacing,
  upwardFacing,
} from './plane-analysis';
import type { SegmentationMessage, SegmentationRequest } from './segmentation.worker';
import { straightenEdges } from './edge-straighten';
import {
  absorbFragments,
  addFrontEdge,
  backsplashBand,
  closeHalos,
  dropNarrowRuns,
  fillHoles,
  removeBelow,
  unite,
} from './surface-cleanup';
import { FIXTURES_LABEL, HORIZONTAL_KINDS, OBJECTS_LABEL, type PaintableAreas, type SurfaceKind, type SurfaceMask } from './types';

/** Inference resolution. Masks are upsampled bilinearly in the shader. */
const DETECTION_EDGE = 640;

/** Ignore specks; walls and floors must be substantial to be worth a pin. */
const MIN_REGION_AREA: Record<SurfaceKind, number> = { countertop: 0.004, backsplash: 0.02, floor: 0.008 };
const MAX_REGIONS: Record<SurfaceKind, number> = { countertop: 3, backsplash: 4, floor: 2 };

/** Height (share of photo) of the band above base cabinets where a counter is looked for by colour. */
const COUNTER_ZONE_SHARE = 0.05;
/** Counter front edges reach at most this share of photo height below the top surface. */
const FRONT_EDGE_SHARE = 0.015;
/** RGB distance from the counter colour still counted as its front edge. */
const FRONT_EDGE_TOLERANCE = 45;
/** The backsplash band is searched up to this share of photo height above the counter. */
const BACKSPLASH_MAX_SHARE = 0.35;

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
  /** Edge-following patches of the photo, used by the magic wand. */
  superpixels: Superpixels;
}

/** Edges wobbling less than this share of the photo's long edge count as straight lines. */
const EDGE_TOLERANCE_SHARE = 1 / 200;
/** Counter rows narrower than this share of the photo width are slivers (end panels, cabinet sides), not counter. */
const COUNTER_MIN_RUN_SHARE = 0.03;
/** Unpainted halos around objects are closed up to this share of the photo's long edge. */
const HALO_SHARE = 0.012;
/** Enclosed holes up to this share of a surface's area are filled (unless they are objects). */
const WALL_HOLE_SHARE = 0.05;
const COUNTER_HOLE_SHARE = 0.08;
/** Wall fragments smaller than this share of the photo join a neighbouring wall plane. */
const WALL_FRAGMENT_SHARE = 0.02;

/**
 * Repairs what busy finishes do to the detection: fills holes (star-tile
 * motifs, mosaic gaps), closes the halo left around appliances, folds wall
 * fragments into their neighbouring plane, and keeps every pixel in one surface.
 */
function cleanCandidates(candidates: PlaneMasks, result: DetectionResult): PlaneMasks {
  const { width, height } = result;
  const all = (masks: SurfaceMask[]) => unite(width, height, ...masks);
  const keepOut = unite(width, height, maskOf(result, [OBJECTS_LABEL]), maskOf(result, [FIXTURES_LABEL]), candidates.protruding);
  const cabinets = maskOf(result, ['cabinet']);
  const radius = Math.max(2, Math.round(Math.max(width, height) * HALO_SHARE));
  const tidy = (mask: SurfaceMask, barrier: SurfaceMask, holeShare: number, r: number) =>
    closeHalos(fillHoles(mask, keepOut, holeShare), barrier, r);

  const counters = candidates.countertop.map((m) =>
    // Smaller halo for counters: a wider one would creep onto the cabinet fronts below.
    tidy(m, unite(width, height, keepOut, all(candidates.backsplash), all(candidates.floor)), COUNTER_HOLE_SHARE, Math.ceil(radius / 2)),
  );
  const counterAll = all(counters);
  const wallPlanes = absorbFragments(candidates.backsplash, Math.round(width * height * WALL_FRAGMENT_SHARE)).map((m) =>
    // Edge refinement may have pulled a white canister back into a white wall by colour; depth says otherwise.
    subtract(subtract(tidy(m, unite(width, height, keepOut, cabinets, counterAll, all(candidates.floor)), WALL_HOLE_SHARE, radius), counterAll), candidates.protruding),
  );
  const floors = candidates.floor.map((m) =>
    subtract(tidy(m, unite(width, height, keepOut, cabinets, counterAll, all(wallPlanes)), WALL_HOLE_SHARE, radius), counterAll),
  );
  // Kitchens are straight lines: snap nearly-straight edges onto exact lines.
  const tolerance = Math.max(2, Math.round(Math.max(width, height) * EDGE_TOLERANCE_SHARE));
  const straight = (m: SurfaceMask, keep: SurfaceMask) => straightenEdges(m, keep, tolerance, tolerance * 2);
  const minCounterRun = Math.max(3, Math.round(width * COUNTER_MIN_RUN_SHARE));
  const straightCounters = counters.map((m) => straight(dropNarrowRuns(m, minCounterRun), unite(width, height, keepOut, all(wallPlanes), all(floors))));
  const counterLine = all(straightCounters);
  return {
    ...candidates,
    countertop: straightCounters,
    // Re-apply "nothing under a counter is wall" against the final, fully grown counters.
    backsplash: wallPlanes.map((m) => removeBelow(subtract(straight(m, unite(width, height, keepOut, cabinets, counterLine)), counterLine), counterLine)),
    floor: floors.map((m) => subtract(straight(m, unite(width, height, keepOut, cabinets, counterLine)), counterLine)),
  };
}

/** Superpixel spacing for the magic wand: about 64 patches along the photo's long edge. */
const PATCHES_PER_EDGE = 64;
/** Edge refinement band: about 1/128 of the long edge (5 px at detection size). */
const EDGES_PER_BAND = 128;

/**
 * Snaps every candidate mask to the photo's real colour edges (two passes of
 * local refinement converge), then makes them disjoint with countertops first,
 * walls next and floors last, so a counter lip claimed by the countertop is
 * never also painted as wall.
 */
function refineCandidates(candidates: PlaneMasks, rgba: Uint8ClampedArray, band: number): PlaneMasks {
  const sample = candidates.countertop[0] ?? candidates.backsplash[0] ?? candidates.floor[0];
  if (!sample) return candidates;
  const claimed = { width: sample.width, height: sample.height, data: new Uint8Array(sample.width * sample.height) };
  const take = (masks: SurfaceMask[]) =>
    masks.map((mask) => {
      const snapped = subtract(refineEdges(refineEdges(mask, rgba, band), rgba, band), claimed);
      for (let i = 0; i < snapped.data.length; i++) if (snapped.data[i]) claimed.data[i] = 255;
      return snapped;
    });
  const countertop = take(candidates.countertop);
  return { ...candidates, countertop, backsplash: take(candidates.backsplash), floor: take(candidates.floor) };
}

export type DetectionProgress = Extract<SegmentationMessage, { type: 'progress' }>;

let worker: Worker | null = null;

function getWorker(): Worker {
  worker ??= new Worker(new URL('./segmentation.worker.ts', import.meta.url), { type: 'module' });
  return worker;
}

/** Slow phones on CPU can take a while, but never leave the user staring at a spinner forever. */
const DETECTION_TIMEOUT_MS = 180_000;

function runWorker(request: SegmentationRequest, onProgress: (p: DetectionProgress) => void) {
  return new Promise<Extract<SegmentationMessage, { type: 'result' }>>((resolve, reject) => {
    const w = getWorker();
    const cleanup = () => {
      clearTimeout(timer);
      w.removeEventListener('message', handle);
      w.removeEventListener('error', crashed);
      w.removeEventListener('messageerror', crashed);
    };
    const fail = (message: string) => {
      cleanup();
      // A crashed or stuck worker cannot be reused; the next photo gets a fresh one.
      w.terminate();
      worker = null;
      reject(new Error(message));
    };
    const handle = (event: MessageEvent<SegmentationMessage>) => {
      const message = event.data;
      if (message.type === 'progress') return onProgress(message);
      cleanup();
      if (message.type === 'result') resolve(message);
      else reject(new Error(message.message));
    };
    const crashed = () => fail('Automatic detection could not start in this browser.');
    const timer = setTimeout(() => fail('Automatic detection took too long.'), DETECTION_TIMEOUT_MS);
    w.addEventListener('message', handle);
    w.addEventListener('error', crashed);
    w.addEventListener('messageerror', crashed);
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

type PlaneMasks = Record<SurfaceKind, SurfaceMask[]> & {
  detectedCountertop: SurfaceMask | null;
  /** Things standing in front of the wall that the model labelled as wall (canisters, bottles). */
  protruding: SurfaceMask | null;
};

/** Candidate masks per kind; each mask may still hold several disconnected regions. */
/** A superpixel at least this much flagged as protruding is taken out whole. */
const PROTRUSION_PATCH_SHARE = 0.25;

function planeMasks(result: DetectionResult, rgba: Uint8ClampedArray, sp: Superpixels): PlaneMasks {
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
      protruding: null,
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
    // Counter zone: a thin band just above the base cabinets, where counters live.
    const everything = { width: result.width, height: result.height, data: new Uint8Array(result.width * result.height).fill(255) };
    const zone = subtract(subtract(extendUpward(cabinets, everything, Math.round(result.height * COUNTER_ZONE_SHARE)), cabinets), objects);
    const grown = growCounter(seeds, cabinets, objects, gradients, reference, rgba, zone);
    const filled = closeMask(grown, Math.round(result.width / 320) + 1);
    // Hole-filling may bridge over a mug or a hob; put those back in front.
    tops = objects ? subtract(filled, foreignObjects(objects, grown, rgba)) : filled;
  }

  const topSurface = union(tops, maskOf(result, ['countertop']));
  // The counter's front edge is the same stone; the scene model calls it cabinet.
  const countertop = topSurface
    ? addFrontEdge(topSurface, rgba, objects, Math.round(result.height * FRONT_EDGE_SHARE), FRONT_EDGE_TOLERANCE)
    : null;

  // Backsplash: everything between the counter and the wall cabinets / hood / window above it.
  const stops = unite(result.width, result.height, labelledCabinets, maskOf(result, [FIXTURES_LABEL]));
  const splashBand = countertop ? backsplashBand(countertop, stops, objects, Math.round(result.height * BACKSPLASH_MAX_SHARE)) : null;
  const mergedWalls = union(wall, splashBand);
  // Nothing under a countertop is wall: that is a cabinet front or a peninsula's end panel.
  const rawWalls = mergedWalls && countertop ? removeBelow(mergedWalls, countertop) : mergedWalls;
  // Judge protrusions against the wall alone: the counter sticks out from the wall but is not an object.
  const wallOnly = rawWalls ? subtract(rawWalls, countertop) : null;
  const protruding = wallOnly
    ? subtract(expandToSuperpixels(protrusions(wallOnly, result.disparity, reference), sp, PROTRUSION_PATCH_SHARE), countertop)
    : null;
  const walls = rawWalls ? subtract(rawWalls, protruding) : null;

  return {
    countertop: present(countertop),
    // Each pixel belongs to one surface: counter bands found inside "wall" leave the wall.
    backsplash: walls ? splitByFacing(subtract(subtract(walls, countertop), floor), gradients, reference) : [],
    floor: present(floor),
    detectedCountertop: countertop,
    protruding,
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

  const superpixels = computeSuperpixels(rgba, width, height, Math.max(6, Math.round(Math.max(width, height) / PATCHES_PER_EDGE)));
  const band = Math.max(2, Math.round(Math.max(width, height) / EDGES_PER_BAND));
  const candidates = cleanCandidates(refineCandidates(planeMasks(result, rgba, superpixels), rgba, band), result);
  const kinds: SurfaceKind[] = ['countertop', 'backsplash', 'floor'];

  const surfaces = kinds.flatMap((kind) => {
    const regions = candidates[kind].flatMap((mask) => describeRegions(mask, MIN_REGION_AREA[kind], HORIZONTAL_KINDS.has(kind)));
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
  return { surfaces, paintable: paintableAreas(result, candidates.detectedCountertop), superpixels };
}
