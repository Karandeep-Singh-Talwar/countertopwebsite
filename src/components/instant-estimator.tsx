'use client';

import React, { useState } from 'react';
import { Calculator, Calendar, Check, DollarSign, ShieldCheck } from 'lucide-react';
import { EDGE_PROFILES } from '@/data/stone-data';

interface InstantEstimatorProps {
  onBookCallWithEstimate: (material: string, sqFt: number, total: number) => void;
}

export function InstantEstimator({ onBookCallWithEstimate }: InstantEstimatorProps) {
  const [sqFt, setSqFt] = useState<number>(45);
  const [materialTier, setMaterialTier] = useState<{ name: string; rate: number }>({
    name: 'Calacatta Gold Supreme Quartz',
    rate: 68,
  });
  const [selectedEdge, setSelectedEdge] = useState(EDGE_PROFILES[0]);
  const [includeSink, setIncludeSink] = useState<boolean>(true);
  const [includeCooktop, setIncludeCooktop] = useState<boolean>(false);
  const [includeTearOut, setIncludeTearOut] = useState<boolean>(true);
  const [includeWaterfall, setIncludeWaterfall] = useState<boolean>(false);

  const estimatedLinearFt = Math.round(sqFt * 0.65);
  const stoneCost = sqFt * materialTier.rate;
  const edgeCost = estimatedLinearFt * selectedEdge.pricePerLinearFt;
  const sinkCost = sqFt >= 40 ? 0 : includeSink ? 180 : 0;
  const cooktopCost = includeCooktop ? 150 : 0;
  const tearOutCost = includeTearOut ? 320 : 0;
  const waterfallEndCost = includeWaterfall ? 650 : 0;
  const laserTemplatingAndInstall = 380;

  const grossEstimate = stoneCost + edgeCost + sinkCost + cooktopCost + tearOutCost + waterfallEndCost + laserTemplatingAndInstall;
  const traditionalYardPrice = Math.round(grossEstimate * 1.35);
  const directSavings = traditionalYardPrice - grossEstimate;

  return (
    <section id="estimator" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-black mb-2">
            PRICE TRANSPARENCY
          </div>
          <h2 className="text-2xl sm:text-4xl font-sans font-light tracking-[0.16em] uppercase text-black">
            INSTANT SQUARE FOOTAGE ESTIMATOR
          </h2>
          <div className="w-12 h-[2px] bg-black mx-auto mt-3 mb-4" />
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
            Select your square footage, surface grade, edge profile, and cutouts for guaranteed all-inclusive pricing without waiting days for fabricator bids.
          </p>
        </div>

        {/* 2-Column Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 7 Cols Controls */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. Square Footage Slider */}
            <div className="bg-gray-50 p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-black">
                  1. Approximate Countertop Area
                </span>
                <span className="text-lg font-bold font-serif text-black bg-white px-3 py-1 border border-gray-300">
                  {sqFt} Sq. Ft.
                </span>
              </div>
              <input
                type="range"
                min={15}
                max={140}
                step={5}
                value={sqFt}
                onChange={(e) => setSqFt(Number(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-none cursor-pointer my-3 accent-black"
              />
              <div className="flex items-center justify-between text-[11px] text-gray-500">
                <span>Small Bath Vanity (15-25 sf)</span>
                <span>Standard Kitchen (40-55 sf)</span>
                <span>Large Island &amp; Perimeter (75-120+ sf)</span>
              </div>
            </div>

            {/* 2. Surface Selection */}
            <div className="bg-gray-50 p-6 border border-gray-200">
              <span className="block text-xs font-bold uppercase tracking-wider text-black mb-3">
                2. Surface Material Tier
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { name: 'Black Galaxy Natural Granite', rate: 52 },
                  { name: 'Authentic Bianco Carrara Marble', rate: 58 },
                  { name: 'Calacatta Gold Supreme Quartz', rate: 68 },
                  { name: 'Nero Marquina Grand Noir Marble', rate: 79 },
                  { name: 'Taj Mahal Exotic Quartzite', rate: 88 },
                  { name: 'Dekton Laurent Sintered Porcelain', rate: 92 },
                ].map((tier) => {
                  const isSelected = materialTier.name === tier.name;
                  return (
                    <button
                      key={tier.name}
                      onClick={() => setMaterialTier(tier)}
                      className={`p-3 text-left text-xs border transition flex items-center justify-between ${
                        isSelected
                          ? 'border-black bg-white ring-1 ring-black font-semibold text-black'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <span className="line-clamp-1">{tier.name}</span>
                      <span className="font-bold text-black shrink-0 ml-2">${tier.rate}/sf</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Edge Profile */}
            <div className="bg-gray-50 p-6 border border-gray-200">
              <span className="block text-xs font-bold uppercase tracking-wider text-black mb-3">
                3. Edge Profile Selection
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {EDGE_PROFILES.map((edge) => {
                  const isSelected = selectedEdge.id === edge.id;
                  return (
                    <button
                      key={edge.id}
                      onClick={() => setSelectedEdge(edge)}
                      className={`p-2.5 text-left text-xs border transition ${
                        isSelected
                          ? 'border-black bg-white ring-1 ring-black font-semibold text-black'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium">{edge.name}</div>
                      <div className="text-[10px] text-gray-500">
                        {edge.pricePerLinearFt === 0 ? 'Included' : `+$${edge.pricePerLinearFt}/linear ft`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Options */}
            <div className="bg-gray-50 p-6 border border-gray-200">
              <span className="block text-xs font-bold uppercase tracking-wider text-black mb-3">
                4. Cutouts &amp; Add-ons
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className="p-2.5 bg-white border border-gray-200 flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={includeSink}
                      onChange={(e) => setIncludeSink(e.target.checked)}
                      className="accent-black"
                    />
                    <span>Undermount Sink Cutout</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">
                    {sqFt >= 40 ? 'FREE Promo' : '+$180'}
                  </span>
                </label>

                <label className="p-2.5 bg-white border border-gray-200 flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={includeCooktop}
                      onChange={(e) => setIncludeCooktop(e.target.checked)}
                      className="accent-black"
                    />
                    <span>Cooktop Range Cutout</span>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-700">+$150</span>
                </label>

                <label className="p-2.5 bg-white border border-gray-200 flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={includeTearOut}
                      onChange={(e) => setIncludeTearOut(e.target.checked)}
                      className="accent-black"
                    />
                    <span>Old Counter Tear-Out</span>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-700">+$320</span>
                </label>

                <label className="p-2.5 bg-white border border-gray-200 flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={includeWaterfall}
                      onChange={(e) => setIncludeWaterfall(e.target.checked)}
                      className="accent-black"
                    />
                    <span>Mitered Waterfall Leg</span>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-700">+$650</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right: 5 Cols Summary Sticky Box */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="bg-black text-white p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                <div>
                  <h3 className="font-serif text-xl font-bold uppercase tracking-wider text-white">
                    Estimated Total
                  </h3>
                  <div className="text-[11px] text-gray-400">Turnkey laser templating &amp; installation</div>
                </div>
                <DollarSign className="w-5 h-5 text-gray-400" />
              </div>

              <div className="py-4 space-y-2 text-xs text-gray-300 border-b border-gray-800">
                <div className="flex justify-between">
                  <span>{sqFt} sq ft {materialTier.name}:</span>
                  <span className="font-bold text-white">${stoneCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Edge Finish ({selectedEdge.name}):</span>
                  <span>{edgeCost === 0 ? 'Included' : `+$${edgeCost}`}</span>
                </div>
                {includeSink && (
                  <div className="flex justify-between">
                    <span>Sink Mount &amp; Cutout:</span>
                    <span className="text-emerald-400 font-semibold">{sqFt >= 40 ? 'FREE ($180 value)' : '+$180'}</span>
                  </div>
                )}
                {includeCooktop && (
                  <div className="flex justify-between">
                    <span>Cooktop Cutout:</span>
                    <span>+$150</span>
                  </div>
                )}
                {includeTearOut && (
                  <div className="flex justify-between">
                    <span>Old Counter Disposal:</span>
                    <span>+$320</span>
                  </div>
                )}
                {includeWaterfall && (
                  <div className="flex justify-between">
                    <span>Waterfall Leg:</span>
                    <span>+$650</span>
                  </div>
                )}
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Laser Templating &amp; Sealing:</span>
                  <span>Included</span>
                </div>
              </div>

              <div className="py-4">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Total Installed Investment:
                </div>
                <div className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1">
                  ${grossEstimate.toLocaleString()}
                </div>
                <div className="mt-2 text-[11px] text-emerald-400">
                  Estimated Factory Direct Savings: ~${directSavings.toLocaleString()} vs Retail
                </div>
              </div>

              <button
                onClick={() => onBookCallWithEstimate(materialTier.name, sqFt, grossEstimate)}
                className="w-full py-4 bg-white text-black hover:bg-[#c59f60] text-xs font-bold uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-lg"
              >
                <Calendar className="w-4 h-4" />
                <span>Lock In Estimate &amp; Book Free Call</span>
              </button>

              <div className="mt-4 text-center text-[10px] text-gray-400">
                Guaranteed pricing valid for 30 days. No spam or pressure.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
