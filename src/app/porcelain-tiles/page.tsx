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
import { ArrowRight, Calculator, X } from 'lucide-react';

export default function PorcelainTilesPage() {
  const [selectedFormat, setSelectedFormat] = useState<'all' | '600x1200' | '600x600'>('all');
  const [activeMaterial, setActiveMaterial] = useState<PorcelainMaterial | null>(null);

  // Simple Tile Packaging Calculator State
  const [tileSqFt, setTileSqFt] = useState<number>(180);
  const sqFtPerBox = 15.5; // 2 pcs of 600x1200mm = ~1.44 m2 = 15.5 sq.ft
  const boxesNeeded = Math.ceil(tileSqFt / sqFtPerBox);
  const totalWeightKg = boxesNeeded * 29; // 29kg per box
  const pricePerSqFt = 19; // avg $19/sq.ft
  const estimatedCost = Math.round(tileSqFt * pricePerSqFt);

  const [isBookCallOpen, setIsBookCallOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [modalInitialMaterial, setModalInitialMaterial] = useState('Matching Calcatta Extra Porcelain Tile');
  const [modalInitialSqFt, setModalInitialSqFt] = useState(180);

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
        {/* Category Hero: Open & Borderless */}
        <section className="max-w-[1680px] mx-auto px-6 md:px-12 py-16 md:py-24 border-b border-[#1A1A1A]/10">
          <div className="max-w-4xl">
            <div className="text-xs uppercase tracking-[0.25em] text-[#6C6863] mb-3 font-mono">
              03 / Architectural Continuity Sizing
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal tracking-tight text-[#1A1A1A] leading-[1.05]">
              Porcelain Tiles <span className="italic font-light text-amber-800">Catalogue</span>
            </h1>
            <p className="mt-6 text-[#6C6863] text-base sm:text-lg font-normal leading-relaxed">
              Large-format 600×1200mm (24"×48") and 600×600mm (24"×24") vitrified floor and wall tiles. Pressed with the exact same high-gloss and silk glazes as our porcelain countertops—allowing unbroken material continuity across your floors, feature walls, shower enclosures, and exterior terraces.
            </p>

            {/* Open Crate & Tile Packaging Console (ZERO BOXES) */}
            <div className="mt-12 pt-8 border-t border-[#1A1A1A]/10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-[#6C6863] font-mono mb-1">
                    Jobsite Crate Packaging Calculator
                  </div>
                  <div className="text-sm text-[#6C6863] font-normal leading-relaxed">
                    Standard crate box: 2 pcs (15.5 sq.ft / 1.44 m²) · 29 kg per freight box
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono uppercase text-[#6C6863]">Coverage Area:</span>
                  <input
                    type="number"
                    min={15}
                    max={3000}
                    step={10}
                    value={tileSqFt}
                    onChange={(e) => setTileSqFt(Math.max(15, Number(e.target.value)))}
                    className="w-24 bg-transparent border-b border-[#1A1A1A]/30 focus:border-amber-800 text-xl font-mono text-[#1A1A1A] text-right py-0.5 outline-none"
                  />
                  <span className="text-xs font-mono text-[#6C6863]">sq.ft</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 font-mono">
                <div>
                  <div className="text-3xl font-serif text-[#1A1A1A] font-normal">{boxesNeeded}</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-[#6C6863] mt-1 font-medium">Boxes Needed</div>
                  <div className="text-xs text-[#6C6863] font-sans mt-0.5">15.5 sq.ft per box</div>
                </div>
                <div>
                  <div className="text-3xl font-serif text-[#1A1A1A] font-normal">{totalWeightKg} kg</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-[#6C6863] mt-1 font-medium">Pallet Mass</div>
                  <div className="text-xs text-[#6C6863] font-sans mt-0.5">~{Math.round(totalWeightKg * 2.204)} lbs freight</div>
                </div>
                <div>
                  <div className="text-3xl font-serif text-emerald-800 font-normal">${estimatedCost.toLocaleString()}</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-[#6C6863] mt-1 font-medium">Wholesale Cost</div>
                  <div className="text-xs text-[#6C6863] font-sans mt-0.5">Direct jobsite freight</div>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => handleOpenQuoteModal({ material: `Porcelain Tile Crate (${boxesNeeded} Boxes / ${tileSqFt} sq.ft)`, sqFt: tileSqFt })}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#1A1A1A] py-1 border-b border-[#1A1A1A] hover:text-amber-800 hover:border-amber-800 transition-colors cursor-pointer"
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
        <section className="max-w-[1680px] mx-auto px-6 md:px-12 py-20">
          {/* Format Tabs & Count */}
          <div className="flex flex-wrap items-center justify-between gap-6 mb-16 pb-4 border-b border-[#1A1A1A]/10">
            <div className="flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium">
              {[
                { id: 'all', label: 'All Formats' },
                { id: '600x1200', label: '600×1200 mm (24×48 in)' },
                { id: '600x600', label: '600×600 mm (24×24 in)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFormat(tab.id as any)}
                  className={`py-1 relative transition-colors cursor-pointer ${
                    selectedFormat === tab.id
                      ? 'text-[#1A1A1A] font-medium'
                      : 'text-[#8C827A] hover:text-[#1A1A1A]'
                  }`}
                >
                  <span>{tab.label}</span>
                  {selectedFormat === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-px bg-[#1A1A1A]" />
                  )}
                </button>
              ))}
            </div>

            <div className="text-xs text-[#8C827A] font-mono tracking-wider">
              Showing <span className="font-semibold text-[#1A1A1A]">{PORCELAIN_CATALOG.length}</span> matching vitrified architectural tiles
            </div>
          </div>

          {/* Tiles Grid: BORDERLESS ART GALLERY (ZERO BOXES) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {PORCELAIN_CATALOG.map((tile) => (
              <motion.div
                key={tile.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setActiveMaterial(tile)}
                className="group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#ECE8E1]">
                    <Image
                      src={tile.roomImage}
                      alt={tile.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />

                    <div className="absolute top-4 right-4 text-[11px] uppercase tracking-wider text-white bg-black/50 backdrop-blur-md px-3 py-1 font-mono">
                      $18 – $26 / sq.ft
                    </div>
                  </div>

                  <div className="pt-6">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#8C827A] mb-1.5 font-mono">
                      <span>PEI IV Wear Class</span>
                      <span>{tile.randomFaces} Faces</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-serif font-light tracking-tight text-[#1A1A1A] mb-2 group-hover:text-amber-800 transition-colors">
                      {tile.name} Tile
                    </h3>

                    <p className="text-[14px] leading-relaxed text-[#59534E] font-light line-clamp-2 mb-3">
                      {tile.description}
                    </p>

                    <p className="text-xs text-amber-800 font-light italic">
                      Direct match to {tile.name} countertop slabs.
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-medium text-[#1A1A1A] group-hover:translate-x-1 transition-transform">
                  <span>View Tile Specifications</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6"
              onClick={() => setActiveMaterial(null)}
            >
              <motion.div
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.98, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-4xl w-full bg-[#FAF8F5] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] relative"
              >
                <button
                  onClick={() => setActiveMaterial(null)}
                  className="absolute top-4 right-4 z-20 p-2 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="md:w-1/2 relative bg-black min-h-[340px]">
                  <Image
                    src={activeMaterial.roomImage}
                    alt={activeMaterial.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400 block mb-2 font-mono">
                      Architectural Tile Series
                    </span>
                    <h4 className="text-3xl sm:text-4xl font-serif font-light tracking-tight">{activeMaterial.name}</h4>
                    <p className="text-xs text-white/70 mt-1 font-light">600×1200mm &amp; 600×600mm Vitrified Tile</p>
                  </div>
                </div>

                <div className="md:w-1/2 p-8 sm:p-10 space-y-6 text-[#1A1A1A] overflow-y-auto">
                  <div>
                    <h5 className="text-[11px] uppercase tracking-[0.2em] text-[#8C827A] mb-2 font-mono">Tile Specification</h5>
                    <p className="text-[14px] leading-relaxed text-[#59534E] font-light">
                      {activeMaterial.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-[#1A1A1A]/10 text-xs font-mono">
                    <div className="flex justify-between py-1">
                      <span className="text-[#8C827A]">Available Formats:</span>
                      <span className="text-[#1A1A1A] font-medium">600×1200mm · 600×600mm</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8C827A]">Slip Rating:</span>
                      <span className="text-[#1A1A1A] font-medium">R10 Wet / Dry</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8C827A]">Wear Rating:</span>
                      <span className="text-[#1A1A1A] font-medium">PEI IV Commercial Heavy</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8C827A]">Crate Coverage:</span>
                      <span className="text-[#1A1A1A] font-medium">15.5 sq.ft (2 pcs / box)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8C827A]">Rate Range:</span>
                      <span className="text-amber-800 font-bold">$18 – $26 / sq.ft</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#1A1A1A]/10 flex items-center gap-4">
                    <button
                      onClick={() => {
                        setActiveMaterial(null);
                        handleOpenQuoteModal({ material: `${activeMaterial.name} Tile` });
                      }}
                      className="flex-1 py-3 bg-[#1A1A1A] hover:bg-amber-800 text-white text-xs uppercase tracking-[0.2em] font-medium transition cursor-pointer"
                    >
                      Request Quote
                    </button>
                    <button
                      onClick={() => {
                        setActiveMaterial(null);
                        handleOpenBookCall({ material: `${activeMaterial.name} Tile`, service: 'Tile Project Consultation' });
                      }}
                      className="flex-1 py-3 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-xs uppercase tracking-[0.2em] font-medium transition cursor-pointer"
                    >
                      Book Consultation
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
