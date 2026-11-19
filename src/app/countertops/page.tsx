'use client';

import React, { useState } from 'react';
import { InCommonNav } from '@/components/in-common-nav';
import { InCommonFooter } from '@/components/in-common-footer';
import { MaterialsCatalogView } from '@/components/materials-catalog-view';
import { BookCallModal } from '@/components/book-call-modal';

export default function CountertopsPage() {
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);
  const [modalInitialMaterial, setModalInitialMaterial] = useState('Calcatta Extra Porcelain');
  const [modalInitialSqFt, setModalInitialSqFt] = useState(55);
  const [modalInitialService, setModalInitialService] = useState('Countertops & Island Consultation');

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
      service: 'Countertops & Island Consultation',
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
          category="countertops"
          categoryNumber="01"
          categoryTitle="Architectural Countertops"
          categoryTagline="Monolithic Slabs for Kitchen Islands, Waterfall Edges, & Vanity Surfaces"
          categoryDescription="Discover premium countertop slabs across four distinct mineral technologies: contractor-friendly 9mm vitrified porcelain, timeless igneous granite, non-porous engineered quartz, and exotic metamorphic quartzite."
          heroImage="/catalog/products/kitchen_countertops_hero.jpg"
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
