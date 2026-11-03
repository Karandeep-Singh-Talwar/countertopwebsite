'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Download, Eye, RefreshCcw, ArrowRight, Loader2, ImageUp } from 'lucide-react';
import { PORCELAIN_CATALOG } from '@/data/porcelain-catalog-data';
import type { Quad } from '@/lib/visualizer/homography';
import { createSurfaceRenderer, type SurfaceRenderer } from '@/lib/visualizer/surface-renderer';
import { detectSurfaces } from '@/lib/visualizer/surface-detection';
import { buildDrawSpec, estimateBaseLuminance, matchTileGrid } from '@/lib/visualizer/surface-spec';
import {
  createSurface,
  type PaintableAreas,
  type PhotoSize,
  type Surface,
  type SurfaceKind,
  type VisualizerProduct,
} from '@/lib/visualizer/types';
import { PhotoSourcePicker } from './photo-source-picker';
import { PhotoUploadButton, usePhotoDrop } from './photo-upload';
import { SurfaceControls } from './surface-controls';
import { SurfaceEditorOverlay } from './surface-editor-overlay';
import { SurfacePins } from './surface-pins';

const PRODUCTS: VisualizerProduct[] = PORCELAIN_CATALOG.map((m) => ({
  id: m.id,
  name: m.name,
  texture: m.slabImage,
  finish: m.finish,
  priceEstimate: m.priceEstimate,
}));

const LUMA_WIDTH = 320;

const productIdOr = (id: string) => (PRODUCTS.some((p) => p.id === id) ? id : PRODUCTS[0].id);

/** What each detected surface starts dressed in, so the first render already looks designed. */
const DEFAULT_PRODUCT: Record<SurfaceKind, string> = {
  countertop: productIdOr('calcatta-extra'),
  backsplash: productIdOr('amazonite'),
  floor: productIdOr('grigio-collemandian'),
};

type DetectionState =
  | { status: 'idle' }
  | { status: 'running'; label: string; progress: number | null }
  | { status: 'notice'; message: string };

function manualSurfaces(size: PhotoSize): Surface[] {
  return [createSurface('backsplash', DEFAULT_PRODUCT.backsplash, size), createSurface('countertop', DEFAULT_PRODUCT.countertop, size)];
}

function downscale(photo: HTMLCanvasElement, width: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = Math.max(1, Math.round((photo.height / photo.width) * width));
  canvas.getContext('2d', { willReadFrequently: true })?.drawImage(photo, 0, 0, canvas.width, canvas.height);
  return canvas;
}

interface RoomVisualizerProps {
  onRequestQuote: (materialSummary: string) => void;
}

