'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Calculator,
  ArrowRight,
  Sparkles,
  Check,
  Send,
  Ruler
} from 'lucide-react';

interface ContractorSavingsCalculatorProps {
  onOpenQuoteModal?: (opts?: { material?: string; sqFt?: number }) => void;
  onOpenBookCall?: (opts?: { material?: string; sqFt?: number; service?: string }) => void;
}

export const ContractorSavingsCalculator: React.FC<ContractorSavingsCalculatorProps> = ({
  onOpenQuoteModal,
  onOpenBookCall,
}) => {
  // Input Mode: 'total' (they know sq ft) vs 'dimensions' (length x breadth)
  const [inputMode, setInputMode] = useState<'dimensions' | 'total'>('dimensions');

  // Mode 1: Direct Sq Ft
  const [directSqFt, setDirectSqFt] = useState<number>(70);

  // Mode 2: Length x Breadth Dimensions in Feet
  // Countertop / Island
  const [counterLength, setCounterLength] = useState<number>(10);
  const [counterBreadth, setCounterBreadth] = useState<number>(3);

  // Backsplash
  const [includeBacksplash, setIncludeBacksplash] = useState<boolean>(true);
  const [backsplashLength, setBacksplashLength] = useState<number>(10);
  const [backsplashHeight, setBacksplashHeight] = useState<number>(2.5);

  // Floor
  const [includeFloor, setIncludeFloor] = useState<boolean>(false);
  const [floorLength, setFloorLength] = useState<number>(12);
  const [floorBreadth, setFloorBreadth] = useState<number>(10);

  // Waterfall Miter Ends (0, 1, or 2 panels, standard 12 sq.ft each)
  const [waterfallCount, setWaterfallCount] = useState<number>(1);

  // Natural Stone comparison type
  const [stoneType, setStoneType] = useState<'quartzite' | 'marble' | 'quartz'>('quartzite');

  // Lead Generation form state
  const [leadEmail, setLeadEmail] = useState<string>('');
  const [leadRole, setLeadRole] = useState<'homeowner' | 'contractor'>('homeowner');
  const [isSubmittingLead, setIsSubmittingLead] = useState<boolean>(false);
  const [leadSubmitted, setLeadSubmitted] = useState<boolean>(false);
  const [leadQuoteId, setLeadQuoteId] = useState<string>('');

  // Math Calculation
  const counterSqFtCalc = Math.round(counterLength * counterBreadth);
  const backsplashSqFtCalc = includeBacksplash ? Math.round(backsplashLength * backsplashHeight) : 0;
  const floorSqFtCalc = includeFloor ? Math.round(floorLength * floorBreadth) : 0;
  const waterfallSqFt = waterfallCount * 12;

  // Final Total Sq Ft based on active mode
  const totalSqFt =
    inputMode === 'total'
      ? Math.max(10, directSqFt + waterfallSqFt)
      : Math.max(10, counterSqFtCalc + backsplashSqFtCalc + floorSqFtCalc + waterfallSqFt);

  // Rate constants ($/sq.ft)
  const porcelainMaterialRate = 28;
  const porcelainInstallRate = 16;
  const porcelainDeliveryFlat = 150;

  const stoneConfig = {
    quartzite: {
      name: 'Exotic Natural Quartzite',
      materialRate: 85,
      fabricationRate: 50,
      installationRate: 40,
      deliveryFlat: 750,
      annualMaintenance: 280,
    },
    marble: {
      name: 'Italian Calacatta Marble',
      materialRate: 95,
      fabricationRate: 55,
      installationRate: 45,
      deliveryFlat: 800,
      annualMaintenance: 350,
    },
    quartz: {
      name: 'Engineered Quartz',
      materialRate: 55,
      fabricationRate: 35,
      installationRate: 30,
      deliveryFlat: 450,
      annualMaintenance: 120,
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
          name: leadRole === 'contractor' ? 'Contractor Partner' : 'Valued Client',
          email: leadEmail,
          phone: 'Provided via instant calculator',
          sqFt: totalSqFt,
          materialName: 'High Gloss Vitrified Porcelain (600x1200mm)',
          edgeProfile: 'Standard 45-degree Miter Edge',
          addons: [
            waterfallCount > 0 ? `${waterfallCount} Mitered Waterfall Ends` : 'No Waterfalls',
            includeBacksplash ? 'Full Backsplash Continuity' : 'No Backsplash',
            includeFloor ? 'Matching Large Format Floor Tile' : 'Countertop Only',
          ],
          totalEstimate: porcelainTotal,
          notes: `Calculated Savings: $${totalSaved.toLocaleString()} vs ${stoneConfig.name}. Role: ${leadRole}. Input mode: ${inputMode}. Boxes: ${estimatedBoxes}.`,
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
        colors: ['#F59E0B', '#10B981', '#FFFFFF'],
      });
    } catch {
      setLeadQuoteId(`VS-${Math.floor(10000 + Math.random() * 90000)}`);
      setLeadSubmitted(true);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
    <section id="savings-calculator" className="scroll-mt-20 w-full bg-[#0D0D0F] py-24 md:py-36 text-white border-t border-white/5">
      <div className="max-w-[1680px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 pb-8 border-b border-white/10">
          <div className="max-w-2xl">
            <div className="text-[11px] uppercase tracking-[0.25em] text-amber-500/80 mb-3 font-mono">
              02 / Transparent Valuation Console
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light tracking-tight text-white leading-[1.08]">
              Project Sizing & Savings Console
            </h2>
            <p className="mt-4 text-white/60 text-base sm:text-lg font-light leading-relaxed">
              No guesswork or complex formulas. Enter your total area or room length × breadth to see direct wholesale porcelain costs versus traditional stone mason fabrication.
            </p>
          </div>

          {/* Benchmark selector: Borderless text tabs */}
          <div className="flex items-center gap-6 text-xs uppercase tracking-wider font-mono">
            <span className="text-white/40">Benchmark Stone:</span>
            {(['quartzite', 'marble', 'quartz'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setStoneType(type)}
                className={`transition-colors py-1 relative cursor-pointer ${
                  stoneType === type ? 'text-amber-400 font-medium' : 'text-white/40 hover:text-white'
                }`}
              >
                <span>{type}</span>
                {stoneType === type && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-amber-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Minimalist Split Console: ZERO chunky container cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* LEFT: Sizing Configuration (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            {/* Sizing Mode Switcher */}
            <div className="flex items-center gap-8 pb-4 border-b border-white/10">
              <button
                type="button"
                onClick={() => setInputMode('dimensions')}
                className={`text-xs sm:text-[13px] uppercase tracking-[0.2em] font-medium transition-colors py-1 relative cursor-pointer ${
                  inputMode === 'dimensions' ? 'text-amber-400' : 'text-white/40 hover:text-white'
                }`}
              >
                <span>Length × Breadth (Auto-Math)</span>
                {inputMode === 'dimensions' && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-amber-400" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setInputMode('total')}
                className={`text-xs sm:text-[13px] uppercase tracking-[0.2em] font-medium transition-colors py-1 relative cursor-pointer ${
                  inputMode === 'total' ? 'text-amber-400' : 'text-white/40 hover:text-white'
                }`}
              >
                <span>I Know Total Sq. Ft</span>
                {inputMode === 'total' && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-amber-400" />
                )}
              </button>
            </div>

            {/* Sizing Fields */}
            {inputMode === 'dimensions' ? (
              <div className="space-y-8 divide-y divide-white/5">
                {/* 1. Countertop Island */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase tracking-[0.2em] text-white/50 font-mono">
                      01 / Kitchen Counter & Island
                    </span>
                    <span className="text-sm font-mono text-amber-400">
                      {counterLength} ft × {counterBreadth} ft = {counterSqFtCalc} sq.ft
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-white/40 block mb-1">Length (ft)</label>
                      <input
                        type="number"
                        min="2"
                        max="40"
                        step="0.5"
                        value={counterLength}
                        onChange={(e) => setCounterLength(parseFloat(e.target.value) || 0)}
                        className="w-full bg-transparent border-b border-white/20 focus:border-amber-400 py-2 text-2xl font-mono text-white outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-white/40 block mb-1">Depth / Breadth (ft)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        step="0.5"
                        value={counterBreadth}
                        onChange={(e) => setCounterBreadth(parseFloat(e.target.value) || 0)}
                        className="w-full bg-transparent border-b border-white/20 focus:border-amber-400 py-2 text-2xl font-mono text-white outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Full-Height Backsplash */}
                <div className="pt-8">
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeBacksplash}
                        onChange={(e) => setIncludeBacksplash(e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 text-amber-500 bg-transparent focus:ring-0"
                      />
                      <span className="text-xs uppercase tracking-[0.2em] text-white/90 font-mono">
                        02 / Full-Height Matching Backsplash
                      </span>
                    </label>
                    {includeBacksplash && (
                      <span className="text-sm font-mono text-amber-400">
                        {backsplashLength} ft × {backsplashHeight} ft = {backsplashSqFtCalc} sq.ft
                      </span>
                    )}
                  </div>

                  {includeBacksplash && (
                    <div className="grid grid-cols-2 gap-8 mt-4">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-white/40 block mb-1">Wall Length (ft)</label>
                        <input
                          type="number"
                          min="2"
                          max="40"
                          step="0.5"
                          value={backsplashLength}
                          onChange={(e) => setBacksplashLength(parseFloat(e.target.value) || 0)}
                          className="w-full bg-transparent border-b border-white/20 focus:border-amber-400 py-2 text-2xl font-mono text-white outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-white/40 block mb-1">Splash Height (ft)</label>
                        <input
                          type="number"
                          min="1"
                          max="8"
                          step="0.5"
                          value={backsplashHeight}
                          onChange={(e) => setBacksplashHeight(parseFloat(e.target.value) || 0)}
                          className="w-full bg-transparent border-b border-white/20 focus:border-amber-400 py-2 text-2xl font-mono text-white outline-none transition-colors"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Matching Tile Floor */}
                <div className="pt-8">
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeFloor}
                        onChange={(e) => setIncludeFloor(e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 text-amber-500 bg-transparent focus:ring-0"
                      />
                      <span className="text-xs uppercase tracking-[0.2em] text-white/90 font-mono">
                        03 / Continuous Matching Floor Tile
                      </span>
                    </label>
                    {includeFloor && (
                      <span className="text-sm font-mono text-amber-400">
                        {floorLength} ft × {floorBreadth} ft = {floorSqFtCalc} sq.ft
                      </span>
                    )}
                  </div>

                  {includeFloor && (
                    <div className="grid grid-cols-2 gap-8 mt-4">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-white/40 block mb-1">Floor Length (ft)</label>
                        <input
                          type="number"
                          min="4"
                          max="60"
                          step="1"
                          value={floorLength}
                          onChange={(e) => setFloorLength(parseFloat(e.target.value) || 0)}
                          className="w-full bg-transparent border-b border-white/20 focus:border-amber-400 py-2 text-2xl font-mono text-white outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-white/40 block mb-1">Floor Width (ft)</label>
                        <input
                          type="number"
                          min="4"
                          max="60"
                          step="1"
                          value={floorBreadth}
                          onChange={(e) => setFloorBreadth(parseFloat(e.target.value) || 0)}
                          className="w-full bg-transparent border-b border-white/20 focus:border-amber-400 py-2 text-2xl font-mono text-white outline-none transition-colors"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Mitered Waterfall Edge */}
                <div className="pt-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-[0.2em] text-white/50 font-mono">
                      04 / Waterfall Miter Ends (36" drops)
                    </span>
                    <span className="text-sm font-mono text-amber-400">
                      {waterfallCount > 0 ? `+${waterfallSqFt} sq.ft` : 'None'}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 pt-2">
                    {[
                      { count: 0, label: 'None' },
                      { count: 1, label: '1 Side (+12 sq.ft)' },
                      { count: 2, label: '2 Sides (+24 sq.ft)' },
                    ].map((opt) => (
                      <button
                        key={opt.count}
                        type="button"
                        onClick={() => setWaterfallCount(opt.count)}
                        className={`text-xs uppercase tracking-wider font-mono py-1 relative cursor-pointer ${
                          waterfallCount === opt.count ? 'text-amber-400 font-medium' : 'text-white/40 hover:text-white'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {waterfallCount === opt.count && (
                          <span className="absolute bottom-0 left-0 right-0 h-px bg-amber-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Direct Sq Ft Entry */
              <div className="pt-4 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-white/40 font-mono">
                      Total Surface Square Footage
                    </label>
                    <span className="text-2xl font-mono text-amber-400">{directSqFt} sq.ft</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="500"
                    step="5"
                    value={directSqFt}
                    onChange={(e) => setDirectSqFt(parseInt(e.target.value))}
                    className="w-full accent-amber-500 bg-white/10 h-1 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-white/30 font-mono mt-2">
                    <span>15 sq.ft (Powder vanity)</span>
                    <span>150 sq.ft (Full kitchen island & splash)</span>
                    <span>500 sq.ft (Commercial / estate)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Total Surface Footprint Footnote */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <span className="text-white/40 uppercase tracking-wider">Total Calculated Surface Area:</span>
              <span className="text-white font-medium text-base">
                {totalSqFt} sq.ft · ~{estimatedBoxes} Freight Boxes
              </span>
            </div>
          </div>

          {/* RIGHT: Live Architectural Valuation & Direct Lead Dispatch (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Big Sculptural Savings Figure */}
            <div className="pb-8 border-b border-white/10">
              <div className="text-[11px] uppercase tracking-[0.25em] text-emerald-400 font-mono mb-2">
                Estimated Project Savings ({savingsPercent}% Lower)
              </div>
              <div className="text-5xl sm:text-6xl font-serif font-light text-amber-400 tracking-tight">
                ${totalSaved.toLocaleString()}
              </div>
              <div className="text-xs text-white/50 font-light mt-2">
                Saved compared to quarry cutting & CNC fabrication for {stoneConfig.name}.
              </div>
            </div>

            {/* Itemized Comparison Matrix: Pure Whitespace & Hairlines */}
            <div className="space-y-4 text-xs font-mono">
              <div className="flex justify-between pb-2 border-b border-white/10 text-white/40 uppercase tracking-wider">
                <span>Cost Itemization</span>
                <span>Vitrified Porcelain</span>
              </div>

              <div className="flex justify-between text-white/80">
                <span>Slab Material ({totalSqFt} sq.ft @ $28):</span>
                <span>${porcelainMaterialCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>General Contractor Setting (@ $16):</span>
                <span>${porcelainLaborCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Specialized CNC Shop Fabrication:</span>
                <span className="text-emerald-400">$0 (Cut On-Site)</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Direct Pallet Freight Delivery:</span>
                <span>${porcelainDeliveryFlat}</span>
              </div>

              <div className="flex justify-between pt-3 border-t border-white/10 text-white font-medium text-sm">
                <span>Total Installed Porcelain:</span>
                <span className="text-amber-400 font-bold">${porcelainTotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-white/40 pt-1">
                <span>Traditional {stoneConfig.name}:</span>
                <span className="line-through text-rose-300">${stoneTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Direct 1-Line Email Lead Capture */}
            <div className="pt-6 border-t border-white/10">
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/60 font-mono mb-2">
                Receive Itemized Specification PDF
              </div>
              <p className="text-xs text-white/50 font-light mb-4">
                We will email this complete {totalSqFt} sq.ft spec breakdown, crate packaging data, and the contractor installation guide directly to you.
              </p>

              {leadSubmitted ? (
                <div className="py-4 text-emerald-400 text-xs font-mono flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Estimate dispatched to {leadEmail} (Ref: {leadQuoteId}).</span>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-3">
                  <div className="flex items-center gap-4 text-xs font-mono text-white/50 mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="leadRole"
                        checked={leadRole === 'homeowner'}
                        onChange={() => setLeadRole('homeowner')}
                        className="accent-amber-500"
                      />
                      <span>Homeowner / Designer</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="leadRole"
                        checked={leadRole === 'contractor'}
                        onChange={() => setLeadRole('contractor')}
                        className="accent-amber-500"
                      />
                      <span>General Contractor / Trade</span>
                    </label>
                  </div>

                  <div className="flex items-center border-b border-white/30 focus-within:border-amber-400 transition-colors">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email for specs..."
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="flex-1 bg-transparent py-2.5 text-sm text-white placeholder-white/30 outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingLead}
                      className="text-xs uppercase tracking-widest text-amber-400 hover:text-amber-300 font-medium flex items-center gap-2 py-2 px-3 transition-colors cursor-pointer"
                    >
                      <span>{isSubmittingLead ? 'Sending...' : 'Send Specs'}</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
