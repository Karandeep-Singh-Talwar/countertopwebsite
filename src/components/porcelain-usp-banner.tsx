'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Check, AlertCircle } from 'lucide-react';

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
        'Cut and mitred on-site with standard diamond wet saws—zero specialized stone fabricator wait times or fees.',
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
      title: 'Direct Wholesale Cost',
      description:
        'Delivers the depth of $150+ natural quarried marble at 40–60% lower material cost with direct jobsite freight.',
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

  const comparisonRows = [
    {
      spec: 'Sourcing & Wholesale Pricing',
      verona: '$28 – $38 / sq.ft direct wholesale · True factory-to-builder pricing with zero showroom commissions or middleman markups',
      competitorPorcelain: '$90 – $160 / sq.ft retail · Multi-tier dealer markups through boutique design centers & showrooms',
      traditionalStone: '$120 – $250+ / sq.ft · Exorbitant quarry extraction markups, fragile transit costs, and high fabrication fees',
      veronaBadge: 'Factory-Direct Wholesale',
      competitorAlert: '3× to 5× retail markup',
      traditionalAlert: '2.5× to 4× higher total cost',
    },
    {
      spec: 'Fabrication & Job-Site Tooling',
      verona: 'Standard commercial diamond wet saw · Mitred and cut directly on-site by general contractor or tile setter',
      competitorPorcelain: 'Rigid 12–20mm heavy slabs · Requires certified specialty fabricators, high-pressure waterjets, and $2,000+ shop minimums',
      traditionalStone: 'Heavy 20–30mm brute weight · Requires dedicated stone fabrication shops, crane deliveries, and cabinet reinforcement',
      veronaBadge: 'Standard Wet Saw Workable',
      competitorAlert: 'Specialist fabricator & CNC lock-in',
      traditionalAlert: 'Reinforced subtop framing required',
    },
    {
      spec: 'Inventory & Lead Times',
      verona: 'In-Stock US Warehousing · Ships palletized within 48–72 hours directly to your job site or facility',
      competitorPorcelain: '8–14 week overseas container transit from Europe · Construction stops if a slab chips or needs extra square footage',
      traditionalStone: '4–6 week queue waiting for slab yard template scheduling, bridge saw cutting, and edge polishing',
      veronaBadge: '48–72h US Dispatch',
      competitorAlert: '8–14 week backorders',
      traditionalAlert: '4–6 week shop wait time',
    },
    {
      spec: 'Unified Multi-Surface Batch Continuity',
      verona: '100% Guaranteed Exact Batch Calibration · Same porcelain material flows seamlessly across island, full-height backsplash, and floor',
      competitorPorcelain: 'Fragmented production catalogs · Countertop slab patterns rarely match floor tile lines in dye lot or thickness',
      traditionalStone: 'Incompatible sizing and quarry lots · Slab blocks cannot match thin floor tiles, breaking architectural continuity',
      veronaBadge: 'Full Multi-Surface Continuity',
      competitorAlert: 'Vein & shade mismatch across surfaces',
      traditionalAlert: 'Zero floor tile matching',
    },
    {
      spec: 'Mineral Glaze Depth & Surface Realism',
      verona: '400+ DPI Deep Vitrified Mineral Glaze · Multi-layer Italian glaze with translucent crystal depth and non-repeating continuous faces',
      competitorPorcelain: 'Variable digital printing · Many brands use flat, repetitive inkjet decals with visible dot-matrix grain upon close inspection',
      traditionalStone: 'Natural fissures and impurities in quarried stone; engineered quartz looks synthetic with flat plastic resin flecks',
      veronaBadge: 'Translucent Italian Glaze',
      competitorAlert: 'Flat digital decal prints',
      traditionalAlert: 'Unstable fissures & resin matrix',
    },
    {
      spec: 'Heat, Stain & Acid Endurance',
      verona: '1200°C True Vitrification · < 0.04% Absorption · Set boiling cast iron directly on surface; wine, citrus, and oils wipe clean with zero sealing',
      competitorPorcelain: 'High heat tolerance, but high internal tension in uncalibrated slabs makes exposed miter edges prone to micro-chipping',
      traditionalStone: 'Porous & fragile · Marble etches from lemon juice in 60 seconds (requires annual sealing); Quartz scorches permanently above 300°F',
      veronaBadge: '1200°C Proof · Zero Sealing',
      competitorAlert: 'Edge chip sensitivity',
      traditionalAlert: 'Permanent wine etching & scorch risk',
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
                    <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-semibold">
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

        {/* Upgraded Architectural Specification Matrix */}
        <div className="border-t border-white/10 mt-16 pt-12">
          {/* Matrix Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-amber-400 font-mono mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Why Verona Stone · The Architectural Advantage</span>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-white tracking-tight">
                How Our Porcelain Compares to the Market
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-white/60 max-w-lg font-sans font-light leading-relaxed">
              Why builders, architects, and homeowners choose Verona Stone over expensive porcelain design boutiques and high-maintenance natural stone.
            </p>
          </div>

          {/* Luxury Elevated Matrix Table */}
          <div className="overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[840px]">
                <thead>
                  <tr className="border-b border-white/15">
                    <th className="py-5 px-6 font-mono text-xs uppercase tracking-[0.2em] text-white/40 w-[22%] bg-white/[0.01]">
                      Criterion
                    </th>

                    {/* Featured Column: Verona Porcelain */}
                    <th className="py-5 px-6 w-[34%] bg-amber-400/[0.04] border-x border-amber-400/25 relative">
                      <div className="inline-block text-[9px] uppercase tracking-[0.2em] font-mono text-amber-300 bg-amber-400/10 px-2.5 py-0.5 border border-amber-400/30 mb-2">
                        Verona Advantage
                      </div>
                      <div className="text-base font-serif font-normal text-white flex items-center gap-1.5">
                        <span>Verona Vitrified Porcelain</span>
                      </div>
                      <div className="text-[11px] font-mono text-amber-400/80 tracking-wider mt-0.5">
                        Factory-Direct Sourced · 9mm Mass
                      </div>
                    </th>

                    {/* Competitor Porcelain */}
                    <th className="py-5 px-6 w-[22%] bg-white/[0.01]">
                      <div className="text-sm font-serif font-normal text-white/80">
                        Other Porcelain Showrooms
                      </div>
                      <div className="text-[11px] font-mono text-white/40 tracking-wider mt-0.5">
                        Neolith / Dekton / Boutique Importers
                      </div>
                    </th>

                    {/* Traditional Stone & Quartz */}
                    <th className="py-5 px-6 w-[22%] bg-white/[0.01]">
                      <div className="text-sm font-serif font-normal text-white/80">
                        Traditional Quarried Stone
                      </div>
                      <div className="text-[11px] font-mono text-white/40 tracking-wider mt-0.5">
                        Granite / Marble / Quartz
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
                  {comparisonRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="group transition-colors hover:bg-white/[0.02]"
                    >
                      {/* Metric Name */}
                      <td className="py-4.5 px-6 font-medium text-white/90 bg-white/[0.01]">
                        <span className="block text-xs uppercase tracking-wider text-amber-400/70 font-mono mb-0.5">
                          0{idx + 1}
                        </span>
                        <span className="text-sm text-white font-serif">
                          {row.spec}
                        </span>
                      </td>

                      {/* Verona Porcelain (Featured Lane) */}
                      <td className="py-4.5 px-6 bg-amber-400/[0.025] border-x border-amber-400/20 text-white font-normal">
                        <div className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[11px] font-mono text-amber-300 font-medium mb-1">
                              {row.veronaBadge}
                            </div>
                            <span className="text-white/95 leading-relaxed font-normal text-xs sm:text-sm">
                              {row.verona}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Competitor Porcelain Showrooms */}
                      <td className="py-4.5 px-6 text-white/60 font-normal leading-relaxed">
                        <p>{row.competitorPorcelain}</p>
                        {row.competitorAlert && (
                          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-mono text-amber-300/60 bg-white/[0.02] px-2 py-0.5 border border-white/5 rounded-xs w-fit">
                            <AlertCircle className="w-3 h-3 shrink-0 text-amber-400/70" />
                            <span>{row.competitorAlert}</span>
                          </div>
                        )}
                      </td>

                      {/* Traditional Quarried Stone & Quartz */}
                      <td className="py-4.5 px-6 text-white/60 font-normal leading-relaxed">
                        <p>{row.traditionalStone}</p>
                        {row.traditionalAlert && (
                          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-mono text-rose-300/60 bg-white/[0.02] px-2 py-0.5 border border-white/5 rounded-xs w-fit">
                            <AlertCircle className="w-3 h-3 shrink-0 text-rose-400/70" />
                            <span>{row.traditionalAlert}</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Matrix Footer Action Callout */}
            <div className="p-4 sm:p-5 bg-white/[0.02] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs font-sans text-white/60 tracking-normal">
                Direct factory-wholesale pricing with guaranteed in-stock US pallet dispatch. ASTM &amp; ISO 13006 verified.
              </span>
              <button
                type="button"
                onClick={() => onOpenQuoteModal({ material: 'Verona Flagship Porcelain Slabs' })}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-amber-400 hover:text-amber-300 transition-colors cursor-pointer self-start sm:self-auto font-medium"
              >
                <span>Request Wholesale Trade Pricing</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
