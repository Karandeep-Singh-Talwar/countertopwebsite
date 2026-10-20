'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

interface InCommonCollectionsProps {
  onSelectCollection: (colId: string) => void;
  onOpenQuoteModal: (opts?: { material?: string }) => void;
}

export function InCommonCollections({
  onSelectCollection,
  onOpenQuoteModal,
}: InCommonCollectionsProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  const collections = [
    {
      id: 'saga',
      name: 'Saga',
      series: 'Series 01',
      subtitle: 'Monolithic Quartzite & Sintered Stone',
      description: 'Massive, unyielding crystalline slabs quarried from bedrock formations in South America. Zero porosity and peerless heat resilience.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      sampleMaterial: 'Taj Mahal & Nero Marquina',
    },
    {
      id: 'curio',
      name: 'Curio',
      series: 'Series 02',
      subtitle: 'Artisanal Zellige & Terracotta',
      description: 'Handcrafted Moroccan clay glazed with botanical minerals and wood-fired in traditional brick kilns. Irregular, organic, and poetic.',
      image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1200&q=80',
      sampleMaterial: 'Snow Blanc & Olive Glazed Tile',
    },
    {
      id: 'core',
      name: 'Core',
      series: 'Series 03',
      subtitle: 'Italian Calacatta & Carrara Marble',
      description: 'Iconic Apuan Alpine marble with flowing charcoal and amber ribbons. Available in bookmatched mirror pairs for kitchen islands.',
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      sampleMaterial: 'Calacatta Gold Supreme',
    },
  ];

  return (
    <section id="collections-section" className="w-full bg-[#FAF8F5] py-20 md:py-28 border-b border-[#E8E4DC] text-[#1A1A1A]">
      <div className="max-w-[1680px] mx-auto px-6 md:px-12">
        {/* Split Grid matching In Common With */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column Label */}
          <div className="md:col-span-3 lg:col-span-2">
            <h2 className="text-[12px] uppercase tracking-[0.18em] font-normal text-[#1A1A1A]/70 sticky top-28">
              Collections
            </h2>
          </div>

          {/* Right Main Area */}
          <div className="md:col-span-9 lg:col-span-10">
            {/* Introductory Text */}
            <p className="text-[17px] sm:text-[19px] md:text-[21px] font-sans font-normal leading-[1.6] text-[#1A1A1A] max-w-3xl mb-14 tracking-[-0.01em]">
              Each of our curated surface collections bears its own distinct geological identity. Because each material requires specialized quarrying methods and honing techniques, they're not only visually unique—they're tonally and tactically diverse, as well.
            </p>

            {/* 3-Column Tall Vertical Image Cards matching In Common With */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {collections.map((col) => (
                <div
                  key={col.id}
                  onClick={() => onSelectCollection(col.id)}
                  className="group relative aspect-[3/5] sm:aspect-[4/6] w-full overflow-hidden bg-[#ECE8E1] cursor-pointer border border-[#E0DCD4] flex flex-col justify-end p-8"
                >
                  {/* Full-bleed background photo */}
                  <Image
                    src={col.image}
                    alt={col.name}
                    fill
                    className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105 filter brightness-[0.82]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 group-hover:from-black/90 transition-colors" />

                  {/* Overlaid Title matching In Common With typography */}
                  <div className="relative z-10 text-white">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-white/70 mb-2">
                      {col.series} • {col.subtitle}
                    </div>
                    <h3 className="text-4xl md:text-5xl font-serif italic font-light tracking-tight text-white mb-3">
                      {col.name}
                    </h3>
                    <p className="text-white/80 text-[13px] leading-relaxed line-clamp-3 mb-6 font-light opacity-90 group-hover:opacity-100 transition-opacity">
                      {col.description}
                    </p>

                    <div className="pt-4 border-t border-white/20 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-white/90 group-hover:text-amber-200 transition-colors">
                      <span>Explore {col.name} Series</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Carousel Controls Bar */}
            <div className="mt-12 flex items-center justify-end space-x-4">
              <button
                onClick={() => setActiveSlide((prev) => (prev > 0 ? prev - 1 : 2))}
                className="p-2 border border-[#D9D4CC] text-[#1A1A1A] hover:bg-black/5 transition-colors cursor-pointer"
                aria-label="Previous Collection"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveSlide((prev) => (prev < 2 ? prev + 1 : 0))}
                className="p-2 border border-[#D9D4CC] text-[#1A1A1A] hover:bg-black/5 transition-colors cursor-pointer"
                aria-label="Next Collection"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