export function RoomVisualizer({ onRequestQuote }: RoomVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Held in state (not a ref) so a freshly created renderer triggers the first paint.
  const [renderer, setRenderer] = useState<SurfaceRenderer | null>(null);
  const [photo, setPhoto] = useState<HTMLCanvasElement | null>(null);
  const [surfaces, setSurfaces] = useState<Surface[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // Corner editing needs exactly one surface; group styling works with many.
  const activeId = selectedIds.length === 1 ? selectedIds[0] : null;
  const [showOriginal, setShowOriginal] = useState(false);
  const [shadeStrength, setShadeStrength] = useState(0.85);
  const [textureTick, setTextureTick] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [detection, setDetection] = useState<DetectionState>({ status: 'idle' });
  // What detection recognised as wall / floor / not-an-object; hand-placed surfaces are clipped to it.
  const [paintable, setPaintable] = useState<PaintableAreas | null>(null);
  // Bumped per photo so a slow detection never overwrites a newer photo's surfaces.
  const detectionToken = useRef(0);

  const lumaCanvas = useMemo(() => (photo ? downscale(photo, LUMA_WIDTH) : null), [photo]);

  // The GPU renderer lives exactly as long as the canvas node: the canvas only
  // mounts once a photo exists, and unmounts when the user picks a new one.
  const attachCanvas = useCallback(
    (node: HTMLCanvasElement | null) => {
      canvasRef.current = node;
      if (!node || !photo) return;
      let created: SurfaceRenderer | null = null;
      try {
        created = createSurfaceRenderer(node, () => setTextureTick((t) => t + 1));
        created.setPhoto(photo);
        setRenderer(created);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'This browser cannot render the visualizer.');
      }
      return () => {
        created?.dispose();
        setRenderer((current) => (current === created ? null : current));
        canvasRef.current = null;
      };
    },
    [photo],
  );

  const baseLuminance = useMemo(() => {
    if (!photo || !lumaCanvas) return new Map<string, number>();
    return new Map(surfaces.map((s) => [s.id, estimateBaseLuminance(lumaCanvas, photo.width, s)]));
  }, [photo, lumaCanvas, surfaces]);

  useEffect(() => {
    if (!renderer) return;
    const specs = surfaces.flatMap((s) => {
      const spec = buildDrawSpec(s, PRODUCTS.find((p) => p.id === s.productId), baseLuminance.get(s.id) ?? 0.5, shadeStrength);
      return spec ? [spec] : [];
    });
    renderer.render(specs, showOriginal);
  }, [renderer, surfaces, baseLuminance, shadeStrength, showOriginal, textureTick]);

  const runDetection = async (next: HTMLCanvasElement, token: number) => {
    const size = { width: next.width, height: next.height };
    const isCurrent = () => token === detectionToken.current;
    try {
      const { surfaces: found, paintable: areas } = await detectSurfaces(next, (p) => {
        if (!isCurrent()) return;
        setDetection({
          status: 'running',
          // Cached weights also report progress, so do not promise a download.
          label: p.stage === 'download' ? 'Loading surface AI' : 'Finding countertops, walls and floors',
          progress: p.progress,
        });
      });
      if (!isCurrent()) return;
      setPaintable(areas);
      if (found.length === 0) throw new Error('No countertops, walls or floors were recognised in this photo.');
      const detected = found.map((d) => createSurface(d.kind, DEFAULT_PRODUCT[d.kind], size, d));
      // Countertops are the main product, so never leave the user without one to
      // place; the hand-placed fallback still keeps clear of recognised objects.
      const counter =
        detected.find((s) => s.kind === 'countertop') ??
        createSurface('countertop', DEFAULT_PRODUCT.countertop, size, { mask: areas.countertop ?? undefined, clipToQuad: true });
      const created = detected.includes(counter) ? detected : [...detected, counter];
      setSurfaces(created);
      setSelectedIds([counter.id]);
      setDetection(
        detected.includes(counter)
          ? { status: 'idle' }
          : { status: 'notice', message: 'Walls and floors found. Drag the countertop corners onto your counter to finish.' },
      );
    } catch (e: unknown) {
      if (!isCurrent()) return;
      const fallback = manualSurfaces(size);
      setSurfaces(fallback);
      setSelectedIds([fallback[1].id]);
      const reason = e instanceof Error ? e.message : 'Automatic detection is unavailable.';
      setDetection({ status: 'notice', message: `${reason} Drag the corners to mark surfaces by hand.` });
    }
  };

  const handlePhoto = (next: HTMLCanvasElement) => {
    detectionToken.current += 1;
    setSurfaces([]);
    setSelectedIds([]);
    setError(null);
    setPaintable(null);
    setPhoto(next);
    setDetection({ status: 'running', label: 'Loading surface AI', progress: null });
    void runDetection(next, detectionToken.current);
  };

  const resetPhoto = () => {
    detectionToken.current += 1;
    setDetection({ status: 'idle' });
    setPhoto(null);
  };

  const addSurface = (kind: SurfaceKind) => {
    if (!photo) return;
    const surface = createSurface(kind, DEFAULT_PRODUCT[kind], { width: photo.width, height: photo.height }, {
      mask: paintable?.[kind] ?? undefined,
      clipToQuad: true,
    });
    setSurfaces((prev) => [...prev, surface]);
    setSelectedIds([surface.id]);
  };

  const removeSurface = (id: string) => {
    setSurfaces((prev) => prev.filter((s) => s.id !== id));
    setSelectedIds((current) => current.filter((selected) => selected !== id));
  };

  const updateSurface = useCallback((id: string, patch: Partial<Surface>) => {
    setSurfaces((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);

  const changeCorners = useCallback((id: string, corners: Quad) => updateSurface(id, { corners }), [updateSurface]);

  const selectSurface = useCallback((id: string, additive = false) => {
    setSelectedIds((current) => {
      if (!additive) return [id];
      return current.includes(id) ? current.filter((selected) => selected !== id) : [...current, id];
    });
  }, []);

  const selectKind = (kind: SurfaceKind) => setSelectedIds(surfaces.filter((s) => s.kind === kind).map((s) => s.id));

  /** Applies a change to every selected surface, keeping tile sizes consistent across a group. */
  const updateSelected = (patch: Partial<Surface>) => {
    setSurfaces((prev) => {
      const lead = prev.find((s) => s.id === selectedIds[0]);
      if (!lead) return prev;
      const leadNext = { ...lead, ...patch };
      const touchesTiles = 'layout' in patch || 'tileColumns' in patch || 'tileRows' in patch;
      return prev.map((s) => {
        if (!selectedIds.includes(s.id)) return s;
        if (s.id === lead.id) return leadNext;
        const grid = touchesTiles && leadNext.layout === 'tile' ? matchTileGrid(s, leadNext, leadNext.tileColumns, leadNext.tileRows) : {};
        return { ...s, ...patch, ...grid };
      });
    });
  };

  const download = () => {
    canvasRef.current?.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'my-verona-kitchen.jpg';
        link.click();
        URL.revokeObjectURL(url);
      },
      'image/jpeg',
      0.92,
    );
  };

  const requestQuote = () => {
    const summary = surfaces
      .map((s) => `${PRODUCTS.find((p) => p.id === s.productId)?.name ?? 'Material'} (${s.kind}, ${s.layout})`)
      .join(' + ');
    onRequestQuote(summary || 'Visualizer selection');
  };

  const { dragging, dropProps } = usePhotoDrop(handlePhoto, setError);

  if (!photo) return <PhotoSourcePicker onPhoto={handlePhoto} />;

  const aspect = photo.width / photo.height;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 items-start">
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <PhotoUploadButton
            onPhoto={handlePhoto}
            onError={setError}
            className="flex items-center gap-2 px-5 py-3 bg-[#1A1A1A] text-white text-xs uppercase tracking-[0.2em] cursor-pointer hover:bg-black"
          >
            <ImageUp className="w-4 h-4" /> Upload your kitchen
          </PhotoUploadButton>
          <span className="text-xs text-[#6C6863]">or drop a photo onto the picture</span>
        </div>
        <div
          className="relative mx-auto bg-[#1A1A1A]"
          style={{ aspectRatio: `${photo.width} / ${photo.height}`, width: `min(100%, calc(75vh * ${aspect}))` }}
          {...dropProps}
        >
          <canvas ref={attachCanvas} className="absolute inset-0 w-full h-full" aria-label="Your room with selected materials" />
          <SurfaceEditorOverlay
            size={{ width: photo.width, height: photo.height }}
            surfaces={surfaces}
            activeId={activeId}
            hidden={showOriginal}
            onSelect={selectSurface}
            onChangeCorners={changeCorners}
          />
          <SurfacePins
            size={{ width: photo.width, height: photo.height }}
            surfaces={surfaces}
            selectedIds={selectedIds}
            hidden={showOriginal}
            onSelect={selectSurface}
          />
          {dragging && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-sm uppercase tracking-[0.2em] outline-2 outline-dashed outline-white -outline-offset-8 pointer-events-none">
              Drop to use this photo
            </div>
          )}
          {detection.status === 'running' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30" role="status">
              <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-black/70 text-white text-xs uppercase tracking-[0.15em]">
                <Loader2 className="w-4 h-4 animate-spin" />
                {detection.label}
                {detection.progress !== null && ` · ${Math.round(detection.progress)}%`}
              </div>
            </div>
          )}
        </div>
        {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
        {detection.status === 'notice' && <p role="status" className="mt-3 text-sm text-[#6C6863]">{detection.message}</p>}

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs uppercase tracking-[0.15em]">
          <button
            className="flex items-center gap-2 cursor-pointer select-none hover:opacity-70"
            onPointerDown={() => setShowOriginal(true)}
            onPointerUp={() => setShowOriginal(false)}
            onPointerLeave={() => setShowOriginal(false)}
            onKeyDown={(e) => e.key === ' ' && setShowOriginal(true)}
            onKeyUp={() => setShowOriginal(false)}
          >
            <Eye className="w-4 h-4" /> Hold to see original
          </button>
          <button className="flex items-center gap-2 cursor-pointer hover:opacity-70" onClick={download}>
            <Download className="w-4 h-4" /> Save image
          </button>
          <button className="flex items-center gap-2 cursor-pointer hover:opacity-70" onClick={resetPhoto}>
            <RefreshCcw className="w-4 h-4" /> Camera or sample
          </button>
          <label className="flex items-center gap-3 normal-case tracking-normal text-[#6C6863]">
            Keep room lighting
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={shadeStrength}
              onChange={(e) => setShadeStrength(Number(e.target.value))}
              className="w-28 accent-[#1A1A1A]"
            />
          </label>
        </div>
      </div>

      <aside className="lg:sticky lg:top-28 space-y-8">
        <SurfaceControls
          surfaces={surfaces}
          selectedIds={selectedIds}
          products={PRODUCTS}
          onSelect={selectSurface}
          onSelectKind={selectKind}
          onAdd={addSurface}
          onRemove={removeSurface}
          onUpdateSelected={updateSelected}
        />
        <button
          onClick={requestQuote}
          disabled={surfaces.length === 0}
          className="w-full flex items-center justify-center gap-2 py-4 bg-[#1A1A1A] text-white text-xs uppercase tracking-[0.2em] cursor-pointer hover:bg-black disabled:opacity-40"
        >
          Quote this look <ArrowRight className="w-4 h-4" />
        </button>
      </aside>
    </div>
  );
}
