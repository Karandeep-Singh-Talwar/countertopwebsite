'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Hammer, 
  Layers, 
  DollarSign, 
  Palette, 
  Flame, 
  ShieldCheck, 
  Droplets, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Calculator,
  Download,
  Sparkles
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
      title: 'Any Contractor Can Install',
      highlight: 'Zero Specialized Stone Cutters Required',
      description:
        'Standard 3cm granite or quartzite slabs require heavy crane logistics, expensive waterjet fabrication shops, and specialized stone cutters charging upwards of $70–$100 per square foot for labor. At 9mm thickness, our high-gloss vitrified porcelain can be precision-cut, mitred, and installed directly on-site by your existing tile installer or general contractor.',
      stat: '50–70% Lower Labor Cost',
      image: '/catalog/products/room_volcano_green.jpg',
      points: [
        'Installs with standard commercial tile wet saws & diamond blades',
        'Lightweight (29 kg / box) – no reinforced cabinet framing required',
        'Eliminates 4–6 week delays waiting for third-party stone fabricators',
        'Straightforward mitred edges or edge-profile trims',
      ],
    },
    {
      id: 'continuity' as const,
      icon: Layers,
      title: 'Seamless Multi-Surface Continuity',
      highlight: 'Island + Full Backsplash + Floor in 1 Exact Match',
      description:
        'Traditional stone requires buying multiple disparate materials for countertops, backsplashes, and floor tile. With our architectural porcelain, the exact same slab design flows effortlessly from the kitchen island, up the full-height backsplash wall, and seamlessly across the kitchen floor.',
      stat: '100% Color & Vein Harmony',
      image: '/catalog/products/room_calcatta_extra.jpg',
      points: [
        'Single material order covers countertops, backsplashes, and flooring',
        'Large-format 600x1200 mm reduces grout lines by up to 80%',
        'Bookmatched continuous random faces for realistic natural veining',
        'Suitable for indoor kitchens, outdoor BBQs, and wet bathrooms',
      ],
    },
    {
      id: 'cost' as const,
      icon: DollarSign,
      title: 'Affordable High-End Luxury',
      highlight: 'Italian Marble Elegance at 40–60% Less Cost',
      description:
        'Natural quarried Calacatta Gold or Brazilian Amazonite easily costs $120–$250/sq.ft plus heavy fabrication waste. Our vitrified porcelain delivers the identical high-gloss crystalline visual depth starting from just $24–$38/sq.ft, saving thousands on home and commercial renovations.',
      stat: '$24–$38 / sq.ft vs $150+ Natural Stone',
      image: '/catalog/products/room_amazonite.jpg',
      points: [
        '40% to 60% total project cost savings including installation',
        'Zero waste from fractured quarry stone fissures',
        'Consistent pricing without unpredictable quarry tier premiums',
        'High resale value with zero ongoing sealing costs',
      ],
    },
    {
      id: 'designs' as const,
      icon: Palette,
      title: 'Vast Design Library (80+ Styles)',
      highlight: 'Exotic Gemstones, Crystalline Onyx & Bookmatched Veining',
      description:
        'Natural stone quarries are limited by what is mined underground. Advanced high-definition vitrified glazing technology replicates the worlds rarest geological minerals: dramatic Calacatta Renoir, jade Bellagio Green, iridescent Labradorite, and 24k gold Fuji Black—all available on-demand.',
      stat: '80+ High-Gloss Designs in Catalog',
      image: '/catalog/products/room_fuji_gold.jpg',
      points: [
        'High-definition Italian glazing technology for deep 3D optical clarity',
        'Up to 8 continuous random faces per design to prevent repeat patterns',
        'Mirror high-gloss finish reflects natural interior daylight',
        'Matching 600x600 mm and 600x1200 mm formats for flexible layouts',
      ],
    },
    {
      id: 'durability' as const,
      icon: ShieldCheck,
      title: 'Indestructible Performance',
      highlight: '< 0.04% Water Absorption · 100% Heat & Acid Proof',
      description:
        'Unlike natural marble which etches from lemon juice, coffee, or wine, and engineered quartz which melts under hot pots above 300°F, vitrified porcelain is fired at over 1200°C. Place scorching pans directly on the surface and wipe away turmeric, oil, or red wine with zero staining.',
      stat: '< 0.04% Porosity (Impermeable)',
      image: '/catalog/products/room_grigio_collemandian.jpg',
      points: [
        'Zero sealing required ever—stain-proof against red wine, oils, and coffee',
        'Thermal shock resistant—place hot cookware directly on the slab',
        'Mohs 5+ hardness resists knife scratches and kitchen utensil impacts',
        'UV ray proof—will never yellow, discolor, or fade in sunny spaces',
      ],
    },
  ];

  const currentPillar = pillars.find((p) => p.id === activeTab) || pillars[0];

  return (
    <section id="usp-section" className="scroll-mt-20 w-full bg-[#18181A] text-white py-20 md:py-28 select-none border-b border-[#2D2D30]">
      <div className="max-w-[1680px] mx-auto px-6 md:px-12">
        {/* Header Block */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-amber-500/30 bg-amber-950/40 text-amber-300 text-[11px] uppercase tracking-[0.2em] font-medium rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>The Porcelain Countertop Advantage</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-sans font-light tracking-tight text-white leading-[1.08]">
            Why Modern Contractors & Designers Prefer Porcelain
          </h2>
          <p className="mt-4 text-white/75 text-base sm:text-lg leading-relaxed font-light">
            Traditional slab countertops require specialized stone fabricators, crane delivery, and high maintenance. Our large-format porcelain slabs empower your existing contractor to install luxury surfaces across countertops, backsplashes, and floors at half the cost.
          </p>
        </div>

        {/* 5 Interactive Pillars Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-10 pb-6 border-b border-white/10">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            const isActive = activeTab === pillar.id;

            return (
              <button
                key={pillar.id}
                onClick={() => setActiveTab(pillar.id)}
                className={`flex items-center gap-2.5 p-3.5 sm:p-4 text-left border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'border-amber-500 bg-white/10 text-white shadow-lg'
                    : 'border-white/10 bg-white/[0.02] text-white/60 hover:text-white hover:border-white/30'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-white/40'}`} />
                <span className="text-[12px] sm:text-[13px] font-medium tracking-wide line-clamp-1">
                  {pillar.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Pillar Feature Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center bg-[#212124] border border-white/10 p-6 sm:p-10 lg:p-12 mb-16">
          {/* Left Text Detail */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-[11px] font-semibold tracking-wider uppercase border border-amber-500/30 rounded">
                {currentPillar.stat}
              </span>
              <span className="text-white/40 text-[12px] tracking-wider uppercase">
                Architectural Vitrified Standard
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-sans font-light tracking-tight text-white">
              {currentPillar.title}
            </h3>

            <p className="text-amber-200/90 text-sm sm:text-base font-serif italic">
              {currentPillar.highlight}
            </p>

            <p className="text-white/80 text-[14px] sm:text-[15px] leading-relaxed font-normal">
              {currentPillar.description}
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/10">
              {currentPillar.points.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-[13px] text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => onOpenQuoteModal({ material: 'High Gloss Porcelain Slabs' })}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black text-[12px] uppercase tracking-[0.16em] font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Calculate Porcelain Savings</span>
              </button>

              <button
                onClick={onExploreCatalog}
                className="px-6 py-3.5 border border-white/30 hover:border-white text-white text-[12px] uppercase tracking-[0.16em] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Browse Porcelain Slabs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Image Showcase */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/20 bg-black/40 shadow-2xl">
              <Image
                src={currentPillar.image}
                alt={currentPillar.title}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-amber-300 block">
                    Actual Architectural Mockup
                  </span>
                  <span className="text-[13px] font-medium text-white">
                    High Gloss Vitrified 600x1200mm
                  </span>
                </div>
                <span className="text-[11px] text-white/70 px-2.5 py-1 bg-black/60 backdrop-blur-sm border border-white/20">
                  9 mm Thickness
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Head-to-Head Comparison Table */}
        <div className="border border-white/10 bg-[#1e1e22] overflow-x-auto">
          <div className="p-6 border-b border-white/10">
            <h4 className="text-xl font-sans font-light text-white">
              Surface Comparison: Porcelain vs. Quarried Stone vs. Quartz
            </h4>
            <p className="text-xs text-white/60 mt-1">
              Data verified against ASTM and ISO 13006 / ISO 10545 testing standards
            </p>
          </div>

          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-white/50 bg-black/30">
                <th className="py-4 px-6 font-medium">Evaluation Criterion</th>
                <th className="py-4 px-6 font-medium text-amber-400 bg-amber-950/20">
                  Porcelain Countertop (Our Flagship USP)
                </th>
                <th className="py-4 px-6 font-medium">Traditional Natural Stone</th>
                <th className="py-4 px-6 font-medium">Engineered Quartz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[13px] text-white/80">
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Installation Process</td>
                <td className="py-3.5 px-6 text-emerald-400 font-semibold bg-amber-950/10">
                  Any tile setter or general contractor can install
                </td>
                <td className="py-3.5 px-6 text-white/60">
                  Requires specialized stone cutter & crane crew
                </td>
                <td className="py-3.5 px-6 text-white/60">
                  Requires specialized shop tooling
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Average Installed Cost</td>
                <td className="py-3.5 px-6 text-emerald-400 font-semibold bg-amber-950/10">
                  $35 – $65 / sq.ft (Total with Labor)
                </td>
                <td className="py-3.5 px-6 text-rose-300">
                  $120 – $250+ / sq.ft
                </td>
                <td className="py-3.5 px-6 text-white/60">
                  $75 – $140 / sq.ft
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Multi-Surface Continuity</td>
                <td className="py-3.5 px-6 text-emerald-400 font-semibold bg-amber-950/10">
                  Identical match for Countertop + Wall + Floor
                </td>
                <td className="py-3.5 px-6 text-white/60">
                  Flooring slabs are too thick & heavy
                </td>
                <td className="py-3.5 px-6 text-white/60">
                  Rarely usable as flooring tile
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Water Absorption / Porosity</td>
                <td className="py-3.5 px-6 text-emerald-400 font-semibold bg-amber-950/10">
                  &lt; 0.04% (Zero Sealing Ever Needed)
                </td>
                <td className="py-3.5 px-6 text-rose-300">
                  0.5% – 2.0% (Must be sealed every 6–12 mos)
                </td>
                <td className="py-3.5 px-6 text-white/60">
                  0.05% (Resin-bound)
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Heat & Hot Pan Resistance</td>
                <td className="py-3.5 px-6 text-emerald-400 font-semibold bg-amber-950/10">
                  Fired at 1200°C · Place hot pots directly
                </td>
                <td className="py-3.5 px-6 text-white/60">
                  Good, but can crack from thermal shock
                </td>
                <td className="py-3.5 px-6 text-rose-300">
                  Resin burns / discolors above 300°F
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Weight & Thickness</td>
                <td className="py-3.5 px-6 text-emerald-400 font-semibold bg-amber-950/10">
                  9 mm (Lightweight 29kg box, no frame reinforcement)
                </td>
                <td className="py-3.5 px-6 text-rose-300">
                  20mm – 30mm (Extremely heavy, requires strong subfloor)
                </td>
                <td className="py-3.5 px-6 text-white/60">
                  20mm – 30mm
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
