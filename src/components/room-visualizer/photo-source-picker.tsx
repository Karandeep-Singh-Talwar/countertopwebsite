'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, ImageUp, Sparkles, X, Aperture } from 'lucide-react';
import { PhotoUploadButton, usePhotoDrop } from './photo-upload';
import {
  captureFrame,
  describeCameraError,
  isCameraSupported,
  loadPhotoUrl,
  startCamera,
  stopCamera,
} from '@/lib/visualizer/photo-source';

// Unsplash serves CORS headers, which WebGL and the detector need. Swap for a photo of one of your own installs.
const SAMPLE_KITCHEN = 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1600&q=80';

interface PhotoSourcePickerProps {
  onPhoto: (photo: HTMLCanvasElement) => void;
}

export function PhotoSourcePicker({ onPhoto }: PhotoSourcePickerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { dragging, dropProps } = usePhotoDrop(onPhoto, (message) => setError(message));

  useEffect(() => () => stopCamera(streamRef.current), []);

  const closeCamera = () => {
    stopCamera(streamRef.current);
    streamRef.current = null;
    setCameraOn(false);
  };

  const openCamera = async () => {
    setError(null);
    if (!isCameraSupported()) {
      setError('Live camera needs a secure (https) page and a supported browser. Upload a photo instead.');
      return;
    }
    setCameraOn(true);
    try {
      // The <video> element mounts once cameraOn flips, so wait a frame for the ref.
      await new Promise((r) => requestAnimationFrame(r));
      if (!videoRef.current) throw new Error('Camera view failed to mount');
      streamRef.current = await startCamera(videoRef.current);
    } catch (e: unknown) {
      setError(describeCameraError(e));
      closeCamera();
    }
  };

  const capture = () => {
    if (!videoRef.current) return;
    try {
      const frame = captureFrame(videoRef.current);
      closeCamera();
      onPhoto(frame);
    } catch (e: unknown) {
      setError(describeCameraError(e));
    }
  };

  const runLoader = async (load: () => Promise<HTMLCanvasElement>) => {
    setBusy(true);
    setError(null);
    try {
      onPhoto(await load());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Could not load that photo.');
    } finally {
      setBusy(false);
    }
  };

  if (cameraOn) {
    return (
      <div className="relative w-full aspect-[3/4] sm:aspect-video bg-black overflow-hidden">
        <video ref={videoRef} playsInline muted className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-x-0 top-0 p-4 flex justify-between items-start text-white text-xs uppercase tracking-[0.2em]">
          <span className="bg-black/40 px-3 py-2 backdrop-blur-sm">Frame your counter &amp; backsplash</span>
          <button onClick={closeCamera} aria-label="Close camera" className="bg-black/40 p-2 backdrop-blur-sm cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={capture}
          aria-label="Capture photo"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-18 h-18 rounded-full border-4 border-white bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/40 transition-colors"
        >
          <Aperture className="w-8 h-8 text-white" />
        </button>
      </div>
    );
  }

  const optionClass =
    'group flex flex-col items-start gap-4 p-6 md:p-8 border border-[#1A1A1A]/15 hover:border-[#1A1A1A] bg-white/60 text-left transition-colors cursor-pointer disabled:opacity-50';

  return (
    <div
      className={`w-full p-2 -m-2 outline-2 outline-dashed transition-colors ${dragging ? 'outline-[#1A1A1A] bg-black/5' : 'outline-transparent'}`}
      {...dropProps}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PhotoUploadButton onPhoto={onPhoto} onError={setError} className={optionClass}>
          <ImageUp className="w-6 h-6" />
          <span className="font-serif text-2xl">Upload your kitchen</span>
          <span className="text-sm text-[#6C6863]">
            Choose a photo or drag it here. We detect your countertops, walls and floor automatically.
          </span>
        </PhotoUploadButton>
        <button onClick={openCamera} disabled={busy} className={optionClass}>
          <Camera className="w-6 h-6" />
          <span className="font-serif text-2xl">Use your camera</span>
          <span className="text-sm text-[#6C6863]">Point your phone at the kitchen and snap the counters you want to replace.</span>
        </button>
        <button onClick={() => void runLoader(() => loadPhotoUrl(SAMPLE_KITCHEN))} disabled={busy} className={optionClass}>
          <Sparkles className="w-6 h-6" />
          <span className="font-serif text-2xl">Try a sample room</span>
          <span className="text-sm text-[#6C6863]">No photo handy? Start with one of our installed kitchens.</span>
        </button>
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      <p className="mt-6 text-xs text-[#6C6863]">
        Your photo is processed in your browser and is never uploaded. For best results, stand back and include the
        whole counter run in good light.
      </p>
    </div>
  );
}
