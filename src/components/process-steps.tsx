'use client';

import React from 'react';
import { Sparkles, PhoneCall, Scan, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

interface ProcessStepsProps {
  onOpenBookCall: () => void;
}

export function ProcessSteps({ onOpenBookCall }: ProcessStepsProps) {
  const steps = [
    {
      step: '01',
      title: 'Free 15-Min Design & Estimation Call',
      desc: 'Connect with an architectural stone specialist. Review your kitchen floorplan, compare live slab veining on video or phone, and get instant line-item pricing.',
      timeframe: 'Day 1',
      icon: PhoneCall,
      highlight: 'Zero Obligation',
    },
    {
      step: '02',
      title: 'Precision 3D Laser Templating',
      desc: 'Our certified technician visits your home with Leica 3D lasers, capturing wall bow, corner angles, and sink cutouts down to 1/32 of an inch without messy wood sticks.',
      timeframe: 'Day 2',
      icon: Scan,
      highlight: 'Zero Gaps Guaranteed',
    },
    {
      step: '03',
      title: 'Italian CNC & Waterjet Fabrication',
      desc: 'Your stone slab is cut using 60,000 PSI computerized waterjets and hand-polished with Italian diamond pads for butter-smooth eased, ogee, or mitered edges.',
      timeframe: 'Days 3-4',
      icon: Cpu,
      highlight: 'Bookmatched Veining',
    },
    {
      step: '04',
      title: '1-Day White-Glove Installation',
      desc: 'Our in-house master installers remove old surfaces, level your cabinets, mount your undermount sink, apply 15-year nano-sealant, and leave your home spotless.',
      timeframe: 'Day 5',
      icon: CheckCircle2,
      highlight: 'Ready for Dinner',
    },
  ];

  return (
    <section id="process" className="py-24 relative bg-[#0b0f15]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c59f60]/10 border border-[#c59f60]/30 text-xs font-semibold text-[#fce6bb] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#c59f60]" />
            <span>Turnkey 5-Day Delivery</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
            How It Works: From Quarry to Kitchen
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3">
            We eliminated the delays and confusion of dealing with multiple contractors. One dedicated team handles everything from initial design call to final polish.
          </p>
        </div>

        {/* 4 Cards Grid with Connecting Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => (
            <div
              key={item.step}
              className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-[#c59f60]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#c59f60]/10 flex flex-col justify-between space-y-6 relative group"
            >
              <div>
                {/* Top Step Number & Timeframe Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-serif font-bold text-[#c59f60]/40 group-hover:text-[#c59f60] transition-colors">
                    {item.step}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700">
                    {item.timeframe}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 text-[#c59f60] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-serif font-bold text-white mb-2 leading-snug">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Bottom Tag */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-[#fce6bb] font-semibold">{item.highlight}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 glass-panel p-6 sm:p-8 rounded-2xl border border-[#c59f60]/30 text-center max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-base font-bold text-white">Ready to start with Step 1?</h4>
            <p className="text-xs text-slate-400">Takes less than 60 seconds to select your preferred call time.</p>
          </div>
          <button
            onClick={onOpenBookCall}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#c59f60] hover:bg-[#b0894b] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shrink-0"
          >
            <span>Book 15-Min Call</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
