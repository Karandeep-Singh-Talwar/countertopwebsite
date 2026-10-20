'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, ArrowRight, Flame, Droplets, RefreshCw, Calendar, Phone } from 'lucide-react';

interface StoneOption {
  id: string;
  name: string;
  type: string;
  pricePerSqFt: number;
  heroImage: string;
  veinColor: string;
  heatRating: string;
  stainRating: string;
}

interface CabinetOption {
  id: string;
  name: string;
  colorHex: string;
  borderHex: string;
}

interface BacksplashOption {
  id: string;
  name: string;
  patternType: string;
  pricePerSqFt: number;
}

const STONES: StoneOption[] = [
  {
    id: 'calacatta-gold',
    name: 'Calacatta Gold Supreme Quartz',
    type: 'Engineered Quartz',
    pricePerSqFt: 68,
    heroImage: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1200&q=80',
    veinColor: '#d4af37',
    heatRating: 'Medium (Up to 300°F)',
    stainRating: 'Impervious (0% Porosity)',
  },
  {
    id: 'taj-mahal',
    name: 'Taj Mahal Brazilian Quartzite',
    type: 'Natural Hard Quartzite',
    pricePerSqFt: 88,
    heroImage: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80',
    veinColor: '#b0894b',
    heatRating: 'Extreme (600°F Direct Pans Safe)',
    stainRating: 'High (Natural Crystalline)',
  },
  {
    id: 'nero-marquina',
    name: 'Nero Marquina Grand Noir Marble',
    type: 'Spanish Natural Marble',
    pricePerSqFt: 79,
    heroImage: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    veinColor: '#ffffff',
    heatRating: 'High (450°F)',
    stainRating: 'Nano-Shield Sealed',
  },
  {
    id: 'bianco-carrara',
    name: 'Authentic Bianco Carrara C Marble',
    type: 'Italian Natural Marble',
    pricePerSqFt: 58,
    heroImage: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1200&q=80',
    veinColor: '#94a3b8',
    heatRating: 'High (Natural Stone)',
    stainRating: 'Perma-Shield Protected',
  },
  {
    id: 'dekton-laurent',
    name: 'Laurent Sintered Ultra-Porcelain',
    type: 'Ultra-Compact Architectural Slab',
    pricePerSqFt: 92,
    heroImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    veinColor: '#c59f60',
    heatRating: 'Extreme (Torch & Heat Safe 800°F+)',
    stainRating: 'Impervious',
  },
  {
    id: 'verde-alpi',
    name: 'Verde Alpi Emerald Marble',
    type: 'Italian Alps Serpentinite',
    pricePerSqFt: 96,
    heroImage: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
    veinColor: '#34d399',
    heatRating: 'High',
    stainRating: 'Artisan Sealed',
  },
];

const CABINETS: CabinetOption[] = [
  { id: 'white', name: 'Alabaster White', colorHex: '#f8fafc', borderHex: '#e2e8f0' },
  { id: 'walnut', name: 'Natural Oak / Walnut', colorHex: '#a07855', borderHex: '#785333' },
  { id: 'navy', name: 'Midnight Navy', colorHex: '#1e293b', borderHex: '#0f172a' },
  { id: 'charcoal', name: 'Slate Charcoal', colorHex: '#334155', borderHex: '#1e293b' },
];

const BACKSPLASHES: BacksplashOption[] = [
  { id: 'zellige', name: 'Artisan Zellige Subway', patternType: 'Handmade Glaze', pricePerSqFt: 18 },
  { id: 'fluted', name: 'Fluted 3D Reeded Marble', patternType: 'Architectural Vertical', pricePerSqFt: 24 },
  { id: 'chevron', name: 'Volcanic Basalt Chevron', patternType: 'Geometric Noir', pricePerSqFt: 22 },
  { id: 'full-slab', name: 'Full-Height Slab Backsplash', patternType: 'Continuous Bookmatch', pricePerSqFt: 45 },
];

interface SpaceVisualizerProps {
  onBookCallForDesign: (material: string, sqFt: number) => void;
}

