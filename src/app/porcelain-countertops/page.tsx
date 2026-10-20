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
        {/* Dedicated Hero Section */}
        <section className="max-w-[1680px] mx-auto px-6 md:px-12 py-12 md:py-16 border-b border-[#E8E4DC]">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-amber-500/30 bg-amber-500/10 text-amber-800 text-[11px] uppercase tracking-[0.2em] font-medium rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Our Flagship Category USP</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light tracking-tight text-[#1A1A1A] leading-[1.08]">
              Porcelain Countertops Catalogue
            </h1>
            <p className="mt-5 text-[#1A1A1A]/75 text-base sm:text-xl font-light leading-relaxed">
              Monolithic 9mm vitrified porcelain slabs engineered for kitchen countertops, island waterfalls, and full-height continuous splashbacks. Sized and calibrated so your existing general contractor or tile setter can cut and install using standard diamond wet saws—eliminating expensive stone fabricator markups.
            </p>

            {/* USP Metric Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#E8E4DC]">
              <div className="p-3.5 bg-white border border-[#E8E4DC] rounded-xl">
                <Hammer className="w-4 h-4 text-amber-700 mb-2" />
                <div className="text-xs font-semibold text-[#1A1A1A]">General Contractor Installable</div>
                <div className="text-[11px] text-[#767168] mt-0.5">Cut on-site with standard wet saw</div>
              </div>
              <div className="p-3.5 bg-white border border-[#E8E4DC] rounded-xl">
                <DollarSign className="w-4 h-4 text-emerald-700 mb-2" />
                <div className="text-xs font-semibold text-[#1A1A1A]">40–60% Lower Total Cost</div>
                <div className="text-[11px] text-[#767168] mt-0.5">$24 – $38 / sq.ft wholesale</div>
              </div>
              <div className="p-3.5 bg-white border border-[#E8E4DC] rounded-xl">
                <Flame className="w-4 h-4 text-amber-700 mb-2" />
                <div className="text-xs font-semibold text-[#1A1A1A]">1000°C Heat Proof</div>
                <div className="text-[11px] text-[#767168] mt-0.5">Direct hot pan safe, zero scorching</div>
              </div>
              <div className="p-3.5 bg-white border border-[#E8E4DC] rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-700 mb-2" />
                <div className="text-xs font-semibold text-[#1A1A1A]">&lt;0.04% Porosity</div>
                <div className="text-[11px] text-[#767168] mt-0.5">Stain-proof against wine & turmeric</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Link
                href="/#savings-calculator"
                className="px-6 py-3 bg-[#1A1A1A] hover:bg-amber-800 text-white text-xs uppercase tracking-widest font-medium transition flex items-center gap-2 rounded-lg cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Calculate Your Project Savings</span>
              </Link>
              <button
                onClick={() => handleOpenQuoteModal({ material: 'Porcelain Countertops Collection' })}
                className="px-6 py-3 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] text-xs uppercase tracking-widest font-medium transition flex items-center gap-2 rounded-lg cursor-pointer"
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
