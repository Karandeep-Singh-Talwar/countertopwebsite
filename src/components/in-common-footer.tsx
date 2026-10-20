'use client';

import React, { useState } from 'react';
import { Mail, Phone, Calculator, Calendar, ArrowRight, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';

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

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-[#FAF8F5] text-[#1A1A1A] pt-16 pb-12 border-t border-[#E8E4DC] select-none">
      <div className="max-w-[1680px] mx-auto px-6 md:px-12">
        {/* Top Segment: Brand Scope & Direct Digital Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-[#E8E4DC] items-start">
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-2xl sm:text-3xl font-serif font-light tracking-tight text-[#1A1A1A]">
              Verona Surfaces
            </h4>
            <span className="text-[11px] uppercase tracking-[0.2em] text-amber-800 font-medium block">
              Architectural Stone &amp; Vitrified Porcelain Catalogue
            </span>
            <p className="text-xs text-[#767168] max-w-md leading-relaxed">
              100% online catalogue with direct-to-jobsite crate freight. We supply large-format 9mm vitrified porcelain slabs and matching tiles directly to homeowners, builders, and general contractors—eliminating expensive showroom markups and specialist stone fabricator overhead.
            </p>
          </div>

          {/* Digital Ordering & Helpdesk (3 cols) */}
          <div className="lg:col-span-3 space-y-2 text-xs text-[#767168]">
            <span className="text-[11px] uppercase tracking-wider text-[#1A1A1A] font-semibold block mb-2">
              Online Orders &amp; Inquiries
            </span>
            <a
              href="mailto:quotes@veronasurfaces.com"
              className="text-[#1A1A1A] hover:underline font-medium flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-amber-700" />
              <span>quotes@veronasurfaces.com</span>
            </a>
            <a
              href="tel:18005557866"
              className="hover:underline flex items-center gap-1.5 pt-1"
            >
              <Phone className="w-3.5 h-3.5 text-amber-700" />
              <span>+1 (800) 555-STONE (7866)</span>
            </a>
            <p className="text-[11px] text-[#767168] pt-1">
              Digital line-item quotes &amp; CAD layout guides dispatched 24/7.
            </p>
          </div>

          {/* Quick Online Action Box (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-[#E8E4DC] p-5 rounded-none space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
              <Truck className="w-4 h-4 text-amber-700" />
              <span>Direct Jobsite Crate Logistics</span>
            </div>
            <p className="text-[11px] text-[#767168] leading-normal">
              Need a crate count calculation or contractor miter advice? Request an instant estimate or talk directly with a technical material specialist.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => onOpenQuoteModal()}
                className="flex-1 py-2.5 px-3 bg-[#1A1A1A] hover:bg-amber-800 text-white text-[11px] uppercase tracking-wider font-medium transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Calculator className="w-3 h-3" />
                <span>Instant Quote</span>
              </button>
              <button
                onClick={() => onOpenBookCall({ service: 'Online Contractor Consultation' })}
                className="flex-1 py-2.5 px-3 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] text-[11px] uppercase tracking-wider font-medium transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3 h-3" />
                <span>Book Call</span>
              </button>
            </div>
          </div>
        </div>

        {/* Middle Segment: Newsletter & Essential Catalogue Links */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-12 border-b border-[#E8E4DC] items-start">
          {/* Direct Email Digest */}
          <div className="lg:col-span-5 max-w-md">
            <span className="text-[11px] uppercase tracking-wider text-[#1A1A1A] font-semibold block mb-1">
              Direct Trade &amp; Catalogue Updates
            </span>
            <p className="text-xs text-[#767168] mb-3">
              Subscribe for new container arrivals, bookmatched vitrified batch releases, and wholesale pricing updates.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="flex border border-[#1A1A1A] bg-white">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                  className="flex-1 px-3 py-2 text-xs text-[#1A1A1A] placeholder-[#767168] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FAF8F5] border-l border-[#1A1A1A] text-[#1A1A1A] text-[10px] uppercase tracking-wider font-medium hover:bg-[#EFECE6] transition-colors cursor-pointer"
                >
                  Join
                </button>
              </div>
              {subscribed ? (
                <p className="text-[11px] text-emerald-800 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Subscribed! Check inbox for wholesale catalogue PDF.</span>
                </p>
              ) : (
                <p className="text-[10px] text-[#767168]">
                  Direct catalogue supply. Zero spam. Unsubscribe at any time.
                </p>
              )}
            </form>
          </div>

          {/* Only Essential Catalogue Navigation */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#767168]">
            {/* Column 1: Core Categories */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#1A1A1A] font-semibold block mb-3">
                Core Categories
              </span>
              <button
                onClick={() => scrollTo('porcelain-catalog-section')}
                className="block hover:text-[#1A1A1A] text-left cursor-pointer transition-colors"
              >
                Porcelain Countertops (USP)
              </button>
              <button
                onClick={() => scrollTo('categories-section')}
                className="block hover:text-[#1A1A1A] text-left cursor-pointer transition-colors"
              >
                Stone Countertops
              </button>
              <button
                onClick={() => scrollTo('categories-section')}
                className="block hover:text-[#1A1A1A] text-left cursor-pointer transition-colors"
              >
                Porcelain Tiles (600x1200mm)
              </button>
              <button
                onClick={() => scrollTo('porcelain-catalog-section')}
                className="block hover:text-[#1A1A1A] text-left cursor-pointer transition-colors"
              >
                High-Gloss Vitrified Slabs
              </button>
            </div>

            {/* Column 2: Online Tools */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#1A1A1A] font-semibold block mb-3">
                Online Tools
              </span>
              <button
                onClick={() => scrollTo('savings-calculator')}
                className="block hover:text-[#1A1A1A] text-left cursor-pointer transition-colors font-medium text-[#1A1A1A]"
              >
                Cost &amp; Savings Calculator
              </button>
              <button
                onClick={() => onOpenQuoteModal()}
                className="block hover:text-[#1A1A1A] text-left cursor-pointer transition-colors"
              >
                Instant Estimate by Email
              </button>
              <button
                onClick={() => onOpenBookCall({ service: 'Contractor Wet-Saw Spec Pack' })}
                className="block hover:text-[#1A1A1A] text-left cursor-pointer transition-colors"
              >
                Contractor Installation Guide
              </button>
              <button
                onClick={() => scrollTo('usp-section')}
                className="block hover:text-[#1A1A1A] text-left cursor-pointer transition-colors"
              >
                Porcelain vs Natural Stone Table
              </button>
            </div>

            {/* Column 3: Direct Advantage */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#1A1A1A] font-semibold block mb-3">
                Online Model
              </span>
              <div className="space-y-1 text-[11px] text-[#767168]">
                <p className="font-medium text-[#1A1A1A]">100% Online Booked</p>
                <p>Direct pallet delivery from kiln to jobsite.</p>
                <p className="font-medium text-[#1A1A1A] pt-1">Your Contractor Installs</p>
                <p>Cuts with standard diamond wet saw.</p>
                <p className="font-medium text-[#1A1A1A] pt-1">Direct Wholesale Rates</p>
                <p>No showroom overhead or middlemen.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Clean Copyright & Essential Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#767168] gap-4">
          <p>© 2026 Verona Surfaces. Direct Online Architectural Catalogue. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-[11px]">
            <span className="hover:text-[#1A1A1A] cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-[#1A1A1A] cursor-pointer">Terms of Supply</span>
            <span>·</span>
            <span className="hover:text-[#1A1A1A] cursor-pointer">Contractor Technical Specs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
