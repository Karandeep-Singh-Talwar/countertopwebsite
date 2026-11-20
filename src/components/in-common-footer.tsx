'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';

interface InCommonFooterProps {
  onOpenBookCall: (opts?: { service?: string; material?: string }) => void;
  onOpenQuoteModal: (opts?: { material?: string }) => void;
  onOpenSwatches: () => void;
}

export function InCommonFooter({
  onOpenBookCall,
  onOpenQuoteModal,
  onOpenSwatches,
}: InCommonFooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 6000);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#FAF8F5] text-[#1A1A1A] pt-20 pb-14 border-t border-[#E8E4DC] select-none">
      <div className="max-w-[1680px] mx-auto px-6 md:px-12">
        {/* Top Segment: Brand Scope & Direct Consultation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-16 border-b border-[#E8E4DC] items-start"
        >
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-block group">
              <h4 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-[#1A1A1A] group-hover:text-amber-800 transition-colors">
                Carrara <span className="italic font-light">&amp; Clay</span>
              </h4>
            </Link>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C827A] font-sans font-medium block">
              Architectural Surfaces Atelier
            </span>
            <p className="text-sm text-[#6C6863] max-w-md leading-relaxed font-normal">
              Curated architectural surfaces across four mineral technologies: vitrified porcelain, natural granite, engineered quartz, and metamorphic quartzite. Monolithic slabs and calibrated tiles delivered directly to residential and commercial jobsites nationwide.
            </p>
          </div>

          {/* Direct Ordering & Inquiries Desk (3 cols) */}
          <div className="lg:col-span-3 space-y-2.5 text-sm text-[#6C6863] font-normal">
            <span className="text-xs uppercase tracking-[0.2em] text-[#1A1A1A] font-semibold block mb-3 font-sans">
              Orders &amp; Architectural Inquiries
            </span>
            <a
              href="mailto:concierge@carraraclay.com"
              className="text-[#1A1A1A] hover:text-amber-800 transition-colors font-medium flex items-center gap-2"
            >
              <Mail className="w-3.5 h-3.5 text-amber-800" />
              <span>concierge@carraraclay.com</span>
            </a>
            <a
              href="tel:18005557522"
              className="hover:text-[#1A1A1A] transition-colors flex items-center gap-2 pt-0.5"
            >
              <Phone className="w-3.5 h-3.5 text-amber-800" />
              <span>+1 (800) 555-SLAB (7522)</span>
            </a>
            <p className="text-xs text-[#8C827A] pt-1 leading-relaxed">
              Inquiries and consultations answered within one business day.
            </p>
          </div>

          {/* Quick Direct Actions (4 cols) */}
          <div className="lg:col-span-4 space-y-4 font-sans text-xs">
            <span className="text-xs uppercase tracking-[0.2em] text-[#1A1A1A] font-semibold block font-sans">
              Direct Project Orders
            </span>
            <p className="text-sm text-[#6C6863] font-normal leading-relaxed">
              Slabs and tiles delivered safely nationwide. Speak with our team or order sample swatches.
            </p>
            <div className="flex flex-wrap items-center gap-6 pt-1">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onOpenBookCall({ service: 'Sample Swatch Request' })}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#1A1A1A] py-1 border-b border-[#1A1A1A] hover:text-amber-800 hover:border-amber-800 transition-colors cursor-pointer"
              >
                <span>Request Swatches</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onOpenBookCall({ service: 'Architectural Surface Consultation' })}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#6C6863] hover:text-[#1A1A1A] py-1 border-b border-[#1A1A1A]/20 hover:border-[#1A1A1A] transition-colors cursor-pointer"
              >
                <span>Schedule Consultation</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Middle Segment: Newsletter & Site Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-16 border-b border-[#E8E4DC] items-start"
        >
          {/* Direct Email Digest (5 cols) */}
          <div className="lg:col-span-5 max-w-md">
            <span className="text-xs uppercase tracking-[0.2em] text-[#1A1A1A] font-semibold block mb-2 font-sans">
              Architectural Updates
            </span>
            <p className="text-sm text-[#6C6863] mb-4 font-normal leading-relaxed">
              Subscribe for new container arrivals, bookmatched quarry releases, and technical architectural updates.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="flex border border-[#1A1A1A] bg-white">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                  className="flex-1 px-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder-[#8C827A] focus:outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="shimmer-liquid-sheen relative overflow-hidden px-6 py-2.5 bg-[#FAF8F5] border-l border-[#1A1A1A] text-[#1A1A1A] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#EFECE6] transition-colors cursor-pointer"
                >
                  Join
                </motion.button>
              </div>
              {subscribed ? (
                <p className="text-xs text-emerald-800 flex items-center gap-1.5 font-medium pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Thank you for subscribing. We will be in touch with new collections.</span>
                </p>
              ) : (
                <p className="text-xs text-[#8C827A] pt-0.5">
                  Direct trade communications. Zero promotional noise.
                </p>
              )}
            </form>
          </div>

          {/* Navigation Columns aligned to current website (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm text-[#6C6863]">
            {/* Column 1: Applications */}
            <div className="space-y-2.5">
              <span className="text-xs uppercase tracking-[0.2em] text-[#1A1A1A] font-semibold block mb-3 font-sans">
                Applications
              </span>
              <Link
                href="/countertops"
                className="block hover:text-[#1A1A1A] transition-colors"
              >
                Countertops &amp; Islands
              </Link>
              <Link
                href="/backsplash-walltile"
                className="block hover:text-[#1A1A1A] transition-colors"
              >
                Backsplash &amp; Wall Tile
              </Link>
              <Link
                href="/flooring"
                className="block hover:text-[#1A1A1A] transition-colors"
              >
                Architectural Flooring
              </Link>
              <Link
                href="/porcelain-countertops"
                className="block hover:text-[#1A1A1A] transition-colors text-xs text-[#8C827A] pt-1"
              >
                Porcelain Countertops
              </Link>
              <Link
                href="/porcelain-tiles"
                className="block hover:text-[#1A1A1A] transition-colors text-xs text-[#8C827A]"
              >
                Porcelain Tiles (600×1200mm)
              </Link>
            </div>

            {/* Column 2: Materials */}
            <div className="space-y-2.5">
              <span className="text-xs uppercase tracking-[0.2em] text-[#1A1A1A] font-semibold block mb-3 font-sans">
                Materials
              </span>
              <Link
                href="/countertops"
                className="block hover:text-[#1A1A1A] transition-colors"
              >
                Vitrified Porcelain
              </Link>
              <Link
                href="/countertops"
                className="block hover:text-[#1A1A1A] transition-colors"
              >
                Natural Granite
              </Link>
              <Link
                href="/countertops"
                className="block hover:text-[#1A1A1A] transition-colors"
              >
                Engineered Quartz
              </Link>
              <Link
                href="/countertops"
                className="block hover:text-[#1A1A1A] transition-colors"
              >
                Metamorphic Quartzite
              </Link>
            </div>

            {/* Column 3: Design & Consultation */}
            <div className="space-y-2.5">
              <span className="text-xs uppercase tracking-[0.2em] text-[#1A1A1A] font-semibold block mb-3 font-sans">
                Design &amp; Trade
              </span>
              <Link
                href="/visualizer"
                className="block hover:text-[#1A1A1A] transition-colors font-medium text-[#1A1A1A]"
              >
                Room Visualizer
              </Link>
              <button
                onClick={() => onOpenBookCall({ service: 'Sample Swatch Request' })}
                className="block hover:text-[#1A1A1A] text-left cursor-pointer transition-colors"
              >
                Request Swatches
              </button>
              <button
                onClick={() => onOpenBookCall({ service: 'Architectural Consultation' })}
                className="block hover:text-[#1A1A1A] text-left cursor-pointer transition-colors"
              >
                Schedule Consultation
              </button>
              <Link
                href="/contact"
                className="block hover:text-[#1A1A1A] transition-colors"
              >
                Contact Atelier &amp; Inquiries
              </Link>
              <Link
                href="/#usp-section"
                className="block hover:text-[#1A1A1A] transition-colors"
              >
                Material Comparison
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar: Clean Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8C827A] gap-4 font-sans">
          <p>© 2026 Carrara &amp; Clay. Architectural Surfaces &amp; Slabs. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-[11px]">
            <span className="hover:text-[#1A1A1A] cursor-pointer transition-colors">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-[#1A1A1A] cursor-pointer transition-colors">Terms of Supply</span>
            <span>·</span>
            <span className="hover:text-[#1A1A1A] cursor-pointer transition-colors">ASTM Durability Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
