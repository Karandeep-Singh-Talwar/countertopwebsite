'use client';

import React from 'react';
import Image from 'next/image';
import { Plus, Trash2, RotateCw, Layers } from 'lucide-react';
import type { Surface, SurfaceKind, VisualizerProduct } from '@/lib/visualizer/types';
import { OutlineToolsPanel } from './outline-tools-panel';
import type { useOutlineTools } from './use-outline-tools';

interface SurfaceControlsProps {
  surfaces: readonly Surface[];
  selectedIds: readonly string[];
  products: readonly VisualizerProduct[];
  /** `additive` toggles one surface in or out of the current selection. */
  onSelect: (id: string, additive: boolean) => void;
  onSelectKind: (kind: SurfaceKind) => void;
  onAdd: (kind: SurfaceKind) => void;
  onRemove: (id: string) => void;
  /** Applies to every selected surface. */
  onUpdateSelected: (patch: Partial<Surface>) => void;
  outline: ReturnType<typeof useOutlineTools>;
}

const KIND_LABEL: Record<SurfaceKind, string> = { countertop: 'Countertop', backsplash: 'Wall', floor: 'Floor' };
const KIND_PLURAL: Record<SurfaceKind, string> = { countertop: 'countertops', backsplash: 'walls', floor: 'floors' };
const KINDS: readonly SurfaceKind[] = ['countertop', 'backsplash', 'floor'];

const isAdditive = (e: React.MouseEvent) => e.ctrlKey || e.metaKey || e.shiftKey;

function Stepper({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="uppercase tracking-[0.15em] text-[#6C6863]">{label}</span>
      <div className="flex items-center border border-[#1A1A1A]/15">
        <button className="px-3 py-1.5 cursor-pointer hover:bg-black/5" onClick={() => onChange(Math.max(1, value - 1))} aria-label={`Fewer ${label}`}>−</button>
        <span className="w-8 text-center tabular-nums">{value}</span>
        <button className="px-3 py-1.5 cursor-pointer hover:bg-black/5" onClick={() => onChange(Math.min(24, value + 1))} aria-label={`More ${label}`}>+</button>
      </div>
    </div>
  );
}

/** Per-kind numbering, matching the pins on the photo ("Walls 1", "Walls 2"...). */
function labelsFor(surfaces: readonly Surface[]): Map<string, string> {
  const counts = new Map<SurfaceKind, number>();
  const labels = new Map<string, string>();
  for (const s of surfaces) {
    const n = (counts.get(s.kind) ?? 0) + 1;
    counts.set(s.kind, n);
    labels.set(s.id, `${KIND_LABEL[s.kind]} ${n}`);
  }
  return labels;
}

