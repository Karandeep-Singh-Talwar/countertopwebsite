'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  Camera,
  X,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

const QUICK_SWATCHES = [
  {
    id: 'calcatta-extra',
    name: 'Calcatta Extra',
    material: 'Porcelain',
    texture: '/catalog/products/slab_calcatta_extra.jpg',
  },
  {
    id: 'amazonite',
    name: 'Amazonite Exotic',
    material: 'Porcelain',
    texture: '/catalog/products/slab_amazonite.jpg',
  },
  {
    id: 'fuji-gold',
    name: 'Fuji Gold Alabaster',
    material: 'Porcelain',
    texture: '/catalog/products/slab_fuji_gold.jpg',
  },
  {
    id: 'grigio-collemandian',
    name: 'Grigio Collemandian',
    material: 'Porcelain',
    texture: '/catalog/products/slab_grigio_collemandian.jpg',
  },
];

const ROOM_PRESETS = [
  {
    id: 'sample-chef-kitchen',
    title: 'Waterfall Kitchen Island',
    type: 'Countertops',
    image: '/catalog/products/kitchen_countertops_hero.jpg',
  },
  {
    id: 'sample-master-bath',
    title: 'Master Bathroom Cladding',
    type: 'Wall Slabs',
    image: '/catalog/products/backsplash_walltile_hero.jpg',
  },
  {
    id: 'sample-grand-foyer',
    title: 'Grand Open-Concept Villa',
    type: 'Flooring',
    image: '/catalog/products/flooring_hero.jpg',
  },
];

export function VeronaVisualizerLauncher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Do not show launcher when already in the full visualizer studio
  if (pathname === '/visualizer') {
    return null;
  }

  const handleLaunchRoom = (presetId: string) => {
    setIsOpen(false);
    router.push(`/visualizer?preset=${presetId}`);
  };

  const handleLaunchMaterial = (materialId: string) => {
    setIsOpen(false);
    router.push(`/visualizer?material=${materialId}`);
  };

  return (
    <>
      {/* 1. Floating Visualizer Trigger Button: Quiet Luxury Architectural Studio */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        <motion.button
          initial={{ scale: 0.9, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          onClick={() => setIsOpen(true)}
          aria-label="Open Verona Room Visualizer"
          className="relative overflow-hidden flex items-center gap-2.5 px-4 py-2.5 bg-[#141413]/95 hover:bg-black text-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.35)] border border-white/15 hover:border-amber-400/40 cursor-pointer group transition-colors"
        >
          <Eye className="w-4 h-4 text-amber-300/90 group-hover:text-amber-200 transition-colors" />
          <span className="text-xs uppercase tracking-[0.16em] font-medium font-sans text-neutral-200 group-hover:text-white transition-colors">
            Room Visualizer
          </span>
        </motion.button>
      </div>

      {/* 2. Verona Visualizer Modal / Popover */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6 bg-black/60 backdrop-blur-sm">
            {/* Backdrop click dismiss */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full sm:max-w-xl max-h-[90vh] bg-[#FAF8F5] text-[#1A1A1A] border border-[#1A1A1A]/10 shadow-2xl rounded-t-2xl sm:rounded-xl overflow-hidden flex flex-col z-10"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#1A1A1A]/10 bg-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-amber-300 flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.25em] text-amber-800 font-medium block">
                      VERONA SURFACES · DESIGN STUDIO
                    </span>
                    <h3 className="text-lg font-serif font-normal text-[#1A1A1A]">
                      Architectural Room Visualizer
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-[#8C827A] hover:text-[#1A1A1A] transition-colors rounded-full hover:bg-black/5 cursor-pointer"
                  aria-label="Close Visualizer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                <p className="text-xs text-[#6C6863] leading-relaxed">
                  Preview Verona porcelain slabs and tiles in your actual kitchen or living area with realistic perspective and ambient room lighting.
                </p>

                {/* Primary Action 1: Upload or Snap Room Photo */}
                <Link
                  href="/visualizer"
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center justify-between p-4 bg-white border border-[#1A1A1A]/15 hover:border-[#1A1A1A] shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-center text-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:text-amber-300 transition-colors">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-serif font-medium text-[#1A1A1A]">
                        Upload Your Room Photo
                      </h4>
                      <p className="text-[11px] text-[#6C6863]">
                        Use your phone camera or upload a photo to preview surfaces in your room.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8C827A] group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Primary Action 2: Pre-Configured Luxury Designer Rooms */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C827A] font-semibold font-sans">
                      Or Preview Curated Spaces
                    </span>
                    <span className="text-[10px] text-amber-800 font-medium">Instant Preview</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {ROOM_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => handleLaunchRoom(preset.id)}
                        className="group text-left border border-[#1A1A1A]/10 hover:border-[#1A1A1A] bg-white p-2 transition-all cursor-pointer shadow-sm hover:shadow-md"
                      >
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-200 mb-2">
                          <Image
                            src={preset.image}
                            alt={preset.title}
                            fill
                            sizes="160px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-[#8C827A] truncate">
                          {preset.type}
                        </div>
                        <div className="text-xs font-serif text-[#1A1A1A] font-medium truncate group-hover:text-amber-800 transition-colors">
                          {preset.title}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Action 3: Quick Slabs Palette */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C827A] font-semibold font-sans block">
                    Popular Sintered Slabs To Preview
                  </span>

                  <div className="grid grid-cols-4 gap-2">
                    {QUICK_SWATCHES.map((swatch) => (
                      <button
                        key={swatch.id}
                        onClick={() => handleLaunchMaterial(swatch.id)}
                        className="group flex flex-col items-center text-center p-2 bg-white border border-[#1A1A1A]/10 hover:border-[#1A1A1A] transition-all cursor-pointer shadow-xs hover:shadow-sm"
                      >
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#E8E4DC] mb-1.5 group-hover:scale-105 transition-transform">
                          <Image
                            src={swatch.texture}
                            alt={swatch.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <span className="text-[11px] font-medium text-[#1A1A1A] truncate w-full">
                          {swatch.name}
                        </span>
                        <span className="text-[9px] text-[#8C827A]">{swatch.material}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="p-4 bg-white border-t border-[#1A1A1A]/10 flex items-center justify-between">
                <span className="text-[11px] text-[#8C827A]">
                  In-browser preview · No account required
                </span>
                <Link
                  href="/visualizer"
                  onClick={() => setIsOpen(false)}
                  className="shimmer-liquid-sheen relative overflow-hidden inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer"
                >
                  <span>Open Full Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
