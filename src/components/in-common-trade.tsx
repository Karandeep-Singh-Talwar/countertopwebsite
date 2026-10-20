'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles, Shield, Compass, FileText, CheckCircle2 } from 'lucide-react';

interface InCommonTradeProps {
  onOpenBookCall: (opts?: { service?: string; material?: string }) => void;
  onOpenQuoteModal: (opts?: { material?: string }) => void;
}

export function InCommonTrade({ onOpenBookCall, onOpenQuoteModal }: InCommonTradeProps) {
  return (
    <section id="trade-section" className="w-full bg-[#9DAFB7] py-20 md:py-28 text-[#1A1A1A] select-none">
      <div className="max-w-[1680px] mx-auto px-6 md:px-12">
        {/* Split Grid matching In Common With */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column Label */}
          <div className="md:col-span-3 lg:col-span-2">
            <h2 className="text-[12px] uppercase tracking-[0.18em] font-medium text-[#1A1A1A]/80 sticky top-28">
              Trade Program
            </h2>
          </div>

          {/* Center Main Text Column */}
          <div className="md:col-span-6 lg:col-span-7">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-sans font-normal leading-[1.3] text-[#1A1A1A] tracking-[-0.02em] mb-6">
              Our Trade Program allows us to support and collaborate with architects, interior designers, and general contractors.
            </h3>

            <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#1A1A1A]/85 max-w-2xl font-normal mb-8">
              Once you're enrolled, our dedicated stone concierges are here to assist with selecting and specifying slabs, physical sample box shipments, precision CAD shop drawings, custom edge detailing, direct quarry slab reservations, and tiered trade pricing.
            </p>

            <div className="flex flex-wrap gap-y-3 gap-x-6 text-[12px] uppercase tracking-wider text-[#1A1A1A]/80 mb-8 font-medium">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1A1A1A]" />
                Direct Quarry Holds
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1A1A1A]" />
                Architectural Sample Crates
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1A1A1A]" />
                20-30% Trade Margin
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={() => onOpenBookCall({ service: 'Architectural Trade Program Onboarding & Sample Kit' })}
                className="px-7 py-3.5 bg-[#1A1A1A] hover:bg-black text-white text-[11px] uppercase tracking-[0.16em] font-medium transition-colors cursor-pointer"
              >
                Apply for Trade Access
              </button>
              <button
                onClick={() => onOpenQuoteModal({ material: 'Trade Specification & Bid Package' })}
                className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-[#1A1A1A] hover:underline cursor-pointer py-2 font-medium"
              >
                <span>Submit RFP / Tender Plans</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Floating Inset Image matching In Common With */}
          <div className="md:col-span-3 lg:col-span-3 flex justify-center md:justify-end">
            <div className="relative aspect-[3/4] w-48 sm:w-56 overflow-hidden bg-[#ECE8E1] border border-white/40 shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80"
                alt="Architectural stone sample box and finishes kit"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-center text-white text-[10px] uppercase tracking-widest font-medium">
                Designer Sample Kit
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
