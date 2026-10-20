'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { MoveHorizontal, Check, Sparkles } from 'lucide-react';

interface RoomPreset {
  id: string;
  name: string;
  beforeImg: string;
  afterImg: string;
  beforeLabel: string;
  afterLabel: string;
  stoneUsed: string;
  savings: string;
}

const PRESETS: RoomPreset[] = [
  {
    id: 'kitchen-island',
    name: 'Gourmet Kitchen Island',
    beforeImg: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1200&q=80',
    beforeLabel: 'Before: Dated Oak & Stained Laminate',
    afterLabel: 'After: 3cm Calacatta Gold Waterfall Island',
    stoneUsed: 'Calacatta Gold Supreme Quartz',
    savings: 'Saved $2,960 Direct',
  },
  {
    id: 'master-bath',
    name: 'Primary Spa Ensuite',
    beforeImg: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
    beforeLabel: 'Before: Discolored Grout Ceramic Tile',
    afterLabel: 'After: Honed Nero Marquina Marble Floating Vanity',
    stoneUsed: 'Nero Marquina Grand Noir',
    savings: 'Installed in 4 Days',
  },
  {
    id: 'outdoor-bar',
    name: 'Outdoor Patio BBQ',
    beforeImg: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
    beforeLabel: 'Before: Weather-Porous Concrete',
    afterLabel: 'After: Taj Mahal Heatproof Natural Quartzite',
    stoneUsed: 'Taj Mahal Quartzite',
    savings: '100% UV & Heat Safe',
  },
];

export function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [activePreset, setActivePreset] = useState<RoomPreset>(PRESETS[0]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.min(Math.max((x / rect.width) * 100, 5), 95);
      setSliderPosition(percentage);
    },
    []
  );

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMove]);

  return (
    <section className="py-16 bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-black mb-2">
            BEFORE &amp; AFTER REALITY
          </div>
          <h2 className="text-2xl sm:text-3xl font-sans font-light tracking-[0.16em] uppercase text-black">
            SEE NEW COUNTERTOPS IN YOUR SPACE
          </h2>
          <div className="w-12 h-[2px] bg-black mx-auto mt-3" />
        </div>

        {/* Room Presets Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1 bg-gray-100 p-1 border border-gray-200 text-xs">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  setActivePreset(preset);
                  setSliderPosition(50);
                }}
                className={`px-3 py-1.5 font-medium transition ${
                  activePreset.id === preset.id
                    ? 'bg-black text-white font-bold'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
              {activePreset.savings}
            </span>
            <span className="text-gray-700 font-medium">
              Material: <strong className="text-black">{activePreset.stoneUsed}</strong>
            </span>
          </div>
        </div>

        {/* Draggable Canvas */}
        <div
          ref={containerRef}
          onClick={(e) => handleMove(e.clientX)}
          onTouchMove={handleTouchMove}
          className="relative w-full h-[380px] sm:h-[480px] md:h-[540px] overflow-hidden border border-gray-300 select-none shadow-xl cursor-ew-resize group"
          style={{ position: 'relative' }}
        >
          {/* AFTER LAYER */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={activePreset.afterImg}
              alt="Verona Countertops After"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

            <div className="absolute bottom-4 right-4 z-10 px-3.5 py-1.5 bg-black/80 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider shadow">
              {activePreset.afterLabel}
            </div>
          </div>

          {/* BEFORE LAYER */}
          <div
            className="absolute inset-y-0 left-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <div
              className="relative w-full h-full"
              style={{
                position: 'relative',
                width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%',
              }}
            >
              <Image
                src={activePreset.beforeImg}
                alt="Countertops Before"
                fill
                className="object-cover object-center grayscale-[20%]"
                priority
              />
              <div className="absolute inset-0 bg-black/20" />

              <div className="absolute bottom-4 left-4 z-10 px-3.5 py-1.5 bg-black/80 backdrop-blur-sm text-gray-200 text-xs font-medium uppercase tracking-wider shadow">
                {activePreset.beforeLabel}
              </div>
            </div>
          </div>

          {/* DRAG HANDLE */}
          <div
            className="absolute inset-y-0 w-1 bg-white cursor-ew-resize z-20 flex items-center justify-center -ml-[2px] shadow-2xl"
            style={{ left: `${sliderPosition}%` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            <div className="w-9 h-9 rounded-full bg-black border-2 border-white text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform">
              <MoveHorizontal className="w-4 h-4" />
            </div>

            <div className="absolute top-4 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest pointer-events-none opacity-80 group-hover:opacity-100 transition shadow">
              ◀ Drag to Compare ▶
            </div>
          </div>
        </div>

        <div className="mt-2 text-center text-xs text-gray-500">
          Slide left or right to inspect seamless mitered waterfall cut and veining bookmatch.
        </div>
      </div>
    </section>
  );
}
