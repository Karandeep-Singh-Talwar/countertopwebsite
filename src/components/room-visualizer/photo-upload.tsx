'use client';

import React, { useState } from 'react';
import { loadPhotoFile } from '@/lib/visualizer/photo-source';

interface PhotoUploadProps {
  onPhoto: (photo: HTMLCanvasElement) => void;
  onError: (message: string) => void;
  className?: string;
  children: React.ReactNode;
}

export async function photoFromFiles(files: FileList | null | undefined): Promise<HTMLCanvasElement | null> {
  const file = files?.[0];
  return file ? loadPhotoFile(file) : null;
}

const describe = (e: unknown) => (e instanceof Error ? e.message : 'Could not open that photo.');

/** A label-wrapped file input: picks a photo (or opens the camera on phones) and decodes it. */
export function PhotoUploadButton({ onPhoto, onError, className, children }: PhotoUploadProps) {
  const [busy, setBusy] = useState(false);
  return (
    <label className={`${className ?? ''} ${busy ? 'opacity-50 pointer-events-none' : ''}`} aria-busy={busy}>
      {children}
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={busy}
        onChange={async (e) => {
          const { files } = e.target;
          setBusy(true);
          try {
            const photo = await photoFromFiles(files);
            if (photo) onPhoto(photo);
          } catch (err: unknown) {
            onError(describe(err));
          } finally {
            e.target.value = '';
            setBusy(false);
          }
        }}
      />
    </label>
  );
}

/** Makes an element a drop target for a photo file; returns the props to spread and the hover state. */
export function usePhotoDrop(onPhoto: (photo: HTMLCanvasElement) => void, onError: (message: string) => void) {
  const [dragging, setDragging] = useState(false);
  const dropProps = {
    onDragOver: (e: React.DragEvent) => {
      if (!e.dataTransfer.types.includes('Files')) return;
      e.preventDefault();
      setDragging(true);
    },
    onDragLeave: () => setDragging(false),
    onDrop: async (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      try {
        const photo = await photoFromFiles(e.dataTransfer.files);
        if (photo) onPhoto(photo);
      } catch (err: unknown) {
        onError(describe(err));
      }
    },
  };
  return { dragging, dropProps };
}
