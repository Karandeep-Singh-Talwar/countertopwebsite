'use client';

import React from 'react';
import { BRAND_PARTNERS } from '@/data/stone-data';
import { Award, ShieldCheck, Check } from 'lucide-react';

export function BrandPartners() {
  return (
    <section className="py-16 bg-[#090d13] border-y border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#fce6bb] flex items-center justify-center gap-2">
            <Award className="w-4 h-4 text-[#c59f60]" />
            <span>Authorized Master Fabricators for Top Global Surface Brands</span>
          </p>
        </div>

        {/* Logos Marquee / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 items-center justify-center">
          {BRAND_PARTNERS.map((partner) => (
            <div
              key={partner.name}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-[#c59f60]/40 transition text-center group flex flex-col items-center justify-center min-h-[90px]"
            >
              <span className="font-serif font-black tracking-widest text-sm text-slate-300 group-hover:text-white group-hover:scale-105 transition">
                {partner.logoText}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                {partner.desc}
              </span>
            </div>
          ))}
        </div>

        {/* Guarantee Banner */}
        <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#c59f60]" />
            <span>100% Certified Authentic First-Choice Slabs</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Full 15-Year Manufacturer Warranty Honored</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#c59f60]" />
            <span>Zero Second-Grade or B-Stock Materials</span>
          </div>
        </div>
      </div>
    </section>
  );
}
