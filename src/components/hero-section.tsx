'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar } from 'lucide-react';

interface HeroSectionProps {
  brandName: string;
  onOpenBookCall: () => void;
  onOpenQuoteModal: () => void;
  onOpenVisualizer?: () => void;
  onSelectCategory?: (category: 'countertops' | 'tiles') => void;
  onOpenQuartzColors?: () => void;
}

export function HeroSection({
  brandName,
  onOpenBookCall,
  onOpenQuoteModal,
  onOpenVisualizer,
  onSelectCategory,
  onOpenQuartzColors,
}: HeroSectionProps) {
  const brandUpper = brandName.toUpperCase();

  const handleBrowseCountertops = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelectCategory?.('countertops');
    const el = document.getElementById('materials-section') || document.getElementById('materials');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBrowseTiles = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelectCategory?.('tiles');
    const el = document.getElementById('materials-section') || document.getElementById('materials');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full bg-white">
      {/* 1. Full-Width Editorial Hero Image (Bright Luxury Kitchen with Waterfall Island matching Daltile Reference) */}
      <div
        className="relative w-full h-[520px] sm:h-[620px] lg:h-[700px] overflow-hidden bg-gray-100"
        style={{ position: 'relative' }}
      >
        <Image
          src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=2000&q=85"
          alt="Discover the perfect countertop"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Soft daylight enhancement overlay */}
        <div className="absolute inset-0 bg-black/15" />

        {/* Centered Box Overlay (Exact Daltile match: dark charcoal translucent box) */}
        <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 z-10">
          <div className="max-w-2xl w-full bg-[#18181b]/70 backdrop-blur-md p-8 sm:p-12 text-center text-white border border-white/20 shadow-2xl">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-sans font-light tracking-[0.16em] uppercase text-white leading-tight">
              DISCOVER THE PERFECT<br />
              <strong className="font-bold tracking-[0.18em]">{brandUpper} COUNTERTOPS &amp; TILES</strong>
            </h1>

            <p className="text-xs sm:text-sm text-gray-200 mt-5 max-w-lg mx-auto font-light leading-relaxed">
              {brandName} specializes exclusively in factory-direct countertop slabs and designer architectural tiles. Expertly curated for luxury kitchen islands, statement backsplashes, and custom bathroom retreats.
            </p>

            {/* Subtle Direct CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={onOpenBookCall}
                className="px-6 py-2.5 bg-white text-black hover:bg-black hover:text-white text-xs font-bold uppercase tracking-widest transition shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Free Design Consultation</span>
              </button>
              <button
                onClick={onOpenQuoteModal}
                className="px-5 py-2.5 bg-black/60 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider border border-white/30 transition shadow-lg cursor-pointer"
              >
                Request Email Quote
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Black Dual Quick Bar (Strictly Focused: COUNTERTOPS | TILES | QUARTZ COLORS | 3D VISUALIZER) */}
      <div className="w-full bg-black text-white py-3.5 px-4 text-center text-xs font-bold tracking-[0.18em] uppercase flex flex-wrap items-center justify-center gap-6 sm:gap-10">
        <button
          onClick={handleBrowseCountertops}
          className="hover:text-gray-300 transition underline underline-offset-4 cursor-pointer uppercase"
        >
          BROWSE COUNTERTOPS
        </button>
        <span className="text-gray-500 font-light hidden sm:inline">|</span>
        <button
          onClick={handleBrowseTiles}
          className="hover:text-gray-300 transition underline underline-offset-4 cursor-pointer uppercase"
        >
          BROWSE TILES
        </button>
        <span className="text-gray-500 font-light hidden sm:inline">|</span>
        <button
          onClick={() => onOpenQuartzColors?.()}
          className="hover:text-gray-300 transition underline underline-offset-4 cursor-pointer uppercase"
        >
          EXPLORE QUARTZ COLORS
        </button>
        {onOpenVisualizer && (
          <>
            <span className="text-gray-500 font-light hidden sm:inline">|</span>
            <button
              onClick={onOpenVisualizer}
              className="hover:text-gray-300 transition underline underline-offset-4 cursor-pointer uppercase"
            >
              3D ROOM VISUALIZER
            </button>
          </>
        )}
      </div>

      {/* 3. Editorial Transition Text (Focused exclusively on Countertops & Tiles) */}
      <div className="max-w-4xl mx-auto px-6 py-14 sm:py-20 text-center">
        <p className="text-xs sm:text-sm md:text-[15px] text-gray-800 leading-relaxed font-normal">
          Elevate your interior architecture by seamlessly pairing precision-cut countertop slabs with handcrafted backsplash and wall tiles. From heat-proof sintered porcelain and diamond-hard Brazilian quartzite to organic Moroccan Zellige and 3D fluted marble tiles, our surfaces combine effortless maintenance with timeless elegance. Whether renovating a gourmet chef&apos;s kitchen or crafting a luxury primary bath, explore the perfect countertop and tile harmony.
        </p>
      </div>
    </section>
  );
}
