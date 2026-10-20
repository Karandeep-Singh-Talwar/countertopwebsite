'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, MapPin, Clock, Calendar, Phone } from 'lucide-react';

interface InCommonShowroomProps {
  onOpenBookCall: (opts?: { service?: string; material?: string }) => void;
}

export function InCommonShowroom({ onOpenBookCall }: InCommonShowroomProps) {
  return (
    <section id="showroom-section" className="w-full bg-[#FAF8F5] py-20 md:py-28 border-b border-[#E8E4DC] text-[#1A1A1A]">
      <div className="max-w-[1680px] mx-auto px-6 md:px-12">
        {/* Split Grid matching In Common With */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column Label */}
          <div className="md:col-span-3 lg:col-span-2">
            <h2 className="text-[12px] uppercase tracking-[0.18em] font-normal text-[#1A1A1A]/70 sticky top-28">
              Visit Us
            </h2>
          </div>

          {/* Right Main Area */}
          <div className="md:col-span-9 lg:col-span-10">
            {/* Header and Story matching In Common With */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-baseline">
              <div className="lg:col-span-4">
                <h3 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light tracking-tight text-[#1A1A1A]">
                  Quarters
                </h3>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#767168] mt-1 block">
                  Concept Studio & Materials Residence
                </span>
              </div>

              <div className="lg:col-span-8">
                <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#1A1A1A]/85 font-normal max-w-2xl mb-4">
                  The In Common With stone and architectural tile collection is available to view, touch, and specify in person at Quarters, our concept store and materials studio in New York City. Occupying 8,000 square feet of a historic 19th-century cast-iron loft, Quarters is styled as a live residence, combining the intimacy of a private home with the theater of architectural hospitality.
                </p>
                <button
                  onClick={() => onOpenBookCall({ service: 'Quarters Showroom Private Appointment' })}
                  className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-[#1A1A1A] hover:text-amber-900 transition-colors font-medium cursor-pointer"
                >
                  <span>Book a Private Studio Appointment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Split Photography Gallery matching In Common With */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-8">
              {/* Photo 1: Atmospheric Stone Bar */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#ECE8E1] border border-[#E0DCD4]">
                <Image
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
                  alt="Quarters showroom intimate bar space with stone counters"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Photo 2: Sun-drenched Residential Loft Gallery */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#ECE8E1] border border-[#E0DCD4]">
                <Image
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
                  alt="Quarters showroom high-ceiling living loft with marble tables"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Location & Hours matching In Common With */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-6 text-[13px] text-[#767168]">
              <div className="space-y-1">
                <p className="text-[#1A1A1A] font-medium">
                  Quarters is open to the public Tuesday through Saturday from 11:00am – 6:00pm.
                </p>
                <p>383 Broadway, Floor 2, New York, NY 10013</p>
                <div className="pt-2 flex items-center gap-6 text-[12px] uppercase tracking-wider text-[#1A1A1A]">
                  <a
                    href="https://maps.google.com/?q=383+Broadway+New+York+NY"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline font-medium inline-flex items-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                  </a>
                  <a
                    href="tel:19178308700"
                    className="hover:underline font-medium inline-flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>+1 (917) 830-8700</span>
                  </a>
                </div>
              </div>

              <div>
                <button
                  onClick={() => onOpenBookCall({ service: 'Quarters Guided Tour & Slab Selection' })}
                  className="px-6 py-3 border border-[#1A1A1A] bg-[#1A1A1A] hover:bg-black text-white text-[11px] uppercase tracking-[0.16em] font-medium transition-colors cursor-pointer"
                >
                  Schedule Showroom Walkthrough
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
