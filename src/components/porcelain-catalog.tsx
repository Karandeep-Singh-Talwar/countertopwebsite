'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  Calendar, 
  Sparkles, 
  Filter,
  CheckCircle2
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
    <section id="porcelain-catalog-section" className="scroll-mt-20 w-full bg-[#FAF8F5] py-20 md:py-28 text-[#1A1A1A]">
      <div className="max-w-[1680px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 border border-[#1A1A1A]/15 bg-[#F2EFE9] text-[#1A1A1A] text-[11px] uppercase tracking-[0.2em] font-medium rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Curated Architectural Collection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-light tracking-tight text-[#1A1A1A]">
              High Gloss Vitrified Porcelain Collection
            </h2>
            <p className="mt-3 text-[#1A1A1A]/75 text-base sm:text-lg max-w-2xl font-light">
              600x1200mm (24x48 in) monolithic 9mm porcelain slabs. Engineered for kitchen countertops, island waterfalls, backsplashes, and unbroken floor continuity.
            </p>
          </div>

          {/* Global View Mode Switcher: Room Mockup vs Clean Slab Specimen */}
          <div className="flex items-center gap-3 bg-white border border-[#E8E4DC] p-1.5 shadow-sm rounded-none">
            <span className="text-[11px] uppercase tracking-wider text-[#767168] pl-2 font-medium">
              View Mode:
            </span>
            <button
              onClick={() => setViewMode('room')}
              className={`px-3.5 py-1.5 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors cursor-pointer ${
                viewMode === 'room'
                  ? 'bg-[#1A1A1A] text-white shadow-sm'
                  : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
              }`}
            >
              Interior Applied
            </button>
            <button
              onClick={() => setViewMode('slab')}
              className={`px-3.5 py-1.5 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors cursor-pointer ${
                viewMode === 'slab'
                  ? 'bg-[#1A1A1A] text-white shadow-sm'
                  : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
              }`}
            >
              Slab Specimen
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-[#E8E4DC]">
          {/* Color Palette Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12px] uppercase tracking-wider text-[#767168] mr-2 flex items-center gap-1.5 font-medium">
              <Filter className="w-3.5 h-3.5" />
              Palette:
            </span>
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
                className={`px-3 py-1.5 text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                  selectedPalette === tab.id
                    ? 'border-b-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold'
                    : 'text-[#767168] hover:text-[#1A1A1A]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-[12px] text-[#767168] tracking-wide font-normal">
            Showing <span className="font-semibold text-[#1A1A1A]">{filteredMaterials.length}</span> luxury vitrified designs
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filteredMaterials.map((mat) => {
            const displayImg = viewMode === 'room' ? mat.roomImage : mat.slabImage;

            return (
              <motion.div
                key={mat.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                onClick={() => setActiveMaterial(mat)}
                className="group flex flex-col justify-between bg-white border border-[#E8E4DC] hover:border-[#1A1A1A]/40 transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer"
              >
                <div>
                  {/* Image Display */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 border-b border-[#E8E4DC]">
                    <Image
                      src={displayImg}
                      alt={mat.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
                      <span className="px-2.5 py-0.5 bg-black/75 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-medium">
                        {mat.collection} Series
                      </span>
                      <span className="px-2.5 py-0.5 bg-emerald-700/85 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-medium">
                        Any Contractor Can Install
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 z-10">
                      <span className="px-2.5 py-1 bg-white/95 text-[#1A1A1A] text-[11px] font-semibold tracking-wide shadow-sm">
                        {mat.priceEstimate}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] uppercase tracking-[0.16em] text-amber-700 font-medium">
                        9mm High Gloss Vitrified
                      </span>
                      <span className="text-[11px] uppercase tracking-wider text-[#767168]">
                        {mat.randomFaces} Random Faces
                      </span>
                    </div>

                    <h3 className="text-2xl font-sans font-light tracking-tight text-[#1A1A1A] mb-2 group-hover:text-amber-900 transition-colors">
                      {mat.name}
                    </h3>

                    <p className="text-[13px] leading-relaxed text-[#1A1A1A]/75 mb-4 line-clamp-2">
                      {mat.description}
                    </p>

                    {/* USP callout box */}
                    <div className="p-3 bg-[#FAF8F5] border border-[#E8E4DC] text-[12px] text-[#1A1A1A]/90 rounded-none mb-4 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-normal">{mat.uspHighlight}</span>
                    </div>

                    {/* Dimensions & Applications Pills */}
                    <div className="flex flex-wrap gap-1.5 text-[11px] text-[#767168]">
                      {mat.application.slice(0, 3).map((app, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[#F2EFE9] border border-[#E8E4DC]">
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Catalog Banner */}
        <div className="mt-16 p-8 md:p-12 bg-white border border-[#E8E4DC] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h4 className="text-2xl font-sans font-light tracking-tight text-[#1A1A1A]">
              Need Full Catalog Spec Sheets or Custom Contractor Miter Quotes?
            </h4>
            <p className="text-[14px] text-[#1A1A1A]/75 max-w-2xl font-light">
              We provide full architectural crates, digital CAD layouts, and direct quarry pricing for residential kitchens and high-traffic commercial projects.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenQuoteModal({ material: 'Full High Gloss Vitrified Porcelain Collection' })}
              className="px-6 py-3.5 bg-[#1A1A1A] hover:bg-amber-800 text-white text-[12px] uppercase tracking-[0.16em] font-medium transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Get Itemized Estimate</span>
            </button>
            <button
              onClick={() => onOpenBookCall({ service: 'Contractor Porcelain Installation Consultation' })}
              className="px-6 py-3.5 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] text-[12px] uppercase tracking-[0.16em] font-medium transition-all cursor-pointer flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5" />
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
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:p-6"
              onClick={() => setActiveMaterial(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-4xl w-full bg-[#FAF8F5] border border-[#E8E4DC] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
              >
                {/* Left Visual Area */}
                <div className="md:w-1/2 relative bg-stone-900 min-h-[300px]">
                  <Image
                    src={activeMaterial.roomImage}
                    alt={activeMaterial.name}
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="text-[10px] uppercase tracking-widest text-amber-300 block mb-1">
                      {activeMaterial.collection} Collection
                    </span>
                    <h4 className="text-3xl font-sans font-light tracking-tight">
                      {activeMaterial.name}
                    </h4>
                    <p className="text-xs text-white/70 mt-1">
                      High Gloss Vitrified Porcelain Slab & Tile
                    </p>
                  </div>
                </div>

                {/* Right Spec Details */}
                <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto space-y-6 text-[#1A1A1A]">
                  <div>
                    <h5 className="text-[11px] uppercase tracking-[0.18em] text-[#767168] mb-1">
                      Material Specification
                    </h5>
                    <p className="text-[13px] leading-relaxed text-[#1A1A1A]/80">
                      {activeMaterial.description}
                    </p>
                  </div>

                  {/* Spec Sheet Table */}
                  <div className="border border-[#E8E4DC] divide-y divide-[#E8E4DC] text-[12px] bg-white">
                    <div className="flex justify-between p-2.5">
                      <span className="text-[#767168]">Thickness:</span>
                      <span className="font-semibold">{activeMaterial.thickness}</span>
                    </div>
                    <div className="flex justify-between p-2.5">
                      <span className="text-[#767168]">Standard Formats:</span>
                      <span className="font-semibold">{activeMaterial.dimensions.join(' / ')}</span>
                    </div>
                    <div className="flex justify-between p-2.5">
                      <span className="text-[#767168]">Water Absorption:</span>
                      <span className="font-semibold text-emerald-700">{activeMaterial.waterAbsorption}</span>
                    </div>
                    <div className="flex justify-between p-2.5">
                      <span className="text-[#767168]">Hardness:</span>
                      <span className="font-semibold">{activeMaterial.hardness}</span>
                    </div>
                    <div className="flex justify-between p-2.5">
                      <span className="text-[#767168]">Thermal Resilience:</span>
                      <span className="font-semibold text-emerald-700">{activeMaterial.thermalResistance}</span>
                    </div>
                    <div className="flex justify-between p-2.5">
                      <span className="text-[#767168]">Continuous Faces:</span>
                      <span className="font-semibold">{activeMaterial.randomFaces} Bookmatchable Patterns</span>
                    </div>
                  </div>

                  {/* USP Benefit */}
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                    <span className="font-semibold block mb-0.5">Contractor Installation Advantage:</span>
                    {activeMaterial.uspHighlight}
                  </div>

                  {/* Modal Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        const matName = activeMaterial.name;
                        setActiveMaterial(null);
                        onOpenQuoteModal({ material: `${matName} (High Gloss Vitrified Porcelain)` });
                      }}
                      className="flex-1 py-3 bg-[#1A1A1A] hover:bg-amber-800 text-white text-[11px] uppercase tracking-[0.16em] font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      <span>Get Slab Quote</span>
                    </button>
                    <button
                      onClick={() => setActiveMaterial(null)}
                      className="py-3 px-4 border border-[#E8E4DC] hover:bg-stone-200 text-[#1A1A1A] text-[11px] uppercase tracking-[0.16em] transition-colors cursor-pointer"
                    >
                      Close
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
