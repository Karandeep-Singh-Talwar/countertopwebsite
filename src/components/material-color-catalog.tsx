'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Calendar, 
  Mail, 
  Eye, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Clock, 
  ChevronRight,
  Filter,
  X
} from 'lucide-react';
import { 
  CATALOG_PRODUCTS, 
  MATERIAL_METAS, 
  MaterialColorItem,
  MaterialMeta 
} from '@/data/material-catalog-data';
import { Card3DTilt } from '@/components/card-3d-tilt';

interface MaterialColorCatalogProps {
  initialMaterialType?: string;
  onBackToMaterials: () => void;
  onOpenBookCall: (opts?: { material?: string; service?: string }) => void;
  onOpenQuoteModal: (opts?: { material?: string }) => void;
  onLaunchVisualizer: (materialName?: string) => void;
}

export function MaterialColorCatalog({
  initialMaterialType = 'quartz',
  onBackToMaterials,
  onOpenBookCall,
  onOpenQuoteModal,
  onLaunchVisualizer,
}: MaterialColorCatalogProps) {
  // Normalize material type
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(() => {
    const raw = initialMaterialType.toLowerCase().replace(/\s+/g, '-');
    if (MATERIAL_METAS[raw]) return raw;
    if (raw.includes('quartzite')) return 'natural-quartzite';
    if (raw.includes('quartz')) return 'quartz';
    if (raw.includes('marble')) return 'marble';
    if (raw.includes('granite')) return 'granite';
    if (raw.includes('porcelain') && raw.includes('tile')) return 'porcelain-tile';
    if (raw.includes('porcelain')) return 'porcelain';
    if (raw.includes('zellige')) return 'zellige';
    if (raw.includes('backsplash')) return 'backsplash';
    if (raw.includes('fluted')) return 'fluted-tile';
    if (raw.includes('soapstone')) return 'soapstone';
    return 'quartz';
  });

  const [selectedColorFilter, setSelectedColorFilter] = useState<string>('all');
  const [selectedFinishFilter, setSelectedFinishFilter] = useState<string>('all');
  const [activeQuickViewItem, setActiveQuickViewItem] = useState<MaterialColorItem | null>(null);

  const currentMeta: MaterialMeta = MATERIAL_METAS[selectedMaterialId] || MATERIAL_METAS['quartz'];

  // All available materials for tab switcher
  const materialList = useMemo(() => Object.values(MATERIAL_METAS), []);

  // Filter products by material & active filters
  const filteredProducts = useMemo(() => {
    let list = CATALOG_PRODUCTS.filter(p => p.materialType === selectedMaterialId);
    
    // If fewer than 2 items exist for a rare category, fallback to showing category items or quartz
    if (list.length === 0) {
      list = CATALOG_PRODUCTS.filter(p => p.materialType === 'quartz');
    }

    if (selectedColorFilter !== 'all') {
      list = list.filter(p => p.colorCategory === selectedColorFilter);
    }

    if (selectedFinishFilter !== 'all') {
      list = list.filter(p => p.finish.toLowerCase().includes(selectedFinishFilter.toLowerCase()));
    }

    return list;
  }, [selectedMaterialId, selectedColorFilter, selectedFinishFilter]);

  // Unique colors in this material for pills
  const availableColors = useMemo(() => {
    const list = CATALOG_PRODUCTS.filter(p => p.materialType === selectedMaterialId);
    const set = new Set(list.map(p => p.colorCategory));
    return [
      { id: 'all', label: 'All Colors', hex: '#18181b', count: list.length },
      ...(set.has('white') ? [{ id: 'white', label: 'White & Cream', hex: '#f8f6f0', count: list.filter(p => p.colorCategory === 'white').length }] : []),
      ...(set.has('gray') ? [{ id: 'gray', label: 'Gray & Concrete', hex: '#9ca3af', count: list.filter(p => p.colorCategory === 'gray').length }] : []),
      ...(set.has('black') ? [{ id: 'black', label: 'Black & Noir', hex: '#18181b', count: list.filter(p => p.colorCategory === 'black').length }] : []),
      ...(set.has('beige') ? [{ id: 'beige', label: 'Beige & Sand', hex: '#d7c4b7', count: list.filter(p => p.colorCategory === 'beige').length }] : []),
      ...(set.has('green') ? [{ id: 'green', label: 'Green & Emerald', hex: '#14532d', count: list.filter(p => p.colorCategory === 'green').length }] : []),
    ];
  }, [selectedMaterialId]);

  return (
    <section id="material-catalog" className="py-12 bg-white min-h-[800px] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Mobbin-Style Header: Back Button & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <button
            onClick={onBackToMaterials}
            className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-black hover:text-gray-600 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to All Materials</span>
          </button>

          <div className="flex items-center gap-2 text-[11px] font-medium tracking-wider uppercase text-gray-500">
            <span>Surfaces</span>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span>{currentMeta.category === 'countertops' ? 'Countertops & Slabs' : 'Architectural Tiles'}</span>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-black font-bold">{currentMeta.name}</span>
          </div>
        </div>

        {/* 2. Horizontal Material Switcher Bar */}
        <div className="py-4 overflow-x-auto no-scrollbar flex items-center gap-2 border-b border-gray-100">
          <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mr-2 shrink-0">
            Switch Surface:
          </span>
          {materialList.map((m) => {
            const isActive = m.id === selectedMaterialId;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedMaterialId(m.id);
                  setSelectedColorFilter('all');
                  setSelectedFinishFilter('all');
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap uppercase tracking-wider transition rounded-none cursor-pointer border ${
                  isActive
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-400 hover:bg-white'
                }`}
              >
                {m.name}
              </button>
            );
          })}
        </div>

        {/* 3. Material Editorial Banner with Specs Bar */}
        <div className="pt-8 pb-10">
          <div className="max-w-3xl">
            <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400 mb-2">
              FACTORY DIRECT INVENTORY • LIVE SLAB SELECTION
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-light tracking-[0.16em] uppercase text-black">
              {currentMeta.headline}
            </h1>
            <div className="w-12 h-[2px] bg-black mt-3 mb-4" />
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
              {currentMeta.description}
            </p>
          </div>

          {/* Quick Technical Specs Pills (Mobbin design pattern) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-gray-100">
            <div className="p-3 bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-black" />
                <span>Hardness</span>
              </div>
              <div className="text-xs font-semibold text-black mt-1">
                {currentMeta.specs.hardness}
              </div>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Porosity</span>
              </div>
              <div className="text-xs font-semibold text-black mt-1">
                {currentMeta.specs.porosity}
              </div>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-black" />
                <span>Maintenance</span>
              </div>
              <div className="text-xs font-semibold text-black mt-1">
                {currentMeta.specs.maintenance}
              </div>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-black" />
                <span>Heat Safe</span>
              </div>
              <div className="text-xs font-semibold text-black mt-1">
                {currentMeta.specs.heatTolerance}
              </div>
            </div>

            <div className="p-3 bg-black text-white border border-black col-span-2 sm:col-span-1">
              <div className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">
                Turnkey Install
              </div>
              <div className="text-xs font-bold text-white mt-1">
                {currentMeta.specs.leadTime}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Mobbin-Style Color & Finish Filter Bar */}
        <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-md py-4 border-y border-gray-200 mb-8 flex flex-wrap items-center justify-between gap-4">
          {/* Color Swatch Filters */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mr-1 hidden sm:inline">
              Filter Color:
            </span>
            {availableColors.map((color) => {
              const isSelected = selectedColorFilter === color.id;
              return (
                <button
                  key={color.id}
                  onClick={() => setSelectedColorFilter(color.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold transition cursor-pointer border ${
                    isSelected
                      ? 'border-black bg-black text-white shadow-sm'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {color.id !== 'all' && (
                    <span
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.hex }}
                    />
                  )}
                  <span>{color.label}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                    ({color.count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Results count & reset */}
          <div className="flex items-center gap-4 text-xs">
            <span className="text-gray-500 font-medium">
              Showing <strong className="text-black">{filteredProducts.length}</strong> colors
            </span>
            {(selectedColorFilter !== 'all' || selectedFinishFilter !== 'all') && (
              <button
                onClick={() => {
                  setSelectedColorFilter('all');
                  setSelectedFinishFilter('all');
                }}
                className="text-[11px] font-bold uppercase tracking-wider text-black underline underline-offset-2 hover:text-gray-500 cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* 5. Mobbin Product Grid of Stone Colors */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 border border-gray-200">
            <p className="text-sm text-gray-600">No stone colors found matching the selected filter.</p>
            <button
              onClick={() => {
                setSelectedColorFilter('all');
                setSelectedFinishFilter('all');
              }}
              className="mt-4 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider"
            >
              View All Colors
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((item) => (
              <Card3DTilt
                key={item.id}
                maxTilt={6}
                scale={1.015}
                className="h-full"
              >
                <div
                  className="h-full bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Image Container with Hover Zoom & Badges */}
                  <div
                    className="relative aspect-[4/3] bg-gray-100 overflow-hidden cursor-pointer"
                    style={{ position: 'relative' }}
                    onClick={() => setActiveQuickViewItem(item)}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      loading="eager"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                      {item.badge && (
                        <span className="px-2 py-0.5 bg-black text-white text-[9px] font-bold uppercase tracking-wider">
                          {item.badge}
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-white/95 text-black text-[9px] font-semibold uppercase tracking-wider border border-gray-200">
                        {item.thickness}
                      </span>
                    </div>

                    {/* Quick-view Eye overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <span className="px-3.5 py-1.5 bg-white text-black text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Slab</span>
                      </span>
                    </div>

                    {/* Bottom Swatch Preview */}
                    <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 bg-black/75 backdrop-blur-sm px-2.5 py-1 text-white text-[10px]">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/50"
                        style={{ backgroundColor: item.colorHex }}
                      />
                      <span>{item.colorLabel}</span>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base sm:text-lg font-sans font-bold tracking-wide uppercase text-black leading-snug">
                          {item.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1">
                        <span>{item.finish}</span>
                        <span>•</span>
                        <span>{item.slabSize}</span>
                      </div>

                      <p className="text-xs text-gray-600 mt-2.5 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Pricing Row */}
                    <div className="pt-3 border-t border-gray-100 flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] uppercase text-gray-400 block font-medium">Turnkey Installed:</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-bold font-serif text-black">
                            ${item.pricePerSqFt}
                          </span>
                          <span className="text-xs text-gray-500">/ sq.ft</span>
                          {item.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">
                              ${item.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => onLaunchVisualizer(item.name)}
                        className="text-[11px] font-bold uppercase tracking-wider text-black hover:underline transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-black" />
                        <span>3D Preview</span>
                      </button>
                    </div>

                    {/* Dual Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => onOpenBookCall({ material: item.name, service: `${currentMeta.name} Installation` })}
                        className="w-full py-2.5 bg-black text-white hover:bg-neutral-800 text-[11px] font-bold uppercase tracking-wider transition flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                      >
                        <Calendar className="w-3 h-3" />
                        <span>Book Call</span>
                      </button>

                      <button
                        onClick={() => onOpenQuoteModal({ material: item.name })}
                        className="w-full py-2.5 bg-white text-black hover:bg-gray-100 border border-gray-300 text-[11px] font-bold uppercase tracking-wider transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Mail className="w-3 h-3" />
                        <span>Quote</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Card3DTilt>
            ))}
          </div>
        )}

        {/* Floating Quick Consultation Dock for High-Intent Visitors */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-black/90 backdrop-blur-md text-white px-5 py-3 border border-white/20 shadow-2xl flex items-center gap-4 max-w-lg w-[92%] sm:w-auto justify-between">
          <div className="hidden sm:block text-left">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#c59f60]">Direct Sourcing Guarantee</div>
            <div className="text-xs font-semibold text-white">Specifying {currentMeta.name} for your project?</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenBookCall({ service: `${currentMeta.name} Specification Call` })}
              className="px-4 py-1.5 bg-white text-black hover:bg-[#c59f60] hover:text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shadow"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Call</span>
            </button>
            <button
              onClick={() => onOpenQuoteModal({ material: currentMeta.name })}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider border border-white/20 transition cursor-pointer"
            >
              Quote
            </button>
          </div>
        </div>

        {/* 6. Bottom Inquiry Card (Mobbin Conversion Anchor) */}
        <div className="mt-16 p-8 bg-black text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
              NEED A CUSTOM SLAB OR VEIN-MATCHING?
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Consult with a {currentMeta.name} Surface Specialist
            </h3>
            <p className="text-xs text-gray-300 mt-1 max-w-xl">
              Our master fabricators provide high-definition laser templating, bookmatched waterfall island layout proofs, and factory-direct pricing with zero markup.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenBookCall({ service: `${currentMeta.name} Custom Sourcing` })}
              className="px-6 py-3 bg-white text-black hover:bg-gray-200 text-xs font-bold uppercase tracking-wider transition shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Free Call</span>
            </button>
            <button
              onClick={() => onOpenQuoteModal({ material: currentMeta.name })}
              className="px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold uppercase tracking-wider border border-white/20 transition cursor-pointer"
            >
              Request Price List
            </button>
          </div>
        </div>
      </div>

      {/* 7. Quick-View Slab Inspector Modal */}
      {activeQuickViewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white border border-black shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setActiveQuickViewItem(null)}
              className="absolute top-4 right-4 p-2 text-black hover:bg-gray-100 transition z-20 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden border border-gray-200">
                <Image
                  src={activeQuickViewItem.image}
                  alt={activeQuickViewItem.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {currentMeta.name} • {activeQuickViewItem.slabSize}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-black mt-1">
                    {activeQuickViewItem.name}
                  </h3>
                  <div className="text-xs text-emerald-700 font-semibold mt-1">
                    {activeQuickViewItem.badge || 'Factory Direct Sourcing'}
                  </div>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed">
                  {activeQuickViewItem.description}
                </p>

                <div className="p-3 bg-gray-50 border border-gray-200 space-y-1 text-xs text-gray-700">
                  <div><strong>Finish:</strong> {activeQuickViewItem.finish}</div>
                  <div><strong>Thickness:</strong> {activeQuickViewItem.thickness}</div>
                  <div><strong>Veining:</strong> {activeQuickViewItem.veining}</div>
                  <div><strong>Best For:</strong> {activeQuickViewItem.bestFor}</div>
                </div>

                <div className="flex items-baseline justify-between pt-2">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase">Installed Estimate:</span>
                    <div className="text-2xl font-bold font-serif text-black">
                      ${activeQuickViewItem.pricePerSqFt} <span className="text-xs font-sans font-normal text-gray-500">/ sq.ft</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const slab = activeQuickViewItem.name;
                        setActiveQuickViewItem(null);
                        onOpenBookCall({ material: slab, service: `${slab} Consultation` });
                      }}
                      className="px-4 py-2.5 bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                    >
                      Book Call
                    </button>
                    <button
                      onClick={() => {
                        const slab = activeQuickViewItem.name;
                        setActiveQuickViewItem(null);
                        onLaunchVisualizer(slab);
                      }}
                      className="px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-black text-xs font-semibold uppercase tracking-wider border border-gray-300 transition cursor-pointer"
                    >
                      3D Room
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
