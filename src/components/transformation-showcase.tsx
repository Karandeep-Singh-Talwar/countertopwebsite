'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, MapPin, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { TRANSFORMATION_CASES } from '@/data/stone-data';

interface TransformationShowcaseProps {
  onBookCallForProject: (projectName: string) => void;
}

export function TransformationShowcase({ onBookCallForProject }: TransformationShowcaseProps) {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState<number>(0);
  const currentCase = TRANSFORMATION_CASES[selectedCaseIndex];

  return (
    <section id="transformations" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-black mb-2">
            REAL CLIENT CASE STUDIES
          </div>
          <h2 className="text-2xl sm:text-4xl font-sans font-light tracking-[0.16em] uppercase text-black">
            OVER 50,000 INSTALLATIONS
          </h2>
          <div className="w-12 h-[2px] bg-black mx-auto mt-3 mb-4" />
          <p className="text-xs sm:text-sm text-gray-600">
            Real homes, real budgets, and verified savings. Explore how homeowners bypassed middleman slab yard markups and received 5-day turnkey installations.
          </p>
        </div>

        {/* Location Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {TRANSFORMATION_CASES.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setSelectedCaseIndex(idx)}
              className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 border ${
                selectedCaseIndex === idx
                  ? 'border-black bg-black text-white'
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-400'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{item.city} — {item.roomType}</span>
            </button>
          ))}
        </div>

        {/* Showcase Box */}
        <div className="bg-gray-50 p-6 sm:p-10 border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visuals */}
            <div className="lg:col-span-7 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* BEFORE */}
                <div
                  className="relative aspect-[4/3] bg-gray-200 border border-gray-300 overflow-hidden"
                  style={{ position: 'relative' }}
                >
                  <Image
                    src={currentCase.beforeImage}
                    alt="Kitchen Before"
                    fill
                    className="object-cover grayscale-[25%]"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 bg-black/80 text-white text-[10px] font-bold uppercase tracking-wider">
                    BEFORE
                  </div>
                  <div className="absolute bottom-2 inset-x-2 text-center">
                    <span className="px-2 py-0.5 bg-black/80 text-gray-300 text-[10px]">
                      Traditional Quote: <strong className="line-through text-red-300">${currentCase.beforeCostQuote.toLocaleString()}</strong>
                    </span>
                  </div>
                </div>

                {/* AFTER */}
                <div
                  className="relative aspect-[4/3] bg-gray-200 border-2 border-black overflow-hidden shadow-md"
                  style={{ position: 'relative' }}
                >
                  <Image
                    src={currentCase.afterImage}
                    alt="Kitchen After"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>AFTER (DIRECT)</span>
                  </div>
                  <div className="absolute bottom-2 inset-x-2 text-center">
                    <span className="px-2 py-0.5 bg-black/90 text-white text-[10px] font-bold">
                      Turnkey Price: ${currentCase.veronaCost.toLocaleString()} ({currentCase.savingsPercentage}% Saved)
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white border border-gray-200 text-xs text-gray-600 flex items-center justify-between">
                <span>Stone: <strong className="text-black">{currentCase.material}</strong></span>
                <span className="text-emerald-700 font-semibold">Completed in 5 Business Days</span>
              </div>
            </div>

            {/* Testimonial & Data */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-black ml-1.5">5.0 Verified Review</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-black leading-snug">
                  {currentCase.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span>{currentCase.city}</span>
                  <span>•</span>
                  <span>{currentCase.date}</span>
                </div>
              </div>

              <blockquote className="p-4 bg-white border-l-2 border-black text-xs sm:text-sm text-gray-700 italic leading-relaxed">
                &ldquo;{currentCase.review}&rdquo;
              </blockquote>

              <div className="text-xs font-bold text-black">
                {currentCase.homeowner} <span className="text-gray-500 font-normal">({currentCase.category})</span>
              </div>

              <div className="p-4 bg-black text-white flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] uppercase text-gray-400">Homeowner Savings:</div>
                  <div className="text-xl font-bold font-serif text-white">
                    ${(currentCase.beforeCostQuote - currentCase.veronaCost).toLocaleString()} Saved
                  </div>
                </div>
                <button
                  onClick={() => onBookCallForProject(currentCase.title)}
                  className="px-4 py-2 bg-white text-black hover:bg-[#c59f60] font-bold text-xs uppercase tracking-wider transition flex items-center gap-1"
                >
                  <span>Book Call</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
