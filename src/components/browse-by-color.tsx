'use client';

import React from 'react';
import Image from 'next/image';

interface ColorCard {
  id: string;
  name: string;
  image: string;
  gradientOverlay: string;
  colorHex: string;
}

const COLORS_ROW_1: ColorCard[] = [
  {
    id: 'white',
    name: 'WHITE',
    image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=80',
    gradientOverlay: 'from-[#ffffff] via-[#e5e7eb]/80 to-[#9ca3af]/50',
    colorHex: '#ffffff',
  },
  {
    id: 'beige',
    name: 'BEIGE',
    image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80',
    gradientOverlay: 'from-[#fefcf8] via-[#e8dfd5]/85 to-[#c4b5a5]/60',
    colorHex: '#e5ded0',
  },
  {
    id: 'gray',
    name: 'GRAY',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    gradientOverlay: 'from-[#f1f5f9] via-[#cbd5e1]/85 to-[#64748b]/60',
    colorHex: '#9ca3af',
  },
];

const COLORS_ROW_2: ColorCard[] = [
  {
    id: 'black',
    name: 'BLACK',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
    gradientOverlay: 'from-[#475569] via-[#1e293b]/90 to-[#0f172a]',
    colorHex: '#18181b',
  },
  {
    id: 'brown',
    name: 'BROWN',
    image: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=800&q=80',
    gradientOverlay: 'from-[#78350f]/80 via-[#53260c]/90 to-[#27150a]',
    colorHex: '#785333',
  },
  {
    id: 'blue-green',
    name: 'BLUE AND GREEN',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
    gradientOverlay: 'from-[#065f46]/80 via-[#047857]/90 to-[#064e3b]',
    colorHex: '#065f46',
  },
];

const COLOR_VIEW_ALL: ColorCard = {
  id: 'view-all',
  name: 'VIEW ALL',
  image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=800&q=80',
  gradientOverlay: 'from-[#ffffff] via-[#e2e8f0]/85 to-[#94a3b8]/60',
  colorHex: '#4b5563',
};

interface BrowseByColorProps {
  onSelectColor: (colorId: string) => void;
  onOpenBookCall: (colorName: string) => void;
}

export function BrowseByColor({ onSelectColor, onOpenBookCall }: BrowseByColorProps) {
  const renderCard = (item: ColorCard) => (
    <div
      key={item.id}
      onClick={() => {
        if (item.id === 'view-all') {
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
          onSelectColor(item.id);
          onOpenBookCall(`Color Palette: ${item.name}`);
        }
      }}
      className="relative aspect-square overflow-hidden bg-stone-100 shadow-sm cursor-pointer group transition-all duration-300 hover:shadow-xl"
      style={{ position: 'relative' }}
    >
      {/* Background stone countertop image */}
      <Image
        src={item.image}
        alt={item.name}
        fill
        loading="eager"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
      />

      {/* Daltile Signature Frosted Gradient Overlay:
          Top starts frosted color fading down with stone visible at bottom.
          On hover, smoothly fades to reveal the vibrant full-color stone underneath! */}
      <div className={`absolute inset-0 bg-gradient-to-b ${item.gradientOverlay} opacity-90 group-hover:opacity-0 transition-opacity duration-500 pointer-events-none`} />

      {/* Subtle darkening on hover to keep white text legible */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-500 pointer-events-none" />

      {/* Centered Bold Uppercase White Color Name (Exact Daltile match) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 pointer-events-none">
        <span className="text-base sm:text-lg font-sans font-bold tracking-[0.22em] text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-105">
          {item.name}
        </span>

        <span className="mt-2 text-[10px] text-white uppercase tracking-widest font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow">
          Explore Slabs & Book Call ▶
        </span>
      </div>
    </div>
  );

  return (
    <section id="colors" className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Heading with Underline (Exact Daltile match) */}
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-sans font-light tracking-[0.25em] text-black uppercase">
            BROWSE BY COLOR
          </h2>
          <div className="w-12 h-[2px] bg-black mx-auto mt-3" />
        </div>

        {/* Rows 1 & 2: 3-column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {COLORS_ROW_1.map(renderCard)}
          {COLORS_ROW_2.map(renderCard)}
        </div>

        {/* Row 3: Single Centered "VIEW ALL" Card (Exact Daltile Reference) */}
        <div className="max-w-[320px] mx-auto mt-6 sm:mt-8">
          {renderCard(COLOR_VIEW_ALL)}
        </div>
      </div>
    </section>
  );
}
