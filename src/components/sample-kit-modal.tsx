'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Box, CheckCircle2, Truck, ShieldCheck, ArrowRight, User, Mail, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SampleKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTheme?: string;
}

export function SampleKitModal({ isOpen, onClose, selectedTheme }: SampleKitModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !address) return;
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 }, colors: ['#c59f60', '#fce6bb'] });
    } catch {}
    setSubmitted(true);
  };

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
          className="relative w-full max-w-lg bg-[#131924] border border-[#c59f60]/40 rounded-3xl shadow-2xl overflow-hidden z-10 p-6 sm:p-8 my-8"
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-[#99753c] via-[#fce6bb] to-[#c59f60] absolute top-0 inset-x-0" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {!submitted ? (
            <div>
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c59f60]/10 text-xs font-semibold text-[#fce6bb] mb-2 border border-[#c59f60]/30">
                  <Box className="w-3.5 h-3.5 text-[#c59f60]" />
                  <span>Curated Sample Box • 100% Free Shipping</span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-white">
                  Order 3 Hand-Cut Stone & Tile Samples
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Touch real 4&quot;x4&quot; stone cutouts, test lemon acid and wine resistance on your kitchen island, and match under your home lighting.
                </p>
                {selectedTheme && (
                  <div className="mt-2.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
                    Pre-selected theme: <strong className="text-[#fce6bb]">{selectedTheme}</strong>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rachel Adams"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#c59f60]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email (for Tracking Number) *</label>
                  <input
                    type="email"
                    required
                    placeholder="rachel@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#c59f60]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="1248 Oakmont Terrace"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#c59f60]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">City</label>
                    <input
                      type="text"
                      required
                      placeholder="Austin"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">State</label>
                    <input
                      type="text"
                      required
                      placeholder="TX"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">Zip Code</label>
                    <input
                      type="text"
                      required
                      placeholder="78701"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <Truck className="w-3.5 h-3.5" /> Fast 48h Priority Delivery
                  </span>
                  <span className="text-[#fce6bb] font-bold">$0.00 Total</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#c59f60] to-[#b0894b] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#c59f60]/20 transition"
                >
                  <Box className="w-4 h-4" />
                  <span>Ship My Free Sample Box</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-2">Sample Box on the Way!</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto mb-6">
                Your 3 curated stone & tile samples are being hand-cut at our fabrication studio. Tracking details will be emailed to <strong className="text-white">{email}</strong> within 12 hours.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#c59f60] text-black text-xs font-bold uppercase tracking-wider"
              >
                Done
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