export function SpaceVisualizer({ onBookCallForDesign }: SpaceVisualizerProps) {
  const [selectedStone, setSelectedStone] = useState<StoneOption>(STONES[0]);
  const [selectedCabinet, setSelectedCabinet] = useState<CabinetOption>(CABINETS[0]);
  const [selectedBacksplash, setSelectedBacksplash] = useState<BacksplashOption>(BACKSPLASHES[0]);
  const [hardware, setHardware] = useState<'gold' | 'black' | 'nickel'>('gold');

  const sqFt = 45;
  const countertopTotal = selectedStone.pricePerSqFt * sqFt;
  const backsplashTotal = selectedBacksplash.pricePerSqFt * 30;
  const grandTotal = countertopTotal + backsplashTotal + 380; // includes templating & install

  return (
    <section id="visualizer" className="py-20 bg-gray-50 border-t border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-black mb-2">
            DESIGN TOOLS &amp; 3D SIMULATION
          </div>
          <h2 className="text-2xl sm:text-4xl font-sans font-light tracking-[0.16em] uppercase text-black">
            INTERACTIVE ROOM VISUALIZER
          </h2>
          <div className="w-12 h-[2px] bg-black mx-auto mt-3 mb-4" />
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
            Test different countertop materials, cabinetry finishes, and backsplash tiles in real time. Get instant pricing transparency and lock in your consultation call.
          </p>
        </div>

        {/* Visualizer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 7 Cols Visualizer Stage */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="relative aspect-[16/11] bg-gray-900 overflow-hidden shadow-xl border border-gray-200"
              style={{ position: 'relative' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedStone.id}-${selectedCabinet.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                  style={{ position: 'relative' }}
                >
                  <Image
                    src={selectedStone.heroImage}
                    alt={selectedStone.name}
                    fill
                    className="object-cover object-center"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

                  {/* Overlays */}
                  <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white text-black text-xs font-bold uppercase tracking-wider shadow">
                      {selectedStone.name}
                    </span>
                    <span className="px-3 py-1 bg-black/80 text-white text-xs font-medium backdrop-blur-sm">
                      Cabinets: {selectedCabinet.name}
                    </span>
                  </div>

                  {/* Bottom bar inside canvas */}
                  <div className="absolute bottom-4 inset-x-4 z-10 p-3 bg-black/80 text-white backdrop-blur-sm flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[10px] text-gray-300 uppercase">Selected Countertop:</div>
                      <div className="font-bold text-white sm:text-sm">{selectedStone.name} (${selectedStone.pricePerSqFt}/sq.ft)</div>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-gray-300">
                      <span>{selectedStone.heatRating.split(' ')[0]} Heat</span>
                      <span>•</span>
                      <span>{selectedStone.stainRating}</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="p-3 bg-white border border-gray-200 text-xs text-gray-600 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-black" />
                <span>Simulated with 3cm thick eased edge &amp; laser accuracy</span>
              </span>
              <span className="font-bold text-black uppercase tracking-wider">Direct Mill Sourced</span>
            </div>
          </div>

          {/* Right: 5 Cols Controls */}
          <div className="lg:col-span-5 space-y-4">
            {/* 1. Stone Selector */}
            <div className="bg-white p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                <span className="text-xs font-bold uppercase tracking-wider text-black">
                  1. Select Countertop Stone
                </span>
                <span className="text-xs font-semibold text-gray-700">
                  ${selectedStone.pricePerSqFt}/sq.ft
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {STONES.map((stone) => {
                  const isSelected = selectedStone.id === stone.id;
                  return (
                    <button
                      key={stone.id}
                      onClick={() => setSelectedStone(stone)}
                      className={`p-2.5 text-left text-xs border transition flex items-center justify-between ${
                        isSelected
                          ? 'border-black bg-gray-50 ring-1 ring-black font-semibold text-black'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <div>
                        <div className="line-clamp-1">{stone.name}</div>
                        <div className="text-[10px] text-gray-500">${stone.pricePerSqFt}/sf</div>
                      </div>
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0 ml-1.5"
                        style={{ backgroundColor: stone.veinColor }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Cabinet Finish */}
            <div className="bg-white p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                <span className="text-xs font-bold uppercase tracking-wider text-black">
                  2. Cabinetry Finish
                </span>
                <span className="text-xs text-gray-500">{selectedCabinet.name}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {CABINETS.map((cab) => {
                  const isSelected = selectedCabinet.id === cab.id;
                  return (
                    <button
                      key={cab.id}
                      onClick={() => setSelectedCabinet(cab)}
                      className={`p-2 text-center border text-xs transition flex flex-col items-center gap-1.5 ${
                        isSelected
                          ? 'border-black bg-gray-50 ring-1 ring-black font-semibold text-black'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <span
                        className="w-6 h-6 border shadow-sm"
                        style={{ backgroundColor: cab.colorHex, borderColor: cab.borderHex }}
                      />
                      <span className="text-[10px] line-clamp-1">{cab.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Backsplash Tile */}
            <div className="bg-white p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                <span className="text-xs font-bold uppercase tracking-wider text-black">
                  3. Matching Backsplash Tile
                </span>
                <span className="text-xs text-gray-700 font-semibold">
                  +${selectedBacksplash.pricePerSqFt}/sq.ft
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {BACKSPLASHES.map((tile) => {
                  const isSelected = selectedBacksplash.id === tile.id;
                  return (
                    <button
                      key={tile.id}
                      onClick={() => setSelectedBacksplash(tile)}
                      className={`p-2 text-left text-xs border transition ${
                        isSelected
                          ? 'border-black bg-gray-50 ring-1 ring-black font-semibold text-black'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <div className="line-clamp-1">{tile.name}</div>
                      <div className="text-[10px] text-gray-500">${tile.pricePerSqFt}/sf</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Turnkey Pricing Box & Call Booking Action */}
            <div className="bg-black text-white p-6 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                    Estimated 45 Sq Ft Turnkey Package:
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-white">
                    ${grandTotal.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 bg-emerald-900 text-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                    Save ~30% Direct
                  </span>
                  <div className="text-[10px] text-gray-400 mt-1">Includes template &amp; install</div>
                </div>
              </div>

              <button
                onClick={() => onBookCallForDesign(selectedStone.name, sqFt)}
                className="w-full py-3.5 bg-white text-black hover:bg-[#c59f60] text-xs font-bold uppercase tracking-widest transition flex items-center justify-center gap-2 shadow"
              >
                <Calendar className="w-4 h-4" />
                <span>Lock In This Spec &amp; Book Free Call</span>
              </button>

              <div className="mt-3 text-center text-[10px] text-gray-400">
                Prefer to speak now? Call toll-free <strong className="text-white">(800) 584-STONE</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
