'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CategoriesOverviewProps {
  activeCategory?: string;
  onSelectCategory?: (cat: string) => void;
  onOpenQuoteModal: (opts?: { material?: string }) => void;
}

export function CategoriesOverview({
  onOpenQuoteModal,
}: CategoriesOverviewProps) {
  const categories = [
    {
      num: '01',
      id: 'countertops',
      href: '/countertops',
      label: 'SURFACE APPLICATION',
      title: 'Countertops',
      tagline: 'Porcelain · Granite · Quartz · Quartzite',
      description:
        'Engineered for chef islands, perimeter counters, and waterfall returns. Choose between contractor-friendly 9mm vitrified porcelain, dense natural volcanic granite, zero-maintenance quartz, and crown-jewel metamorphic quartzite.',
      image: '/catalog/products/kitchen_countertops_hero.jpg',
      specs: [
        'Porcelain: Cut on-site with diamond wet saw',
        'Granite: Natural volcanic heat & scratch stamina',
        'Quartz: 100% non-porous zero-sealing uniformity',
        'Quartzite: Marble elegance with diamond toughness',
      ],
      priceTag: 'From $24 / sq.ft',
    },
    {
      num: '02',
      id: 'backsplash-walltile',
      href: '/backsplash-walltile',
      label: 'VERTICAL CONTINUITY',
      title: 'Backsplash & Wall Tile',
      tagline: 'Porcelain · Granite · Quartz · Quartzite',
      description:
        'Run continuous uninterrupted veining from countertop up to ceiling or clad master bathroom showers in monolithic stone. Zero porous grout lines to scrub and 100% moisture barrier.',
      image: '/catalog/products/backsplash_walltile_hero.jpg',
      specs: [
        'Bookmatched continuous vein flow',
        'Direct stove heat & grease impervious',
        'Shower, vanity & fireplace wall cladding',
        'Available in matching slabs & calibrated tiles',
      ],
      priceTag: 'From $24 / sq.ft',
    },
    {
      num: '03',
      id: 'flooring',
      href: '/flooring',
      label: 'ARCHITECTURAL FOUNDATION',
      title: 'Flooring',
      tagline: 'Porcelain · Granite · Quartz · Quartzite',
      description:
        'Harmonize your entire open-concept floor plan. Large-format 600×1200mm vitrified tiles, granite pavers, and quartzite floor stones engineered for heavy residential and commercial foot traffic.',
      image: '/catalog/products/flooring_hero.jpg',
      specs: [
        'Exact color harmony to countertops & walls',
        'Calibrated 600×1200mm & 600×600mm sizing',
        'PEI IV/V frost, stain & scratch proofing',
        'Direct wholesale jobsite crate freight',
      ],
      priceTag: 'From $18 / sq.ft',
    },
  ];

  return (
    <section id="categories-section" className="scroll-mt-20 w-full bg-[#FAF8F5] py-24 md:py-32 text-[#1A1A1A]">
      <div className="max-w-[1680px] mx-auto px-6 md:px-12">
        {/* Section Header: Open, borderless, airy */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 pb-8 border-b border-[#1A1A1A]/10">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#6C6863] mb-3 font-medium">
              Architectural Collections
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal tracking-tight text-[#1A1A1A] leading-[1.05]">
              Surfaces by <span className="italic font-light text-amber-800">Application</span>
            </h2>
          </div>

          <p className="text-[#6C6863] text-base sm:text-lg max-w-xl font-normal leading-relaxed">
            Every surface application—<strong className="text-[#1A1A1A]">Countertops, Backsplash &amp; Wall Tile, and Flooring</strong>—curated across four core stone technologies: Porcelain, Granite, Quartz, and Quartzite.
          </p>
        </div>

        {/* 3 Categories: Borderless Editorial Columns (NO BOXES) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
          {categories.map((cat) => (
            <div key={cat.id} className="group flex flex-col justify-between">
              <div>
                {/* Clean Image with subtle zoom, NO card frame */}
                <Link
                  href={cat.href}
                  className="block relative aspect-[4/3] w-full overflow-hidden bg-[#ECE8E1] cursor-pointer"
                >
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />

                  {/* Clean, minimalist price floating top-right without bulky box */}
                  <div className="absolute top-4 right-4 text-xs uppercase tracking-[0.2em] text-white bg-black/60 backdrop-blur-md px-3 py-1 font-sans font-medium">
                    {cat.priceTag}
                  </div>
                </Link>

                {/* Editorial Metadata & Typography floating naturally */}
                <div className="pt-8">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-[#6C6863] mb-2 font-medium">
                    <span>{cat.label}</span>
                    <span>{cat.num}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-serif font-normal tracking-tight text-[#1A1A1A] mb-2 group-hover:text-amber-800 transition-colors">
                    <Link href={cat.href}>{cat.title}</Link>
                  </h3>

                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#8C827A] font-medium mb-4">
                    {cat.tagline}
                  </p>

                  <p className="text-sm leading-relaxed text-[#6C6863] font-normal mb-6">
                    {cat.description}
                  </p>

                  {/* Clean spec list separated by hairline, NO checkboxes or colored boxes */}
                  <div className="border-t border-[#1A1A1A]/10 pt-4 space-y-2 mb-8">
                    {cat.specs.map((spec, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-[#2E2B29] font-normal">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-700/60 shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Borderless Editorial Link with Animated Hairline */}
              <div className="pt-2">
                <Link
                  href={cat.href}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#1A1A1A] group/link py-1 relative"
                >
                  <span>Explore {cat.title}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-[#1A1A1A] transition-all duration-300 group-hover:w-full" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
