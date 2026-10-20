'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Check, Calculator, Calendar, ArrowRight, Sparkles, Layers, Sliders } from 'lucide-react';

interface InCommonSwatchesProps {
  onOpenQuoteModal: (opts?: { material?: string }) => void;
  onOpenBookCall: (opts?: { material?: string; service?: string }) => void;
}

export function InCommonSwatches({
  onOpenQuoteModal,
  onOpenBookCall,
}: InCommonSwatchesProps) {
  const [selectedMaterialType, setSelectedMaterialType] = useState<'quartz' | 'marble' | 'quartzite' | 'porcelain' | 'tiles'>('quartz');
  const [selectedColorFilter, setSelectedColorFilter] = useState<string>('all');
  const [activeStoneIndex, setActiveStoneIndex] = useState<number>(0);
  const [selectedFinish, setSelectedFinish] = useState<'honed' | 'polished' | 'leathered'>('honed');

  const materialCatalog: Record<string, {
    typeName: string;
    description: string;
    finishes: ('honed' | 'polished' | 'leathered')[];
    stones: {
      id: string;
      name: string;
      colorCategory: string;
      colorHex: string;
      colorDesc: string;
      pricePerSqFt: number;
      origin: string;
      hardness: string;
      porosity: string;
      stockSlabs: number;
      image: string;
      specularTone: string;
    }[];
  }> = {
    quartz: {
      typeName: 'Engineered Quartz',
      description: 'Manufactured with 93% crushed natural quartz crystal and resin. Stain-proof, acid-resistant, and zero-maintenance.',
      finishes: ['polished', 'honed', 'leathered'],
      stones: [
        {
          id: 'q-calacatta-gold',
          name: 'Calacatta Gold Supreme Quartz',
          colorCategory: 'white-gold',
          colorHex: '#F6F3EE',
          colorDesc: 'Luminous warm alabaster base with dramatic ribbons of honey gold and charcoal.',
          pricePerSqFt: 82,
          origin: 'Milan, Italy',
          hardness: '7.0 Mohs',
          porosity: '0.01% (Zero Porosity)',
          stockSlabs: 18,
          image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          specularTone: 'rgba(235, 215, 175, 0.4)',
        },
        {
          id: 'q-pure-arctic',
          name: 'Pure Arctic White Quartz',
          colorCategory: 'white',
          colorHex: '#FBFBFA',
          colorDesc: 'Ultra-pure crisp white with subtle micro-crystalline sparkle in direct sunlight.',
          pricePerSqFt: 72,
          origin: 'Verona, Italy',
          hardness: '7.0 Mohs',
          porosity: '0.01%',
          stockSlabs: 24,
          image: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1200&q=80',
          specularTone: 'rgba(255, 255, 255, 0.5)',
        },
        {
          id: 'q-slate-gray',
          name: 'Gris Velvet Slate Quartz',
          colorCategory: 'gray',
          colorHex: '#7C8187',
          colorDesc: 'Moody concrete-inspired charcoal with delicate mineral clouding and velvet touch.',
          pricePerSqFt: 78,
          origin: 'Valencia, Spain',
          hardness: '7.0 Mohs',
          porosity: '0.02%',
          stockSlabs: 12,
          image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
          specularTone: 'rgba(160, 170, 180, 0.3)',
        },
        {
          id: 'q-charcoal-noir',
          name: 'Nero Marquina Quartz',
          colorCategory: 'black',
          colorHex: '#222326',
          colorDesc: 'Deep midnight obsidian with high-contrast electric white thunder veining.',
          pricePerSqFt: 88,
          origin: 'Castellón, Spain',
          hardness: '7.0 Mohs',
          porosity: '0.01%',
          stockSlabs: 15,
          image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
          specularTone: 'rgba(255, 255, 255, 0.4)',
        },
        {
          id: 'q-amber-onyx',
          name: 'Onyx Amber Translucent Quartz',
          colorCategory: 'amber',
          colorHex: '#C59A64',
          colorDesc: 'Warm honey amber bands with semi-translucent back-lighting capability.',
          pricePerSqFt: 96,
          origin: 'Tuscany, Italy',
          hardness: '7.0 Mohs',
          porosity: '0.01%',
          stockSlabs: 8,
          image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
          specularTone: 'rgba(240, 190, 110, 0.5)',
        },
      ],
    },
    marble: {
      typeName: 'Natural Italian Marble',
      description: 'Metamorphic rock formed from recrystallized carbonate minerals. Famous for soft patina, dramatic movement, and cool surface temperature.',
      finishes: ['honed', 'polished', 'leathered'],
      stones: [
        {
          id: 'm-calacatta-viola',
          name: 'Calacatta Viola Heritage Marble',
          colorCategory: 'purple-gold',
          colorHex: '#583C48',
          colorDesc: 'Cream ivory marble field enriched with deep burgundy, wine, and violet breccia.',
          pricePerSqFt: 145,
          origin: 'Carrara, Italy',
          hardness: '3.5 Mohs',
          porosity: '0.15% (Requires Seal)',
          stockSlabs: 6,
          image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          specularTone: 'rgba(215, 175, 195, 0.35)',
        },
        {
          id: 'm-carrara-bianco',
          name: 'Carrara Bianco Honed Marble',
          colorCategory: 'white',
          colorHex: '#EAEAE6',
          colorDesc: 'Timeless Roman classic with feathered smoky gray veining on pearl white field.',
          pricePerSqFt: 85,
          origin: 'Tuscany, Italy',
          hardness: '3.5 Mohs',
          porosity: '0.12%',
          stockSlabs: 20,
          image: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1200&q=80',
          specularTone: 'rgba(230, 230, 230, 0.4)',
        },
        {
          id: 'm-verde-alpi',
          name: 'Verde Alpi Emerald Marble',
          colorCategory: 'green',
          colorHex: '#254134',
          colorDesc: 'Deep alpine pine forest with brecciated serpentine emerald and calcite fractures.',
          pricePerSqFt: 135,
          origin: 'Aosta Valley, Italy',
          hardness: '4.0 Mohs',
          porosity: '0.10%',
          stockSlabs: 7,
          image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1200&q=80',
          specularTone: 'rgba(140, 210, 170, 0.3)',
        },
      ],
    },
    quartzite: {
      typeName: 'Monolithic Quartzite',
      description: '100% natural sandstone metamorphic rock subjected to heat and tectonic pressure. Harder than granite, acid-proof, and naturally heat-proof.',
      finishes: ['honed', 'leathered', 'polished'],
      stones: [
        {
          id: 'qz-taj-mahal',
          name: 'Taj Mahal Satin Quartzite',
          colorCategory: 'cream-gold',
          colorHex: '#DED5C5',
          colorDesc: 'Semi-translucent crystalline depth with warm caramel, taupe, and ivory ribbons.',
          pricePerSqFt: 110,
          origin: 'Bahia, Brazil',
          hardness: '7.5 Mohs (Harder than Knife Steel)',
          porosity: '0.04%',
          stockSlabs: 16,
          image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
          specularTone: 'rgba(230, 210, 180, 0.45)',
        },
        {
          id: 'qz-super-white',
          name: 'Super White Dolomite Quartzite',
          colorCategory: 'white-gray',
          colorHex: '#D5D7DC',
          colorDesc: 'Chiseled glacial swirls of silvery mist, pewter, and cool arctic chalk.',
          pricePerSqFt: 98,
          origin: 'Espirito Santo, Brazil',
          hardness: '7.0 Mohs',
          porosity: '0.05%',
          stockSlabs: 11,
          image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
          specularTone: 'rgba(210, 220, 230, 0.35)',
        },
      ],
    },
    porcelain: {
      typeName: 'Sintered Porcelain Slabs',
      description: 'Natural clay and feldspar minerals compressed under 25,000 tons and fired at 1,200°C. Virtually indestructible, UV-stable for indoor/outdoor.',
      finishes: ['honed', 'polished'],
      stones: [
        {
          id: 'p-laurent-noir',
          name: 'Laurent Sintered Porcelain',
          colorCategory: 'black-gold',
          colorHex: '#21201E',
          colorDesc: 'Charcoal graphite velvet canvas scored with dramatic fiery copper-gold seams.',
          pricePerSqFt: 76,
          origin: 'Castellón, Spain',
          hardness: '8.0 Mohs',
          porosity: '0.00% (Absolute Zero)',
          stockSlabs: 22,
          image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
          specularTone: 'rgba(240, 170, 90, 0.4)',
        },
        {
          id: 'p-statuario-matte',
          name: 'Statuario Pure Matte Porcelain',
          colorCategory: 'white',
          colorHex: '#F7F6F3',
          colorDesc: 'Architectural matte finish mimicking rare Carrara Statuario with feather-soft gray plumes.',
          pricePerSqFt: 74,
          origin: 'Modena, Italy',
          hardness: '8.0 Mohs',
          porosity: '0.00%',
          stockSlabs: 19,
          image: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1200&q=80',
          specularTone: 'rgba(255, 255, 255, 0.4)',
        },
      ],
    },
    tiles: {
      typeName: 'Handcrafted Architectural Tiles',
      description: 'Artisanal clay and terracotta tiles hand-glazed and kiln-fired. Ideal for kitchen backsplashes, shower sanctuaries, and fireplace surrounds.',
      finishes: ['honed'],
      stones: [
        {
          id: 't-zellige-snow',
          name: 'Artisan Moroccan Zellige Blanc',
          colorCategory: 'white',
          colorHex: '#F0ECE4',
          colorDesc: 'Organic undulating surface with pearlescent milk-white glaze and chiseled edges.',
          pricePerSqFt: 18.5,
          origin: 'Fez, Morocco',
          hardness: 'Hand-Molded Clay',
          porosity: 'Glazed Enamel Seal',
          stockSlabs: 450,
          image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1200&q=80',
          specularTone: 'rgba(245, 240, 230, 0.5)',
        },
        {
          id: 't-fluted-carrara',
          name: '3D Fluted Carrara Marble Tile',
          colorCategory: 'gray',
          colorHex: '#DCDCD8',
          colorDesc: 'Architectural fluted ribbing carved from solid Italian marble block for tactile light play.',
          pricePerSqFt: 34.0,
          origin: 'Carrara, Italy',
          hardness: 'Solid Carved Stone',
          porosity: 'Honed Seal',
          stockSlabs: 180,
          image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
          specularTone: 'rgba(220, 225, 230, 0.4)',
        },
      ],
    },
  };

  const currentCategory = materialCatalog[selectedMaterialType];
  const stones = currentCategory.stones;
  const activeStone = stones[activeStoneIndex] || stones[0];

  return (
    <section id="swatches-section" className="w-full bg-[#FAF8F5] py-20 md:py-28 border-b border-[#E8E4DC] text-[#1A1A1A]">
      <div className="max-w-[1680px] mx-auto px-6 md:px-12">
        {/* Split Grid matching In Common With */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column Label */}
          <div className="md:col-span-3 lg:col-span-2">
            <h2 className="text-[12px] uppercase tracking-[0.18em] font-normal text-[#1A1A1A]/70 sticky top-28">
              Materials & Colorways
            </h2>
          </div>

          {/* Right Main Studio Area */}
          <div className="md:col-span-9 lg:col-span-10">
            {/* Headline */}
            <div className="mb-10">
              <h3 className="text-3xl sm:text-4xl font-sans font-light tracking-tight text-[#1A1A1A] mb-3">
                In-Page Colorway & Finish Studio
              </h3>
              <p className="text-[15px] sm:text-[16px] text-[#767168] max-w-2xl font-normal leading-relaxed">
                Select any material below to inspect real-time colorways, authentic quarry origins, surface sheen finishes, and itemized sq. ft. contractor pricing on this single page.
              </p>
            </div>

            {/* Material Category Tabs */}
            <div className="flex flex-wrap gap-2 pb-6 border-b border-[#E8E4DC]">
              {[
                { id: 'quartz', label: 'Quartz Slabs' },
                { id: 'quartzite', label: 'Natural Quartzite' },
                { id: 'marble', label: 'Italian Marble' },
                { id: 'porcelain', label: 'Sintered Porcelain' },
                { id: 'tiles', label: 'Architectural Tiles' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedMaterialType(tab.id as any);
                    setActiveStoneIndex(0);
                  }}
                  className={`px-5 py-2.5 text-[12px] uppercase tracking-[0.14em] font-medium transition-all cursor-pointer border ${
                    selectedMaterialType === tab.id
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'bg-white hover:bg-[#F2EFE9] text-[#1A1A1A] border-[#D9D4CC]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* In-Page Color Swatches Bar matching user request */}
            <div className="py-6 border-b border-[#E8E4DC] flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#767168] block mb-2 font-medium">
                  {currentCategory.typeName} Colorways:
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  {stones.map((st, idx) => (
                    <button
                      key={st.id}
                      onClick={() => setActiveStoneIndex(idx)}
                      className={`group flex items-center gap-2.5 px-3 py-1.5 border transition-all cursor-pointer ${
                        activeStoneIndex === idx
                          ? 'border-[#1A1A1A] bg-white ring-1 ring-[#1A1A1A]'
                          : 'border-[#D9D4CC] bg-[#F7F5F0] hover:bg-white'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/20 shadow-inner shrink-0"
                        style={{ backgroundColor: st.colorHex }}
                      />
                      <span className="text-[12px] text-[#1A1A1A] font-medium tracking-tight">
                        {st.name.split(' ')[0]} {st.name.split(' ')[1] || ''}
                      </span>
                      {activeStoneIndex === idx && <Check className="w-3 h-3 text-[#1A1A1A]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Surface Finish Selector */}
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#767168] block mb-2 font-medium">
                  Surface Honing Finish:
                </span>
                <div className="inline-flex border border-[#D9D4CC] divide-x divide-[#D9D4CC] text-[11px] uppercase tracking-wider bg-white">
                  {currentCategory.finishes.map((f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedFinish(f)}
                      className={`px-3.5 py-1.5 transition-colors cursor-pointer ${
                        selectedFinish === f
                          ? 'bg-[#1A1A1A] text-white font-medium'
                          : 'hover:bg-black/5 text-[#1A1A1A]'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Stone Detail Card */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#F3EFE9] border border-[#E0DCD4] p-8 md:p-12">
              {/* Stone Slab Photo with 3D sheen overlay */}
              <div className="lg:col-span-7">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-white border border-[#D9D4CC] shadow-md group">
                  <Image
                    src={activeStone.image}
                    alt={activeStone.name}
                    fill
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-60 group-hover:opacity-80"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${activeStone.specularTone} 0%, transparent 70%)`,
                    }}
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-md text-white text-[10px] uppercase tracking-widest font-mono">
                    {activeStone.stockSlabs} Slabs Available in Yard
                  </div>
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md text-[#1A1A1A] text-[10px] uppercase tracking-widest font-medium">
                    Finish: {selectedFinish}
                  </div>
                </div>
              </div>

              {/* Stone Specs & Conversion Buttons */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-[#767168] mb-1">
                    {activeStone.origin}
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-sans font-normal text-[#1A1A1A] tracking-tight mb-2">
                    {activeStone.name}
                  </h4>
                  <p className="text-[14px] text-[#767168] leading-relaxed mb-6">
                    {activeStone.colorDesc}
                  </p>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#DED9D0] text-[12px]">
                    <div>
                      <span className="text-[#767168] block uppercase text-[10px] tracking-wider">Hardness</span>
                      <span className="font-medium text-[#1A1A1A]">{activeStone.hardness}</span>
                    </div>
                    <div>
                      <span className="text-[#767168] block uppercase text-[10px] tracking-wider">Absorption</span>
                      <span className="font-medium text-[#1A1A1A]">{activeStone.porosity}</span>
                    </div>
                    <div>
                      <span className="text-[#767168] block uppercase text-[10px] tracking-wider">Standard Thickness</span>
                      <span className="font-medium text-[#1A1A1A]">2cm & 3cm Monolith</span>
                    </div>
                    <div>
                      <span className="text-[#767168] block uppercase text-[10px] tracking-wider">Turnkey Installed</span>
                      <span className="font-semibold text-amber-900">${activeStone.pricePerSqFt} / sq ft</span>
                    </div>
                  </div>
                </div>

                {/* Conversion CTAs */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() =>
                      onOpenQuoteModal({
                        material: `${activeStone.name} (${selectedFinish} finish)`,
                      })
                    }
                    className="flex-1 py-3.5 px-4 bg-[#1A1A1A] hover:bg-black text-white text-[11px] uppercase tracking-[0.16em] font-medium text-center transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Get Itemized Quote</span>
                  </button>

                  <button
                    onClick={() =>
                      onOpenBookCall({
                        material: `${activeStone.name} (${selectedFinish} finish)`,
                        service: 'Virtual Stone Selection & Slab Reservation',
                      })
                    }
                    className="flex-1 py-3.5 px-4 border border-[#1A1A1A] hover:bg-black/5 text-[#1A1A1A] text-[11px] uppercase tracking-[0.16em] font-medium text-center transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Call</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
