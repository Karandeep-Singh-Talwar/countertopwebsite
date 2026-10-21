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
import { Layers, ArrowRight, X } from 'lucide-react';

export default function StoneCountertopsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Quartzite' | 'Marble' | 'Granite' | 'Quartz'>('all');
  const [activeProduct, setActiveProduct] = useState<SlabProduct | null>(null);

  const [isBookCallOpen, setIsBookCallOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [modalInitialMaterial, setModalInitialMaterial] = useState('Taj Mahal Quartzite');
  const [modalInitialSqFt, setModalInitialSqFt] = useState(65);

  const filteredSlabs = SLAB_PRODUCTS.filter((slab) => {
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
        {/* Category Hero: Open & Borderless */}
        <section className="max-w-[1680px] mx-auto px-6 md:px-12 py-16 md:py-24 border-b border-[#1A1A1A]/10">
          <div className="max-w-4xl">
            <div className="text-xs uppercase tracking-[0.25em] text-[#6C6863] mb-3 font-mono">
              02 / Natural &amp; Engineered Stone Slabs
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal tracking-tight text-[#1A1A1A] leading-[1.05]">
              Stone Countertops <span className="italic font-light text-amber-800">Catalogue</span>
            </h1>
            <p className="mt-6 text-[#6C6863] text-base sm:text-lg font-normal leading-relaxed">
              Traditional quarried 2cm &amp; 3cm natural quartzite, Italian marble, granite, and premium engineered quartz. Hand-selected slab bundles sourced directly from Italian and South American quarries for monumental residential kitchen islands and heavy overhangs.
            </p>

            {/* Open Architectural Metric Row (ZERO BOXES) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-12 pt-8 border-t border-[#1A1A1A]/10 font-mono">
              <div>
                <div className="text-3xl sm:text-4xl font-serif text-[#1A1A1A] font-normal">3 cm</div>
                <div className="text-xs uppercase tracking-[0.2em] text-[#1A1A1A] font-medium mt-1">Solid Slabs</div>
                <div className="text-xs text-[#6C6863] mt-0.5 font-sans">Heavy architectural overhangs</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-serif text-[#1A1A1A] font-normal">CNC</div>
                <div className="text-xs uppercase tracking-[0.2em] text-[#1A1A1A] font-medium mt-1">Precision Milling</div>
                <div className="text-xs text-[#6C6863] mt-0.5 font-sans">Waterjet cutouts &amp; ogee profiles</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-serif text-amber-800 font-normal">Direct</div>
                <div className="text-xs uppercase tracking-[0.2em] text-[#1A1A1A] font-medium mt-1">Quarry Sourcing</div>
                <div className="text-xs text-[#6C6863] mt-0.5 font-sans">Italy, Brazil, Spain &amp; Zimbabwe</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-serif text-[#1A1A1A] font-normal">Bundle</div>
                <div className="text-xs uppercase tracking-[0.2em] text-[#1A1A1A] font-medium mt-1">Bookmatched</div>
                <div className="text-xs text-[#6C6863] mt-0.5 font-sans">Consecutive mirrored slab veining</div>
              </div>
            </div>
          </div>
        </section>

        {/* Stone Slab Gallery */}
        <section className="max-w-[1680px] mx-auto px-6 md:px-12 py-20">
          {/* Minimalist Filter Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-6 mb-16 pb-4 border-b border-[#1A1A1A]/10">
            <div className="flex flex-wrap items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium">
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
                  className={`py-1 relative transition-colors cursor-pointer ${
                    selectedCategory === tab.id
                      ? 'text-[#1A1A1A] font-medium'
                      : 'text-[#8C827A] hover:text-[#1A1A1A]'
                  }`}
                >
                  <span>{tab.label}</span>
                  {selectedCategory === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-px bg-[#1A1A1A]" />
                  )}
                </button>
              ))}
            </div>

            <div className="text-xs text-[#6C6863] font-mono tracking-wider">
              Showing <span className="font-semibold text-[#1A1A1A]">{filteredSlabs.length}</span> curated stone slabs
            </div>
          </div>

          {/* Slabs Grid: BORDERLESS ART GALLERY (ZERO BOXES) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {filteredSlabs.map((slab) => (
              <motion.div
                key={slab.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setActiveProduct(slab)}
                className="group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#ECE8E1]">
                    <Image
                      src={slab.image}
                      alt={slab.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />

                    <div className="absolute top-4 right-4 text-[11px] uppercase tracking-wider text-white bg-black/50 backdrop-blur-md px-3 py-1 font-mono">
                      ${slab.pricePerSqFt} / sq.ft
                    </div>
                  </div>

                  <div className="pt-6">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#8C827A] mb-1.5 font-mono">
                      <span>{slab.origin}</span>
                      <span>{slab.thickness} · {slab.finish}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-serif font-light tracking-tight text-[#1A1A1A] mb-2 group-hover:text-amber-800 transition-colors">
                      {slab.name}
                    </h3>

                    <p className="text-[14px] leading-relaxed text-[#59534E] font-light line-clamp-2 mb-3">
                      {slab.description}
                    </p>

                    <p className="text-xs text-[#8C827A] font-mono">
                      Best For: {slab.bestFor.join(' · ')}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-medium text-[#1A1A1A] group-hover:translate-x-1 transition-transform">
                  <span>View Geological Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6"
              onClick={() => setActiveProduct(null)}
            >
              <motion.div
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.98, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-4xl w-full bg-[#FAF8F5] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] relative"
              >
                <button
                  onClick={() => setActiveProduct(null)}
                  className="absolute top-4 right-4 z-20 p-2 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="md:w-1/2 relative bg-black min-h-[340px]">
                  <Image
                    src={activeProduct.image}
                    alt={activeProduct.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400 block mb-2 font-mono">
                      {activeProduct.category} · Quarry Sourced
                    </span>
                    <h4 className="text-3xl sm:text-4xl font-serif font-light tracking-tight">{activeProduct.name}</h4>
                    <p className="text-xs text-white/70 mt-1 font-light">${activeProduct.pricePerSqFt} / sq.ft material</p>
                  </div>
                </div>

                <div className="md:w-1/2 p-8 sm:p-10 space-y-6 text-[#1A1A1A] overflow-y-auto">
                  <div>
                    <h5 className="text-[11px] uppercase tracking-[0.2em] text-[#8C827A] mb-2 font-mono">Geological Specification</h5>
                    <p className="text-[14px] leading-relaxed text-[#59534E] font-light">
                      {activeProduct.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-[#1A1A1A]/10 text-xs font-mono">
                    <div className="flex justify-between py-1">
                      <span className="text-[#8C827A]">Quarry Origin:</span>
                      <span className="text-[#1A1A1A] font-medium">{activeProduct.origin}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8C827A]">Slab Thickness:</span>
                      <span className="text-[#1A1A1A] font-medium">{activeProduct.thickness}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8C827A]">Surface Texture:</span>
                      <span className="text-[#1A1A1A] font-medium">{activeProduct.finish}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8C827A]">Material Cost:</span>
                      <span className="text-amber-800 font-bold">${activeProduct.pricePerSqFt} / sq.ft</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8C827A]">Recommended For:</span>
                      <span className="text-[#1A1A1A] font-medium">{activeProduct.bestFor.join(', ')}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#1A1A1A]/10 flex items-center gap-4">
                    <button
                      onClick={() => {
                        setActiveProduct(null);
                        handleOpenQuoteModal({ material: activeProduct.name });
                      }}
                      className="flex-1 py-3 bg-[#1A1A1A] hover:bg-amber-800 text-white text-xs uppercase tracking-[0.2em] font-medium transition cursor-pointer"
                    >
                      Request Quote
                    </button>
                    <button
                      onClick={() => {
                        setActiveProduct(null);
                        handleOpenBookCall({ material: activeProduct.name, service: 'Stone Slab Consultation' });
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
