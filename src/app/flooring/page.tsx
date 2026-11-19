'use client';

import React, { useState } from 'react';
import { InCommonNav } from '@/components/in-common-nav';
import { InCommonFooter } from '@/components/in-common-footer';
import { MaterialsCatalogView } from '@/components/materials-catalog-view';
import { BookCallModal } from '@/components/book-call-modal';

export default function FlooringPage() {
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);
  const [modalInitialMaterial, setModalInitialMaterial] = useState('Large Format Porcelain Vitrified Flooring');
  const [modalInitialSqFt, setModalInitialSqFt] = useState(250);
  const [modalInitialService, setModalInitialService] = useState('Architectural Flooring Consultation');

  const handleOpenBookCall = (opts?: { material?: string; sqFt?: number; service?: string }) => {
    if (opts?.material) setModalInitialMaterial(opts.material);
    if (opts?.sqFt) setModalInitialSqFt(opts.sqFt);
    if (opts?.service) setModalInitialService(opts.service);
    setIsBookCallOpen(true);
  };

  const handleOpenQuoteModal = (opts?: { material?: string; sqFt?: number }) => {
    handleOpenBookCall({
      material: opts?.material,
      sqFt: opts?.sqFt,
      service: 'Architectural Flooring Consultation',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1A1A]">
      <InCommonNav
        onOpenBookCall={handleOpenBookCall}
        onOpenQuoteModal={handleOpenQuoteModal}
      />

      <main className="flex-1 pt-20">
        <MaterialsCatalogView
          category="flooring"
          categoryNumber="03"
          categoryTitle="Architectural Flooring"
          categoryTagline="High-Traffic Vitrified Pavers, Large-Format Slabs, & Polished Natural Stone"
          categoryDescription="Unify your interior floor plan with expansive, low-maintenance surfaces. Choose between PEI IV/V vitrified porcelain tiles, indestructible natural granite pavers, monolithic quartz tiles, and crystalline quartzite."
          heroImage="/catalog/products/flooring_hero.jpg"
          initialMaterial="porcelain"
          onOpenQuoteModal={handleOpenQuoteModal}
          onOpenBookCall={handleOpenBookCall}
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
        initialService={modalInitialService}
      />
    </div>
  );
}
