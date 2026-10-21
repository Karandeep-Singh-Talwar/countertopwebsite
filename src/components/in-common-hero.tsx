'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Calculator, ArrowRight } from 'lucide-react';

interface InCommonHeroProps {
  onOpenBookCall: () => void;
  onOpenQuoteModal: () => void;
  onExploreClick: () => void;
}

export function InCommonHero({
  onOpenBookCall,
  onOpenQuoteModal,
  onExploreClick,
}: InCommonHeroProps) {
  return (
    <section id="hero-section" className="relative w-full h-[92vh] min-h-[680px] max-h-[1100px] bg-[#1a1714] overflow-hidden select-none">
      {/* Background Architectural Interior Photo with subtle Ken Burns effect */}
      <motion.div
        initial={{ scale: 1.06, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2400&q=85"
          alt="Architectural stone countertop interior bathed in warm ambient light"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.75] contrast-[1.05]"
        />
        {/* Soft atmospheric gradient overlays matching reference */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-[#3a2c1d]/20 mix-blend-multiply pointer-events-none" />
      </motion.div>

      {/* Main Content Container with Staggered Entrance */}
      <div className="relative z-10 w-full h-full max-w-[1680px] mx-auto px-6 md:px-12 flex flex-col justify-between pt-36 pb-12">
        {/* Top Spacer */}
        <div className="w-full"></div>

        {/* Center / Signature Brand Typography matching In Common With */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <h1 className="text-white text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-normal tracking-tight leading-[0.9] text-balance drop-shadow-sm">
            Verona <span className="italic font-light text-amber-200">Surfaces</span>
          </h1>
          <p className="mt-4 text-white/80 text-lg sm:text-2xl md:text-3xl font-light tracking-tight font-serif italic">
            Porcelain Countertops, Natural Stone &amp; Large-Format Tiles
          </p>
        </motion.div>

        {/* Bottom Bar: Narrative & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end pt-8 border-t border-white/20"
        >
          {/* Bottom Left: Editorial Statement matching In Common With */}
          <div className="md:col-span-7 lg:col-span-6 space-y-4">
            <p className="text-white/85 text-base sm:text-lg leading-relaxed max-w-lg font-normal">
              The contractor-friendly porcelain revolution. Flow identical high-gloss Italian Calacatta, rare Amazonite, and deep Onyx from your kitchen island countertop, up the backsplash, and across the floor. Any tile contractor can install—zero specialized stone cutter fees.
            </p>
            <button
              onClick={onExploreClick}
              className="group inline-flex items-center gap-3 text-white text-xs uppercase tracking-[0.2em] font-medium hover:text-amber-200 transition-colors cursor-pointer"
            >
              <span>Explore Porcelain Slabs</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5 font-light">
                —
              </span>
            </button>
          </div>

          {/* Bottom Right: Direct Conversion CTA Buttons */}
          <div className="md:col-span-5 lg:col-span-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3.5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenQuoteModal}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-white/30 hover:border-white/70 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white text-xs uppercase tracking-[0.2em] font-medium transition-all cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Instant Slab Quote</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenBookCall}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#FAF8F5] hover:bg-white text-[#1A1A1A] text-xs uppercase tracking-[0.2em] font-medium transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Virtual Call</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Subtle bottom gradient seal */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FAF8F5]" />
    </section>
  );
}
