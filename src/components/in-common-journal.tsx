'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface InCommonJournalProps {
  onOpenArticle?: (title: string) => void;
}

export function InCommonJournal({ onOpenArticle }: InCommonJournalProps) {
  const articles = [
    {
      id: 'quarters-welcome',
      date: 'May 13, 2024',
      title: 'Welcome to Quarters: A living ode to community, craftsmanship, and collaborative design',
      excerpt: 'How an 8,000 square foot 19th-century loft became Manhattan’s most intimate sanctuary for experiencing monolithic stone and architectural light.',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'high-end-press',
      date: 'May 16, 2025',
      title: 'Featured Press: To Find High End Architectural Stone in New York, Look Up',
      excerpt: 'Architectural Digest explores our bespoke quarry direct pipeline and why top tier residential designers are choosing honed Taj Mahal and tactile zellige.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  return (
    <section id="lately-section" className="w-full bg-[#FAF8F5] py-20 md:py-28 border-b border-[#E8E4DC] text-[#1A1A1A]">
      <div className="max-w-[1680px] mx-auto px-6 md:px-12">
        {/* Split Grid matching In Common With */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column Label */}
          <div className="md:col-span-3 lg:col-span-2">
            <h2 className="text-[12px] uppercase tracking-[0.18em] font-normal text-[#1A1A1A]/70 sticky top-28">
              Lately
            </h2>
          </div>

          {/* Right Main Articles Grid */}
          <div className="md:col-span-9 lg:col-span-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
              {articles.map((art) => (
                <article key={art.id} className="group cursor-pointer flex flex-col">
                  {/* Article Date matching In Common With */}
                  <div className="text-[11px] uppercase tracking-[0.2em] text-[#767168] mb-3">
                    {art.date}
                  </div>

                  {/* Image Container */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#ECE8E1] mb-5 border border-[#E0DCD4]">
                    <Image
                      src={art.image}
                      alt={art.title}
                      fill
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  {/* Headline */}
                  <h3 className="text-xl sm:text-2xl font-serif font-light leading-snug text-[#1A1A1A] tracking-tight group-hover:text-amber-900 transition-colors mb-3">
                    {art.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-[13px] leading-relaxed text-[#767168] mb-4">
                    {art.excerpt}
                  </p>

                  {/* Read More Link matching In Common With */}
                  <div className="mt-auto text-[11px] uppercase tracking-[0.16em] text-[#1A1A1A] group-hover:text-amber-900 transition-colors inline-flex items-center gap-1 font-medium">
                    <span>Read More</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
