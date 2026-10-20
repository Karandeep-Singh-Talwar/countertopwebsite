'use client';

import React, { useState } from 'react';
import { ChevronDown, Phone } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: 'What is the practical difference between Quartz, Natural Quartzite, and Marble?',
    a: 'Engineered Quartz is non-porous and never requires sealing, making it the most stain-resistant option for busy households. Natural Quartzite is a metamorphic rock diamond-hardened by geological pressure—it has the organic veining of marble but is heatproof up to 600°F. Natural Marble is softer and more porous, ideal for luxurious aesthetics with our included 15-year nano-sealant shield.',
  },
  {
    q: 'How does the free 15-minute consultation call work?',
    a: 'When you book a call, you select a date and time that fits your schedule. A dedicated stone specialist calls you (via phone or video). We review your rough cabinet measurements or kitchen photos, show you live full-slab veining patterns in our digital inventory, and generate an exact line-item quote with zero obligation.',
  },
  {
    q: 'How quickly can my new countertops be fabricated and installed?',
    a: 'From the moment our 3D laser technician measures your home, our standard turnaround is 5 to 7 business days. While traditional retailers take 4 to 8 weeks due to middleman markups and subcontractor scheduling, our local in-house CNC waterjet facility cuts and polishes your stone immediately.',
  },
  {
    q: 'Do you tear out and haul away our existing old countertops?',
    a: 'Yes! Our turnkey installation team will carefully detach your old laminate, tile, or granite countertops and haul them away for eco-friendly recycling. We also level your cabinets and ensure all support brackets are secured before setting your new slabs.',
  },
  {
    q: 'Can I put hot pots and pans directly on the surface?',
    a: 'With Natural Quartzite, Sintered Ultra-Porcelain (Dekton), and Granite, you can place scorching 500°F+ pots directly on the surface without scorch marks. For Engineered Quartz, we always recommend using a decorative trivet, as extreme thermal shock can occasionally cause resin discoloration.',
  },
  {
    q: 'Do you supply and install matching backsplash tiles alongside countertop slabs?',
    a: 'Yes! We provide turnkey countertop and tile packages. When our 3D laser templating technician scans your kitchen, we measure both your countertop perimeter and backsplash walls. Our master installation team sets your countertop slabs and installs your chosen backsplash tiles (hand-molded Zellige, 3D fluted marble, chevron mosaics, or full-height slab) in one seamless coordinated schedule.',
  },
  {
    q: 'What does your 15-Year Transferable Warranty cover?',
    a: 'Our warranty covers seam stability, structural fabrication integrity, precision sink mount bonding, and stain resistance from common household spills (coffee, lemon juice, wine, oils). If you ever sell your home, the warranty transfers to the new homeowner.',
  },
];

interface FAQSectionProps {
  onOpenBookCall: () => void;
}

export function FAQSection({ onOpenBookCall }: FAQSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-gray-50 border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-black mb-2">
            RESOURCES &amp; SUPPORT
          </div>
          <h2 className="text-2xl sm:text-3xl font-sans font-light tracking-[0.16em] uppercase text-black">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <div className="w-12 h-[2px] bg-black mx-auto mt-3 mb-4" />
          <p className="text-xs sm:text-sm text-gray-600">
            Clear, honest answers about stone selection, fabrication, templating, and care.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-2">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-gray-200 overflow-hidden shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-semibold text-black hover:bg-gray-50 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Help Banner */}
        <div className="mt-10 p-5 bg-white border border-gray-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <div className="font-bold text-black uppercase tracking-wider">Have an architectural plan or blueprint?</div>
            <div className="text-gray-500">Our commercial and residential estimation desk is available 7 days a week.</div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:18005847866"
              className="px-4 py-2 border border-gray-300 text-black hover:bg-black hover:text-white font-semibold transition"
            >
              (800) 584-STONE
            </a>
            <button
              onClick={onOpenBookCall}
              className="px-5 py-2 bg-black text-white hover:bg-gray-800 font-bold uppercase tracking-wider transition"
            >
              Book Call
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
