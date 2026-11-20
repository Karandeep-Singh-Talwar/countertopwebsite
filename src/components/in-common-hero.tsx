'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface InCommonHeroProps {
  onOpenBookCall?: () => void;
  onOpenQuoteModal?: () => void;
  onExploreClick?: () => void;
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
          src="/catalog/products/home_luxury_hero.jpg"
          alt="Architectural porcelain countertop interior bathed in warm ambient light"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.78] contrast-[1.05]"
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
            Carrara <span className="italic font-light text-amber-200">&amp; Clay</span>
          </h1>
          <p className="mt-4 text-white/80 text-lg sm:text-2xl md:text-3xl font-light tracking-tight font-serif italic">
            Porcelain Countertops &amp; Architectural Vitrified Tiles
          </p>
        </motion.div>

        {/* Bottom Bar: Architectural Narrative */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="pt-8 border-t border-white/20 max-w-2xl"
        >
          <p className="text-white/85 text-base sm:text-lg leading-relaxed font-light">
            Monolithic mineral surfaces sculpted for architectural continuity. Unbroken veining flows effortlessly across kitchen island counters, vertical splashbacks, and floor planes, uniting Italian Calacatta, rare Amazonite, and deep volcanic stone.
          </p>
        </motion.div>
      </div>

      {/* Subtle bottom gradient seal */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FAF8F5]" />
    </section>
  );
}
