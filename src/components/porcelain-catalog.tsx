'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  Calendar, 
  ArrowRight,
  X
} from 'lucide-react';
import { PORCELAIN_CATALOG, PorcelainMaterial } from '@/data/porcelain-catalog-data';

export interface PorcelainCatalogProps {
  onOpenQuoteModal: (opts?: { material?: string }) => void;
  onOpenBookCall: (opts?: { service?: string; material?: string }) => void;
  initialCategory?: string;
}

export function PorcelainCatalog({
  onOpenQuoteModal,
  onOpenBookCall,
  initialCategory = 'all',
}: PorcelainCatalogProps) {
  const [selectedPalette, setSelectedPalette] = useState<'all' | 'white' | 'green' | 'black' | 'earth' | 'blue'>('all');
  const [viewMode, setViewMode] = useState<'room' | 'slab'>('room');
  const [activeMaterial, setActiveMaterial] = useState<PorcelainMaterial | null>(null);

  const filteredMaterials = PORCELAIN_CATALOG.filter((mat) => {
    if (selectedPalette !== 'all' && mat.palette !== selectedPalette) return false;
    return true;
  });

  return (
    <section id="porcelain-catalog-section" className="scroll-mt-20 w-full bg-[#FAF8F5] py-24 md:py-32 text-[#1A1A1A]">
      <div className="max-w-[1680px] mx-auto px-6 md:px-12">
        {/* Section Header: Open & Borderless */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 pb-8 border-b border-[#1A1A1A]/10">
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-[#8C827A] mb-3 font-mono">
              Architectural Vitrified Collection
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light tracking-tight text-[#1A1A1A] leading-[1.08]">
              High Gloss Vitrified Porcelain Slabs
            </h2>
            <p className="mt-4 text-[#59534E] text-base sm:text-lg max-w-2xl font-light leading-relaxed">
              600×1200mm (24×48 in) monolithic 9mm porcelain slabs. Engineered for kitchen countertops, island waterfalls, backsplashes, and unbroken floor continuity.
            </p>
          </div>

          {/* Minimalist View Mode Switcher: Pure text tabs with active underline, ZERO box container */}
          <div className="flex items-center gap-6 text-xs uppercase tracking-[0.18em] font-mono">
            <span className="text-[#8C827A]">Perspective:</span>
            <button
              onClick={() => setViewMode('room')}
              className={`py-1 relative transition-colors cursor-pointer ${
                viewMode === 'room' ? 'text-[#1A1A1A] font-medium' : 'text-[#8C827A] hover:text-[#1A1A1A]'
              }`}
            >
              <span>Interior Applied</span>
              {viewMode === 'room' && (
                <span className="absolute bottom-0 left-0 right-0 h-px bg-[#1A1A1A]" />
              )}
            </button>
            <button
              onClick={() => setViewMode('slab')}
              className={`py-1 relative transition-colors cursor-pointer ${
                viewMode === 'slab' ? 'text-[#1A1A1A] font-medium' : 'text-[#8C827A] hover:text-[#1A1A1A]'
              }`}
            >
              <span>Slab Specimen</span>
              {viewMode === 'slab' && (
                <span className="absolute bottom-0 left-0 right-0 h-px bg-[#1A1A1A]" />
              )}
            </button>
          </div>
        </div>

        {/* Minimalist Filter Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-16 pb-4 border-b border-[#1A1A1A]/10">
          <div className="flex flex-wrap items-center gap-8 text-xs uppercase tracking-[0.18em] font-mono">
            {[
              { id: 'all', label: 'All Slabs' },
              { id: 'white', label: 'White Calacatta' },
              { id: 'green', label: 'Emerald & Jade' },
              { id: 'black', label: 'Obsidian & Gold' },
              { id: 'earth', label: 'Amber & Grigio' },
              { id: 'blue', label: 'Labradorite Blue' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedPalette(tab.id as any)}
                className={`py-1 relative transition-colors cursor-pointer ${
                  selectedPalette === tab.id
                    ? 'text-[#1A1A1A] font-medium'
                    : 'text-[#8C827A] hover:text-[#1A1A1A]'
                }`}
              >
                <span>{tab.label}</span>
                {selectedPalette === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-[#1A1A1A]" />
                )}
              </button>
            ))}
          </div>

          <div className="text-xs text-[#8C827A] font-mono tracking-wider">
            Showing <span className="font-semibold text-[#1A1A1A]">{filteredMaterials.length}</span> curated vitrified designs
          </div>
        </div>

        {/* Materials Grid: BORDERLESS ART GALLERY (ZERO BOXES) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {filteredMaterials.map((mat) => {
            const displayImg = viewMode === 'room' ? mat.roomImage : mat.slabImage;

            return (
              <motion.div
                key={mat.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setActiveMaterial(mat)}
                className="group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Clean Visual Area */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#ECE8E1]">
                    <Image
                      src={displayImg}
                      alt={mat.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />

                    {/* Floating Price */}
                    <div className="absolute top-4 right-4 text-[11px] uppercase tracking-wider text-white bg-black/50 backdrop-blur-md px-3 py-1 font-mono">
                      {mat.priceEstimate}
                    </div>
                  </div>

                  {/* Editorial Spec Caption: Clean, borderless, typography-driven */}
                  <div className="pt-6">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#8C827A] mb-1.5 font-mono">
                      <span>9mm Vitrified Porcelain</span>
                      <span>{mat.randomFaces} Faces</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-serif font-light tracking-tight text-[#1A1A1A] mb-2 group-hover:text-amber-800 transition-colors">
                      {mat.name}
                    </h3>

                    <p className="text-[14px] leading-relaxed text-[#59534E] font-light line-clamp-2 mb-3">
                      {mat.description}
                    </p>

                    <p className="text-xs text-amber-800 font-light italic">
                      {mat.uspHighlight}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-medium text-[#1A1A1A] group-hover:translate-x-1 transition-transform">
                  <span>View Material Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Editorial Callout: Open Layout with Hairlines */}
        <div className="mt-28 pt-16 pb-12 border-t border-b border-[#1A1A1A]/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h4 className="text-3xl sm:text-4xl font-serif font-light tracking-tight text-[#1A1A1A]">
              Need Full Architectural Crates or CAD Layouts?
            </h4>
            <p className="mt-3 text-[15px] text-[#59534E] font-light leading-relaxed">
              We dispatch wholesale crate pallets directly to jobsites nationwide. Speak with our architectural advisors or receive a digital specification package with exact box and miter calculations.
            </p>
          </div>

          <div className="flex items-center gap-8">
            <button
              onClick={() => onOpenQuoteModal({ material: 'Full High Gloss Vitrified Porcelain Collection' })}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#1A1A1A] py-1 border-b border-[#1A1A1A] hover:text-amber-800 hover:border-amber-800 transition-colors cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>Get Itemized Estimate</span>
            </button>
            <button
              onClick={() => onOpenBookCall({ service: 'Contractor Porcelain Installation Consultation' })}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#59534E] hover:text-[#1A1A1A] py-1 border-b border-[#1A1A1A]/20 hover:border-[#1A1A1A] transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Contractor Call</span>
            </button>
          </div>
        </div>

        {/* Detailed Material Quick Spec Modal */}
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

                {/* Left Visual Area */}
                <div className="md:w-1/2 relative bg-stone-900 min-h-[340px]">
                  <Image
                    src={activeMaterial.roomImage}
                    alt={activeMaterial.name}
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400 block mb-2 font-mono">
                      {activeMaterial.collection} Collection
                    </span>
                    <h4 className="text-3xl sm:text-4xl font-serif font-light tracking-tight">
                      {activeMaterial.name}
                    </h4>
                    <p className="text-xs text-white/70 mt-1 font-light">
                      High Gloss Vitrified Porcelain Slab & Matching Tile
                    </p>
                  </div>
                </div>

                {/* Right Spec Details: Clean, whitespace, hairlines */}
                <div className="md:w-1/2 p-8 sm:p-10 overflow-y-auto space-y-6 text-[#1A1A1A]">
                  <div>
                    <h5 className="text-[11px] uppercase tracking-[0.2em] text-[#8C827A] mb-2 font-mono">
                      Material Specification
                    </h5>
                    <p className="text-[14px] leading-relaxed text-[#59534E] font-light">
                      {activeMaterial.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-[#1A1A1A]/10 text-xs font-mono">
                    <div className="flex justify-between py-1">
                      <span className="text-[#8C827A]">Format:</span>
                      <span className="text-[#1A1A1A] font-medium">{activeMaterial.dimensions.join(' · ')}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8C827A]">Thickness:</span>
                      <span className="text-[#1A1A1A] font-medium">{activeMaterial.thickness}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8C827A]">Finish:</span>
                      <span className="text-[#1A1A1A] font-medium">{activeMaterial.finish}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8C827A]">Random Faces:</span>
                      <span className="text-[#1A1A1A] font-medium">{activeMaterial.randomFaces} continuous</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8C827A]">Porosity:</span>
                      <span className="text-emerald-700 font-medium">&lt; 0.04% (Impervious)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8C827A]">Wholesale Rate:</span>
                      <span className="text-amber-800 font-bold">{activeMaterial.priceEstimate}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#1A1A1A]/10 flex items-center gap-4">
                    <button
                      onClick={() => {
                        setActiveMaterial(null);
                        onOpenQuoteModal({ material: activeMaterial.name });
                      }}
                      className="flex-1 py-3 bg-[#1A1A1A] hover:bg-amber-800 text-white text-xs uppercase tracking-[0.2em] font-medium transition cursor-pointer"
                    >
                      Request Quote
                    </button>
                    <button
                      onClick={() => {
                        setActiveMaterial(null);
                        onOpenBookCall({ material: activeMaterial.name, service: 'Material Consultation' });
                      }}
                      className="flex-1 py-3 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-xs uppercase tracking-[0.2em] font-medium transition cursor-pointer"
                    >
                      Book Call
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
