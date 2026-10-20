'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { InCommonNav } from '@/components/in-common-nav';
import { InCommonFooter } from '@/components/in-common-footer';
import { BookCallModal } from '@/components/book-call-modal';
import { RequestQuoteModal } from '@/components/request-quote-modal';
import { PORCELAIN_CATALOG, PorcelainMaterial } from '@/data/porcelain-catalog-data';
import { Sparkles, Grid3X3, Layers, ShieldCheck, Box, Calculator, Check, ArrowRight, Filter, Info } from 'lucide-react';

export default function PorcelainTilesPage() {
  const [selectedFormat, setSelectedFormat] = useState<'all' | '600x1200' | '600x600'>('all');
  const [activeMaterial, setActiveMaterial] = useState<PorcelainMaterial | null>(null);

  // Quick Tile Box Calculator state
  const [tileSqFt, setTileSqFt] = useState<number>(150);

  const [isBookCallOpen, setIsBookCallOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [modalInitialMaterial, setModalInitialMaterial] = useState('Calcatta Extra (600x1200mm Matching Porcelain Tile)');
  const [modalInitialSqFt, setModalInitialSqFt] = useState(150);

  // Tile coverage math (1.44 sq.m = 15.5 sq.ft per 2-tile box)
  const boxesNeeded = Math.ceil(tileSqFt / 15.5);
  const totalWeightKg = boxesNeeded * 29;
  const estimatedCost = tileSqFt * 18;

  const handleOpenBookCall = (opts?: { material?: string; sqFt?: number; service?: string }) => {
    if (opts?.material) setModalInitialMaterial(opts.material);
    if (opts?.sqFt) setModalInitialSqFt(opts.sqFt);
    setIsBookCallOpen(true);
  };

  const handleOpenQuoteModal = (opts?: { material?: string; sqFt?: number }) => {
    if (opts?.material) setModalInitialMaterial(opts.material);
    if (opts?.sqFt) setModalInitialSqFt(opts.sqFt);
    setIsQuoteModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1A1A]">
      <InCommonNav
        onOpenBookCall={handleOpenBookCall}
        onOpenQuoteModal={handleOpenQuoteModal}
      />

      <main className="flex-1 pt-24 md:pt-32">
        {/* Category Hero */}
        <section className="max-w-[1680px] mx-auto px-6 md:px-12 py-12 md:py-16 border-b border-[#E8E4DC]">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-stone-600/20 bg-stone-100 text-stone-800 text-[11px] uppercase tracking-[0.2em] font-medium rounded-full">
              <Grid3X3 className="w-3.5 h-3.5 text-stone-700" />
              <span>Architectural Continuity Sizing</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light tracking-tight text-[#1A1A1A] leading-[1.08]">
              Porcelain Tiles Catalogue
            </h1>
            <p className="mt-5 text-[#1A1A1A]/75 text-base sm:text-xl font-light leading-relaxed">
              Large-format 600x1200mm (24"x48") and 600x600mm (24"x24") vitrified floor and wall tiles. Pressed with the exact same high-gloss and silk glazes as our porcelain countertops—allowing unbroken material continuity across your floors, feature walls, shower enclosures, and exterior terraces.
            </p>

            {/* Quick Tile Box Estimator Card */}
            <div className="mt-8 p-6 bg-white border border-[#E8E4DC] rounded-2xl shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2">
                    <Box className="w-4 h-4 text-amber-700" />
                    <span>Quick Crate &amp; Tile Box Coverage Estimator</span>
                  </span>
                  <p className="text-[11px] text-[#767168] mt-0.5">
                    Standard box: 2 pcs (15.5 sq.ft / 1.44 sq.m) · 29 kg per box
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#767168]">Your Floor / Wall Area:</span>
                  <div className="flex items-center bg-[#FAF8F5] border border-[#D9D4CC] rounded-lg px-2.5 py-1">
                    <input
                      type="number"
                      min={15}
                      max={2000}
                      step={10}
                      value={tileSqFt}
                      onChange={(e) => setTileSqFt(Math.max(15, Number(e.target.value)))}
                      className="w-16 bg-transparent text-sm font-mono font-bold text-[#1A1A1A] text-right focus:outline-none mr-1"
                    />
                    <span className="text-xs text-[#767168]">sq.ft</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#F0EDE6] text-xs">
                <div>
                  <span className="text-[#767168] block text-[11px]">Boxes Required:</span>
                  <span className="font-mono font-bold text-base text-[#1A1A1A]">{boxesNeeded} Boxes</span>
                </div>
                <div>
                  <span className="text-[#767168] block text-[11px]">Total Pallet Weight:</span>
                  <span className="font-mono font-bold text-base text-[#1A1A1A]">{totalWeightKg} kg (~{Math.round(totalWeightKg * 2.204)} lbs)</span>
                </div>
                <div>
                  <span className="text-[#767168] block text-[11px]">Est. Wholesale Material:</span>
                  <span className="font-mono font-bold text-base text-emerald-800">${estimatedCost.toLocaleString()}</span>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => handleOpenQuoteModal({ material: `Porcelain Tile Crate (${boxesNeeded} Boxes / ${tileSqFt} sq.ft)`, sqFt: tileSqFt })}
                    className="w-full py-2 px-3 bg-[#1A1A1A] hover:bg-amber-800 text-white text-[11px] uppercase tracking-wider font-medium transition rounded-lg cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Get Tile Crate Quote</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tile Gallery */}
        <section className="max-w-[1680px] mx-auto px-6 md:px-12 py-16">
          {/* Format Tabs & Count */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-[#E8E4DC]">
            <div className="flex items-center gap-2">
              <span className="text-[12px] uppercase tracking-wider text-[#767168] mr-2 font-medium">
                Format:
              </span>
              {[
                { id: 'all', label: 'All Formats' },
                { id: '600x1200', label: '600x1200 mm (24x48 in)' },
                { id: '600x600', label: '600x600 mm (24x24 in)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFormat(tab.id as any)}
                  className={`px-3 py-1.5 text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                    selectedFormat === tab.id
                      ? 'border-b-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold'
                      : 'text-[#767168] hover:text-[#1A1A1A]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-[12px] text-[#767168] font-normal">
              Showing <span className="font-semibold text-[#1A1A1A]">{PORCELAIN_CATALOG.length}</span> matching vitrified architectural tiles
            </div>
          </div>

          {/* Tiles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {PORCELAIN_CATALOG.map((tile) => (
              <motion.div
                key={tile.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setActiveMaterial(tile)}
                className="group flex flex-col justify-between bg-white border border-[#E8E4DC] hover:border-[#1A1A1A]/40 transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer"
              >
                <div>
                  {/* Tile Image (Applied Room View) */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 border-b border-[#E8E4DC]">
                    <Image
                      src={tile.roomImage}
                      alt={tile.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-3 left-3 z-10 flex gap-2">
                      <span className="px-2.5 py-0.5 bg-black/75 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-medium">
                        Matching Tile Series
                      </span>
                      <span className="px-2.5 py-0.5 bg-emerald-700/85 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-medium">
                        PEI IV Wear Class
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 z-10">
                      <span className="px-2.5 py-1 bg-white/95 text-[#1A1A1A] text-[11px] font-semibold tracking-wide shadow-sm">
                        $18 – $26 / sq.ft
                      </span>
                    </div>
                  </div>

                  {/* Tile Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] uppercase tracking-[0.16em] text-amber-700 font-medium">
                        Vitrified Ceramic Body
                      </span>
                      <span className="text-[11px] uppercase tracking-wider text-[#767168]">
                        {tile.randomFaces} Faces
                      </span>
                    </div>

                    <h3 className="text-2xl font-sans font-light tracking-tight text-[#1A1A1A] mb-2 group-hover:text-amber-900 transition-colors">
                      {tile.name} Architectural Tile
                    </h3>

                    <p className="text-[13px] leading-relaxed text-[#1A1A1A]/75 mb-4 line-clamp-2">
                      {tile.description}
                    </p>

                    <div className="p-3 bg-[#FAF8F5] border border-[#E8E4DC] text-xs text-[#1A1A1A]/90 rounded-none mb-4 flex items-start gap-2">
                      <Layers className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
                      <span>Exact color and pattern match to our {tile.name} countertop slabs.</span>
                    </div>

                    {/* Applications */}
                    <div className="flex flex-wrap gap-1.5 text-[11px] text-[#767168]">
                      {['Continuous Flooring', 'Shower Walls', 'Accent Facades', 'R10 Slip Rating'].map((app, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[#F2EFE9] border border-[#E8E4DC]">
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Modal for Tile Spec Sheet */}
        <AnimatePresence>
          {activeMaterial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 sm:p-6"
              onClick={() => setActiveMaterial(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-3xl w-full bg-[#FAF8F5] border border-[#E8E4DC] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
              >
                <div className="md:w-1/2 relative bg-black min-h-[300px]">
                  <Image
                    src={activeMaterial.roomImage}
                    alt={activeMaterial.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="text-[10px] uppercase tracking-widest text-amber-300 block mb-1">
                      {activeMaterial.collection} Collection · Tile
                    </span>
                    <h4 className="text-3xl font-sans font-light tracking-tight">{activeMaterial.name}</h4>
                    <p className="text-xs text-white/70 mt-1">600x1200mm &amp; 600x600mm Vitrified Tiles</p>
                  </div>
                </div>

                <div className="md:w-1/2 p-6 sm:p-8 space-y-5 text-[#1A1A1A] overflow-y-auto">
                  <div>
                    <h5 className="text-[11px] uppercase tracking-[0.18em] text-[#767168] mb-1">Packaging &amp; Technical Specs</h5>
                    <p className="text-xs text-[#1A1A1A]/80 leading-relaxed">{activeMaterial.description}</p>
                  </div>

                  <div className="border border-[#E8E4DC] divide-y divide-[#E8E4DC] text-xs bg-white">
                    <div className="flex justify-between p-2.5">
                      <span className="text-[#767168]">Formats:</span>
                      <span className="font-semibold">600x1200 mm &amp; 600x600 mm</span>
                    </div>
                    <div className="flex justify-between p-2.5">
                      <span className="text-[#767168]">Thickness:</span>
                      <span className="font-semibold">9 mm Rectified Monocaliber</span>
                    </div>
                    <div className="flex justify-between p-2.5">
                      <span className="text-[#767168]">Box Packing:</span>
                      <span className="font-semibold">2 pcs / box (15.5 sq.ft / 1.44 sq.m)</span>
                    </div>
                    <div className="flex justify-between p-2.5">
                      <span className="text-[#767168]">Box Weight:</span>
                      <span className="font-semibold">29 kg (64 lbs)</span>
                    </div>
                    <div className="flex justify-between p-2.5">
                      <span className="text-[#767168]">Water Absorption:</span>
                      <span className="font-semibold text-emerald-800">&lt; 0.04% (Stain-proof)</span>
                    </div>
                    <div className="flex justify-between p-2.5">
                      <span className="text-[#767168]">Traffic Rating:</span>
                      <span className="font-semibold">PEI IV Heavy Residential &amp; Light Commercial</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        const name = activeMaterial.name;
                        setActiveMaterial(null);
                        handleOpenQuoteModal({ material: `${name} Architectural Tile (600x1200mm)` });
                      }}
                      className="flex-1 py-3 bg-[#1A1A1A] hover:bg-amber-800 text-white text-[11px] uppercase tracking-wider font-medium transition cursor-pointer"
                    >
                      Request Tile Crate Quote
                    </button>
                    <button
                      onClick={() => setActiveMaterial(null)}
                      className="px-4 py-3 border border-[#E8E4DC] hover:bg-stone-200 text-xs transition cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <InCommonFooter
        onOpenBookCall={handleOpenBookCall}
        onOpenQuoteModal={handleOpenQuoteModal}
        onOpenSwatches={() => {}}
      />

      <BookCallModal
        isOpen={isBookCallOpen}
        onClose={() => setIsBookCallOpen(false)}
        initialMaterial={modalInitialMaterial}
        initialSqFt={modalInitialSqFt}
      />

      <RequestQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        initialMaterial={modalInitialMaterial}
        initialSqFt={modalInitialSqFt}
      />
    </div>
  );
}
