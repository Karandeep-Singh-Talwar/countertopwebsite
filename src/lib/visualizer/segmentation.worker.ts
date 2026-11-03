// Runs scene parsing (what is it?) and depth estimation (which way does it
// face?) off the main thread so the page stays responsive while the weights
// download and inference runs.

import {
  pipeline,
  RawImage,
  type DepthEstimationPipeline,
  type ImageSegmentationPipeline,
} from '@huggingface/transformers';
import { OBJECTS_LABEL } from './types';

const SEGMENTATION_MODEL = 'Xenova/segformer-b2-finetuned-ade-512-512';
const DEPTH_MODEL = 'onnx-community/depth-anything-v2-small';

/**
 * ADE20K labels sent back. Cabinets are not repainted themselves: depth finds
 * the upward-facing counter tops inside them, which scene models usually
 * label "cabinet". Everything else (pots, stoves, sinks) stays in front.
 */
const WANTED_LABELS = new Set(['wall', 'floor', 'rug', 'countertop', 'counter', 'kitchen island', 'cabinet']);

/** The room's shell. Every other label (stoves, pots, plants, people) is an object to keep in front. */
const STRUCTURE_LABELS = new Set([...WANTED_LABELS, 'ceiling', 'windowpane', 'door', 'column', 'stairs']);

export type SegmentationRequest = {
  type: 'segment';
  width: number;
  height: number;
  pixels: Uint8ClampedArray;
};

export type SegmentationMessage =
  | { type: 'progress'; stage: 'download' | 'inference'; progress: number | null }
  | {
      type: 'result';
      width: number;
      height: number;
      segments: { label: string; mask: Uint8Array }[];
      /** Relative inverse depth per pixel; null when the depth model could not run. */
      disparity: Float32Array | null;
    }
  | { type: 'error'; message: string };

const post = (message: SegmentationMessage, transfer: Transferable[] = []) =>
  (self as unknown as Worker).postMessage(message, transfer);

// Both models download at once; report one combined percentage.
const downloads = new Map<string, { loaded: number; total: number }>();

function onDownloadProgress(event: unknown) {
  if (typeof event !== 'object' || event === null) return;
  const { status, name, file, loaded, total } = event as { status?: string; name?: string; file?: string; loaded?: number; total?: number };
  if (status !== 'progress' || !file?.endsWith('.onnx') || !total) return;
  downloads.set(`${name}/${file}`, { loaded: loaded ?? 0, total });
  let sumLoaded = 0;
  let sumTotal = 0;
  downloads.forEach((d) => {
    sumLoaded += d.loaded;
    sumTotal += d.total;
  });
  post({ type: 'progress', stage: 'download', progress: (sumLoaded / sumTotal) * 100 });
}

async function load<T>(task: 'image-segmentation' | 'depth-estimation', model: string): Promise<T> {
  const hasWebGpu = 'gpu' in navigator;
  try {
    return (await pipeline(task, model, { device: hasWebGpu ? 'webgpu' : 'wasm', progress_callback: onDownloadProgress })) as T;
  } catch (error: unknown) {
    if (!hasWebGpu) throw error;
    // Some GPUs advertise WebGPU but fail to compile the model; CPU still works.
    return (await pipeline(task, model, { device: 'wasm', progress_callback: onDownloadProgress })) as T;
  }
}

let segmenter: Promise<ImageSegmentationPipeline> | null = null;
let depthEstimator: Promise<DepthEstimationPipeline | null> | null = null;

async function estimateDisparity(image: RawImage): Promise<Float32Array | null> {
  // Depth sharpens results but is optional: without it, detection falls back to labels only.
  depthEstimator ??= load<DepthEstimationPipeline>('depth-estimation', DEPTH_MODEL).catch(() => null);
  const model = await depthEstimator;
  if (!model) return null;
  try {
    const { data } = (await model(image)).predicted_depth;
    return data instanceof Float32Array ? data : Float32Array.from(data as ArrayLike<number>);
  } catch {
    return null;
  }
}

self.onmessage = async (event: MessageEvent<SegmentationRequest>) => {
  const { width, height, pixels } = event.data;
  try {
    segmenter ??= load<ImageSegmentationPipeline>('image-segmentation', SEGMENTATION_MODEL);
    const image = new RawImage(pixels, width, height, 4);
    const disparityPromise = estimateDisparity(image);
    const model = await segmenter;
    post({ type: 'progress', stage: 'inference', progress: null });

    const output = await model(image);
    const segments = output
      .filter((s) => s.label !== null && WANTED_LABELS.has(s.label))
      .map((s) => ({ label: s.label as string, mask: Uint8Array.from(s.mask.data) }));
    const objects = new Uint8Array(width * height);
    for (const s of output) {
      if (s.label !== null && STRUCTURE_LABELS.has(s.label)) continue;
      for (let i = 0; i < objects.length; i++) if (s.mask.data[i]) objects[i] = 255;
    }
    segments.push({ label: OBJECTS_LABEL, mask: objects });
    const disparity = await disparityPromise;
    const usableDisparity = disparity && disparity.length === width * height ? disparity : null;

    const transfer: Transferable[] = segments.map((s) => s.mask.buffer);
    if (usableDisparity) transfer.push(usableDisparity.buffer);
    post({ type: 'result', width, height, segments, disparity: usableDisparity }, transfer);
  } catch (error: unknown) {
    segmenter = null;
    post({ type: 'error', message: error instanceof Error ? error.message : 'Surface detection failed' });
  }
};
