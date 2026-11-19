'use client';

import React, { useState } from 'react';
import { InCommonNav } from '@/components/in-common-nav';
import { InCommonFooter } from '@/components/in-common-footer';
import { MaterialsCatalogView } from '@/components/materials-catalog-view';
import { BookCallModal } from '@/components/book-call-modal';

export default function BacksplashWallTilePage() {
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);
  const [modalInitialMaterial, setModalInitialMaterial] = useState('Continuous Calcatta Porcelain Wall Tile');
  const [modalInitialSqFt, setModalInitialSqFt] = useState(65);
  const [modalInitialService, setModalInitialService] = useState('Backsplash & Wall Tile Package Consultation');

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
      service: 'Backsplash & Wall Tile Package Consultation',
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
          category="backsplash-walltile"
          categoryNumber="02"
          categoryTitle="Backsplash & Wall Tile"
          categoryTagline="Full-Height Vertical Cladding & Moisture-Proof Wall Systems"
          categoryDescription="Seamless vertical transitions from countertop to ceiling. Explore bookmatched porcelain slabs, radiant natural quartzite feature walls, impervious granite splashbacks, and stain-proof quartz surfaces."
          heroImage="/catalog/products/backsplash_walltile_hero.jpg"
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
