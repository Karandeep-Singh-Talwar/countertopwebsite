'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Hammer, CheckCircle2, Layers, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';

interface CategoriesOverviewProps {
  activeCategory: 'all' | 'porcelain-countertops' | 'stone-countertops' | 'porcelain-tiles';
  onSelectCategory: (cat: 'porcelain-countertops' | 'stone-countertops' | 'porcelain-tiles') => void;
  onOpenQuoteModal: (opts?: { material?: string }) => void;
}

export function CategoriesOverview({
  activeCategory,
  onSelectCategory,
  onOpenQuoteModal,
}: CategoriesOverviewProps) {
  const categories = [
    {
      id: 'porcelain-countertops' as const,
      badge: 'Our Flagship USP',
      badgeColor: 'bg-amber-600 text-white',
      title: 'Porcelain Countertops',
      tagline: 'Under Countertops · The Contractor-Friendly Revolution',
      description:
        'Large-format 9mm vitrified porcelain slabs. Can be installed directly by your own tile contractor—saving 50-70% on specialized stone fabricator labor. Matches flawlessly with backsplashes & floors.',
      image: '/catalog/products/room_calcatta_extra.jpg',
      specs: [
        'Any General Contractor or Tile Installer Can Fit',
        'Continuous Flow: Island to Backsplash to Floor',
        'More Styles, More Designs, 40-60% Less Expensive',
        '100% Stain, Heat & Scratch Proof (<0.04% Porosity)',
      ],
      priceTag: 'Starting at $24/sq.ft',
      isHero: true,
    },
    {
      id: 'stone-countertops' as const,
      badge: 'Natural & Engineered',
      badgeColor: 'bg-[#1A1A1A] text-white',
      title: 'Stone Countertops',
      tagline: 'Quartzite, Marble, Granite & Engineered Quartz',
      description:
        'Traditional quarried 2cm & 3cm natural stone and engineered quartz slabs. Hand-selected slabs sourced directly from Italian and South American quarries for monumental residential islands.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      specs: [
        'Natural Taj Mahal & Calacatta Marble',
        'Solid 3cm Slabs for Classic Heavy Overhangs',
        'Fabricated with Precision CNC & Waterjet Cutters',
        'Direct Quarry Slab Selection',
      ],
      priceTag: 'Starting at $65/sq.ft',
      isHero: false,
    },
    {
      id: 'porcelain-tiles' as const,
      badge: 'Architectural Continuity',
      badgeColor: 'bg-stone-700 text-white',
      title: 'Porcelain Tiles',
      tagline: '600x1200mm & 600x600mm Large Format Surfaces',
      description:
        'Seamlessly coordinated with our porcelain countertops. Run the exact same high-gloss bookmatched patterns across your floor, shower walls, exterior facades, and fireplace surrounds.',
      image: '/catalog/products/room_amazonite.jpg',
      specs: [
        'Exact Match to Kitchen Island Countertops',
        'Standard 600x1200 mm & 600x600 mm Formats',
        'Multiple Random Faces for Organic Realism',
        'Indoor & Outdoor Frost-Resistant PEI IV',
      ],
      priceTag: 'Starting at $18/sq.ft',
      isHero: false,
    },
  ];

  return (
    <section id="categories-section" className="scroll-mt-20 w-full bg-[#FAF8F5] py-20 md:py-28 border-b border-[#E8E4DC] text-[#1A1A1A]">
      <div className="max-w-[1680px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 border border-[#1A1A1A]/15 bg-[#F2EFE9] text-[#1A1A1A] text-[11px] uppercase tracking-[0.2em] font-medium rounded-full">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>Core Material Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-light tracking-tight text-[#1A1A1A]">
              Three Pillars of Surface Design
            </h2>
            <p className="mt-3 text-[#1A1A1A]/75 text-base sm:text-lg max-w-2xl font-light">
              Explore our core categories, anchored by our flagship <span className="font-medium text-[#1A1A1A]">Porcelain Countertops</span>—engineered so your existing general contractor can install luxury stone finishes without costly fabricator overhead.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#767168]">
            <span>600x1200mm Vitrified High-Gloss Large Format</span>
          </div>
        </div>

        {/* 3 Categories Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;

            return (
              <motion.div
                key={cat.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className={`flex flex-col justify-between bg-white border transition-all duration-300 shadow-sm hover:shadow-xl ${
                  cat.isHero
                    ? 'border-amber-600/40 ring-1 ring-amber-600/20'
                    : 'border-[#E8E4DC]'
                }`}
              >
                <div>
                  {/* Image Container with Tag */}
                  <Link href={`/${cat.id}`} className="block relative aspect-[16/10] w-full overflow-hidden bg-stone-100 cursor-pointer">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover object-center transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Top Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className={`px-3 py-1 text-[10px] uppercase tracking-[0.18em] font-medium rounded-full shadow-sm ${cat.badgeColor}`}>
                        {cat.badge}
                      </span>
                    </div>

                    {/* Price Tag */}
                    <div className="absolute bottom-4 right-4 z-10">
                      <span className="px-2.5 py-1 bg-black/75 backdrop-blur-md text-white text-[11px] font-medium tracking-wide">
                        {cat.priceTag}
                      </span>
                    </div>
                  </Link>

                  {/* Card Content */}
                  <div className="p-7 sm:p-8">
                    <span className="text-[11px] uppercase tracking-[0.16em] text-amber-700 font-medium block mb-1">
                      {cat.tagline}
                    </span>
                    <h3 className="text-2xl font-sans font-light tracking-tight text-[#1A1A1A] mb-3">
                      {cat.title}
                    </h3>
                    <p className="text-[14px] leading-relaxed text-[#1A1A1A]/80 mb-6 font-normal">
                      {cat.description}
                    </p>

                    {/* Feature bullet checklist */}
                    <div className="space-y-2.5 pt-4 border-t border-[#F0EDE6] mb-6">
                      {cat.specs.map((spec, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-[13px] text-[#1A1A1A]/90">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action Button linking directly to dedicated catalogue page */}
                <div className="p-7 sm:p-8 pt-0">
                  <Link
                    href={`/${cat.id}`}
                    className={`w-full py-3 px-4 text-[12px] uppercase tracking-[0.16em] font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      cat.isHero
                        ? 'bg-[#1A1A1A] hover:bg-amber-800 text-white shadow-md'
                        : 'border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A]'
                    }`}
                  >
                    <span>Explore {cat.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
