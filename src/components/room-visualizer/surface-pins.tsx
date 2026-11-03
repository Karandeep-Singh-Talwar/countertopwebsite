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
            style={{ left: `${(at.x / size.width) * 100}%`, top: `${(at.y / size.height) * 100}%` }}
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
