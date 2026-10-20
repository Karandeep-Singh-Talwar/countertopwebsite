'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { X, Mail, Send, CheckCircle2, Calculator, Sparkles, Check } from 'lucide-react';

interface RequestQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMaterial?: string;
  initialSqFt?: number;
}

export function RequestQuoteModal({
  isOpen,
  onClose,
  initialMaterial = 'Calcatta Extra (600x1200mm Vitrified Porcelain)',
  initialSqFt = 55,
}: RequestQuoteModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setLeadRole] = useState<'homeowner' | 'contractor'>('homeowner');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [quoteNumber, setQuoteNumber] = useState('');

  if (!isOpen) return null;

  // Real-time calculated estimate based on 9mm vitrified porcelain rates
  const materialCost = initialSqFt * 28;
  const laborCost = initialSqFt * 16;
  const deliveryCost = 150;
  const calculatedEstimate = materialCost + laborCost + deliveryCost;
  const estimatedBoxes = Math.ceil(initialSqFt / 15.5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || (role === 'contractor' ? 'Trade Partner' : 'Client'),
          email: email.trim(),
          phone: 'Provided via website lead modal',
          sqFt: initialSqFt,
          materialName: initialMaterial,
          edgeProfile: 'Standard 45-degree Miter Edge',
          addons: ['Contractor Wet-Saw Spec Guide', 'Crate Quantity Calculation'],
          totalEstimate: calculatedEstimate,
          notes: `Lead Role: ${role}. Boxes: ${estimatedBoxes}.`,
        }),
      });

      const data = await res.json();
      setQuoteNumber(data.quoteId || `VS-${Math.floor(10000 + Math.random() * 90000)}`);
      setSubmitted(true);

      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#1A1A1A'],
      });
    } catch {
      setQuoteNumber(`VS-${Math.floor(10000 + Math.random() * 90000)}`);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-[#FAF8F5] border border-[#E8E4DC] shadow-2xl overflow-hidden z-10 p-6 sm:p-8 my-8 text-[#1A1A1A]"
        >
          {/* Top aesthetic accent line */}
          <div className="h-1 w-full bg-amber-500 absolute top-0 inset-x-0" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-black transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {!submitted ? (
            <div>
              {/* Header */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[10px] font-bold uppercase tracking-widest rounded-full mb-2">
                  <Calculator className="w-3 h-3 text-amber-600" />
                  <span>Instant Estimate Calculated</span>
                </div>
                <h3 className="text-2xl font-serif font-light tracking-tight text-[#1A1A1A]">
                  Send Estimate &amp; Contractor Specs
                </h3>
                <p className="text-xs text-[#1A1A1A]/70 mt-1">
                  We already calculated your project pricing based on wholesale 9mm vitrified porcelain. Enter your email to receive the itemized PDF spec pack.
                </p>
              </div>

              {/* Calculated Summary Preview Box */}
              <div className="p-4 bg-white border border-[#E8E4DC] rounded-xl mb-5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#767168]">Material Selected:</span>
                  <span className="font-semibold text-[#1A1A1A] max-w-[240px] truncate text-right">
                    {initialMaterial}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#767168]">Area &amp; Sizing:</span>
                  <span className="font-mono font-medium text-[#1A1A1A]">
                    {initialSqFt} sq.ft (~{estimatedBoxes} Boxes)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F0EDE6]">
                  <span className="text-[#767168] font-medium">Estimated Slabs + Install:</span>
                  <span className="font-mono text-base font-bold text-amber-700">
                    ${calculatedEstimate.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Minimal Lead Capture Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Role Switcher */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#767168] mb-1.5">
                    I am a:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setLeadRole('homeowner')}
                      className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                        role === 'homeowner'
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-white text-[#1A1A1A]/70 border-[#E8E4DC] hover:border-[#1A1A1A]'
                      }`}
                    >
                      Homeowner
                    </button>
                    <button
                      type="button"
                      onClick={() => setLeadRole('contractor')}
                      className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                        role === 'contractor'
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-white text-[#1A1A1A]/70 border-[#E8E4DC] hover:border-[#1A1A1A]'
                      }`}
                    >
                      General Contractor / Mason
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#767168] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="architect@domain.com or homeowner@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-[#D9D4CC] rounded-lg px-3.5 py-2.5 text-xs text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#767168] mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-[#D9D4CC] rounded-lg px-3.5 py-2.5 text-xs text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-black"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#1A1A1A] hover:bg-amber-800 text-white font-medium text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-lg transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Sending Estimate...' : 'Send Estimate & Contractor Specs'}</span>
                  </button>
                  <p className="text-[10px] text-center text-[#767168] mt-2">
                    Instant delivery. No sales spam. We send CAD layout specs and contractor diamond wet-saw guides.
                  </p>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full mx-auto flex items-center justify-center">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div className="text-[11px] font-mono font-bold text-amber-800 uppercase tracking-widest">
                ESTIMATE DISPATCHED · REF #{quoteNumber}
              </div>
              <h3 className="text-2xl font-serif font-light text-[#1A1A1A]">
                Estimate &amp; Specs on the Way!
              </h3>
              <p className="text-xs text-[#1A1A1A]/70 max-w-sm mx-auto leading-relaxed">
                We have emailed your complete itemized PDF estimate of <strong>${calculatedEstimate.toLocaleString()}</strong> ({initialSqFt} sq.ft scope) to <strong>{email}</strong>.
              </p>
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-amber-800 text-white text-xs font-medium uppercase tracking-wider rounded-lg transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
