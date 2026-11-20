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
  onOpenQuoteModal: _onOpenQuoteModal,
  onOpenBookCall: _onOpenBookCall,
  onExploreCatalog: _onExploreCatalog,
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
      num: '01',
      category: 'CONTINUOUS FLOW',
      title: 'Counter-to-Backsplash',
      verona:
        'Unbroken slab flows seamlessly into full backsplash and floor planes from a single continuous run.',
      naturalStone:
        'Disjointed quarry lots, mismatched veining seams, and exorbitant custom fabrication fees.',
    },
    {
      num: '02',
      category: 'INTEGRATED MILLWORK',
      title: 'Monolithic Sinks',
      verona:
        'Precision mitred apron basins and knife-edge drawers withstand boiling water and thermal shock.',
      naturalStone:
        'Too brittle for mitred joins; demands secondary undermount metal pans and concealed brackets.',
    },
    {
      num: '03',
      category: 'CONTINUITY',
      title: 'Indoor-to-Outdoor',
      verona:
        'Zero UV fading or frost crack; flows seamlessly across glass thresholds directly to outdoor terraces.',
      naturalStone:
        'Yellows and chalks under solar rays; winter freeze-thaw cycles provoke micro-fissure splitting.',
    },
    {
      num: '04',
      category: 'STRUCTURE',
      title: 'Floating Cantilevers',
      verona:
        'High flexural endurance allows razor-thin 12mm island overhangs without visible steel sub-framing.',
      naturalStone:
        'Heavier 30mm dead-weight prone to sudden shear; requires bulky steel gussets and knee corbels.',
    },
  ];

  return (
    <section id="usp-section" className="scroll-mt-20 w-full bg-[#111113] py-14 md:py-24 text-white border-t border-white/5">
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

        {/* Accordion Strip (All 5 visible simultaneously, zero bullets, 2-line descriptions) */}
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

        {/* Revamped "How Porcelain Compares": Engineered for Permanence, Crafted for Living */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="border-t border-white/[0.08] mt-16 md:mt-24 pt-12 md:pt-16"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6">
            <div>
              <h3 className="text-3xl sm:text-4xl lg:text-[44px] font-serif font-normal text-white tracking-tight leading-[1.18]">
                Engineered for Permanence,<br />
                <span className="italic font-light text-neutral-200">Crafted for Living</span>
              </h3>
            </div>
            <div className="max-w-md lg:max-w-lg">
              <p className="text-xs sm:text-[13px] text-neutral-400 font-light leading-relaxed">
                Where classic marble demands constant vigilance, Carrara &amp; Clay vitrified stone offers complete freedom. Hot cast-iron, spilled Chianti, and morning sunlight leave no trace.
              </p>
            </div>
          </div>

          {/* 4 Architectural Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {comparisons.map((item, idx) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                className="group rounded-2xl border border-white/[0.06] bg-[#0E0E10] hover:border-amber-400/20 p-6 lg:p-7 flex flex-col justify-between transition-all duration-300 shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
              >
                <div>
                  {/* Top: Numeral & Category Tag */}
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="font-serif text-3xl font-light text-neutral-500/80 tracking-tight">
                      {item.num}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-amber-500/80 font-medium">
                      {item.category}
                    </span>
                  </div>

                  {/* Feature Title */}
                  <h4 className="font-serif text-xl sm:text-2xl text-white font-normal tracking-tight min-h-[56px] flex items-center leading-snug">
                    {item.num === '01' ? (
                      <>Counter-to-<br />Backsplash</>
                    ) : (
                      item.title
                    )}
                  </h4>

                  {/* Verona Porcelain Block */}
                  <div className="mt-6">
                    <div className="text-[9px] font-mono font-semibold tracking-[0.22em] text-[#D4AF37] uppercase mb-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                      <span>CARRARA &amp; CLAY</span>
                    </div>
                    <p className="text-[11.5px] sm:text-xs text-neutral-200/90 leading-relaxed font-light">
                      {item.verona}
                    </p>
                  </div>

                  {/* Natural Stone Block */}
                  <div className="mt-5">
                    <div className="text-[9px] font-mono font-semibold tracking-[0.22em] text-neutral-500 uppercase mb-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                      <span>NATURAL STONE</span>
                    </div>
                    <p className="text-[11.5px] sm:text-xs text-neutral-500 leading-relaxed font-light">
                      {item.naturalStone}
                    </p>
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
