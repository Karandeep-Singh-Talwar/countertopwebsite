'use client';

import React from 'react';
import Image from 'next/image';
import { Laptop, Calendar } from 'lucide-react';

interface DualShowcaseProps {
  onOpenBookCall: () => void;
  onLaunchVisualizer: () => void;
}

export function DualShowcase({ onOpenBookCall, onLaunchVisualizer }: DualShowcaseProps) {
  return (
    <section className="py-16 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. LEFT CARD: DESIGN THE KITCHEN OF YOUR DREAMS (Exact Daltile match) */}
          <div className="bg-[#65676b] text-white overflow-hidden shadow-md flex flex-col justify-between group">
            <div className="p-8 sm:p-10">
              <h3 className="text-xl sm:text-2xl font-sans font-light tracking-[0.16em] uppercase text-white leading-tight">
                DESIGN THE KITCHEN OF<br />
                <strong className="font-bold">YOUR DREAMS</strong>
              </h3>

              <p className="text-xs sm:text-sm text-gray-200 mt-3 font-light leading-relaxed max-w-md">
                Not sure where to start? Use our 3D room visualization studio to test countertop slabs with matching backsplash tiles and cabinet grouts to find your signature kitchen style!
              </p>

              <div className="mt-6">
                <button
                  onClick={onLaunchVisualizer}
                  className="px-6 py-2.5 bg-white text-black hover:bg-black hover:text-white text-xs font-bold uppercase tracking-wider transition shadow"
                >
                  EXPLORE 3D VISUALIZER
                </button>
              </div>
            </div>

            {/* Laptop Visualizer Graphic (Matching Daltile reference screen) */}
            <div className="relative w-full h-56 sm:h-64 mt-2" style={{ position: 'relative' }}>
              <Image
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80"
                alt="Room visualizer 3D studio"
                fill
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6 z-10 flex items-center gap-2 text-xs font-semibold text-white drop-shadow">
                <Laptop className="w-4 h-4 text-white" />
                <span>Launch Interactive 3D Room Studio</span>
              </div>
            </div>
          </div>

          {/* 2. RIGHT CARD: FIND YOUR PERFECT SLAB & TILE (Exact Daltile match) */}
          <div className="bg-[#52525b] text-white overflow-hidden shadow-md flex flex-col justify-between group">
            <div className="p-8 sm:p-10">
              <h3 className="text-xl sm:text-2xl font-sans font-light tracking-[0.16em] uppercase text-white leading-tight">
                FIND YOUR<br />
                <strong className="font-bold">PERFECT SLAB &amp; TILE</strong>
              </h3>

              <p className="text-xs sm:text-sm text-gray-200 mt-3 font-light leading-relaxed max-w-md">
                Visit our Slab &amp; Tile Studio or connect with a stone specialist today to inspect live quartz &amp; marble inventory, touch artisanal tile samples, and lock in factory-direct pricing.
              </p>

              <div className="mt-6">
                <button
                  onClick={onOpenBookCall}
                  className="px-6 py-2.5 bg-white text-black hover:bg-black hover:text-white text-xs font-bold uppercase tracking-wider transition shadow"
                >
                  SCHEDULE CONSULTATION &amp; SAMPLES
                </button>
              </div>
            </div>

            {/* Luxury Bathroom Stone Graphic (matching reference freestanding tub / vanity) */}
            <div className="relative w-full h-56 sm:h-64 mt-2" style={{ position: 'relative' }}>
              <Image
                src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80"
                alt="Luxury stone showroom and bath"
                fill
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6 z-10 flex items-center gap-2 text-xs font-semibold text-white drop-shadow">
                <Calendar className="w-4 h-4 text-white" />
                <span>Free 15-Minute Video or In-Home Consultation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
