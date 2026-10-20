'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, Layers, ArrowRight, ShieldCheck, Box } from 'lucide-react';

interface CoordinatedPairing {
  id: string;
  theme: string;
  countertopName: string;
  countertopImage: string;
  tileName: string;
  tileImage: string;
  vibe: string;
  bundlePrice: string;
  savings: string;
}

const PAIRINGS: CoordinatedPairing[] = [
  {
    id: 'tuscan-villa',
    theme: 'The Italian Villa Elegance',
    countertopName: 'Calacatta Gold Supreme Quartz (3cm)',
    countertopImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    tileName: 'Artisan Zellige Glazed Terracotta Subway',
    tileImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    vibe: 'Warm honey veins reflecting off pearlescent, undulating handmade tiles.',
    bundlePrice: '$78 / combined sq.ft',
    savings: 'Save 15% as Coordinated Package',
  },
  {
    id: 'nordic-sanctuary',
    theme: 'The Nordic Sculptural Sanctuary',
    countertopName: 'Mont Blanc Dolomitic Quartzite',
    countertopImage: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    tileName: 'Fluted Architectural 3D Reeded Marble',
    tileImage: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
    vibe: 'Architectural vertical reeding paired with serene alpine white stone.',
    bundlePrice: '$94 / combined sq.ft',
    savings: 'Save $650 on Backsplash Installation',
  },
  {
    id: 'parisian-noir',
    theme: 'The Parisian High Noir',
    countertopName: 'Nero Marquina Grand Noir Marble',
    countertopImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    tileName: 'Volcanic Basalt Matte Chevron Mesh',
    tileImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
    vibe: 'Dramatic obsidian depths accented with Parisian sharp angles and brass fixtures.',
    bundlePrice: '$89 / combined sq.ft',
    savings: 'Free Laser Templating Included',
  },
  {
    id: 'coastal-organic',
    theme: 'The Coastal Organic Minimalist',
    countertopName: 'Taj Mahal Exotic Brazilian Quartzite',
    countertopImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    tileName: 'Venetian Micro-Aggregate Terrazzo Bianco',
    tileImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    vibe: 'Bulletproof heat resistance with European terrazzo mid-century character.',
    bundlePrice: '$92 / combined sq.ft',
    savings: 'Save $820 Bundle Credit',
  },
];

interface SlabTilePairingsProps {
  onBookCallForPairing: (theme: string) => void;
  onOrderSampleBox: (theme: string) => void;
}

export function SlabTilePairings({ onBookCallForPairing, onOrderSampleBox }: SlabTilePairingsProps) {
  return (
    <section id="pairings" className="py-24 relative bg-stone-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c59f60]/10 border border-[#c59f60]/30 text-xs font-semibold text-[#fce6bb] mb-3">
            <Layers className="w-3.5 h-3.5 text-[#c59f60]" />
            <span>Coordinated Surfaces Collection</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
            Curated Countertop & Tile Pairings
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3">
            Avoid clashing tones. Our architectural designers pair matching slab countertops with complementary backsplash tiles for a seamless, designer-grade finished look.
          </p>
        </div>

        {/* 2x2 Grid of Pairings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {PAIRINGS.map((p) => (
            <div
              key={p.id}
              className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-800 hover:border-[#c59f60]/40 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between space-y-6"
            >
              <div>
                {/* Theme Header */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                    {p.theme}
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 shrink-0">
                    {p.savings}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {p.vibe}
                </p>

                {/* Side-by-Side Visual Showcase */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {/* Countertop */}
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-700/80 group">
                    <Image
                      src={p.countertopImage}
                      alt={p.countertopName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-2 inset-x-2 text-[11px] font-bold text-white leading-tight">
                      <div className="text-[9px] text-[#fce6bb] uppercase font-semibold">Countertop Slab</div>
                      {p.countertopName}
                    </div>
                  </div>

                  {/* Matching Tile */}
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-700/80 group">
                    <Image
                      src={p.tileImage}
                      alt={p.tileName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-2 inset-x-2 text-[11px] font-bold text-white leading-tight">
                      <div className="text-[9px] text-[#fce6bb] uppercase font-semibold">Backsplash Tile</div>
                      {p.tileName}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Turnkey Bundle:</div>
                  <div className="text-base font-bold text-white">{p.bundlePrice}</div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => onOrderSampleBox(p.theme)}
                    className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition"
                  >
                    <Box className="w-3.5 h-3.5 text-[#c59f60]" />
                    <span>Free Sample Box</span>
                  </button>

                  <button
                    onClick={() => onBookCallForPairing(p.theme)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg bg-[#c59f60] hover:bg-[#b0894b] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition shadow-md shadow-[#c59f60]/20"
                  >
                    <span>Book Call</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
