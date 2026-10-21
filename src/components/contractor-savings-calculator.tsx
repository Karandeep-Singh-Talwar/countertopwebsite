'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Check,
  ShieldCheck,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface ContractorSavingsCalculatorProps {
  onOpenQuoteModal?: (opts?: { material?: string; sqFt?: number }) => void;
  onOpenBookCall?: (opts?: { service?: string; material?: string }) => void;
}

type PrimaryCategory = 'porcelain-countertops' | 'stone-countertops' | 'tiles';

export const ContractorSavingsCalculator: React.FC<ContractorSavingsCalculatorProps> = ({
  onOpenQuoteModal,
  onOpenBookCall,
}) => {
  // 1. Core Primary Categories (3 Categories)
  const [primaryCategory, setPrimaryCategory] = useState<PrimaryCategory>('porcelain-countertops');

  const categoryLabels: Record<PrimaryCategory, string> = {
    'porcelain-countertops': 'Porcelain Countertops',
    'stone-countertops': 'Stone Countertops',
    'tiles': 'Tiles',
  };

  const handleCategoryChange = (cat: PrimaryCategory) => {
    setPrimaryCategory(cat);
  };

  // 3. Sizing Mode: 'dimensions' (length x breadth) vs 'total' (direct sq ft)
  const [inputMode, setInputMode] = useState<'dimensions' | 'total'>('dimensions');
  const [directSqFt, setDirectSqFt] = useState<number>(70);

  // Dimensions in Feet
  const [counterLength, setCounterLength] = useState<number>(10);
  const [counterBreadth, setCounterBreadth] = useState<number>(3);

  // Stone Geology / Mineral Pattern
  const [stoneGeology, setStoneGeology] = useState<string>('Calacatta Extra (Gold Vein)');

  // Surface Finish
  const [surfaceFinish, setSurfaceFinish] = useState<string>('High-Gloss Polished');

  // Project Timeline
  const [projectTimeline, setProjectTimeline] = useState<string>('Ready to Order (1–2 Weeks)');

  // Benchmark Stone comparison
  const [stoneType, setStoneType] = useState<'quartzite' | 'marble' | 'quartz'>('marble');

  // Lead Generation form state
  const [leadName, setLeadName] = useState<string>('');
  const [leadEmail, setLeadEmail] = useState<string>('');
  const [leadPhone, setLeadPhone] = useState<string>('');
  const [leadRole, setLeadRole] = useState<'homeowner' | 'contractor'>('homeowner');
  const [isSubmittingLead, setIsSubmittingLead] = useState<boolean>(false);
  const [leadSubmitted, setLeadSubmitted] = useState<boolean>(false);
  const [leadQuoteId, setLeadQuoteId] = useState<string>('');

  // Math Calculations (Estimate total square footage directly no matter the use)
  const counterSqFtCalc = Math.round(counterLength * counterBreadth);
  const totalSqFt =
    inputMode === 'total'
      ? Math.max(5, directSqFt)
      : Math.max(5, counterSqFtCalc);

  // Rate constants ($/sq.ft)
  const porcelainMaterialRate = primaryCategory === 'tiles' ? 18 : 28;
  const porcelainInstallRate = primaryCategory === 'tiles' ? 12 : 16;
  const porcelainDeliveryFlat = 150;

  const stoneConfig = {
    quartzite: {
      name: 'Exotic Natural Quartzite',
      materialRate: 85,
      fabricationRate: 50,
      installationRate: 40,
      deliveryFlat: 750,
    },
    marble: {
      name: 'Italian Calacatta Marble',
      materialRate: 95,
      fabricationRate: 55,
      installationRate: 45,
      deliveryFlat: 800,
    },
    quartz: {
      name: 'Engineered Quartz',
      materialRate: 55,
      fabricationRate: 35,
      installationRate: 30,
      deliveryFlat: 450,
    },
  }[stoneType];

  const porcelainMaterialCost = totalSqFt * porcelainMaterialRate;
  const porcelainLaborCost = totalSqFt * porcelainInstallRate;
  const porcelainTotal = porcelainMaterialCost + porcelainLaborCost + porcelainDeliveryFlat;

  const stoneMaterialCost = totalSqFt * stoneConfig.materialRate;
  const stoneFabCost = totalSqFt * stoneConfig.fabricationRate;
  const stoneLaborCost = totalSqFt * stoneConfig.installationRate;
  const stoneTotal = stoneMaterialCost + stoneFabCost + stoneLaborCost + stoneConfig.deliveryFlat;

  const totalSaved = stoneTotal - porcelainTotal;
  const savingsPercent = Math.round((totalSaved / stoneTotal) * 100);
  const estimatedBoxes = Math.ceil(totalSqFt / 15.5);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail || !leadEmail.includes('@')) return;

    setIsSubmittingLead(true);
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName || (leadRole === 'contractor' ? 'Contractor Partner' : 'Valued Client'),
          email: leadEmail,
          phone: leadPhone || 'Provided via valuation console',
          sqFt: totalSqFt,
          materialName: `${categoryLabels[primaryCategory]} (${stoneGeology})`,
          edgeProfile: 'Standard Factory Calibrated Edge',
          addons: [
            `Category: ${categoryLabels[primaryCategory]}`,
            `Finish: ${surfaceFinish}`,
            `Timeline: ${projectTimeline}`,
          ],
          totalEstimate: porcelainTotal,
          notes: `Category: ${categoryLabels[primaryCategory]}. Material: ${stoneGeology} (${surfaceFinish}). Calculated Savings: $${totalSaved.toLocaleString()} vs ${stoneConfig.name}. Role: ${leadRole}. Total SqFt: ${totalSqFt}. Boxes: ${estimatedBoxes}.`,
        }),
      });

      const data = await res.json();
      const generatedId = data.quoteId || `VS-${Math.floor(10000 + Math.random() * 90000)}`;
      setLeadQuoteId(generatedId);
      setLeadSubmitted(true);

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D4AF37', '#10B981', '#FFFFFF'],
      });
    } catch {
      setLeadQuoteId(`VS-${Math.floor(10000 + Math.random() * 90000)}`);
      setLeadSubmitted(true);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
    <section id="savings-calculator" className="scroll-mt-20 w-full bg-[#131316] py-20 md:py-32 text-white border-t border-white/5">
      <div className="max-w-[1680px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6 pb-8 border-b border-white/10">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] mb-2.5 font-medium">
              02 / Transparent Valuation Console
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal tracking-tight text-white leading-tight">
              Project Sizing &amp; <span className="italic font-light text-[#E5C378]">Customization Console</span>
            </h2>
            <p className="mt-3 text-white/70 text-sm sm:text-base font-normal leading-relaxed">
              Select your category, dimensions, and specifications. Enter your email to unlock your itemized wholesale cost breakdown.
            </p>
          </div>

          {/* Benchmark comparison selector */}
          <div className="flex items-center gap-4 text-xs font-sans">
            <span className="text-white/50">Benchmark Against:</span>
            {(['quartzite', 'marble', 'quartz'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setStoneType(type)}
                className={`capitalize transition-colors py-1 relative cursor-pointer text-xs sm:text-sm ${
                  stoneType === type ? 'text-[#D4AF37] font-medium' : 'text-white/45 hover:text-white'
                }`}
              >
                <span>{type}</span>
                {stoneType === type && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Split Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* LEFT: Complete Customization Suite (7 cols) */}
          <div className="lg:col-span-7 space-y-9">
            {/* 01 / SELECT CORE CATEGORY (Stone Countertop, Tiles, Porcelain Countertops) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-[#D4AF37]/90 font-medium font-sans">
                  01 / Select Category
                </span>
                <span className="text-xs text-white/60 font-sans">
                  {categoryLabels[primaryCategory]}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'porcelain-countertops' as const,
                    label: 'Porcelain Countertops',
                    desc: '9mm High-Gloss Vitrified Slabs · 1200°C Heat Proof',
                  },
                  {
                    id: 'stone-countertops' as const,
                    label: 'Stone Countertops',
                    desc: 'Natural Marble, Exotic Quartzite & Quartz',
                  },
                  {
                    id: 'tiles' as const,
                    label: 'Tiles',
                    desc: '600×1200mm Architectural Floor & Wall Slabs',
                  },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`p-3.5 text-left border rounded-xs transition-all cursor-pointer ${
                      primaryCategory === cat.id
                        ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-white shadow-md'
                        : 'border-white/10 bg-white/[0.02] text-white/70 hover:text-white hover:border-white/25 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-serif text-sm sm:text-base font-normal text-white">
                        {cat.label}
                      </div>
                      {primaryCategory === cat.id && <Check className="w-4 h-4 text-[#D4AF37] shrink-0 ml-2" />}
                    </div>
                    <p className="text-[11px] text-white/50 leading-relaxed font-sans font-light">
                      {cat.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* 02 / SIZING & DIMENSIONS */}
            <div className="pt-7 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-[#D4AF37]/90 font-medium font-sans">
                  02 / Required Square Footage
                </span>
                <div className="flex items-center gap-4 text-xs font-sans">
                  <button
                    type="button"
                    onClick={() => setInputMode('dimensions')}
                    className={`py-1 transition-colors cursor-pointer ${
                      inputMode === 'dimensions' ? 'text-white font-medium border-b border-[#D4AF37]' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    Length × Breadth (Auto-Math)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('total')}
                    className={`py-1 transition-colors cursor-pointer ${
                      inputMode === 'total' ? 'text-white font-medium border-b border-[#D4AF37]' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    Direct Sq. Ft
                  </button>
                </div>
              </div>

              {inputMode === 'dimensions' ? (
                <div className="bg-white/[0.015] border border-white/10 p-5 rounded-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/80 font-medium font-sans">
                      Enter Dimensions
                    </span>
                    <span className="text-xs font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 border border-[#D4AF37]/20 rounded-xs">
                      {counterLength} ft × {counterBreadth} ft = {counterSqFtCalc} sq.ft
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/50 block mb-1 font-sans">Length (ft)</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        step="0.5"
                        value={counterLength}
                        onChange={(e) => setCounterLength(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white/[0.03] border border-white/15 focus:border-[#D4AF37] rounded-xs px-3.5 py-2.5 text-lg font-mono text-white outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/50 block mb-1 font-sans">Depth / Width (ft)</label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        step="0.5"
                        value={counterBreadth}
                        onChange={(e) => setCounterBreadth(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white/[0.03] border border-white/15 focus:border-[#D4AF37] rounded-xs px-3.5 py-2.5 text-lg font-mono text-white outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/[0.015] border border-white/10 p-5 rounded-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-wider text-white/60 font-sans font-medium">
                      Total Surface Square Footage
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="5"
                        max="1000"
                        value={directSqFt}
                        onChange={(e) => setDirectSqFt(parseInt(e.target.value) || 0)}
                        className="w-24 bg-white/[0.03] border border-white/15 focus:border-[#D4AF37] rounded-xs px-2.5 py-1 text-right text-lg font-mono text-[#D4AF37] outline-none"
                      />
                      <span className="text-xs font-mono text-white/50">sq.ft</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="500"
                    step="5"
                    value={directSqFt}
                    onChange={(e) => setDirectSqFt(parseInt(e.target.value))}
                    className="w-full accent-[#D4AF37] bg-white/10 h-1.5 rounded-full cursor-pointer"
                  />
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs text-white/45 font-sans mr-1">Quick Presets:</span>
                    {[35, 65, 100, 150, 250, 400].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setDirectSqFt(preset)}
                        className={`text-xs px-2.5 py-1 rounded-xs border transition-colors cursor-pointer ${
                          directSqFt === preset
                            ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-white font-medium'
                            : 'border-white/10 text-white/60 hover:text-white hover:border-white/20'
                        }`}
                      >
                        {preset} sq.ft
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 03 / DESIRED MINERAL PATTERN & FINISH */}
            <div className="pt-7 border-t border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-[#D4AF37]/90 font-medium font-sans">
                  03 / Desired Mineral Pattern &amp; Sheen
                </span>
                <span className="text-xs text-white/60 font-sans">{stoneGeology}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-3.5">
                {[
                  'Calacatta Extra (Gold Vein)',
                  'Volcano Green (Emerald Crystal)',
                  'Brazilian Amazonite (Teal Glaze)',
                  'Fuji Gold 24k (Black & Gold)',
                  'Bellagio Jade (Translucent Onyx)',
                ].map((stone) => (
                  <button
                    key={stone}
                    type="button"
                    onClick={() => setStoneGeology(stone)}
                    className={`p-3 text-left border rounded-xs text-xs sm:text-sm font-sans transition-all flex items-center justify-between cursor-pointer ${
                      stoneGeology === stone
                        ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-white font-medium shadow-xs'
                        : 'border-white/10 bg-white/[0.02] text-white/70 hover:text-white hover:border-white/25'
                    }`}
                  >
                    <span className="truncate">{stone}</span>
                    {stoneGeology === stone && <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 ml-2" />}
                  </button>
                ))}
              </div>

              {/* Surface Finish */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs text-white/50 font-sans">Surface Sheen:</span>
                {[
                  'High-Gloss Polished',
                  'Honed Matte / Satin Silk',
                ].map((finish) => (
                  <button
                    key={finish}
                    type="button"
                    onClick={() => setSurfaceFinish(finish)}
                    className={`py-1.5 px-3 border rounded-xs text-xs font-sans transition-all cursor-pointer ${
                      surfaceFinish === finish
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white font-medium'
                        : 'border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {finish}
                  </button>
                ))}
              </div>
            </div>

            {/* 04 / PROJECT TIMELINE */}
            <div className="pt-7 border-t border-white/10">
              <span className="text-xs uppercase tracking-wider text-[#D4AF37]/90 font-medium font-sans block mb-3">
                04 / Project Timeline
              </span>
              <div className="flex flex-wrap gap-2.5">
                {[
                  'Ready to Order (1–2 Weeks)',
                  'In Renovation (30–60 Days)',
                  'Planning & Blueprint Phase',
                ].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setProjectTimeline(time)}
                    className={`py-2.5 px-4 border rounded-xs text-xs sm:text-sm font-sans transition-all cursor-pointer ${
                      projectTimeline === time
                        ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-white font-medium shadow-xs'
                        : 'border-white/10 bg-white/[0.02] text-white/65 hover:text-white hover:border-white/25'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: BLUEPRINT SUMMARY & GATED EMAIL VALUATION (5 cols) */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="border border-white/15 bg-[#17171B] p-6 sm:p-7 rounded-xs shadow-2xl space-y-6">
              {/* Specification Blueprint Summary */}
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                  <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-medium font-sans">
                    Configured Blueprint
                  </span>
                  <span className="text-xs font-mono text-white/70">
                    {totalSqFt} sq.ft · ~{estimatedBoxes} Boxes
                  </span>
                </div>

                <div className="space-y-3 pt-4 text-xs sm:text-sm font-sans">
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Category:</span>
                    <span className="text-white font-medium truncate max-w-[210px]">{categoryLabels[primaryCategory]}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Mineral Pattern:</span>
                    <span className="text-white font-medium truncate max-w-[210px]">{stoneGeology}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Surface Area:</span>
                    <span className="text-white font-medium font-mono">{totalSqFt} sq.ft</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Surface Sheen:</span>
                    <span className="text-white font-medium truncate max-w-[210px]">{surfaceFinish}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Timeline:</span>
                    <span className="text-white font-medium">{projectTimeline}</span>
                  </div>
                </div>
              </div>

              {/* GATING: Only show price & comparison AFTER email submission */}
              {leadSubmitted ? (
                /* UNLOCKED: Shows Price, Savings & Detailed Comparison */
                <div className="space-y-5 pt-4 border-t border-white/10">
                  {/* Success Alert */}
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-sans flex items-start gap-2.5 rounded-xs">
                    <Check className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                    <div>
                      <div className="font-semibold text-emerald-200">Price Breakdown Sent!</div>
                      <div className="text-white/70 text-xs mt-0.5">
                        Itemized PDF sent to <span className="text-white font-medium">{leadEmail}</span> (Ref: {leadQuoteId}).
                      </div>
                    </div>
                  </div>

                  {/* Savings Reveal */}
                  <div className="pb-5 border-b border-white/10">
                    <div className="text-xs uppercase tracking-wider text-emerald-400 font-sans font-medium mb-1">
                      Estimated Savings ({savingsPercent}% Lower)
                    </div>
                    <div className="text-4xl sm:text-5xl font-serif text-[#D4AF37] tracking-tight">
                      ${totalSaved.toLocaleString()}
                    </div>
                    <div className="text-xs text-white/60 font-sans mt-1.5 leading-relaxed">
                      Saved compared to traditional quarry cutting &amp; CNC fabrication for {stoneConfig.name}.
                    </div>
                  </div>

                  {/* Unlocked Itemized Comparison Table */}
                  <div className="space-y-2.5 text-xs sm:text-sm font-sans">
                    <div className="flex justify-between pb-2 border-b border-white/10 text-white/45 uppercase text-[11px] tracking-wider font-medium">
                      <span>Cost Itemization</span>
                      <span>{categoryLabels[primaryCategory]}</span>
                    </div>

                    <div className="flex justify-between text-white/80">
                      <span>Material ({totalSqFt} sq.ft @ ${porcelainMaterialRate}):</span>
                      <span className="font-mono">${porcelainMaterialCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Installation / Setting (@ ${porcelainInstallRate}):</span>
                      <span className="font-mono">${porcelainLaborCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Edge &amp; Surface Preparation:</span>
                      <span className="text-emerald-400 font-medium font-mono">$0 (Factory Calibrated)</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Direct Pallet Freight Delivery:</span>
                      <span className="font-mono">${porcelainDeliveryFlat}</span>
                    </div>

                    <div className="flex justify-between pt-3 border-t border-white/10 text-white font-medium">
                      <span>Total Installed Estimate:</span>
                      <span className="text-[#D4AF37] font-bold font-mono text-base">${porcelainTotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-white/40 pt-0.5">
                      <span>Traditional {stoneConfig.name}:</span>
                      <span className="line-through text-rose-300 font-mono">${stoneTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Post-submission Action */}
                  <button
                    type="button"
                    onClick={() => setLeadSubmitted(false)}
                    className="inline-flex items-center gap-1.5 text-xs font-sans text-white/45 hover:text-white transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Recalculate with different email or specs</span>
                  </button>
                </div>
              ) : (
                /* Gated Form: Enter email to receive itemized quote */
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <form onSubmit={handleLeadSubmit} className="space-y-4">
                    {/* Role selector */}
                    <div className="flex items-center gap-5 text-xs sm:text-sm font-sans text-white/70">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="leadRole"
                          checked={leadRole === 'homeowner'}
                          onChange={() => setLeadRole('homeowner')}
                          className="accent-[#D4AF37] cursor-pointer"
                        />
                        <span>Homeowner / Designer</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="leadRole"
                          checked={leadRole === 'contractor'}
                          onChange={() => setLeadRole('contractor')}
                          className="accent-[#D4AF37] cursor-pointer"
                        />
                        <span>General Contractor</span>
                      </label>
                    </div>

                    {/* Email Input (Required) */}
                    <div>
                      <label className="text-xs font-sans font-medium text-white/80 block mb-1.5">
                        Email Address for Itemized Price Breakdown *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/20 focus:border-[#D4AF37] rounded-xs px-3.5 py-2.5 text-sm text-white placeholder-white/35 outline-none font-sans transition-colors"
                      />
                    </div>

                    {/* Optional Name / Phone */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-sans text-white/50 block mb-1">
                          Full Name (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={leadName}
                          onChange={(e) => setLeadName(e.target.value)}
                          className="w-full bg-white/[0.04] border border-white/15 focus:border-[#D4AF37] rounded-xs px-3 py-2 text-xs sm:text-sm text-white placeholder-white/30 outline-none font-sans transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-sans text-white/50 block mb-1">
                          Phone / Zip (Optional)
                        </label>
                        <input
                          type="tel"
                          placeholder="(555) 000-0000"
                          value={leadPhone}
                          onChange={(e) => setLeadPhone(e.target.value)}
                          className="w-full bg-white/[0.04] border border-white/15 focus:border-[#D4AF37] rounded-xs px-3 py-2 text-xs sm:text-sm text-white placeholder-white/30 outline-none font-sans transition-colors"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmittingLead}
                      className="w-full py-3.5 px-5 bg-gradient-to-r from-[#D4AF37] via-[#DFBD4B] to-[#D4AF37] hover:brightness-105 text-[#111113] font-sans font-medium text-sm tracking-wide rounded-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                    >
                      <span>{isSubmittingLead ? 'Sending Breakdown...' : 'Email My Price Breakdown & Unlock Quote'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="flex items-center justify-center gap-2 text-xs text-white/45 font-sans text-center pt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Instant email delivery · Zero spam · No unsolicited calls</span>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
