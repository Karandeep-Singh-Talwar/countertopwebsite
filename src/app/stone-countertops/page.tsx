'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { InCommonNav } from '@/components/in-common-nav';
import { InCommonFooter } from '@/components/in-common-footer';
import { BookCallModal } from '@/components/book-call-modal';
import { RequestQuoteModal } from '@/components/request-quote-modal';
import { SLAB_PRODUCTS, SlabProduct } from '@/data/stone-data';
import { Sparkles, Layers, ShieldCheck, MapPin, Calculator, Calendar, Check, ArrowRight, Filter, Info, Eye } from 'lucide-react';

export default function StoneCountertopsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Quartzite' | 'Marble' | 'Granite' | 'Quartz'>('all');
  const [activeProduct, setActiveProduct] = useState<SlabProduct | null>(null);

  const [isBookCallOpen, setIsBookCallOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [modalInitialMaterial, setModalInitialMaterial] = useState('Taj Mahal Exotic Quartzite');
  const [modalInitialSqFt, setModalInitialSqFt] = useState(65);

  const filteredSlabs = SLAB_PRODUCTS.filter((slab) => {
    if (slab.category === 'Porcelain' || slab.category === 'Tile') return false; // Filter out tiles/porcelain to keep stone focus
    if (selectedCategory !== 'all' && slab.category !== selectedCategory) return false;
    return true;
  });

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
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-[#1A1A1A]/15 bg-[#F2EFE9] text-[#1A1A1A] text-[11px] uppercase tracking-[0.2em] font-medium rounded-full">
              <Layers className="w-3.5 h-3.5 text-stone-700" />
              <span>Quarried Natural &amp; Engineered Slabs</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light tracking-tight text-[#1A1A1A] leading-[1.08]">
              Stone Countertops Catalogue
            </h1>
            <p className="mt-5 text-[#1A1A1A]/75 text-base sm:text-xl font-light leading-relaxed">
              Traditional quarried 2cm &amp; 3cm natural quartzite, Italian marble, granite, and premium engineered quartz. Hand-selected slab bundles sourced directly from Italian and South American quarries for monumental residential kitchen islands and heavy overhangs.
            </p>

            {/* Sizing & Spec Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#E8E4DC]">
              <div className="p-3.5 bg-white border border-[#E8E4DC] rounded-xl">
                <div className="text-xs font-semibold text-[#1A1A1A]">Solid 3cm Slabs</div>
                <div className="text-[11px] text-[#767168] mt-0.5">Heavy architectural overhangs</div>
              </div>
              <div className="p-3.5 bg-white border border-[#E8E4DC] rounded-xl">
                <div className="text-xs font-semibold text-[#1A1A1A]">CNC Precision Milling</div>
                <div className="text-[11px] text-[#767168] mt-0.5">Waterjet cutouts &amp; ogee edges</div>
              </div>
              <div className="p-3.5 bg-white border border-[#E8E4DC] rounded-xl">
                <div className="text-xs font-semibold text-[#1A1A1A]">Direct Quarry Sourcing</div>
                <div className="text-[11px] text-[#767168] mt-0.5">Italy, Brazil, Spain &amp; Zimbabwe</div>
              </div>
              <div className="p-3.5 bg-white border border-[#E8E4DC] rounded-xl">
                <div className="text-xs font-semibold text-[#1A1A1A]">Bookmatched Bundles</div>
                <div className="text-[11px] text-[#767168] mt-0.5">Consecutive mirrored slab veining</div>
              </div>
            </div>
          </div>
        </section>

        {/* Stone Slab Gallery */}
        <section className="max-w-[1680px] mx-auto px-6 md:px-12 py-16">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-[#E8E4DC]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[12px] uppercase tracking-wider text-[#767168] mr-2 flex items-center gap-1.5 font-medium">
                <Filter className="w-3.5 h-3.5" />
                Material Class:
              </span>
              {[
                { id: 'all', label: 'All Stone Slabs' },
                { id: 'Quartzite', label: 'Natural Quartzite' },
                { id: 'Marble', label: 'Italian Marble' },
                { id: 'Granite', label: 'Quarried Granite' },
                { id: 'Quartz', label: 'Engineered Quartz' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id as any)}
                  className={`px-3 py-1.5 text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                    selectedCategory === tab.id
                      ? 'border-b-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold'
                      : 'text-[#767168] hover:text-[#1A1A1A]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-[12px] text-[#767168] font-normal">
              Showing <span className="font-semibold text-[#1A1A1A]">{filteredSlabs.length}</span> curated stone slabs
            </div>
          </div>

          {/* Slabs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filteredSlabs.map((slab) => (
              <motion.div
                key={slab.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setActiveProduct(slab)}
                className="group flex flex-col justify-between bg-white border border-[#E8E4DC] hover:border-[#1A1A1A]/40 transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer"
              >
                <div>
                  {/* Slab Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 border-b border-[#E8E4DC]">
                    <Image
                      src={slab.image}
                      alt={slab.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-3 left-3 z-10 flex gap-2">
                      <span className="px-2.5 py-0.5 bg-black/75 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-medium">
                        {slab.category}
                      </span>
                      <span className="px-2.5 py-0.5 bg-white/90 backdrop-blur-md text-[#1A1A1A] text-[10px] uppercase tracking-wider font-semibold">
                        {slab.thickness}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 z-10">
                      <span className="px-2.5 py-1 bg-white/95 text-[#1A1A1A] text-[11px] font-semibold tracking-wide shadow-sm">
                        ${slab.pricePerSqFt} / sq.ft
                      </span>
                    </div>
                  </div>

                  {/* Slab Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] uppercase tracking-[0.16em] text-stone-600 font-medium">
                        {slab.origin}
                      </span>
                      <span className="text-[11px] uppercase tracking-wider text-[#767168]">
                        Finish: {slab.finish}
                      </span>
                    </div>

                    <h3 className="text-2xl font-sans font-light tracking-tight text-[#1A1A1A] mb-2 group-hover:text-amber-900 transition-colors">
                      {slab.name}
                    </h3>

                    <p className="text-[13px] leading-relaxed text-[#1A1A1A]/75 mb-4 line-clamp-2">
                      {slab.description}
                    </p>

                    {/* Applications */}
                    <div className="flex flex-wrap gap-1.5 text-[11px] text-[#767168] pt-2 border-t border-[#F0EDE6]">
                      {slab.bestFor.map((app, i) => (
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

        {/* Modal for Stone Slab Spec Sheet */}
        <AnimatePresence>
          {activeProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 sm:p-6"
              onClick={() => setActiveProduct(null)}
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
                    src={activeProduct.image}
                    alt={activeProduct.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="text-[10px] uppercase tracking-widest text-amber-300 block mb-1">
                      {activeProduct.category} · Quarry Sourced
                    </span>
                    <h4 className="text-3xl font-sans font-light tracking-tight">{activeProduct.name}</h4>
                    <p className="text-xs text-white/70 mt-1">${activeProduct.pricePerSqFt} / sq.ft material</p>
                  </div>
                </div>

                <div className="md:w-1/2 p-6 sm:p-8 space-y-5 text-[#1A1A1A] overflow-y-auto">
                  <div>
                    <h5 className="text-[11px] uppercase tracking-[0.18em] text-[#767168] mb-1">Geological Specification</h5>
                    <p className="text-xs text-[#1A1A1A]/80 leading-relaxed">{activeProduct.description}</p>
                  </div>

                  <div className="border border-[#E8E4DC] divide-y divide-[#E8E4DC] text-xs bg-white">
                    <div className="flex justify-between p-2.5">
                      <span className="text-[#767168]">Quarry Origin:</span>
                      <span className="font-semibold">{activeProduct.origin}</span>
                    </div>
                    <div className="flex justify-between p-2.5">
                      <span className="text-[#767168]">Available Thickness:</span>
                      <span className="font-semibold">{activeProduct.thickness}</span>
                    </div>
                    <div className="flex justify-between p-2.5">
                      <span className="text-[#767168]">Surface Finish:</span>
                      <span className="font-semibold">{activeProduct.finish}</span>
                    </div>
                    <div className="flex justify-between p-2.5">
                      <span className="text-[#767168]">Heat Resistance:</span>
                      <span className="font-semibold">{activeProduct.heatResistance}</span>
                    </div>
                    <div className="flex justify-between p-2.5">
                      <span className="text-[#767168]">Stain Resistance:</span>
                      <span className="font-semibold">{activeProduct.stainResistance}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        const name = activeProduct.name;
                        setActiveProduct(null);
                        handleOpenQuoteModal({ material: name });
                      }}
                      className="flex-1 py-3 bg-[#1A1A1A] hover:bg-amber-800 text-white text-[11px] uppercase tracking-wider font-medium transition cursor-pointer"
                    >
                      Request Slab Quote
                    </button>
                    <button
                      onClick={() => setActiveProduct(null)}
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
