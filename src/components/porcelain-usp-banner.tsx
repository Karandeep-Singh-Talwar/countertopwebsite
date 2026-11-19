'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

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
      title: 'Effortless On-Site Craft',
      contrast: 'vs. Rigid Shop Fabrication',
      veronaLabel: 'Verona Sintered 9mm Mass',
      verona:
        'Calibrated 9mm profile cut, mitred, and dressed on-site using standard diamond wet saws. Waterfall returns and precise cutouts executed without weeks of specialist CNC delay.',
      traditionalLabel: 'Heavy 20-30mm Quarried Stone',
      traditional:
        'Brute 30mm slabs requiring industrial bridge saws, off-site shop queues, crane staging, and cabinet frame reinforcement.',
    },
    {
      title: 'Monolithic Spatial Flow',
      contrast: 'vs. Fragmented Quarry Lots',
      veronaLabel: 'Continuous Vitrification',
      verona:
        'Identical mineral glaze formulation flows unbroken across kitchen island waterfalls, vertical splashbacks, and floor planes from a single harmonized batch.',
      traditionalLabel: 'Disjointed Slab Blocks & Tiles',
      traditional:
        'Disparate quarry cuts and separate tile batches introduce clashing undertones, broken veining trajectories, and mismatched grout lines.',
    },
    {
      title: 'Absolute Culinary Armor',
      contrast: 'vs. Vulnerable Porous Stone',
      veronaLabel: 'Kiln-Fused Impermeability',
      verona:
        '1200°C sintering achieves under 0.04% absorption. Scorching Dutch ovens, citrus acids, turmeric, and espresso wipe clean with permanent zero-sealing confidence.',
      traditionalLabel: 'Porous Marble & Synthetic Quartz',
      traditional:
        'Natural marble etches instantaneously under lemon juice and requires annual sealing; engineered polymer quartz permanently discolors and scorches above 300°F.',
    },
  ];

  return (
    <section id="usp-section" className="scroll-mt-20 w-full bg-[#111113] py-14 md:py-20 text-white border-t border-white/5">
      <div className="max-w-[1680px] mx-auto px-6 md:px-12">
        {/* Minimalist Editorial Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 pb-5 border-b border-white/10 flex items-center justify-between"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal tracking-tight text-white leading-[1.1]">
            Why Modern Designers Prefer <span className="italic font-light text-amber-300">Porcelain</span>
          </h2>
        </motion.div>

        {/* Reverted Accordion Strip (All 5 visible simultaneously, zero bullets, 2-line descriptions) */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row gap-3 h-auto lg:h-[400px]"
        >
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
        </motion.div>

        {/* Architectural Material Contrast (Concise & Editorial) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="border-t border-white/10 mt-16 pt-12"
        >
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
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                className="group border border-white/10 bg-white/[0.02] hover:border-amber-400/40 hover:bg-white/[0.04] p-8 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
              >
                <div>
                  <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-white/10">
                    <h4 className="text-xl font-serif text-white font-normal group-hover:text-amber-200 transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[11px] font-sans text-amber-300/80 tracking-wider">
                      {item.contrast}
                    </span>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-amber-300 font-sans font-medium mb-1.5 flex items-center justify-between">
                        <span>{item.veronaLabel}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">VERONA</span>
                      </div>
                      <p className="text-sm text-white/90 leading-relaxed font-normal">
                        {item.verona}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-sans font-medium mb-1.5">
                        {item.traditionalLabel}
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed font-light">
                        {item.traditional}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
