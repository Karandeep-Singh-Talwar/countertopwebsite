'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [comparisonMode, setComparisonMode] = useState<'grid' | 'rolling'>('grid');
  const [rollingIndex, setRollingIndex] = useState<number>(0);

  const handleNextComparison = () => {
    setRollingIndex((prev) => (prev === 3 ? 0 : prev + 1));
  };

  const handlePrevComparison = () => {
    setRollingIndex((prev) => (prev === 0 ? 3 : prev - 1));
  };

  const openBottomMaskStyle: React.CSSProperties = {
    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 100%)',
    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 100%)',
  };

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
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 lg:mb-14 gap-6">
            <div>
              <h3 className="text-3xl sm:text-4xl lg:text-[44px] font-serif font-normal text-white tracking-tight leading-[1.18]">
                Engineered for Permanence,<br />
                <span className="italic font-light text-neutral-200">Crafted for Living</span>
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6">
              <p className="max-w-md text-xs sm:text-[13px] text-neutral-400 font-light leading-relaxed">
                Where classic marble demands constant vigilance, Carrara &amp; Clay vitrified stone offers complete freedom. Hot cast-iron, spilled Chianti, and morning sunlight leave no trace.
              </p>

              {/* View Toggle */}
              <div className="flex items-center gap-1 p-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md self-start sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => setComparisonMode('grid')}
                  className={`px-3 py-1 text-[11px] font-mono tracking-wider uppercase rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                    comparisonMode === 'grid'
                      ? 'bg-white/15 text-white font-medium shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                  aria-label="Grid view"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setComparisonMode('rolling')}
                  className={`px-3 py-1 text-[11px] font-mono tracking-wider uppercase rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                    comparisonMode === 'rolling'
                      ? 'bg-white/15 text-white font-medium shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                  aria-label="Rolling deck view"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span>Rolling</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card Presentation: Grid vs 3D Rolling Deck */}
          <AnimatePresence mode="wait">
            {comparisonMode === 'grid' ? (
              <motion.div
                key="grid-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
              >
                {comparisons.map((item, idx) => (
                  <motion.div
                    key={item.num}
                    initial={{ opacity: 0, y: 45 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{
                      duration: 0.8,
                      delay: idx * 0.22,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={{ y: -4 }}
                    style={openBottomMaskStyle}
                    className="group relative rounded-t-2xl sm:rounded-t-3xl border-t border-x border-b-0 border-white/[0.08] hover:border-amber-400/25 bg-gradient-to-b from-[#141417]/95 via-[#0e0e11]/70 to-transparent p-6 lg:p-7 pb-16 lg:pb-24 flex flex-col justify-between transition-colors duration-300"
                  >
                    <div>
                      {/* Top: Numeral */}
                      <div className="mb-4">
                        <span className="font-serif text-3xl font-light text-neutral-500/80 tracking-tight">
                          {item.num}
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

                      {/* Primary Feature Benefit */}
                      <div className="mt-4">
                        <p className="text-[11.5px] sm:text-xs text-neutral-200/90 leading-relaxed font-light">
                          {item.verona}
                        </p>
                      </div>

                      {/* Natural Stone Block */}
                      <div className="mt-5">
                        <div className="text-[9px] font-mono font-semibold tracking-[0.22em] text-neutral-500 uppercase mb-1.5">
                          <span>NATURAL STONE</span>
                        </div>
                        <p className="text-[11.5px] sm:text-xs text-neutral-500 leading-relaxed font-light">
                          {item.naturalStone}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="rolling-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="relative w-full max-w-5xl mx-auto py-6 sm:py-10 flex flex-col items-center select-none"
              >
                {/* Left Arrow */}
                <button
                  type="button"
                  onClick={handlePrevComparison}
                  aria-label="Previous specification"
                  className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 bg-[#0E0E10]/80 hover:bg-[#1A1A1E] backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:border-amber-400/40 transition-all shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Right Arrow */}
                <button
                  type="button"
                  onClick={handleNextComparison}
                  aria-label="Next specification"
                  className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 bg-[#0E0E10]/80 hover:bg-[#1A1A1E] backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:border-amber-400/40 transition-all shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* 3D Rolling Stage */}
                <div className="relative w-full h-[400px] sm:h-[420px] flex items-center justify-center overflow-hidden [perspective:1000px]">
                  {comparisons.map((item, idx) => {
                    let offset = (idx - rollingIndex + comparisons.length) % comparisons.length;
                    if (offset > 2) offset -= 4;

                    const isActive = offset === 0;
                    const isLeft = offset === -1;
                    const isRight = offset === 1;

                    let xPos = '0%';
                    let scale = 1;
                    let opacity = 1;
                    let zIndex = 30;
                    let rotateY = 0;

                    if (isActive) {
                      xPos = '0%';
                      scale = 1;
                      opacity = 1;
                      zIndex = 30;
                      rotateY = 0;
                    } else if (isLeft) {
                      xPos = '-58%';
                      scale = 0.86;
                      opacity = 0.35;
                      zIndex = 20;
                      rotateY = 10;
                    } else if (isRight) {
                      xPos = '58%';
                      scale = 0.86;
                      opacity = 0.35;
                      zIndex = 20;
                      rotateY = -10;
                    } else {
                      xPos = '0%';
                      scale = 0.72;
                      opacity = 0;
                      zIndex = 10;
                      rotateY = 0;
                    }

                    return (
                      <motion.div
                        key={item.num}
                        animate={{
                          x: xPos,
                          scale,
                          opacity,
                          zIndex,
                          rotateY,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 280,
                          damping: 30,
                          mass: 0.8,
                        }}
                        drag={isActive ? 'x' : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, info) => {
                          if (info.offset.x < -40 || info.velocity.x < -300) {
                            handleNextComparison();
                          } else if (info.offset.x > 40 || info.velocity.x > 300) {
                            handlePrevComparison();
                          }
                        }}
                        onClick={() => {
                          if (isLeft) handlePrevComparison();
                          if (isRight) handleNextComparison();
                        }}
                        style={openBottomMaskStyle}
                        className={`absolute w-[290px] sm:w-[350px] md:w-[380px] rounded-t-2xl sm:rounded-t-3xl border-t border-x border-b-0 border-white/[0.08] bg-gradient-to-b from-[#141417]/95 via-[#0e0e11]/70 to-transparent p-6 sm:p-7 pb-16 sm:pb-24 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-colors duration-300 ${
                          isActive
                            ? 'cursor-grab active:cursor-grabbing border-amber-400/30'
                            : 'cursor-pointer hover:opacity-50'
                        }`}
                      >
                        <div>
                          {/* Top: Numeral */}
                          <div className="mb-4">
                            <span className="font-serif text-3xl font-light text-neutral-500/80 tracking-tight">
                              {item.num}
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

                          {/* Primary Feature Benefit */}
                          <div className="mt-4">
                            <p className="text-[11.5px] sm:text-xs text-neutral-200/90 leading-relaxed font-light">
                              {item.verona}
                            </p>
                          </div>

                          {/* Natural Stone Block */}
                          <div className="mt-5">
                            <div className="text-[9px] font-mono font-semibold tracking-[0.22em] text-neutral-500 uppercase mb-1.5">
                              <span>NATURAL STONE</span>
                            </div>
                            <p className="text-[11.5px] sm:text-xs text-neutral-500 leading-relaxed font-light">
                              {item.naturalStone}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Rolling Indicator Pills */}
                <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
                  {comparisons.map((item, idx) => (
                    <button
                      key={item.num}
                      type="button"
                      onClick={() => setRollingIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === rollingIndex
                          ? 'w-8 bg-amber-400/90 shadow-[0_0_12px_rgba(251,191,36,0.35)]'
                          : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`Specification ${item.num}`}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
