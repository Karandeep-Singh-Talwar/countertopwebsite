'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Phone, Mail, Calendar, Calculator, Sparkles, ChevronDown } from 'lucide-react';

interface InCommonNavProps {
  onOpenBookCall: (opts?: { material?: string; service?: string }) => void;
  onOpenQuoteModal: (opts?: { material?: string }) => void;
  onOpenEstimator?: () => void;
  onSelectSection?: (sectionId: string) => void;
  onOpenMaterials?: () => void;
}

export function InCommonNav({
  onOpenBookCall,
  onOpenQuoteModal,
  onOpenEstimator,
  onSelectSection,
  onOpenMaterials,
}: InCommonNavProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showDarkText = isScrolled || !isHomePage;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onSelectSection) {
      onSelectSection(id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showDarkText
          ? 'bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E4DC] text-[#1A1A1A] py-3.5 shadow-sm'
          : 'bg-transparent text-white py-5'
      }`}
    >
      <div className="max-w-[1680px] mx-auto px-6 md:px-12 flex items-center justify-between text-[13px] tracking-wide font-sans">
        {/* Left Links - 3 Core Categories & USP */}
        <nav className="flex items-center space-x-6 md:space-x-8">
          <Link
            href="/porcelain-countertops"
            className={`cursor-pointer transition-opacity duration-200 hover:opacity-70 font-normal uppercase tracking-wider text-[11px] md:text-[12px] flex items-center gap-1.5 ${
              showDarkText ? 'text-[#1A1A1A]' : 'text-white'
            }`}
          >
            <span>Porcelain Countertops</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          </Link>
          <Link
            href="/stone-countertops"
            className={`cursor-pointer transition-opacity duration-200 hover:opacity-70 font-normal uppercase tracking-wider text-[11px] md:text-[12px] ${
              showDarkText ? 'text-[#1A1A1A]' : 'text-white'
            }`}
          >
            Stone Countertops
          </Link>
          <Link
            href="/porcelain-tiles"
            className={`cursor-pointer transition-opacity duration-200 hover:opacity-70 font-normal uppercase tracking-wider text-[11px] md:text-[12px] ${
              showDarkText ? 'text-[#1A1A1A]' : 'text-white'
            }`}
          >
            Porcelain Tiles
          </Link>
          <Link
            href="/#usp-section"
            className={`hidden lg:inline-flex items-center gap-1.5 cursor-pointer transition-opacity duration-200 hover:opacity-70 font-medium uppercase tracking-wider text-[11px] md:text-[12px] ${
              showDarkText ? 'text-amber-800' : 'text-amber-300'
            }`}
          >
            <span>Our USP</span>
          </Link>
          <Link
            href="/#savings-calculator"
            className={`hidden xl:inline-flex items-center gap-1.5 cursor-pointer transition-opacity duration-200 hover:opacity-70 font-normal uppercase tracking-wider text-[11px] md:text-[12px] ${
              showDarkText ? 'text-[#1A1A1A]' : 'text-white'
            }`}
          >
            <span>Cost Calculator</span>
          </Link>
        </nav>

        {/* Center Minimalist Brand Accent (When Scrolled, only on very wide screens) */}
        {showDarkText && (
          <Link
            href="/"
            className="cursor-pointer text-[11px] tracking-[0.2em] font-medium uppercase text-[#1A1A1A] transition-opacity hover:opacity-70 hidden 2xl:block shrink-0 px-4"
          >
            Verona Surfaces · Architectural Stone & Porcelain
          </Link>
        )}

        {/* Right Segmented Menu Box */}
        <div className="flex items-center">
          <div
            className={`hidden sm:flex items-center divide-x border text-[11px] uppercase tracking-wider ${
              showDarkText
                ? 'border-[#D9D4CC] divide-[#D9D4CC] bg-white/80 text-[#1A1A1A]'
                : 'border-white/30 divide-white/30 bg-black/20 backdrop-blur-sm text-white'
            }`}
          >
            <button
              onClick={() => scrollTo('savings-calculator')}
              className="px-4 py-2 hover:bg-black/5 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Calculator className="w-3 h-3" />
              <span>Calculator</span>
            </button>
            <button
              onClick={() => onOpenQuoteModal()}
              className="px-4 py-2 hover:bg-black/5 transition-colors cursor-pointer"
            >
              Instant Quote
            </button>
            <button
              onClick={() => onOpenBookCall({ service: 'Contractor & Material Consultation' })}
              className={`px-5 py-2 font-medium transition-colors cursor-pointer ${
                showDarkText
                  ? 'bg-[#1A1A1A] text-white hover:bg-black'
                  : 'bg-white text-[#1A1A1A] hover:bg-[#FAF8F5]'
              }`}
            >
              Book Call
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`sm:hidden p-2 rounded border cursor-pointer ${
              showDarkText ? 'border-[#D9D4CC] text-[#1A1A1A]' : 'border-white/30 text-white'
            }`}
            aria-label="Toggle Navigation Menu"
          >
            <span className="text-[11px] uppercase tracking-widest font-medium">Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#FAF8F5] border-b border-[#E8E4DC] text-[#1A1A1A] px-6 py-6 space-y-4">
          <Link
            href="/porcelain-countertops"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left py-2 text-sm uppercase tracking-wider font-medium text-amber-900"
          >
            Porcelain Countertops (USP)
          </Link>
          <Link
            href="/stone-countertops"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left py-2 text-sm uppercase tracking-wider font-medium"
          >
            Stone Countertops
          </Link>
          <Link
            href="/porcelain-tiles"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left py-2 text-sm uppercase tracking-wider font-medium"
          >
            Porcelain Tiles
          </Link>
          <Link
            href="/#savings-calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left py-2 text-sm uppercase tracking-wider"
          >
            Contractor Cost Calculator
          </Link>
          <div className="pt-4 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookCall();
              }}
              className="w-full py-3 bg-[#1A1A1A] text-white text-xs uppercase tracking-widest text-center"
            >
              Book 1-on-1 Consultation
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuoteModal();
              }}
              className="w-full py-3 border border-[#1A1A1A] text-[#1A1A1A] text-xs uppercase tracking-widest text-center"
            >
              Request Itemized Quote
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
