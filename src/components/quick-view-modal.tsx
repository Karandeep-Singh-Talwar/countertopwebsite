'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Flame, Droplets, ShieldCheck, MapPin, Check, ArrowRight, Phone } from 'lucide-react';
import { SlabProduct } from '@/data/stone-data';

interface QuickViewModalProps {
  slab: SlabProduct | null;
  onClose: () => void;
  onBookCallForSlab: (slabName: string) => void;
}

export function QuickViewModal({ slab, onClose, onBookCallForSlab }: QuickViewModalProps) {
  if (!slab) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-[#131924] border border-[#c59f60]/40 rounded-3xl shadow-2xl overflow-hidden z-10 p-6 sm:p-8 my-8"
        >
          {/* Top accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#99753c] via-[#fce6bb] to-[#c59f60] absolute top-0 inset-x-0" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-2">
            {/* Left: High-Res Slab Preview */}
            <div className="space-y-3">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
                <Image
                  src={slab.image}
                  alt={slab.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[11px] font-bold text-[#fce6bb] border border-white/10 uppercase">
                  {slab.category}
                </div>
              </div>

              {/* Origin & Mill Tag */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#c59f60]" />
                  <span>Quarry: <strong>{slab.origin}</strong></span>
                </span>
                <span className="text-emerald-400 font-semibold">Grade A+ First-Choice</span>
              </div>
            </div>

            {/* Right: Technical Specs & Inquiries */}
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#c59f60]">
                  Slab Specification Sheet
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                  {slab.name}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {slab.description}
                </p>
              </div>

              {/* Price Callout */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-baseline justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Factory Direct:</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-serif font-bold text-white">
                      ${slab.pricePerSqFt}
                    </span>
                    <span className="text-xs text-slate-400">/ sq.ft installed</span>
                  </div>
                </div>
                {slab.originalPrice && (
                  <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    Save ${slab.originalPrice - slab.pricePerSqFt}/sf
                  </span>
                )}
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Thickness:</div>
                  <div className="font-semibold text-white">{slab.thickness}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Surface Finish:</div>
                  <div className="font-semibold text-white">{slab.finish}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Heat Rating:</div>
                  <div className="font-semibold text-amber-300">{slab.heatResistance}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Stain Porosity:</div>
                  <div className="font-semibold text-blue-300">{slab.stainResistance}</div>
                </div>
              </div>

              {/* Best Applications */}
              <div>
                <div className="text-[11px] font-semibold text-slate-300 mb-1.5">Recommended Applications:</div>
                <div className="flex flex-wrap gap-1.5">
                  {slab.bestFor.map((app) => (
                    <span
                      key={app}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-[11px] text-slate-300 border border-slate-700/60"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    onClose();
                    onBookCallForSlab(slab.name);
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#c59f60] to-[#b0894b] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#c59f60]/20 hover:scale-[1.01] transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Book Call with this Slab Spec</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center">
                  <a
                    href="tel:18005847866"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#c59f60]" />
                    <span>Or call a stone specialist now: (800) 584-STONE</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
