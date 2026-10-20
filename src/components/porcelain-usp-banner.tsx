'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Hammer, 
  Layers, 
  DollarSign, 
  Palette, 
  ShieldCheck, 
  ArrowRight, 
  Calculator
} from 'lucide-react';

interface PorcelainUspBannerProps {
  onOpenQuoteModal: (opts?: { material?: string }) => void;
  onOpenBookCall: (opts?: { service?: string; material?: string }) => void;
  onExploreCatalog: () => void;
}

export function PorcelainUspBanner({
  onOpenQuoteModal,
  onOpenBookCall,
  onExploreCatalog,
}: PorcelainUspBannerProps) {
  const [activeTab, setActiveTab] = useState<'contractor' | 'continuity' | 'cost' | 'designs' | 'durability'>('contractor');

  const pillars = [
    {
      id: 'contractor' as const,
      icon: Hammer,
      tabTitle: 'Contractor Installable',
      title: 'Any General Contractor or Tile Setter Can Install',
      highlight: 'Zero Specialized CNC Stone Fabrication Required',
      description:
        'Standard 3cm granite or quartzite slabs require heavy crane logistics, expensive waterjet fabrication shops, and specialized stone cutters charging $70–$100/sq.ft for labor. At 9mm thickness, our high-gloss vitrified porcelain can be precision-cut, mitred, and installed directly on-site by your existing tile installer or general contractor.',
      stat: '50–70% Lower Labor Cost',
      image: '/catalog/products/room_volcano_green.jpg',
      points: [
        'Installs with standard commercial tile wet saws & diamond blades',
        'Lightweight (29 kg / box) – no reinforced cabinetry required',
        'Eliminates 4–6 week delays waiting for third-party stone cutters',
        'Straightforward on-site mitred waterfall edges & backsplashes',
      ],
    },
    {
      id: 'continuity' as const,
      icon: Layers,
      tabTitle: 'Surface Continuity',
      title: 'Seamless Island, Backsplash & Floor Harmony',
      highlight: 'Island + Full Backsplash + Floor in 1 Exact Batch',
      description:
        'Traditional stone requires buying disparate materials for countertops, backsplashes, and floor tile. With our architectural porcelain, the exact same high-gloss vitrified slab design flows effortlessly from the kitchen island, up the full-height backsplash wall, and seamlessly across the kitchen floor.',
      stat: '100% Color & Vein Harmony',
      image: '/catalog/products/room_calcatta_extra.jpg',
      points: [
        'Single material order covers countertops, backsplashes, and flooring',
        'Large-format 600×1200mm eliminates up to 80% of grout lines',
        'Continuous random faces prevent artificial pattern repetition',
        'Suitable for indoor kitchens, outdoor BBQs, and wet bath walls',
      ],
    },
    {
      id: 'cost' as const,
      icon: DollarSign,
      tabTitle: 'Direct Wholesale Cost',
      title: 'High-End Italian Luxury at 40–60% Less Cost',
      highlight: 'Italian Marble Elegance Starting at $24/sq.ft',
      description:
        'Natural quarried Calacatta Gold or Brazilian Amazonite easily costs $120–$250/sq.ft plus heavy fabrication waste. Our vitrified porcelain delivers the identical high-gloss crystalline visual depth starting from just $24–$38/sq.ft, saving thousands on renovations.',
      stat: '$24–$38 / sq.ft vs $150+ Natural Stone',
      image: '/catalog/products/room_amazonite.jpg',
      points: [
        '40% to 60% total project cost savings including installation',
        'Zero waste from fractured quarry stone fissures',
        'Transparent direct-to-jobsite pallet freight pricing',
        'Zero ongoing chemical sealant or re-polishing costs',
      ],
    },
    {
      id: 'designs' as const,
      icon: Palette,
      tabTitle: '80+ Design Library',
      title: 'Exotic Gemstones, Crystalline Minerals & Bookmatching',
      highlight: 'Rare Geologies Replicated with Italian Glazing Precision',
      description:
        'Natural stone quarries are limited by what is mined underground. Advanced Italian high-definition vitrified glazing technology replicates the worlds rarest geological minerals: dramatic Calacatta Renoir, jade Bellagio Green, iridescent Labradorite, and 24k gold Fuji Black.',
      stat: '80+ Vitrified Slab Designs',
      image: '/catalog/products/room_fuji_gold.jpg',
      points: [
        'Deep optical 3D clarity mimicking million-year natural crystallization',
        'Up to 8 continuous random faces per design to ensure organic flow',
        'Mirror high-gloss finish reflects natural interior daylight',
        'Available in matching 600×1200mm and 600×600mm formats',
      ],
    },
    {
      id: 'durability' as const,
      icon: ShieldCheck,
      tabTitle: 'Indestructible Performance',
      title: 'Non-Porous, Hot Pan Safe & Zero Maintenance',
      highlight: 'Fired at 1200°C · <0.04% Water Absorption',
      description:
        'Unlike porous marble that etches from lemon juice or quartz that discolors from hot pots, vitrified porcelain is completely vitrified at extreme temperatures. Place boiling Dutch ovens directly on the surface without trivets, and wipe red wine or turmeric clean with zero staining.',
      stat: '0% Chemical Sealing Ever Required',
      image: '/catalog/products/room_bellagio_green.jpg',
      points: [
        '100% heat proof: place hot pans directly without heat mats',
        'Impervious to coffee, red wine, curry, and citrus acid stains',
        'UV & weather resistant: flawless for outdoor kitchens & bars',
        'Hygienic NSF-equivalent non-porous food prep surface',
      ],
    },
  ];

  const currentPillar = pillars.find((p) => p.id === activeTab) || pillars[0];

  return (
    <section id="usp-section" className="scroll-mt-20 w-full bg-[#111113] py-24 md:py-36 text-white border-t border-white/5">
      <div className="max-w-[1680px] mx-auto px-6 md:px-12">
        {/* Section Header: Open & Architectural */}
        <div className="max-w-3xl mb-16">
          <div className="text-[11px] uppercase tracking-[0.25em] text-amber-500/80 mb-3 font-mono">
            01 / Flagship Technology
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light tracking-tight text-white leading-[1.08]">
            Why Modern Contractors & Designers Prefer Porcelain
          </h2>
          <p className="mt-5 text-white/60 text-base sm:text-lg font-light leading-relaxed">
            Eliminate specialized stone fabricator markups, crane delivery, and high maintenance. Our large-format 9mm vitrified slabs empower your existing contractor to install luxury surfaces across countertops, backsplashes, and floors at half the cost.
          </p>
        </div>

        {/* Minimalist Tab Navigation: Seamless underline, ZERO box buttons */}
        <div className="flex items-center gap-8 md:gap-12 overflow-x-auto pb-4 mb-16 border-b border-white/10 no-scrollbar">
          {pillars.map((pillar) => {
            const isActive = activeTab === pillar.id;

            return (
              <button
                key={pillar.id}
                onClick={() => setActiveTab(pillar.id)}
                className={`group pb-4 text-xs sm:text-[13px] uppercase tracking-[0.18em] font-medium transition-all relative whitespace-nowrap cursor-pointer ${
                  isActive ? 'text-amber-400' : 'text-white/40 hover:text-white'
                }`}
              >
                <span>{pillar.tabTitle}</span>
                {isActive && (
                  <motion.div
                    layoutId="uspTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Fluid Split Presentation: ZERO container boxes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center mb-28">
          {/* Left: Refined Editorial Typography */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-[12px] font-mono tracking-[0.2em] uppercase text-amber-400/90">
              {currentPillar.stat}
            </div>

            <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light tracking-tight text-white leading-tight">
              {currentPillar.title}
            </h3>

            <p className="text-amber-200/80 text-sm sm:text-base font-serif italic">
              {currentPillar.highlight}
            </p>

            <p className="text-white/70 text-[15px] sm:text-[16px] leading-relaxed font-light">
              {currentPillar.description}
            </p>

            {/* Clean Spec Points with Hairline Dividers */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              {currentPillar.points.map((pt, idx) => (
                <div key={idx} className="flex items-baseline gap-3 text-[14px] text-white/80 font-light">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            {/* Borderless Editorial Actions */}
            <div className="flex flex-wrap items-center gap-8 pt-6">
              <button
                onClick={() => onOpenQuoteModal({ material: 'High Gloss Porcelain Slabs' })}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-amber-400 hover:text-amber-300 py-1 border-b border-amber-400/50 hover:border-amber-300 transition-all cursor-pointer"
              >
                <Calculator className="w-4 h-4" />
                <span>Calculate Your Project Savings</span>
              </button>

              <button
                onClick={onExploreCatalog}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-white/70 hover:text-white py-1 border-b border-white/20 hover:border-white transition-all cursor-pointer"
              >
                <span>Browse Porcelain Slabs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Expansive Architectural Visual */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[16/11] w-full overflow-hidden bg-black/50">
              <Image
                src={currentPillar.image}
                alt={currentPillar.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 z-10 flex items-end justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-amber-400 font-mono">
                    Architectural Interior Mockup
                  </div>
                  <div className="text-sm font-medium text-white mt-1">
                    600×1200mm High-Gloss Vitrified Slabs
                  </div>
                </div>
                <div className="text-xs text-white/70 font-mono">
                  9mm Monolithic Thickness
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Head-to-Head Comparison Matrix: Open, Borderless Sheet with Hairlines */}
        <div className="border-t border-white/10 pt-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-white/40 mb-2 font-mono">
                ASTM & ISO 13006 Verified Metrics
              </div>
              <h4 className="text-2xl sm:text-3xl font-serif font-light text-white">
                Surface Comparison Matrix
              </h4>
            </div>
            <p className="text-xs text-white/50 max-w-md font-light">
              Benchmarked across national US residential renovation data for slab material, tooling, and labor overhead.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/20 text-[11px] uppercase tracking-[0.2em] text-white/40 font-mono">
                  <th className="py-4 pr-6 font-normal">Criterion</th>
                  <th className="py-4 px-6 font-medium text-amber-400">
                    Vitrified Porcelain (Flagship)
                  </th>
                  <th className="py-4 px-6 font-normal">Natural Quarried Stone</th>
                  <th className="py-4 pl-6 font-normal">Engineered Quartz</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-[14px]">
                <tr>
                  <td className="py-5 pr-6 font-medium text-white/90">Installation Method</td>
                  <td className="py-5 px-6 text-emerald-400 font-medium">
                    Any general contractor / tile setter with standard wet saw
                  </td>
                  <td className="py-5 px-6 text-white/60 font-light">
                    Specialized stone fabrication shop & crane crew
                  </td>
                  <td className="py-5 pl-6 text-white/60 font-light">
                    Specialized shop cutting & diamond polishers
                  </td>
                </tr>
                <tr>
                  <td className="py-5 pr-6 font-medium text-white/90">Total Installed Cost</td>
                  <td className="py-5 px-6 text-emerald-400 font-medium">
                    $35 – $65 / sq.ft (Material + On-Site Labor)
                  </td>
                  <td className="py-5 px-6 text-rose-300 font-light">
                    $120 – $250+ / sq.ft
                  </td>
                  <td className="py-5 pl-6 text-white/60 font-light">
                    $75 – $140 / sq.ft
                  </td>
                </tr>
                <tr>
                  <td className="py-5 pr-6 font-medium text-white/90">Multi-Surface Flow</td>
                  <td className="py-5 px-6 text-emerald-400 font-medium">
                    Identical slab matching for Island + Backsplash + Floor
                  </td>
                  <td className="py-5 px-6 text-white/60 font-light">
                    Flooring slabs too thick & heavy (impossible continuity)
                  </td>
                  <td className="py-5 pl-6 text-white/60 font-light">
                    Rarely calibrated for floor tile use
                  </td>
                </tr>
                <tr>
                  <td className="py-5 pr-6 font-medium text-white/90">Water Absorption</td>
                  <td className="py-5 px-6 text-emerald-400 font-medium">
                    &lt; 0.04% · Zero chemical sealing ever needed
                  </td>
                  <td className="py-5 px-6 text-rose-300 font-light">
                    0.5% – 2.0% · Must be re-sealed every 6–12 months
                  </td>
                  <td className="py-5 pl-6 text-white/60 font-light">
                    0.05% (Polymer resin-bound)
                  </td>
                </tr>
                <tr>
                  <td className="py-5 pr-6 font-medium text-white/90">Thermal Hot Pan Tolerance</td>
                  <td className="py-5 px-6 text-emerald-400 font-medium">
                    Fired at 1200°C · Direct hot pots safe
                  </td>
                  <td className="py-5 px-6 text-white/60 font-light">
                    Susceptible to thermal shock cracking
                  </td>
                  <td className="py-5 pl-6 text-rose-300 font-light">
                    Resin burns / turns yellow above 300°F
                  </td>
                </tr>
                <tr>
                  <td className="py-5 pr-6 font-medium text-white/90">Weight & Handling</td>
                  <td className="py-5 px-6 text-emerald-400 font-medium">
                    9mm lightweight (29kg box, no frame reinforcement)
                  </td>
                  <td className="py-5 px-6 text-rose-300 font-light">
                    20–30mm heavy mass (requires reinforced cabinetry)
                  </td>
                  <td className="py-5 pl-6 text-white/60 font-light">
                    20–30mm heavy mass
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
