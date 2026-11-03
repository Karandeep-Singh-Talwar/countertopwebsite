'use client';

import React, { useState } from 'react';
import { InCommonNav } from '@/components/in-common-nav';
import { InCommonFooter } from '@/components/in-common-footer';
import { BookCallModal } from '@/components/book-call-modal';
import { RequestQuoteModal } from '@/components/request-quote-modal';
import { RoomVisualizer } from '@/components/room-visualizer/room-visualizer';

export default function VisualizerPage() {
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
      <InCommonNav onOpenBookCall={handleOpenBookCall} onOpenQuoteModal={handleOpenQuoteModal} />

      <main className="flex-1 pt-24 md:pt-32">
        <section className="max-w-[1680px] mx-auto px-6 md:px-12 py-12 md:py-16 border-b border-[#1A1A1A]/10">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6C6863] mb-4">Room Visualizer</p>
          <h1 className="font-serif text-4xl md:text-6xl tracking-tight max-w-3xl">
            See our surfaces in <span className="italic font-light">your</span> kitchen.
          </h1>
          <p className="mt-6 max-w-2xl text-[#6C6863]">
            Snap your counters with your phone camera, outline the countertop and backsplash, then swap between every
            slab in our collection. Your room&apos;s own light and shadows are kept, so what you see is close to what gets installed.
          </p>
        </section>

        <section className="max-w-[1680px] mx-auto px-6 md:px-12 py-12 md:py-16">
          <RoomVisualizer onRequestQuote={(material) => handleOpenQuoteModal({ material })} />
        </section>
      </main>

      <InCommonFooter onOpenBookCall={handleOpenBookCall} onOpenQuoteModal={handleOpenQuoteModal} onOpenSwatches={() => {}} />

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
