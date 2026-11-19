'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  Flame,
  Droplets,
  Layers,
  ArrowRight,
  Calculator,
  Calendar,
  X,
  Maximize2,
  Check,
  ChevronRight,
} from 'lucide-react';
import {
  type ApplicationCategory,
  type MaterialType,
  type ColorPalette,
  type UnifiedMaterialProduct,
  MATERIAL_METAS,
  UNIFIED_CATALOG,
} from '@/data/unified-materials-data';

interface MaterialsCatalogViewProps {
  category: ApplicationCategory;
  categoryTitle: string;
  categoryNumber: string;
  categoryTagline: string;
  categoryDescription: string;
  heroImage: string;
  initialMaterial?: MaterialType;
  onOpenQuoteModal: (opts?: { material?: string; sqFt?: number }) => void;
  onOpenBookCall: (opts?: { material?: string; service?: string }) => void;
}

const MATERIAL_TABS: { id: MaterialType; label: string; badge: string }[] = [
  { id: 'porcelain', label: 'Porcelain', badge: 'Contractor 9mm' },
  { id: 'granite', label: 'Granite', badge: 'Natural Igneous' },
  { id: 'quartz', label: 'Quartz', badge: 'Zero Sealing' },
  { id: 'quartzite', label: 'Quartzite', badge: 'Crown Jewel' },
];

const PALETTES: { id: ColorPalette; label: string }[] = [
  { id: 'all', label: 'All Palettes' },
  { id: 'white', label: 'White & Light' },
  { id: 'gray', label: 'Gray & Charcoal' },
  { id: 'black', label: 'Obsidian Black' },
  { id: 'earth', label: 'Warm Earth' },
  { id: 'green', label: 'Emerald Green' },
  { id: 'blue', label: 'Exotic Blue' },
];

