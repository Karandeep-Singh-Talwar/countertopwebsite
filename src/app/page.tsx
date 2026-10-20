'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InCommonNav } from '@/components/in-common-nav';
import { InCommonHero } from '@/components/in-common-hero';
import { CategoriesOverview } from '@/components/categories-overview';
import { PorcelainUspBanner } from '@/components/porcelain-usp-banner';
import { ContractorSavingsCalculator } from '@/components/contractor-savings-calculator';
import { InCommonFooter } from '@/components/in-common-footer';
import { BookCallModal } from '@/components/book-call-modal';
import { RequestQuoteModal } from '@/components/request-quote-modal';

export default function HomePage() {
  const router = useRouter();

  // Modal states
  const [isBookCallOpen, setIsBookCallOpen] = useState<boolean>(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);

  // Active Category state
  const [activeCategory, setActiveCategory] = useState<'all' | 'porcelain-countertops' | 'stone-countertops' | 'porcelain-tiles'>('all');

  // Pre-fill state for consultations and quotes
  const [modalInitialMaterial, setModalInitialMaterial] = useState<string>('Calcatta Extra (600x1200mm Vitrified Porcelain)');
  const [modalInitialSqFt, setModalInitialSqFt] = useState<number>(55);
  const [modalInitialService, setModalInitialService] = useState<string>('Porcelain Countertop & Backsplash Package');

  const handleOpenBookCall = (opts?: { material?: string; sqFt?: number; service?: string }) => {
    if (opts?.material) setModalInitialMaterial(opts.material);
    if (opts?.sqFt) setModalInitialSqFt(opts.sqFt);
    if (opts?.service) setModalInitialService(opts.service);
    setIsBookCallOpen(true);
  };

  const handleOpenQuoteModal = (opts?: { material?: string; sqFt?: number }) => {
    if (opts?.material) setModalInitialMaterial(opts.material);
    if (opts?.sqFt) setModalInitialSqFt(opts.sqFt);
    setIsQuoteModalOpen(true);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      handleOpenQuoteModal();
    }
  };

  const handleSelectCategory = (cat: 'porcelain-countertops' | 'stone-countertops' | 'porcelain-tiles') => {
    setActiveCategory(cat);
    router.push(`/${cat}`);
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1A1A] selection:bg-[#1A1A1A] selection:text-white">
      {/* 1. Header / Navigation */}
      <InCommonNav
        onOpenBookCall={handleOpenBookCall}
        onOpenQuoteModal={handleOpenQuoteModal}
        onOpenMaterials={() => scrollTo('categories-section')}
        onSelectSection={scrollTo}
      />

      <main className="flex-1">
        {/* 2. Hero Landing Page Section */}
        <InCommonHero
          onOpenBookCall={() => handleOpenBookCall({ service: 'Contractor Porcelain Installation Consultation' })}
          onOpenQuoteModal={() => handleOpenQuoteModal({ material: 'Calcatta Extra (Vitrified Porcelain)' })}
          onExploreClick={() => scrollTo('categories-section')}
        />

        {/* 3. Three Separate Category Pillars (Links to Dedicated Catalog Pages) */}
        <CategoriesOverview
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          onOpenQuoteModal={handleOpenQuoteModal}
        />

        {/* 4. Flagship Porcelain Countertops USP Deep Dive */}
        <PorcelainUspBanner
          onOpenQuoteModal={handleOpenQuoteModal}
          onOpenBookCall={handleOpenBookCall}
          onExploreCatalog={() => router.push('/porcelain-countertops')}
        />

        {/* 5. Contractor Installation & Direct Cost Savings Calculator */}
        <ContractorSavingsCalculator
          onOpenQuoteModal={handleOpenQuoteModal}
          onOpenBookCall={handleOpenBookCall}
        />
      </main>

      {/* 6. Footer */}
      <InCommonFooter
        onOpenBookCall={handleOpenBookCall}
        onOpenQuoteModal={handleOpenQuoteModal}
        onOpenSwatches={() => scrollTo('categories-section')}
      />

      {/* 7. Conversion Modals */}
      <BookCallModal
        isOpen={isBookCallOpen}
        onClose={() => setIsBookCallOpen(false)}
        initialMaterial={modalInitialMaterial}
        initialSqFt={modalInitialSqFt}
        initialService={modalInitialService}
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
