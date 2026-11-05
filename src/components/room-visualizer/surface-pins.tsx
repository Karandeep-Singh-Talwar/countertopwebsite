'use client';

import React from 'react';
import { Check } from 'lucide-react';
import type { Point } from '@/lib/visualizer/homography';
import type { PhotoSize, Surface, SurfaceKind } from '@/lib/visualizer/types';

const PIN_LABEL: Record<SurfaceKind, string> = { countertop: 'Countertops', backsplash: 'Walls', floor: 'Floors' };

interface SurfacePinsProps {
  size: PhotoSize;
  surfaces: readonly Surface[];
  selectedIds: readonly string[];
  hidden: boolean;
  /** `additive` (Ctrl / Cmd / Shift-tap) toggles the surface in the current selection. */
  onSelect: (id: string, additive: boolean) => void;
}

/** Pins stay this far (percent) inside the picture so their labels are never cut off. */
const EDGE_MARGIN = { x: 7, y: 5 };
/** A pin closer than this (percent of the picture) to a corner handle moves out of its way. */
const HANDLE_CLEARANCE = 5;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Pin position in percent: clamped inside the picture and nudged off the editable corner handles. */
function pinPosition(at: Point, size: PhotoSize, handles: readonly Point[]): { left: number; top: number } {
  const left = clamp((at.x / size.width) * 100, EDGE_MARGIN.x, 100 - EDGE_MARGIN.x);
  let top = clamp((at.y / size.height) * 100, EDGE_MARGIN.y, 100 - EDGE_MARGIN.y);
  for (const h of handles) {
    const hx = (h.x / size.width) * 100;
    const hy = (h.y / size.height) * 100;
    if (Math.abs(hx - left) < HANDLE_CLEARANCE * 2 && Math.abs(hy - top) < HANDLE_CLEARANCE) {
      top = clamp(hy > 50 ? hy - HANDLE_CLEARANCE * 1.6 : hy + HANDLE_CLEARANCE * 1.6, EDGE_MARGIN.y, 100 - EDGE_MARGIN.y);
    }
  }
  return { left, top };
}

function quadCenter(surface: Surface): Point {
  const xs = surface.corners.map((c) => c.x);
  const ys = surface.corners.map((c) => c.y);
  return { x: xs.reduce((a, b) => a + b) / 4, y: ys.reduce((a, b) => a + b) / 4 };
}

/**
 * Floating labels anchored on each surface - tap one to choose what the
 * material picker applies to. HTML (not SVG) so text stays crisp and the pins
 * are real, focusable buttons.
 */
export function SurfacePins({ size, surfaces, selectedIds, hidden, onSelect }: SurfacePinsProps) {
  if (hidden) return null;
  const counts = new Map<SurfaceKind, number>();
  // Corner handles are shown only when exactly one surface is selected.
  const editing = selectedIds.length === 1 ? surfaces.find((s) => s.id === selectedIds[0]) : undefined;
  const handles = editing ? editing.corners : [];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {surfaces.map((surface) => {
        const n = (counts.get(surface.kind) ?? 0) + 1;
        counts.set(surface.kind, n);
        const total = surfaces.filter((s) => s.kind === surface.kind).length;
        const label = total > 1 ? `${PIN_LABEL[surface.kind]} ${n}` : PIN_LABEL[surface.kind];
        const at = surface.anchor ?? quadCenter(surface);
        const active = selectedIds.includes(surface.id);
        return (
          <button
            key={surface.id}
            onClick={(e) => onSelect(surface.id, e.ctrlKey || e.metaKey || e.shiftKey)}
            aria-pressed={active}
            className={`pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full text-[11px] sm:text-xs whitespace-nowrap backdrop-blur-sm border transition-colors cursor-pointer ${
              active ? 'bg-white text-[#1A1A1A] border-white' : 'bg-black/55 text-white border-white/40 hover:bg-black/70'
            }`}
            style={(() => {
              const { left, top } = pinPosition(at, size, handles);
              return { left: `${left}%`, top: `${top}%` };
            })()}
          >
            {label}
            <span className={`w-4 h-4 rounded-full flex items-center justify-center ${active ? 'bg-[#1A1A1A] text-white' : 'border border-white/70'}`}>
              {active && <Check className="w-3 h-3" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