export function MaterialsCatalogView({
  category,
  categoryTitle,
  categoryNumber,
  categoryTagline,
  categoryDescription,
  heroImage,
  initialMaterial = 'porcelain',
  onOpenQuoteModal,
  onOpenBookCall,
}: MaterialsCatalogViewProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType>(initialMaterial);
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette>('all');
  const [activeProduct, setActiveProduct] = useState<UnifiedMaterialProduct | null>(null);
  const [viewMode, setViewMode] = useState<'slab' | 'room'>('slab');

  const meta = MATERIAL_METAS[selectedMaterial];

  // Filter items matching active category and active material
  const filteredProducts = useMemo(() => {
    return UNIFIED_CATALOG.filter((item) => {
      const matchApp = item.applications.includes(category);
      const matchMat = item.material === selectedMaterial;
      const matchPal = selectedPalette === 'all' || item.palette === selectedPalette;
      return matchApp && matchMat && matchPal;
    });
  }, [category, selectedMaterial, selectedPalette]);

  return (
    <div className="w-full bg-[#FAF8F5] text-[#1A1A1A]">
      {/* 1. Cinematic Architectural Hero */}
      <section className="relative w-full h-[65vh] min-h-[520px] max-h-[780px] bg-[#1a1714] overflow-hidden select-none">
        <motion.div
          initial={{ scale: 1.05, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={heroImage}
            alt={categoryTitle}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center filter brightness-[0.72] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/40 pointer-events-none" />
        </motion.div>

        <div className="relative z-10 w-full h-full max-w-[1680px] mx-auto px-6 md:px-12 flex flex-col justify-end pb-16">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="max-w-4xl"
          >
            <div className="text-xs uppercase tracking-[0.25em] text-white/70 mb-3 font-sans font-medium">
              Architectural Surface Collection
            </div>
            <h1 className="text-white text-4xl sm:text-6xl md:text-7xl font-serif font-normal tracking-tight leading-[1.05]">
              {categoryTitle}
            </h1>
            <p className="mt-4 text-white/80 text-base sm:text-lg font-light leading-relaxed max-w-2xl">
              {categoryDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Four Material Switcher Pillars */}
      <section className="border-b border-[#1A1A1A]/10 bg-white sticky top-[68px] z-30 shadow-sm">
        <div className="max-w-[1680px] mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between overflow-x-auto py-1 scrollbar-none gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 py-2">
              {MATERIAL_TABS.map((tab) => {
                const isActive = selectedMaterial === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setSelectedMaterial(tab.id);
                      setSelectedPalette('all');
                    }}
                    className={`relative px-4 sm:px-6 py-2.5 transition-all text-xs uppercase tracking-[0.2em] font-medium whitespace-nowrap cursor-pointer ${
                      isActive ? 'text-[#1A1A1A]' : 'text-[#6C6863] hover:text-[#1A1A1A]'
                    }`}
                  >
                    <span className="text-xs uppercase tracking-[0.2em] font-medium">{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeMaterialUnderline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1A1A1A]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Action */}
            <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
              <span className="text-[#6C6863]">Direct Wholesale Freight</span>
              <button
                onClick={() => onOpenQuoteModal({ material: `${meta.title} (${categoryTitle})` })}
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold py-1 border-b border-[#1A1A1A] cursor-pointer hover:text-amber-800"
              >
                <span>Request Custom Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Material Technical Intelligence Dossier (Zero SaaS Boxes) */}
      <section className="border-b border-[#1A1A1A]/10 bg-[#FAF8F5] py-10 sm:py-14">
        <div className="max-w-[1680px] mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-[#1A1A1A]/10">
            <div className="max-w-2xl space-y-2">
              <div className="text-[11px] uppercase tracking-[0.25em] text-amber-900 font-sans font-medium">
                {meta.keyBadge}
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#1A1A1A] font-normal tracking-tight">
                {meta.title} <span className="italic font-light">Specifications</span>
              </h2>
              <p className="text-sm sm:text-base text-[#6C6863] leading-relaxed pt-1">
                {meta.description}
              </p>
            </div>

            <div className="flex items-center gap-6 text-xs font-sans tracking-[0.15em] uppercase text-[#6C6863]">
              <span>Direct Jobsite Logistics</span>
              <button
                onClick={() => onOpenQuoteModal({ material: `${meta.title} (${categoryTitle})` })}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#1A1A1A] py-1 border-b border-[#1A1A1A] hover:text-amber-800 hover:border-amber-800 transition-colors cursor-pointer"
              >
                <span>Request Custom Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Understated Editorial Spec Row: Hairline separated, zero SaaS boxes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#8C827A] block font-sans">
                Physical Hardness
              </span>
              <span className="text-lg sm:text-xl font-serif text-[#1A1A1A] mt-1.5 block">
                {meta.metrics.hardness}
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#8C827A] block font-sans">
                Thermal Tolerance
              </span>
              <span className="text-lg sm:text-xl font-serif text-[#1A1A1A] mt-1.5 block">
                {meta.metrics.heatTolerance}
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#8C827A] block font-sans">
                Absorption Barrier
              </span>
              <span className="text-lg sm:text-xl font-serif text-[#1A1A1A] mt-1.5 block">
                {meta.metrics.porosity}
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#8C827A] block font-sans">
                Wholesale Valuation
              </span>
              <span className="text-lg sm:text-xl font-serif text-[#1A1A1A] mt-1.5 block">
                {meta.metrics.avgPrice}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Editorial Palette Filter Bar */}
      <section className="py-5 border-b border-[#1A1A1A]/10 bg-[#FAF8F5]">
        <div className="max-w-[1680px] mx-auto px-6 md:px-12 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.2em] font-sans">
            <span className="text-[#8C827A] font-medium">Palette:</span>
            {PALETTES.map((pal) => {
              const isSelected = selectedPalette === pal.id;
              return (
                <button
                  key={pal.id}
                  onClick={() => setSelectedPalette(pal.id)}
                  className={`relative py-1 transition-colors cursor-pointer ${
                    isSelected
                      ? 'text-[#1A1A1A] font-medium'
                      : 'text-[#6C6863] hover:text-[#1A1A1A]'
                  }`}
                >
                  <span>{pal.label}</span>
                  {isSelected && (
                    <motion.div
                      layoutId="activePaletteLine"
                      className="absolute bottom-0 left-0 right-0 h-px bg-[#1A1A1A]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-xs font-sans tracking-wider text-[#6C6863]">
            <span>{filteredProducts.length} surfaces available</span>
          </div>
        </div>
      </section>

      {/* 5. Product Grid Showcase */}
      <section className="py-16 md:py-24 max-w-[1680px] mx-auto px-6 md:px-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-white border border-[#1A1A1A]/10 p-8">
            <p className="text-lg font-serif text-[#6C6863]">No stones match the selected palette filter.</p>
            <button
              onClick={() => setSelectedPalette('all')}
              className="mt-4 px-6 py-2.5 bg-[#1A1A1A] text-white text-xs uppercase tracking-widest cursor-pointer"
            >
              Reset Palette Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col bg-white border border-[#1A1A1A]/10 transition-all duration-300 hover:border-[#1A1A1A] hover:shadow-xl"
              >
                {/* Visual Preview */}
                <div
                  onClick={() => setActiveProduct(product)}
                  className="relative aspect-[4/3] w-full overflow-hidden bg-[#ECE8E1] cursor-pointer"
                >
                  <Image
                    src={product.slabImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="px-4 py-2 bg-white text-[#1A1A1A] text-xs uppercase tracking-widest font-sans shadow-md flex items-center gap-2 font-medium">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Inspect Surface</span>
                    </span>
                  </div>
                </div>

                {/* Information Body */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-sans uppercase tracking-[0.2em] text-[#8C827A]">
                      <span>{product.material}</span>
                      <span>{product.thickness}</span>
                    </div>
                    <h3
                      onClick={() => setActiveProduct(product)}
                      className="mt-2 text-2xl font-serif font-normal text-[#1A1A1A] cursor-pointer hover:text-amber-800 transition-colors"
                    >
                      {product.name}
                    </h3>
                    <p className="mt-3 text-xs sm:text-sm text-[#6C6863] line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#1A1A1A]/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C827A] block font-sans">
                        Wholesale Rate · {product.finish}
                      </span>
                      <span className="text-lg font-serif text-[#1A1A1A] font-medium">
                        {product.priceEstimate}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenQuoteModal({ material: `${product.name} (${product.material})` });
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-[11px] uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer"
                    >
                      <span>Get Quote</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. Product Detail Inspection Modal */}
      <AnimatePresence>
        {activeProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-y-auto bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-5xl bg-[#FAF8F5] text-[#1A1A1A] shadow-2xl border border-[#1A1A1A]/20 overflow-hidden my-auto"
            >
              <button
                onClick={() => setActiveProduct(null)}
                className="absolute top-5 right-5 z-20 p-2 bg-white/80 hover:bg-white text-[#1A1A1A] transition-colors rounded-full shadow-sm cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
                {/* Media Column (7 cols) */}
                <div className="lg:col-span-7 bg-black flex flex-col justify-between">
                  <div className="relative aspect-[4/3] w-full bg-[#111]">
                    <Image
                      src={viewMode === 'slab' ? activeProduct.slabImage : activeProduct.roomImage}
                      alt={activeProduct.name}
                      fill
                      priority
                      className="object-cover"
                    />
                  </div>

                  {/* Toggle between Full Slab vs Room Application */}
                  <div className="p-4 bg-[#1A1714] border-t border-white/10 flex items-center justify-between text-xs font-mono text-white">
                    <span className="uppercase tracking-wider opacity-60">Inspection View</span>
                    <div className="flex items-center divide-x divide-white/20 border border-white/20">
                      <button
                        onClick={() => setViewMode('slab')}
                        className={`px-3 py-1.5 transition-colors cursor-pointer uppercase tracking-wider ${
                          viewMode === 'slab' ? 'bg-white text-[#1A1A1A] font-bold' : 'hover:bg-white/10'
                        }`}
                      >
                        Full Slab Texture
                      </button>
                      <button
                        onClick={() => setViewMode('room')}
                        className={`px-3 py-1.5 transition-colors cursor-pointer uppercase tracking-wider ${
                          viewMode === 'room' ? 'bg-white text-[#1A1A1A] font-bold' : 'hover:bg-white/10'
                        }`}
                      >
                        Room Application
                      </button>
                    </div>
                  </div>
                </div>

                {/* Details Column (5 cols) */}
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-[#FAF8F5]">
                  <div>
                    <div className="text-[10px] uppercase font-mono tracking-[0.25em] text-amber-800">
                      {activeProduct.material} · {categoryTitle}
                    </div>
                    <h3 className="text-3xl font-serif text-[#1A1A1A] mt-2">
                      {activeProduct.name}
                    </h3>
                    <div className="text-xl font-serif font-semibold text-[#1A1A1A] mt-2">
                      {activeProduct.priceEstimate}
                    </div>
                    <p className="text-xs text-[#6C6863] mt-3 leading-relaxed">
                      {activeProduct.description}
                    </p>

                    {/* Technical Specifications */}
                    <div className="mt-6 pt-6 border-t border-[#1A1A1A]/10 space-y-2.5 text-xs font-mono">
                      <div className="flex justify-between py-1 border-b border-[#1A1A1A]/5">
                        <span className="text-[#6C6863]">Thickness</span>
                        <span className="font-semibold text-[#1A1A1A]">{activeProduct.thickness}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#1A1A1A]/5">
                        <span className="text-[#6C6863]">Available Dimensions</span>
                        <span className="font-semibold text-[#1A1A1A] text-right">
                          {activeProduct.dimensions.join(' · ')}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#1A1A1A]/5">
                        <span className="text-[#6C6863]">Surface Finish</span>
                        <span className="font-semibold text-[#1A1A1A]">{activeProduct.finish}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#1A1A1A]/5">
                        <span className="text-[#6C6863]">Hardness Rating</span>
                        <span className="font-semibold text-[#1A1A1A]">{activeProduct.specs.hardness}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#1A1A1A]/5">
                        <span className="text-[#6C6863]">Porosity</span>
                        <span className="font-semibold text-emerald-800">{activeProduct.specs.waterAbsorption}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#1A1A1A]/5">
                        <span className="text-[#6C6863]">Heat Resistance</span>
                        <span className="font-semibold text-amber-800">{activeProduct.specs.thermalRating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-[#1A1A1A]/10">
                    <button
                      onClick={() => {
                        const name = activeProduct.name;
                        setActiveProduct(null);
                        onOpenQuoteModal({ material: `${name} (${activeProduct.material})` });
                      }}
                      className="w-full py-3 bg-[#1A1A1A] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer text-center"
                    >
                      Request Itemized Quote
                    </button>
                    <button
                      onClick={() => {
                        const name = activeProduct.name;
                        setActiveProduct(null);
                        onOpenBookCall({
                          material: `${name} (${activeProduct.material})`,
                          service: `${categoryTitle} Consultation`,
                        });
                      }}
                      className="w-full py-3 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#F2EFE9] text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer text-center"
                    >
                      Book Free Consultation
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
