'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

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
      num: '01',
      id: 'porcelain-countertops' as const,
      label: 'FLAGSHIP SPECIFICATION',
      title: 'Porcelain Countertops',
      tagline: 'The Contractor-Friendly Revolution',
      description:
        'Large-format 9mm vitrified porcelain slabs calibrated so your existing tile contractor can cut and set on-site with standard diamond wet saws—eliminating 50–70% in specialized stone cutter fabrication costs.',
      image: '/catalog/products/room_calcatta_extra.jpg',
      specs: [
        'Contractor installable on-site',
        'Zero specialized CNC stone cutter fees',
        'Direct match to splashbacks & floors',
        '<0.04% porosity · 1000°C heat proof',
      ],
      priceTag: 'From $24 / sq.ft',
      isFlagship: true,
    },
    {
      num: '02',
      id: 'stone-countertops' as const,
      label: 'NATURAL & ENGINEERED',
      title: 'Stone Countertops',
      tagline: 'Quartzite, Marble & Granite Slabs',
      description:
        'Classic quarried 2cm and 3cm natural stone slabs hand-selected from Italian and Brazilian quarries. Solid mass, deep crystalline natural veining, and custom edge profiles for monumental architectural islands.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      specs: [
        'Natural Taj Mahal, Calacatta & Granite',
        'Substantial 3cm monolithic thickness',
        'Precision waterjet cut & polished',
        'Direct quarry slab batch selection',
      ],
      priceTag: 'From $65 / sq.ft',
      isFlagship: false,
    },
    {
      num: '03',
      id: 'porcelain-tiles' as const,
      label: 'ARCHITECTURAL HARMONY',
      title: 'Porcelain Tiles',
      tagline: 'Matching Large-Format Surfaces',
      description:
        'Coordinate your entire interior language. Run the identical high-gloss vitrified pattern across floors, shower walls, and hearth surrounds with calibrated 600×1200mm and 600×600mm packaging.',
      image: '/catalog/products/room_amazonite.jpg',
      specs: [
        'Exact match to countertop slabs',
        'Standard 600×1200mm & 600×600mm',
        'Multiple continuous random faces',
        'PEI IV frost & stain impervious',
      ],
      priceTag: 'From $18 / sq.ft',
      isFlagship: false,
    },
  ];

  return (
    <section id="categories-section" className="scroll-mt-20 w-full bg-[#FAF8F5] py-24 md:py-32 text-[#1A1A1A]">
      <div className="max-w-[1680px] mx-auto px-6 md:px-12">
        {/* Section Header: Open, borderless, airy */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 pb-8 border-b border-[#1A1A1A]/10">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#6C6863] mb-3 font-medium">
              Surface Collections
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal tracking-tight text-[#1A1A1A] leading-[1.05]">
              Three Pillars of <span className="italic font-light text-amber-800">Surface Design</span>
            </h2>
          </div>

          <p className="text-[#6C6863] text-base sm:text-lg max-w-xl font-normal leading-relaxed">
            From our groundbreaking <span className="text-[#1A1A1A] font-medium">9mm contractor-cut porcelain slabs</span> to monumental quarried quartzite and matching architectural tiles—crafted for seamless continuity.
          </p>
        </div>

        {/* 3 Categories: Borderless Editorial Columns (NO BOXES) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {categories.map((cat) => (
            <div key={cat.id} className="group flex flex-col justify-between">
              <div>
                {/* Clean Image with subtle zoom, NO card frame */}
                <Link
                  href={`/${cat.id}`}
                  className="block relative aspect-[16/11] w-full overflow-hidden bg-[#ECE8E1] cursor-pointer"
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

                  <h3 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-[#1A1A1A] mb-2 group-hover:text-amber-800 transition-colors">
                    <Link href={`/${cat.id}`}>{cat.title}</Link>
                  </h3>

                  <p className="text-xs uppercase tracking-[0.2em] text-[#8C827A] font-medium mb-4">
                    {cat.tagline}
                  </p>

                  <p className="text-base leading-relaxed text-[#6C6863] font-normal mb-6">
                    {cat.description}
                  </p>

                  {/* Clean spec list separated by hairline, NO checkboxes or colored boxes */}
                  <div className="border-t border-[#1A1A1A]/10 pt-4 space-y-2 mb-8">
                    {cat.specs.map((spec, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-[#2E2B29] font-normal">
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
                  href={`/${cat.id}`}
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
