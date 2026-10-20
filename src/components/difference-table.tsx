'use client';

import React from 'react';
import { CheckCircle2, XCircle, Sparkles, Shield, Clock, Award } from 'lucide-react';
import { COMPARISON_ROWS } from '@/data/stone-data';

interface DifferenceTableProps {
  onOpenBookCall: () => void;
}

export function DifferenceTable({ onOpenBookCall }: DifferenceTableProps) {
  return (
    <section id="difference" className="py-24 relative bg-stone-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c59f60]/10 border border-[#c59f60]/30 text-xs font-semibold text-[#fce6bb] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#c59f60]" />
            <span>The Modern Stone Experience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
            The Verona Direct Difference
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3">
            Traditional countertop shopping is broken—opaque slab yard pricing, 6-week delays, and subcontractor finger pointing. Here is how we revolutionized the journey.
          </p>
        </div>

        {/* Comparison Matrix Table */}
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-slate-900/90 border-b border-slate-800 text-xs font-bold uppercase tracking-wider p-4 sm:p-6 items-center">
            <div className="col-span-5 sm:col-span-4 text-slate-400">Buying Experience</div>
            <div className="col-span-3 sm:col-span-4 text-slate-500 hidden sm:block">
              Traditional Slab Yard / Big Box
            </div>
            <div className="col-span-7 sm:col-span-4 text-[#fce6bb] flex items-center gap-2 justify-end sm:justify-start">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Verona Direct (Modern)</span>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-800/80 text-xs sm:text-sm">
            {COMPARISON_ROWS.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 p-4 sm:p-6 items-center hover:bg-slate-900/40 transition gap-2 sm:gap-4"
              >
                {/* Feature Name */}
                <div className="col-span-5 sm:col-span-4 font-semibold text-white">
                  {row.feature}
                </div>

                {/* Traditional / Big Box */}
                <div className="col-span-7 sm:col-span-4 text-slate-400 flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span className="line-through opacity-80">{row.traditional}</span>
                </div>

                {/* Verona Direct */}
                <div className="col-span-12 sm:col-span-4 pt-2 sm:pt-0 text-white font-medium flex items-start gap-2 bg-[#c59f60]/5 sm:bg-transparent p-2 sm:p-0 rounded-lg sm:rounded-none">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-[#fce6bb]">{row.verona}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Table Footer Callout */}
          <div className="p-6 bg-slate-900/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#c59f60]" />
                <span>5-Day Guaranteed Install</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>15-Year Warranty</span>
              </div>
              <div className="hidden md:flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#fce6bb]" />
                <span>Direct Italian & Brazilian Quarries</span>
              </div>
            </div>

            <button
              onClick={onOpenBookCall}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#c59f60] to-[#b0894b] text-black font-bold text-xs uppercase tracking-wider transition hover:shadow-lg hover:shadow-[#c59f60]/30"
            >
              Book Your Free 15-Min Design Call
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
