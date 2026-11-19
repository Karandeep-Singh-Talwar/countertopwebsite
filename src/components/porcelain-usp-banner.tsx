'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface PorcelainUspBannerProps {
  onOpenQuoteModal: (opts?: { material?: string }) => void;
  onOpenBookCall: (opts?: { service?: string; material?: string }) => void;
  onExploreCatalog: () => void;
}

export function PorcelainUspBanner({
  onOpenQuoteModal,
  onOpenBookCall,
  onExploreCatalog,
}: PorcelainUspBannerProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const pillars = [
    {
      id: 'contractor' as const,
      num: '01',
      title: 'Contractor Installable',
      description:
        'Cut and mitred on-site with standard diamond wet saws with zero specialized stone fabricator wait times.',
      image: '/catalog/products/room_volcano_green.jpg',
    },
    {
      id: 'continuity' as const,
      num: '02',
      title: 'Seamless Surface Flow',
      description:
        'Order one continuous batch to seamlessly match identical veining across kitchen island, full backsplash, and floor.',
      image: '/catalog/products/room_calcatta_extra.jpg',
    },
    {
      id: 'cost' as const,
      num: '03',
      title: 'Direct Jobsite Logistics',
      description:
        'Delivers the depth of rare Italian natural quarried marble with direct jobsite freight and zero showroom markups.',
      image: '/catalog/products/room_amazonite.jpg',
    },
    {
      id: 'designs' as const,
      num: '04',
      title: 'Rare Mineral Slabs',
      description:
        'High-definition Italian glazing replicates rare Calacatta, Amazonite, and onyx with non-repeating continuous faces.',
      image: '/catalog/products/room_fuji_gold.jpg',
    },
    {
      id: 'durability' as const,
      num: '05',
      title: 'Heat Proof & Durable',
      description:
        'Boiling Dutch ovens sit directly on surfaces without trivets; zero porosity wipes wine, lemon, and turmeric clean.',
      image: '/catalog/products/room_bellagio_green.jpg',
    },
  ];

  const comparisons = [
    {
      title: 'Tooling & Fabrication',
      verona: 'Calibrated 9mm profile cut and mitred on-site using standard diamond wet saws by your general contractor or tile setter.',
      traditional: 'Heavy 20-30mm slabs requiring specialized CNC bridge saws, high-pressure waterjets, and long fabrication waitlists.',
    },
    {
      title: 'Spatial Continuity',
      verona: 'Identical mineral glaze formulation flows uninterrupted across kitchen island countertops, full-height backsplashes, and floor tiles.',
      traditional: 'Natural quarry lots and stone slab blocks cannot match thin floor tiles, resulting in broken veining and clashing shades.',
    },
    {
      title: 'Thermal & Chemical Stamina',
      verona: '1200°C kiln vitrification with under 0.04% absorption. Completely safe for direct boiling cookware, wine, and oils without sealing.',
      traditional: 'Porous marble etches instantly from lemon juice and requires annual sealing. Engineered quartz scorches permanently above 300°F.',
    },
  ];

  return (
    <section id="usp-section" className="scroll-mt-20 w-full bg-[#111113] py-14 md:py-20 text-white border-t border-white/5">
      <div className="max-w-[1680px] mx-auto px-6 md:px-12">
        {/* Minimalist Editorial Header */}
        <div className="mb-8 pb-5 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal tracking-tight text-white leading-[1.1]">
            Why Modern Designers Prefer <span className="italic font-light text-amber-300">Porcelain</span>
          </h2>
        </div>

        {/* Reverted Accordion Strip (All 5 visible simultaneously, zero bullets, 2-line descriptions) */}
        <div className="flex flex-col lg:flex-row gap-3 h-auto lg:h-[400px]">
          {pillars.map((pillar, idx) => {
            const isActive = activeIndex === idx;
            return (
              <div
                key={pillar.id}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => setActiveIndex(idx)}
                className={`group relative overflow-hidden cursor-pointer border transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                  isActive
                    ? 'lg:flex-[2.6] min-h-[220px] lg:min-h-0 border-amber-400/50 bg-black/80 shadow-[0_16px_40px_rgba(0,0,0,0.6)]'
                    : 'lg:flex-[1] min-h-[80px] lg:min-h-0 border-white/10 hover:border-white/20 bg-black/40'
                }`}
              >
                {/* Background Visual */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={pillar.image}
                    alt={pillar.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 35vw"
                    className={`object-cover object-center transition-all duration-700 ease-out ${
                      isActive
                        ? 'grayscale-0 scale-105 brightness-95'
                        : 'grayscale contrast-[1.08] brightness-[0.5] group-hover:brightness-[0.7]'
                    }`}
                  />
                  <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] pointer-events-none" />
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
                      isActive
                        ? 'bg-gradient-to-t from-black/95 via-black/60 to-black/30'
                        : 'bg-gradient-to-t from-black/90 via-black/70 to-black/50'
                    }`}
                  />
                </div>

                {/* Card Content Overlay */}
                <div className="relative z-10 flex flex-col justify-between h-full p-5 sm:p-6">
                  {/* Top Bar: Numeral */}
                  <div>
                    <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-amber-300 font-medium">
                      {pillar.num}
                    </span>
                  </div>

                  {/* Bottom Copy */}
                  <div className="mt-auto pt-6">
                    <h3
                      className={`font-serif font-normal text-white leading-snug transition-all duration-300 ${
                        isActive
                          ? 'text-2xl sm:text-3xl text-amber-200 mb-2'
                          : 'text-base sm:text-lg group-hover:text-amber-100'
                      }`}
                    >
                      {pillar.title}
                    </h3>

                    {/* Description: Exactly 2 lines, visible when active */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-out ${
                        isActive ? 'max-h-24 opacity-100' : 'max-h-0 lg:max-h-0 opacity-0'
                      }`}
                    >
                      <p className="text-xs sm:text-sm text-white/80 leading-relaxed line-clamp-2 max-w-xl">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Architectural Material Contrast (Concise & Editorial) */}
        <div className="border-t border-white/10 mt-16 pt-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-amber-300 font-sans font-medium mb-2">
                Architectural Advantage
              </div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-white tracking-tight">
                How Porcelain Compares
              </h3>
            </div>
            <p className="text-sm text-white/60 max-w-lg font-light leading-relaxed">
              Why architects, general contractors, and homeowners specify Verona vitrified porcelain over fragile natural stone and synthetic quartz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {comparisons.map((item, idx) => (
              <div
                key={idx}
                className="border border-white/10 bg-white/[0.02] p-8 flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-xl font-serif text-white font-normal mb-6">
                    {item.title}
                  </h4>

                  <div className="space-y-6">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-amber-300 font-sans font-medium mb-1.5">
                        Verona Vitrified Porcelain
                      </div>
                      <p className="text-sm text-white/90 leading-relaxed font-normal">
                        {item.verona}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-sans font-medium mb-1.5">
                        Quarried Stone &amp; Synthetic Quartz
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed font-light">
                        {item.traditional}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs text-white/50 font-light">
              ASTM C373 water absorption verified (&lt;0.04%). ISO 13006 vitrification certified.
            </span>
            <button
              type="button"
              onClick={() => onOpenQuoteModal({ material: 'Verona Flagship Porcelain Slabs' })}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-300 hover:text-white transition-colors cursor-pointer font-medium"
            >
              <span>Request Material Specifications</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
