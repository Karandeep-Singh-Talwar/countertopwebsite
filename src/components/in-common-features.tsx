'use client';

import React from 'react';
import Image from 'next/image';
import { Calculator, Calendar, ArrowRight, ShieldCheck, Flame, Droplets } from 'lucide-react';

interface InCommonFeaturesProps {
  onOpenQuoteModal: (opts?: { material?: string }) => void;
  onOpenBookCall: (opts?: { material?: string; service?: string }) => void;
  onOpenSwatches: () => void;
}

export function InCommonFeatures({
  onOpenQuoteModal,
  onOpenBookCall,
  onOpenSwatches,
}: InCommonFeaturesProps) {
  return (
    <section className="w-full bg-[#FAF8F5] text-[#1A1A1A]">
      {/* ---------------- FEATURE 1: TAJ MAHAL QUARTZITE MONOLITH ---------------- */}
      <div className="border-b border-[#E8E4DC] py-16 md:py-24">
        <div className="max-w-[1680px] mx-auto px-6 md:px-12">
          {/* Top Badge matching In Common With */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#1A1A1A]"></span>
            <span className="text-[12px] uppercase tracking-[0.2em] font-medium text-[#1A1A1A]">
              Taj Mahal Satin Quartzite Monolith
            </span>
          </div>

          {/* Split Two-Column Layout matching In Common With */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Left Large Architectural Interior Image */}
            <div className="lg:col-span-8">
              <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[16/11] w-full overflow-hidden bg-[#ECE8E1] border border-[#E8E4DC]">
                <Image
                  src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=85"
                  alt="Architectural bathroom with wood paneling and Taj Mahal quartzite stone vanity"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>
            </div>

            {/* Right Column: Narrative + Inset Product Specimen Card */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-10 lg:pl-4">
              <div>
                <p className="text-[14px] sm:text-[15px] leading-relaxed text-[#1A1A1A]/85 font-normal tracking-wide">
                  A monolithic natural stone that brings its luminous crystalline depth and soft gold-umber veining to the fore. Designed for spaces of every style and scale, Taj Mahal pairs a tactile honed satin touch with extraordinary mineral density—impervious to heat, acid, scratching, and time.
                </p>

                <div className="mt-6 flex items-center gap-6 text-[12px] text-[#767168] uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-700" /> Heat Proof
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-blue-700" /> Non-Porous
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Lifetime Slabs
                  </span>
                </div>
              </div>

              {/* Floating Product Specimen Card matching In Common With inset box */}
              <div className="bg-[#EFECE6] p-8 border border-[#E0DCD4] flex flex-col">
                <div className="relative aspect-[4/3] w-full mb-6 overflow-hidden bg-white/70">
                  <Image
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                    alt="Taj Mahal Satin Quartzite slab detail"
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-black/60 text-white text-[9px] uppercase tracking-widest">
                    Quarried in Bahia, Brazil
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-[14px] uppercase tracking-[0.12em] font-medium text-[#1A1A1A]">
                    Taj Mahal Satin Quartzite
                  </h4>
                  <div className="text-[13px] text-[#767168] font-normal">
                    Turnkey Installed From $110.00 / sq ft
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-[#DED9D0] flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => onOpenQuoteModal({ material: 'Taj Mahal Satin Quartzite' })}
                    className="flex-1 py-3 px-4 bg-[#1A1A1A] hover:bg-black text-white text-[11px] uppercase tracking-[0.16em] text-center transition-colors cursor-pointer"
                  >
                    Request Quote
                  </button>
                  <button
                    onClick={() => onOpenBookCall({ material: 'Taj Mahal Satin Quartzite', service: 'Slab Viewing & Fabrication Consultation' })}
                    className="flex-1 py-3 px-4 border border-[#1A1A1A] hover:bg-black/5 text-[#1A1A1A] text-[11px] uppercase tracking-[0.16em] text-center transition-colors cursor-pointer"
                  >
                    Book Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- FEATURE 2: ARTISAN ZELLIGE TILE STORY ---------------- */}
      <div className="border-b border-[#E8E4DC] py-16 md:py-24">
        <div className="max-w-[1680px] mx-auto px-6 md:px-12">
          {/* Top Badge matching In Common With */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#1A1A1A]"></span>
            <span className="text-[12px] uppercase tracking-[0.2em] font-medium text-[#1A1A1A]">
              Artisan Moroccan Zellige Blanc Tile
            </span>
          </div>

          {/* Split Two-Column Layout matching In Common With */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Left Large Architectural Interior Image */}
            <div className="lg:col-span-8">
              <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[16/11] w-full overflow-hidden bg-[#ECE8E1] border border-[#E8E4DC]">
                <Image
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85"
                  alt="Modern bedroom suite with warm wood joinery and natural tile textures"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>
            </div>

            {/* Right Column: Narrative + Inset Product Specimen Card */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-10 lg:pl-4">
              <div>
                <p className="text-[14px] sm:text-[15px] leading-relaxed text-[#1A1A1A]/85 font-normal tracking-wide">
                  A handcrafted Moroccan clay tile whose surface resembles a floating texture grounded by traditional kilns. Made by manually pressing raw clay over press molds, each tile pairs a gentle undulating form with a raw, textured surface that is innately one-of-a-kind.
                </p>

                <div className="mt-6 flex items-center gap-6 text-[12px] text-[#767168] uppercase tracking-wider">
                  <span>Feathered Bevel Edge</span>
                  <span>•</span>
                  <span>Hand-Glazed Enamel</span>
                  <span>•</span>
                  <span>Fez, Morocco</span>
                </div>
              </div>

              {/* Floating Product Specimen Card */}
              <div className="bg-[#EFECE6] p-8 border border-[#E0DCD4] flex flex-col">
                <div className="relative aspect-[4/3] w-full mb-6 overflow-hidden bg-white/70">
                  <Image
                    src="https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=80"
                    alt="Artisan Zellige Blanc handcrafted tile detail"
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-black/60 text-white text-[9px] uppercase tracking-widest">
                    4×4 Artisanal Subway
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-[14px] uppercase tracking-[0.12em] font-medium text-[#1A1A1A]">
                    Artisan Zellige Blanc
                  </h4>
                  <div className="text-[13px] text-[#767168] font-normal">
                    From $18.50 / sq ft (Box of 25)
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-[#DED9D0] flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => onOpenQuoteModal({ material: 'Artisan Zellige Blanc Tile' })}
                    className="flex-1 py-3 px-4 bg-[#1A1A1A] hover:bg-black text-white text-[11px] uppercase tracking-[0.16em] text-center transition-colors cursor-pointer"
                  >
                    Sample Box
                  </button>
                  <button
                    onClick={() => onOpenBookCall({ material: 'Artisan Zellige Tile Package', service: 'Tile Layout & Backsplash Consultation' })}
                    className="flex-1 py-3 px-4 border border-[#1A1A1A] hover:bg-black/5 text-[#1A1A1A] text-[11px] uppercase tracking-[0.16em] text-center transition-colors cursor-pointer"
                  >
                    Book Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
