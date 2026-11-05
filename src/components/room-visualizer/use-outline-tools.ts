'use client';

import { useState } from 'react';
import type { Point } from '@/lib/visualizer/homography';
import { editMask, magicWand, quadToMask } from '@/lib/visualizer/mask-refine';
import type { Superpixels } from '@/lib/visualizer/superpixels';
import type { PhotoSize, Surface, SurfaceMask } from '@/lib/visualizer/types';

export type OutlineTool = 'corners' | 'add' | 'erase';

interface HistoryEntry {
  id: string;
  mask: SurfaceMask | undefined;
  clipToQuad: boolean | undefined;
}

interface OutlineToolsOptions {
  surfaces: readonly Surface[];
  activeId: string | null;
  superpixels: Superpixels | null;
  photoSize: PhotoSize | null;
  setSurfaces: (update: (prev: Surface[]) => Surface[]) => void;
}

/** CIELAB delta-E the wand tolerates by default: same paint under changing light, not the cabinet next to it. */
export const DEFAULT_WAND_TOLERANCE = 10;
const MAX_HISTORY = 30;

/**
 * Magic-wand add / erase on the selected surface's outline, with undo.
 * Pure colour-and-edge editing; works the same on detected and hand-placed surfaces.
 */
export function useOutlineTools({ surfaces, activeId, superpixels, photoSize, setSurfaces }: OutlineToolsOptions) {
  const [tool, setTool] = useState<OutlineTool>('corners');
  const [tolerance, setTolerance] = useState(DEFAULT_WAND_TOLERANCE);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const applyAt = (point: Point) => {
    if (tool === 'corners' || !activeId || !superpixels || !photoSize) return;
    const surface = surfaces.find((s) => s.id === activeId);
    if (!surface) return;
    const region = magicWand(superpixels, point, photoSize.width, photoSize.height, tolerance);
    // A hand-placed surface paints quad AND mask; turn that into a plain mask so edits outside the quad show.
    const base = surface.clipToQuad || !surface.mask
      ? quadToMask(surface.corners, photoSize.width, photoSize.height, superpixels.width, superpixels.height, surface.mask)
      : surface.mask;
    const mask = editMask(base, region, tool);
    setHistory((h) => [...h.slice(-(MAX_HISTORY - 1)), { id: surface.id, mask: surface.mask, clipToQuad: surface.clipToQuad }]);
    setSurfaces((prev) => prev.map((s) => (s.id === surface.id ? { ...s, mask, clipToQuad: false } : s)));
  };

  const undo = () => {
    const last = history[history.length - 1];
    if (!last) return;
    setHistory((h) => h.slice(0, -1));
    setSurfaces((prev) => prev.map((s) => (s.id === last.id ? { ...s, mask: last.mask, clipToQuad: last.clipToQuad } : s)));
  };

  /** Forget history when the photo changes; old entries point at surfaces that no longer exist. */
  const reset = () => {
    setHistory([]);
    setTool('corners');
  };

  return {
    tool,
    setTool,
    tolerance,
    setTolerance,
    canUndo: history.length > 0,
    undo,
    applyAt,
    reset,
    available: superpixels !== null,
  };
}
