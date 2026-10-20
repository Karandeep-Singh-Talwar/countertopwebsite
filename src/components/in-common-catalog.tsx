'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

interface InCommonCatalogProps {
  onSelectCategory: (category: 'countertops' | 'tiles' | 'bespoke') => void;
  onOpenQuoteModal: (opts?: { material?: string }) => void;
  onOpenSwatches: () => void;
}

export function InCommonCatalog({
  onSelectCategory,
  onOpenQuoteModal,
  onOpenSwatches,
}: InCommonCatalogProps) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const categories = [
    {
      id: 'countertops',
      title: 'Countertops & Slabs',
      count: '48',
      description: 'Bookmatched Calacatta, honed Taj Mahal quartzite, engineered quartz, and ultracompact porcelain slabs.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      tag: 'Natural & Engineered',
      actionText: 'Explore Slabs',
    },
    {
      id: 'tiles',
      title: 'Architectural Tiles',
      count: '62',
      description: 'Artisanal Moroccan zellige, fluted Italian marble tile, terracotta subway, and textured micro-mosaics.',
      image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1200&q=80',
      tag: 'Handcrafted Surfaces',
      actionText: 'Explore Tiles',
    },
    {
      id: 'bespoke',
      title: 'Vanities & Hearths',
      count: '18',
      description: 'Integrated monolithic stone sinks, floating bathroom vanities, curved fireplace surrounds, and custom edges.',
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      tag: 'Custom Fabrication',
      actionText: 'View Fabrication',
    },
  ];

  return (
    <section id="catalog-section" className="w-full bg-[#FAF8F5] py-20 border-b border-[#E8E4DC] text-[#1A1A1A]">
      <div className="max-w-[1680px] mx-auto px-6 md:px-12">
        {/* Split Grid matching In Common With reference */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column Label */}
          <div className="md:col-span-3 lg:col-span-2">
            <h2 className="text-[12px] uppercase tracking-[0.18em] font-normal text-[#1A1A1A]/70 sticky top-28">
              Our Catalog
            </h2>
          </div>

          {/* Right Main Column */}
          <div className="md:col-span-9 lg:col-span-10">
            {/* Introductory Statement */}
            <p className="text-[17px] sm:text-[19px] md:text-[21px] font-sans font-normal leading-[1.6] text-[#1A1A1A] max-w-3xl mb-14 tracking-[-0.01em]">
              Since our founding, our architectural stone collection has grown to encompass hand-selected natural marbles, monolithic Brazilian quartzites, engineered quartz, and artisanal handcrafted zellige tiles—suitable for both bespoke residential sanctuaries and monumental commercial developments.
            </p>

            {/* 3-Card Grid matching In Common With */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {categories.map((cat, idx) => (
                <div
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id as any);
                    onOpenSwatches();
                  }}
                  className="group cursor-pointer flex flex-col"
                >
                  {/* Image Container with subtle hover zoom */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#EAE6DE] mb-5 border border-[#E8E4DC]">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-3.5 left-3.5 px-2.5 py-1 bg-black/40 backdrop-blur-md text-white text-[10px] uppercase tracking-wider">
                      {cat.tag}
                    </div>
                  </div>

                  {/* Title and Item Count */}
                  <div className="flex items-baseline justify-between pt-1">
                    <h3 className="text-[17px] font-normal text-[#1A1A1A] tracking-tight group-hover:text-amber-900 transition-colors flex items-center gap-1.5">
                      <span>{cat.title}</span>
                      <sup className="text-[11px] text-[#767168] font-mono">{cat.count}</sup>
                    </h3>
                  </div>

                  {/* Shop link */}
                  <div className="mt-2 text-[12px] uppercase tracking-wider text-[#767168] group-hover:text-[#1A1A1A] transition-colors flex items-center gap-1">
                    <span>{cat.actionText}</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Controls Bar matching In Common With */}
            <div className="mt-14 pt-8 border-t border-[#E8E4DC] flex items-center justify-between">
              <button
                onClick={onOpenSwatches}
                className="text-[12px] uppercase tracking-[0.16em] text-[#1A1A1A] hover:text-amber-900 transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>Shop All Surfaces & In-Page Colors</span>
                <span className="font-light">—</span>
              </button>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : 2))}
                  className="p-2 border border-[#D9D4CC] text-[#1A1A1A] hover:bg-black/5 transition-colors cursor-pointer"
                  aria-label="Previous Slide"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveSlideIndex((prev) => (prev < 2 ? prev + 1 : 0))}
                  className="p-2 border border-[#D9D4CC] text-[#1A1A1A] hover:bg-black/5 transition-colors cursor-pointer"
                  aria-label="Next Slide"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