export function SurfaceControls({ surfaces, selectedIds, products, onSelect, onSelectKind, onAdd, onRemove, onUpdateSelected, outline }: SurfaceControlsProps) {
  const selected = surfaces.filter((s) => selectedIds.includes(s.id));
  const lead = selected[0] ?? null;
  const labels = labelsFor(surfaces);
  const sameProduct = selected.every((s) => s.productId === lead?.productId);

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-xs uppercase tracking-[0.2em] text-[#6C6863] mb-3">1 · Surfaces</h3>
        <div className="flex flex-wrap gap-2">
          {KINDS.map((kind) => {
            const ofKind = surfaces.filter((s) => s.kind === kind);
            if (ofKind.length < 2) return null;
            const allSelected = ofKind.every((s) => selectedIds.includes(s.id)) && selected.length === ofKind.length;
            return (
              <button
                key={kind}
                onClick={() => onSelectKind(kind)}
                aria-pressed={allSelected}
                className={`flex items-center gap-1.5 px-3 py-2 border text-xs uppercase tracking-[0.15em] cursor-pointer ${
                  allSelected ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white' : 'border-[#1A1A1A] hover:bg-black/5'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> All {KIND_PLURAL[kind]} ({ofKind.length})
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {surfaces.map((s) => {
            const on = selectedIds.includes(s.id);
            return (
              <div
                key={s.id}
                className={`flex items-center border text-xs uppercase tracking-[0.15em] ${on ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white' : 'border-[#1A1A1A]/15'}`}
              >
                <button className="px-3 py-2 cursor-pointer" aria-pressed={on} onClick={(e) => onSelect(s.id, isAdditive(e))}>
                  {labels.get(s.id)}
                </button>
                <button className="px-2 py-2 cursor-pointer opacity-60 hover:opacity-100" onClick={() => onRemove(s.id)} aria-label={`Remove ${labels.get(s.id)}`}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
          {KINDS.map((kind) => (
            <button
              key={kind}
              onClick={() => onAdd(kind)}
              className="flex items-center gap-1.5 px-3 py-2 border border-dashed border-[#1A1A1A]/30 text-xs uppercase tracking-[0.15em] cursor-pointer hover:border-[#1A1A1A]"
            >
              <Plus className="w-3.5 h-3.5" /> {KIND_LABEL[kind]}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-[#6C6863]">
          Tap a label to style one surface, or pick &ldquo;All walls&rdquo; to style them together. Ctrl / ⌘ / Shift-tap adds a
          surface to the group.
        </p>
        {selected.length === 1 && lead && <OutlineToolsPanel outline={outline} surfaceLabel={labels.get(lead.id) ?? 'surface'} />}
      </section>

      {lead && (
        <>
          <section>
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#6C6863] mb-3">
              2 · Choose material{selected.length > 1 && ` · ${selected.length} surfaces`}
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2">
              {products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onUpdateSelected({ productId: p.id })}
                  title={p.name}
                  className={`relative aspect-square overflow-hidden cursor-pointer outline-offset-2 ${sameProduct && lead.productId === p.id ? 'outline-2 outline-[#1A1A1A]' : 'outline-0 hover:opacity-80'}`}
                >
                  <Image src={p.texture} alt={p.name} fill sizes="96px" className="object-cover" />
                </button>
              ))}
            </div>
            {(() => {
              const product = sameProduct ? products.find((p) => p.id === lead.productId) : null;
              if (!sameProduct) return <p className="mt-3 text-sm text-[#6C6863]">Mixed materials - pick one to apply to all selected.</p>;
              return product ? (
                <p className="mt-3 text-sm">
                  <span className="font-serif text-lg">{product.name}</span>
                  <span className="block text-xs text-[#6C6863]">{product.finish} · {product.priceEstimate}</span>
                </p>
              ) : null;
            })()}
          </section>

          <section className="space-y-3">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#6C6863]">3 · Layout</h3>
            <div className="grid grid-cols-2 border border-[#1A1A1A]/15 text-xs uppercase tracking-[0.15em]">
              {(['slab', 'tile'] as const).map((layout) => (
                <button
                  key={layout}
                  onClick={() => onUpdateSelected({ layout })}
                  className={`py-2 cursor-pointer ${lead.layout === layout ? 'bg-[#1A1A1A] text-white' : 'hover:bg-black/5'}`}
                >
                  {layout === 'slab' ? 'Full slab' : 'Tiles + grout'}
                </button>
              ))}
            </div>
            {lead.layout === 'slab' ? (
              <label className="block text-xs">
                <span className="uppercase tracking-[0.15em] text-[#6C6863]">Vein scale</span>
                <input
                  type="range"
                  min={0.5}
                  max={4}
                  step={0.1}
                  value={lead.scale}
                  onChange={(e) => onUpdateSelected({ scale: Number(e.target.value) })}
                  className="w-full accent-[#1A1A1A]"
                />
              </label>
            ) : (
              <>
                <Stepper label="Tiles across" value={lead.tileColumns} onChange={(v) => onUpdateSelected({ tileColumns: v })} />
                <Stepper label="Tiles high" value={lead.tileRows} onChange={(v) => onUpdateSelected({ tileRows: v })} />
              </>
            )}
            <button
              onClick={() => onUpdateSelected({ rotated: !lead.rotated })}
              className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] cursor-pointer hover:opacity-70"
            >
              <RotateCw className="w-3.5 h-3.5" /> Rotate pattern 90°
            </button>
          </section>
        </>
      )}
    </div>
  );
}
