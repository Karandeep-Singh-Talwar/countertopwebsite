'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { InCommonNav } from '@/components/in-common-nav';
import { PorcelainCatalog } from '@/components/porcelain-catalog';
import { InCommonFooter } from '@/components/in-common-footer';
import { BookCallModal } from '@/components/book-call-modal';
import { RequestQuoteModal } from '@/components/request-quote-modal';
import { Sparkles, Hammer, ShieldCheck, Flame, DollarSign, Calculator, ArrowRight, Layers } from 'lucide-react';

export default function PorcelainCountertopsPage() {
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [modalInitialMaterial, setModalInitialMaterial] = useState('Calcatta Extra (600x1200mm Vitrified Porcelain)');
  const [modalInitialSqFt, setModalInitialSqFt] = useState(55);

  const handleOpenBookCall = (opts?: { material?: string; sqFt?: number; service?: string }) => {
    if (opts?.material) setModalInitialMaterial(opts.material);
    if (opts?.sqFt) setModalInitialSqFt(opts.sqFt);
    setIsBookCallOpen(true);
  };

  const handleOpenQuoteModal = (opts?: { material?: string; sqFt?: number }) => {
    if (opts?.material) setModalInitialMaterial(opts.material);
    if (opts?.sqFt) setModalInitialSqFt(opts.sqFt);
    setIsQuoteModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1A1A]">
      <InCommonNav
        onOpenBookCall={handleOpenBookCall}
        onOpenQuoteModal={handleOpenQuoteModal}
      />

      <main className="flex-1 pt-24 md:pt-32">
        {/* Dedicated Hero Section: Open, borderless, airy */}
        <section className="max-w-[1680px] mx-auto px-6 md:px-12 py-16 md:py-24 border-b border-[#1A1A1A]/10">
          <div className="max-w-4xl">
            <div className="text-[11px] uppercase tracking-[0.25em] text-[#8C827A] mb-3 font-mono">
              01 / Flagship Technology & Catalogue
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light tracking-tight text-[#1A1A1A] leading-[1.05]">
              Porcelain Countertops Catalogue
            </h1>
            <p className="mt-6 text-[#59534E] text-base sm:text-xl font-light leading-relaxed">
              Monolithic 9mm vitrified porcelain slabs engineered for kitchen countertops, island waterfalls, and full-height continuous splashbacks. Sized and calibrated so your existing general contractor or tile setter can cut and install using standard diamond wet saws—eliminating expensive stone fabricator markups.
            </p>

            {/* Open Architectural Metric Row (ZERO BOXES) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-12 pt-8 border-t border-[#1A1A1A]/10 font-mono">
              <div>
                <div className="text-3xl sm:text-4xl font-serif text-[#1A1A1A] font-light">9 mm</div>
                <div className="text-xs uppercase tracking-wider text-[#1A1A1A] font-medium mt-1">Contractor Installed</div>
                <div className="text-[11px] text-[#8C827A] mt-0.5 font-sans">Cut on-site with diamond wet saw</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-serif text-amber-800 font-light">40–60%</div>
                <div className="text-xs uppercase tracking-wider text-[#1A1A1A] font-medium mt-1">Lower Total Cost</div>
                <div className="text-[11px] text-[#8C827A] mt-0.5 font-sans">$24 – $38 / sq.ft wholesale</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-serif text-[#1A1A1A] font-light">1000°C</div>
                <div className="text-xs uppercase tracking-wider text-[#1A1A1A] font-medium mt-1">Heat Proof</div>
                <div className="text-[11px] text-[#8C827A] mt-0.5 font-sans">Direct hot pan safe, no scorch</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-serif text-emerald-800 font-light">&lt;0.04%</div>
                <div className="text-xs uppercase tracking-wider text-[#1A1A1A] font-medium mt-1">Zero Porosity</div>
                <div className="text-[11px] text-[#8C827A] mt-0.5 font-sans">Impervious to wine & turmeric</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-8 mt-10">
              <Link
                href="/#savings-calculator"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#1A1A1A] py-1 border-b border-[#1A1A1A] hover:text-amber-800 hover:border-amber-800 transition-colors cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Calculate Your Project Savings</span>
              </Link>
              <button
                onClick={() => handleOpenQuoteModal({ material: 'Porcelain Countertops Collection' })}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#59534E] hover:text-[#1A1A1A] py-1 border-b border-[#1A1A1A]/20 hover:border-[#1A1A1A] transition-colors cursor-pointer"
              >
                <span>Request Custom Quote</span>
              </button>
            </div>
          </div>
        </section>

        {/* The Catalogue Section */}
        <PorcelainCatalog
          onOpenQuoteModal={handleOpenQuoteModal}
          onOpenBookCall={handleOpenBookCall}
          initialCategory="porcelain-countertops"
        />
      </main>

      <InCommonFooter
        onOpenBookCall={handleOpenBookCall}
        onOpenQuoteModal={handleOpenQuoteModal}
        onOpenSwatches={() => {}}
      />

      <BookCallModal
        isOpen={isBookCallOpen}
        onClose={() => setIsBookCallOpen(false)}
        initialMaterial={modalInitialMaterial}
        initialSqFt={modalInitialSqFt}
      />

      <RequestQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        initialMaterial={modalInitialMaterial}
        initialSqFt={modalInitialSqFt}
      />
    </div>
  );
}
