'use client';

import React from 'react';
import { Move, Wand2, Eraser, Undo2 } from 'lucide-react';
import type { OutlineTool, useOutlineTools } from './use-outline-tools';

interface OutlineToolsPanelProps {
  outline: ReturnType<typeof useOutlineTools>;
  surfaceLabel: string;
}

const TOOLS: { id: OutlineTool; label: string; icon: React.ReactNode; hint: string }[] = [
  { id: 'corners', label: 'Corners', icon: <Move className="w-3.5 h-3.5" />, hint: 'Drag the corner dots to set the pattern’s perspective.' },
  { id: 'add', label: 'Add area', icon: <Wand2 className="w-3.5 h-3.5" />, hint: 'Tap a missed patch on the photo; similar-coloured area joins the surface.' },
  { id: 'erase', label: 'Erase area', icon: <Eraser className="w-3.5 h-3.5" />, hint: 'Tap a wrongly covered patch on the photo to remove it.' },
];

/** Hand fixes for the selected surface's outline: magic wand, eraser, tolerance and undo. */
export function OutlineToolsPanel({ outline, surfaceLabel }: OutlineToolsPanelProps) {
  if (!outline.available) return null;
  const current = TOOLS.find((t) => t.id === outline.tool) ?? TOOLS[0];

  return (
    <div className="mt-4 border border-[#1A1A1A]/15 p-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.15em] text-[#6C6863]">Fix {surfaceLabel} outline</span>
        <button
          onClick={outline.undo}
          disabled={!outline.canUndo}
          className="flex items-center gap-1 text-xs uppercase tracking-[0.15em] cursor-pointer disabled:opacity-30 disabled:cursor-default hover:opacity-70"
        >
          <Undo2 className="w-3.5 h-3.5" /> Undo
        </button>
      </div>
      <div className="grid grid-cols-3 border border-[#1A1A1A]/15 text-[11px] uppercase tracking-[0.12em]">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            onClick={() => outline.setTool(t.id)}
            aria-pressed={outline.tool === t.id}
            className={`flex items-center justify-center gap-1.5 py-2 cursor-pointer ${outline.tool === t.id ? 'bg-[#1A1A1A] text-white' : 'hover:bg-black/5'}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-[#6C6863]">{current.hint}</p>
      {outline.tool !== 'corners' && (
        <label className="block text-xs">
          <span className="uppercase tracking-[0.15em] text-[#6C6863]">
            Colour tolerance · {outline.tolerance < 8 ? 'tight' : outline.tolerance > 16 ? 'loose' : 'normal'}
          </span>
          <input
            type="range"
            min={4}
            max={25}
            step={1}
            value={outline.tolerance}
            onChange={(e) => outline.setTolerance(Number(e.target.value))}
            className="w-full accent-[#1A1A1A]"
          />
        </label>
      )}
    </div>
  );
}
