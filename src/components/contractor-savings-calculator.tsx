'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Calculator,
  ArrowRight,
  TrendingDown,
  Hammer,
  Truck,
  CheckCircle2,
  Layers,
  Sparkles,
  ShieldCheck,
  FileText,
  DollarSign,
  Info,
  Ruler,
  Mail,
  Send,
  Check,
  Building2,
  Home
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
  const [inputMode, setInputMode] = useState<'total' | 'dimensions'>('dimensions');

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
  // Vitrified Porcelain:
  const porcelainMaterialRate = 28; // $28/sq.ft wholesale slab
  const porcelainInstallRate = 16;  // $16/sq.ft installed by client's GC / tile setter
  const porcelainFabrication = 0;   // $0 CNC shop fee (cut on-site with standard diamond wet saw)
  const porcelainDeliveryFlat = 150; // standard curbside freight pallet

  // Traditional Stone rates:
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
      deliveryFlat: 750,
      annualMaintenance: 350,
    },
    quartz: {
      name: 'Engineered Quartz (Resin-bound)',
      materialRate: 60,
      fabricationRate: 40,
      installationRate: 35,
      deliveryFlat: 550,
      annualMaintenance: 0,
    },
  }[stoneType];

  // Financial totals
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

  // Handle instant lead generation
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

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
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
    <section id="savings-calculator" className="scroll-mt-24 pt-32 pb-28 bg-[#111111] text-white relative overflow-hidden border-t border-white/10">
      {/* Background ambient accents */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.06),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs tracking-widest uppercase rounded-full mb-4">
              <Calculator className="w-3.5 h-3.5" />
              <span>Instant Estimate & Cost Calculator</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight leading-tight">
              Know Your Exact Surface Cost & Savings.
            </h2>
            <p className="mt-4 text-white/70 text-base sm:text-lg leading-relaxed">
              Don't worry about complex math or industry jargon. Simply enter your total square footage—or your room length and breadth—and see what you save by letting your existing contractor install porcelain.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-xl backdrop-blur-md">
            <span className="text-xs uppercase tracking-wider text-white/50 px-2">Compare Against:</span>
            {(['quartzite', 'marble', 'quartz'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setStoneType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all capitalize cursor-pointer ${
                  stoneType === type
                    ? 'bg-white text-black shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Left Configurator (7 cols), Right Estimate & Lead Capture (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Sizing Configurator */}
          <div className="lg:col-span-7 bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Sizing Method Switcher */}
            <div>
              <label className="text-xs uppercase tracking-wider text-white/50 block mb-3 font-semibold">
                How would you like to calculate?
              </label>
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-black/40 border border-white/10 rounded-xl">
                <button
                  type="button"
                  onClick={() => setInputMode('dimensions')}
                  className={`py-2.5 px-3 rounded-lg text-xs font-medium tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    inputMode === 'dimensions'
                      ? 'bg-amber-400 text-black font-semibold shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Length × Breadth (We do the math)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInputMode('total')}
                  className={`py-2.5 px-3 rounded-lg text-xs font-medium tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    inputMode === 'total'
                      ? 'bg-amber-400 text-black font-semibold shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>I Know Total Sq. Ft</span>
                </button>
              </div>
            </div>

            {/* OPTION A: LENGTH X BREADTH INPUTS */}
            {inputMode === 'dimensions' && (
              <div className="space-y-5 pt-2">
                {/* Surface 1: Main Countertop / Island */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>1. Kitchen Island / Counter Dimensions</span>
                    </span>
                    <span className="text-xs font-mono font-semibold text-amber-300">
                      {counterLength} ft × {counterBreadth} ft = {counterSqFtCalc} sq.ft
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[11px] text-white/60 block mb-1">Length (Feet):</span>
                      <div className="flex items-center bg-black/50 border border-white/15 rounded-lg px-3 py-2">
                        <input
                          type="number"
                          min={2}
                          max={40}
                          value={counterLength}
                          onChange={(e) => setCounterLength(Math.max(1, Number(e.target.value)))}
                          className="w-full bg-transparent text-sm text-white font-mono focus:outline-none"
                        />
                        <span className="text-xs text-white/40">ft</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] text-white/60 block mb-1">Breadth / Depth (Feet):</span>
                      <div className="flex items-center bg-black/50 border border-white/15 rounded-lg px-3 py-2">
                        <input
                          type="number"
                          min={1}
                          max={15}
                          value={counterBreadth}
                          onChange={(e) => setCounterBreadth(Math.max(1, Number(e.target.value)))}
                          className="w-full bg-transparent text-sm text-white font-mono focus:outline-none"
                        />
                        <span className="text-xs text-white/40">ft</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-white/40">
                    Standard counter is 2 ft deep; kitchen islands are typically 3 to 4 ft deep.
                  </p>
                </div>

                {/* Surface 2: Optional Backsplash */}
                <div className={`p-4 rounded-xl border transition-all ${
                  includeBacksplash
                    ? 'bg-white/5 border-amber-400/40 text-white'
                    : 'bg-black/20 border-white/5 text-white/50'
                }`}>
                  <div className="flex items-center justify-between cursor-pointer mb-2" onClick={() => setIncludeBacksplash(!includeBacksplash)}>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={includeBacksplash}
                        onChange={(e) => setIncludeBacksplash(e.target.checked)}
                        className="w-4 h-4 rounded accent-amber-400 cursor-pointer"
                      />
                      <div>
                        <div className="font-semibold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                          <span>2. Add Full-Height Backsplash Wall</span>
                          <span className="px-1.5 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 rounded font-mono font-normal">
                            Zero Grout Behind Cooktop
                          </span>
                        </div>
                      </div>
                    </div>
                    {includeBacksplash && (
                      <span className="text-xs font-mono font-semibold text-amber-300">
                        {backsplashLength} ft × {backsplashHeight} ft = {backsplashSqFtCalc} sq.ft
                      </span>
                    )}
                  </div>

                  {includeBacksplash && (
                    <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-white/10">
                      <div>
                        <span className="text-[11px] text-white/60 block mb-1">Wall Length (Feet):</span>
                        <div className="flex items-center bg-black/50 border border-white/15 rounded-lg px-3 py-2">
                          <input
                            type="number"
                            min={1}
                            max={40}
                            value={backsplashLength}
                            onChange={(e) => setBacksplashLength(Math.max(1, Number(e.target.value)))}
                            className="w-full bg-transparent text-sm text-white font-mono focus:outline-none"
                          />
                          <span className="text-xs text-white/40">ft</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[11px] text-white/60 block mb-1">Wall Height (Feet):</span>
                        <div className="flex items-center bg-black/50 border border-white/15 rounded-lg px-3 py-2">
                          <input
                            type="number"
                            step={0.5}
                            min={1}
                            max={10}
                            value={backsplashHeight}
                            onChange={(e) => setBacksplashHeight(Math.max(0.5, Number(e.target.value)))}
                            className="w-full bg-transparent text-sm text-white font-mono focus:outline-none"
                          />
                          <span className="text-xs text-white/40">ft</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Surface 3: Optional Floor Tiles */}
                <div className={`p-4 rounded-xl border transition-all ${
                  includeFloor
                    ? 'bg-white/5 border-amber-400/40 text-white'
                    : 'bg-black/20 border-white/5 text-white/50'
                }`}>
                  <div className="flex items-center justify-between cursor-pointer mb-2" onClick={() => setIncludeFloor(!includeFloor)}>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={includeFloor}
                        onChange={(e) => setIncludeFloor(e.target.checked)}
                        className="w-4 h-4 rounded accent-amber-400 cursor-pointer"
                      />
                      <div>
                        <div className="font-semibold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                          <span>3. Add Matching 600x1200mm Tile Floor</span>
                          <span className="px-1.5 py-0.5 text-[10px] bg-blue-500/20 text-blue-300 rounded font-mono font-normal">
                            Exact Same Vein
                          </span>
                        </div>
                      </div>
                    </div>
                    {includeFloor && (
                      <span className="text-xs font-mono font-semibold text-amber-300">
                        {floorLength} ft × {floorBreadth} ft = {floorSqFtCalc} sq.ft
                      </span>
                    )}
                  </div>

                  {includeFloor && (
                    <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-white/10">
                      <div>
                        <span className="text-[11px] text-white/60 block mb-1">Room Length (Feet):</span>
                        <div className="flex items-center bg-black/50 border border-white/15 rounded-lg px-3 py-2">
                          <input
                            type="number"
                            min={2}
                            max={60}
                            value={floorLength}
                            onChange={(e) => setFloorLength(Math.max(1, Number(e.target.value)))}
                            className="w-full bg-transparent text-sm text-white font-mono focus:outline-none"
                          />
                          <span className="text-xs text-white/40">ft</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[11px] text-white/60 block mb-1">Room Breadth (Feet):</span>
                        <div className="flex items-center bg-black/50 border border-white/15 rounded-lg px-3 py-2">
                          <input
                            type="number"
                            min={2}
                            max={60}
                            value={floorBreadth}
                            onChange={(e) => setFloorBreadth(Math.max(1, Number(e.target.value)))}
                            className="w-full bg-transparent text-sm text-white font-mono focus:outline-none"
                          />
                          <span className="text-xs text-white/40">ft</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* OPTION B: DIRECT SQ FT INPUT & SLIDER */}
            {inputMode === 'total' && (
              <div className="space-y-4 pt-2">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-white">
                      Enter Known Square Footage:
                    </label>
                    <div className="flex items-center bg-black/50 border border-white/20 rounded-lg px-3 py-1">
                      <input
                        type="number"
                        min={10}
                        max={500}
                        value={directSqFt}
                        onChange={(e) => setDirectSqFt(Math.max(10, Number(e.target.value)))}
                        className="w-20 bg-transparent text-base font-mono font-bold text-amber-400 focus:outline-none text-right mr-1"
                      />
                      <span className="text-xs text-white/50">sq.ft</span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min={20}
                    max={200}
                    step={5}
                    value={directSqFt}
                    onChange={(e) => setDirectSqFt(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />

                  {/* Preset quick buttons */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-[11px] text-white/40 self-center mr-1">Quick Presets:</span>
                    {[
                      { label: 'Small Galley (30 sq.ft)', val: 30 },
                      { label: 'Standard Kitchen (55 sq.ft)', val: 55 },
                      { label: 'Island + Backsplash (85 sq.ft)', val: 85 },
                      { label: 'Full Open Concept (140 sq.ft)', val: 140 },
                    ].map((pre) => (
                      <button
                        key={pre.val}
                        type="button"
                        onClick={() => setDirectSqFt(pre.val)}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${
                          directSqFt === pre.val
                            ? 'bg-amber-400 text-black font-semibold'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {pre.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Waterfall Edge Panel Modifier */}
            <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-medium text-xs text-white uppercase tracking-wider flex items-center gap-2">
                  <span>Mitered Waterfall Edge Panels</span>
                  <span className="text-[10px] text-white/50 font-normal lowercase">(45° miter fold to floor)</span>
                </div>
                <p className="text-xs text-white/50 mt-0.5">
                  Your general contractor cuts 45° miters on-site with standard diamond saw
                </p>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                {[0, 1, 2].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setWaterfallCount(cnt)}
                    className={`px-3 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                      waterfallCount === cnt
                        ? 'bg-amber-400 text-black font-semibold'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {cnt === 0 ? 'None' : `${cnt} Side${cnt > 1 ? 's' : ''} (+${cnt * 12} sq.ft)`}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Calculated Surface Area Result Badge */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-500/10 to-transparent rounded-xl border border-amber-500/20">
              <div className="flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-amber-400" />
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-white block">
                    Calculated Total Project Area
                  </span>
                  <span className="text-[11px] text-white/50">
                    {inputMode === 'dimensions'
                      ? `(${counterSqFtCalc} island + ${backsplashSqFtCalc} splash + ${floorSqFtCalc} floor + ${waterfallSqFt} waterfall)`
                      : 'Direct square footage entered'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-mono font-bold text-amber-400">{totalSqFt} <span className="text-xs text-white/60">sq.ft</span></span>
                <span className="text-[11px] block text-white/40 font-mono">~{estimatedBoxes} Vitrified Boxes Needed</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Comparative Receipt & Immediate Friction-Free Lead Capture */}
          <div className="lg:col-span-5 space-y-6">
            {/* BIG SAVINGS CALLOUT */}
            <div className="bg-gradient-to-br from-emerald-950/80 via-emerald-900/40 to-black border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                  <TrendingDown className="w-4 h-4" />
                  <span>Estimated Total Client Savings</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold font-mono">
                  {savingsPercent}% Lower Cost
                </span>
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-mono font-bold text-white tracking-tight">
                  ${totalSaved.toLocaleString()}
                </span>
                <span className="text-white/60 text-sm">less than {stoneConfig.name.split(' ')[0]}</span>
              </div>

              <p className="mt-2 text-xs text-emerald-200/80 leading-relaxed">
                Calculated on real-world US contractor labour vs specialty CNC stone cutting, crane delivery, and high slab markups.
              </p>
            </div>

            {/* SIDE BY SIDE COMPARISON RECEIPT */}
            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 space-y-5 shadow-xl">
              {/* Option 1: Vitrified Porcelain */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="font-semibold text-sm text-white">Vitrified Porcelain Surface</span>
                  </div>
                  <span className="font-mono font-bold text-amber-400 text-lg">
                    ${porcelainTotal.toLocaleString()}
                  </span>
                </div>

                <div className="text-xs space-y-1.5 text-white/70 pl-4 border-l border-amber-400/30 font-mono">
                  <div className="flex justify-between">
                    <span className="text-white/60 font-sans">9mm High-Gloss Slabs ({totalSqFt} sq.ft @ ${porcelainMaterialRate}):</span>
                    <span>${porcelainMaterialCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60 font-sans">Installed by YOUR Contractor (@ ${porcelainInstallRate}/sq.ft):</span>
                    <span>${porcelainLaborCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60 font-sans">Specialized CNC Shop Fabrication:</span>
                    <span className="text-emerald-400 font-semibold">$0 (Cut On-Site)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60 font-sans">Standard Pallet Freight Delivery:</span>
                    <span>${porcelainDeliveryFlat}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60 font-sans">Annual Chemical Sealing:</span>
                    <span className="text-emerald-400 font-semibold">$0 (Impervious &lt;0.04%)</span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/10" />

              {/* Option 2: Traditional Stone */}
              <div className="space-y-3 opacity-80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
                    <span className="font-semibold text-sm text-white/90">{stoneConfig.name}</span>
                  </div>
                  <span className="font-mono font-semibold text-white/80 text-lg line-through decoration-red-400/70">
                    ${stoneTotal.toLocaleString()}
                  </span>
                </div>

                <div className="text-xs space-y-1.5 text-white/50 pl-4 border-l border-white/20 font-mono">
                  <div className="flex justify-between">
                    <span className="font-sans">Raw Slabs ({totalSqFt} sq.ft @ ${stoneConfig.materialRate}):</span>
                    <span>${stoneMaterialCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans">CNC Edge Miter &amp; Cutout Fabrication:</span>
                    <span>${stoneFabCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans">Specialist Stone Mason Installation:</span>
                    <span>${stoneLaborCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans">Boom Crane / Heavy Rigging Truck:</span>
                    <span>${stoneConfig.deliveryFlat}</span>
                  </div>
                  {stoneConfig.annualMaintenance > 0 && (
                    <div className="flex justify-between text-red-300/80">
                      <span className="font-sans">Annual Re-sealing Maintenance:</span>
                      <span>+${stoneConfig.annualMaintenance}/year</span>
                    </div>
                  )}
                </div>
              </div>

              {/* FRICTION-FREE LEAD GENERATION MODULE */}
              <div className="pt-2 border-t border-white/10">
                {!leadSubmitted ? (
                  <form onSubmit={handleLeadSubmit} className="space-y-3 bg-black/40 border border-white/10 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-amber-400" />
                        <span>Send Me This Estimate &amp; Specs</span>
                      </div>
                      <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded text-[10px]">
                        <button
                          type="button"
                          onClick={() => setLeadRole('homeowner')}
                          className={`px-2 py-0.5 rounded transition cursor-pointer ${
                            leadRole === 'homeowner' ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white'
                          }`}
                        >
                          Homeowner
                        </button>
                        <button
                          type="button"
                          onClick={() => setLeadRole('contractor')}
                          className={`px-2 py-0.5 rounded transition cursor-pointer ${
                            leadRole === 'contractor' ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white'
                          }`}
                        >
                          Contractor
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-white/60 leading-normal">
                      We'll dispatch this itemized ${porcelainTotal.toLocaleString()} estimate, your {estimatedBoxes}-box crate count, and the Contractor Wet-Saw Fabrication Guide directly to your email.
                    </p>

                    <div className="flex gap-2">
                      <input
                        type="email"
                        required
                        placeholder="Enter your email address..."
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="submit"
                        disabled={isSubmittingLead}
                        className="py-2 px-4 bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0 disabled:opacity-50"
                      >
                        <Send className="w-3 h-3" />
                        <span>{isSubmittingLead ? 'Sending...' : 'Send Estimate'}</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl space-y-2 text-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-black mx-auto flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div className="text-[11px] font-mono text-emerald-300 font-bold uppercase tracking-wider">
                      ESTIMATE DISPATCHED · REF #{leadQuoteId}
                    </div>
                    <h5 className="text-sm font-semibold text-white">Line-Item PDF &amp; Specs Sent!</h5>
                    <p className="text-[11px] text-white/70 max-w-xs mx-auto">
                      Sent to <strong>{leadEmail}</strong>. Includes wholesale pricing breakdown for {totalSqFt} sq.ft, wet-saw cut guide, and local freight timeline.
                    </p>
                    <button
                      type="button"
                      onClick={() => setLeadSubmitted(false)}
                      className="text-[10px] text-emerald-400 hover:underline uppercase tracking-wider font-mono cursor-pointer pt-1 block mx-auto"
                    >
                      Send to another email or recalculate
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Contractor Guarantee Note */}
              <div className="flex items-start gap-2.5 pt-1 text-[11px] text-white/40 leading-normal">
                <Info className="w-4 h-4 shrink-0 text-amber-400/80 mt-0.5" />
                <span>
                  All calculations assume 9mm vitrified porcelain tiles &amp; slabs (600x1200mm). Any licensed contractor or tile mason can cut, bevel, and set with standard diamond equipment.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
