'use client';

import React, { useRef } from 'react';
import { isConvexQuad, type Point, type Quad } from '@/lib/visualizer/homography';
import type { PhotoSize, Surface } from '@/lib/visualizer/types';

interface SurfaceEditorOverlayProps {
  size: PhotoSize;
  surfaces: readonly Surface[];
  activeId: string | null;
  hidden: boolean;
  onSelect: (id: string) => void;
  onChangeCorners: (id: string, corners: Quad) => void;
}

type DragTarget = { surfaceId: string; corner: number | 'body'; start: Point; startCorners: Quad };

const clamp = (v: number, max: number) => Math.min(Math.max(v, 0), max);

/**
 * SVG layer sharing the photo's pixel coordinates (viewBox = photo size), so
 * dragged corners map 1:1 onto the homography without any extra conversion.
 */
export function SurfaceEditorOverlay({ size, surfaces, activeId, hidden, onSelect, onChangeCorners }: SurfaceEditorOverlayProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<DragTarget | null>(null);
  const handleRadius = Math.max(size.width, size.height) * 0.016;

  const toPhoto = (event: React.PointerEvent): Point => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: ((event.clientX - rect.left) / rect.width) * size.width,
      y: ((event.clientY - rect.top) / rect.height) * size.height,
    };
  };

  const beginDrag = (event: React.PointerEvent, surface: Surface, corner: number | 'body') => {
    event.stopPropagation();
    onSelect(surface.id);
    svgRef.current?.setPointerCapture(event.pointerId);
    drag.current = { surfaceId: surface.id, corner, start: toPhoto(event), startCorners: surface.corners };
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const current = drag.current;
    if (!current) return;
    const p = toPhoto(event);
    const dx = p.x - current.start.x;
    const dy = p.y - current.start.y;
    const next = current.startCorners.map((c, i) =>
      current.corner === 'body' || current.corner === i
        ? { x: clamp(c.x + dx, size.width), y: clamp(c.y + dy, size.height) }
        : c,
    );
    const quad: Quad = [next[0], next[1], next[2], next[3]];
    // Reject bow-tie shapes: the homography would fold the texture over itself.
    if (isConvexQuad(quad)) onChangeCorners(current.surfaceId, quad);
  };

  const endDrag = (event: React.PointerEvent) => {
    if (svgRef.current?.hasPointerCapture(event.pointerId)) svgRef.current.releasePointerCapture(event.pointerId);
    drag.current = null;
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${size.width} ${size.height}`}
      className={`absolute inset-0 w-full h-full touch-none select-none transition-opacity ${hidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {surfaces.map((surface) => {
        const active = surface.id === activeId;
        // Detected surfaces are outlined by their mask; only show the perspective quad while editing.
        if (surface.mask && !surface.clipToQuad && !active) return null;
        const points = surface.corners.map((c) => `${c.x},${c.y}`).join(' ');
        return (
          <g key={surface.id}>
            <polygon
              points={points}
              fill={active ? 'rgba(212,175,55,0.08)' : 'transparent'}
              stroke={active ? '#D4AF37' : 'rgba(255,255,255,0.7)'}
              strokeWidth={handleRadius * 0.18}
              strokeDasharray={active ? undefined : `${handleRadius * 0.6} ${handleRadius * 0.4}`}
              className="cursor-move"
              onPointerDown={(e) => beginDrag(e, surface, 'body')}
            />
            {active &&
              surface.corners.map((c, i) => (
                <g key={i} className="cursor-grab active:cursor-grabbing" onPointerDown={(e) => beginDrag(e, surface, i)}>
                  {/* Oversized invisible hit area: the visible dot is too small for fingers. */}
                  <circle cx={c.x} cy={c.y} r={handleRadius * 2.6} fill="transparent" />
                  <circle cx={c.x} cy={c.y} r={handleRadius} fill="#FAF8F5" stroke="#1A1A1A" strokeWidth={handleRadius * 0.2} />
                </g>
              ))}
          </g>
        );
      })}
    </svg>
  );
}
