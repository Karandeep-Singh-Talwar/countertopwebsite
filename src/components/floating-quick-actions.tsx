'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Mail, Calculator, ArrowUp, X, Sparkles } from 'lucide-react';

interface FloatingQuickActionsProps {
  onOpenBookCall: () => void;
  onOpenQuoteModal: () => void;
  onScrollToEstimator: () => void;
}

export function FloatingQuickActions({
  onOpenBookCall,
  onOpenQuoteModal,
  onScrollToEstimator,
}: FloatingQuickActionsProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="p-3 rounded-full bg-slate-900/90 text-slate-300 hover:text-white border border-slate-700 hover:border-[#c59f60] shadow-xl backdrop-blur-md transition hover:-translate-y-1"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Expanded Quick Contact Drawer */}
      {isExpanded && (
        <div className="glass-panel-glow p-4 rounded-2xl border border-[#c59f60]/40 shadow-2xl mb-1 w-64 space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#c59f60]" />
              <span>Direct Stone Hotline</span>
            </span>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <a
            href="tel:18005847866"
            className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-white border border-slate-800 transition"
          >
            <Phone className="w-4 h-4 text-[#c59f60]" />
            <div>
              <div className="font-bold">(800) 584-STONE</div>
              <div className="text-[10px] text-emerald-400">Live Agent Available</div>
            </div>
          </a>

          <button
            onClick={() => {
              setIsExpanded(false);
              onOpenQuoteModal();
            }}
            className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-white border border-slate-800 transition text-left"
          >
            <Mail className="w-4 h-4 text-[#c59f60]" />
            <div>
              <div className="font-bold">Email Quote Request</div>
              <div className="text-[10px] text-slate-400">PDF sent in 2 hours</div>
            </div>
          </button>

          <button
            onClick={() => {
              setIsExpanded(false);
              onScrollToEstimator();
            }}
            className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-white border border-slate-800 transition text-left"
          >
            <Calculator className="w-4 h-4 text-[#c59f60]" />
            <div>
              <div className="font-bold">Instant Price Calculator</div>
              <div className="text-[10px] text-slate-400">Calculate $/sq ft in 60s</div>
            </div>
          </button>
        </div>
      )}

      {/* Main Trigger Pill & Book Call Action */}
      <div className="flex items-center gap-2 shadow-2xl">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3.5 py-3 rounded-full bg-slate-900/90 text-white border border-slate-700 hover:border-[#c59f60] backdrop-blur-md transition flex items-center gap-1.5 shadow-xl hover:scale-105"
        >
          <Phone className="w-4 h-4 text-[#c59f60]" />
          <span className="text-xs font-semibold hidden sm:inline">Call Us</span>
        </button>

        <button
          onClick={onOpenBookCall}
          className="group relative px-5 py-3 rounded-full bg-gradient-to-r from-[#c59f60] via-[#d4af37] to-[#b0894b] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-xl shadow-[#c59f60]/30 hover:scale-105 active:scale-95 transition"
        >
          {/* Animated pulsing green indicator */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-700" />
          </span>

          <Calendar className="w-4 h-4 text-black" />
          <span>Book Free Call</span>
        </button>
      </div>
    </div>
  );
}
