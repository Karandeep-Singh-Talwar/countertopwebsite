'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, SlidersHorizontal, Flame, Droplets, Check, ArrowUpRight, Phone, Eye } from 'lucide-react';
import { SLAB_PRODUCTS, SlabProduct } from '@/data/stone-data';

interface MaterialCatalogProps {
  onSelectSlabForCall: (slabName: string) => void;
  onOpenQuickView: (slab: SlabProduct) => void;
}

export function MaterialCatalog({ onSelectSlabForCall, onOpenQuickView }: MaterialCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeColor, setActiveColor] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const categories = ['All', 'Quartz', 'Quartzite', 'Marble', 'Granite', 'Porcelain'];
  const colors = [
    { id: 'all', label: 'All Colors', dot: 'bg-gradient-to-r from-white via-amber-200 to-black' },
    { id: 'white', label: 'White & Cream', dot: 'bg-white' },
    { id: 'beige', label: 'Warm Beige', dot: 'bg-amber-100' },
    { id: 'gray', label: 'Architectural Gray', dot: 'bg-slate-400' },
    { id: 'black', label: 'Noir & Black', dot: 'bg-neutral-900' },
    { id: 'gold', label: 'Gold & Veined', dot: 'bg-amber-400' },
    { id: 'green', label: 'Emerald Green', dot: 'bg-emerald-600' },
  ];

  const filteredSlabs = useMemo(() => {
    return SLAB_PRODUCTS.filter((slab) => {
      const matchesCat = activeCategory === 'All' || slab.category === activeCategory;
      const matchesColor = activeColor === 'all' || slab.colorGroup === activeColor;
      const matchesSearch =
        slab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slab.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slab.origin.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesColor && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerSqFt - b.pricePerSqFt;
      if (sortBy === 'price-desc') return b.pricePerSqFt - a.pricePerSqFt;
      return 0;
    });
  }, [activeCategory, activeColor, searchQuery, sortBy]);

  return (
    <section id="catalog" className="py-24 relative bg-[#0b0f15]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c59f60]/10 border border-[#c59f60]/30 text-xs font-semibold text-[#fce6bb] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#c59f60]" />
              <span>Direct Mill Sourced Inventory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
              Curated Architectural Slabs
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
              From rare Italian Calacatta to diamond-hard Brazilian Quartzite. Each slab is hand-selected for unique crystalline structure and dramatic veining.
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search slabs, origins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#c59f60]"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-[#c59f60]"
            >
              <option value="featured">Sort: Featured Slabs</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar border-b border-slate-800/80">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeCategory === cat
                  ? 'bg-[#c59f60] text-black shadow-lg shadow-[#c59f60]/20'
                  : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Color Palette Filters (Inspired by Daltile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          <span className="text-xs text-slate-400 font-medium mr-2 flex items-center gap-1.5 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#c59f60]" /> Filter Color:
          </span>
          {colors.map((color) => {
            const isSelected = activeColor === color.id;
            return (
              <button
                key={color.id}
                onClick={() => setActiveColor(color.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition flex items-center gap-2 border ${
                  isSelected
                    ? 'border-[#c59f60] bg-[#c59f60]/10 text-white ring-1 ring-[#c59f60]'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full border border-white/20 ${color.dot}`} />
                <span>{color.label}</span>
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        {filteredSlabs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSlabs.map((slab) => (
              <motion.div
                key={slab.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="group relative rounded-2xl overflow-hidden glass-panel border border-slate-800 hover:border-[#c59f60]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#c59f60]/10 flex flex-col justify-between"
              >
                <div>
                  {/* Slab Image Container with interactive zoom */}
                  <div className="relative aspect-[16/11] overflow-hidden bg-slate-950">
                    <Image
                      src={slab.image}
                      alt={slab.name}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151b23] via-transparent to-black/30 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-bold text-[#fce6bb] uppercase tracking-wider">
                        {slab.category}
                      </span>
                      {slab.trending && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-bold text-amber-300">
                          Trending
                        </span>
                      )}
                      {slab.newArrival && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-bold text-emerald-300">
                          New Quarry
                        </span>
                      )}
                    </div>

                    {/* Quick View Button on Hover */}
                    <button
                      onClick={() => onOpenQuickView(slab)}
                      className="absolute bottom-3 right-3 z-10 px-3 py-1.5 rounded-lg bg-black/80 hover:bg-[#c59f60] hover:text-black backdrop-blur-md border border-white/20 text-xs font-semibold text-white transition flex items-center gap-1.5 shadow-lg"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Slab</span>
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <div className="text-[11px] text-slate-400 font-medium">{slab.origin}</div>
                    <h3 className="text-xl font-serif font-bold text-white mt-1 group-hover:text-[#fce6bb] transition">
                      {slab.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {slab.description}
                    </p>

                    {/* Spec Indicators */}
                    <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        <span>{slab.finish}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-blue-400" />
                        <span>{slab.thickness}</span>
                      </span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> In Stock
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Pricing & CTA */}
                <div className="p-6 pt-0">
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Factory Direct:</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-serif font-bold text-white">
                          ${slab.pricePerSqFt}
                        </span>
                        <span className="text-xs text-slate-400">/ sq.ft</span>
                        {slab.originalPrice && (
                          <span className="text-xs text-slate-500 line-through">
                            ${slab.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectSlabForCall(slab.name)}
                      className="px-3.5 py-2.5 rounded-lg bg-[#c59f60] hover:bg-[#b0894b] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition shadow-md shadow-[#c59f60]/20"
                    >
                      <span>Book Call</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-sm">No stone slabs found matching your filter criteria.</p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setActiveColor('all');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
