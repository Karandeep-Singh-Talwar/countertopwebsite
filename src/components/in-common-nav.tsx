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
      <div className="max-w-[1680px] mx-auto px-6 md:px-12 flex items-center justify-between text-xs tracking-[0.2em] font-sans">
        {/* Left: Brand Identity + 3 Core Collections */}
        <div className="flex items-center space-x-8 lg:space-x-12">
          <Link
            href="/"
            className={`font-serif text-lg tracking-tight whitespace-nowrap transition-opacity hover:opacity-80 shrink-0 ${
              showDarkText ? 'text-[#1A1A1A]' : 'text-white'
            }`}
          >
            Verona <span className="italic font-light">Surfaces</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link
              href="/porcelain-countertops"
              className={`whitespace-nowrap cursor-pointer transition-opacity duration-200 hover:opacity-70 font-medium uppercase tracking-[0.2em] text-xs ${
                showDarkText ? 'text-[#1A1A1A]' : 'text-white'
              }`}
            >
              Porcelain Countertops
            </Link>
            <Link
              href="/stone-countertops"
              className={`whitespace-nowrap cursor-pointer transition-opacity duration-200 hover:opacity-70 font-medium uppercase tracking-[0.2em] text-xs ${
                showDarkText ? 'text-[#1A1A1A]' : 'text-white'
              }`}
            >
              Stone Countertops
            </Link>
            <Link
              href="/porcelain-tiles"
              className={`whitespace-nowrap cursor-pointer transition-opacity duration-200 hover:opacity-70 font-medium uppercase tracking-[0.2em] text-xs ${
                showDarkText ? 'text-[#1A1A1A]' : 'text-white'
              }`}
            >
              Porcelain Tiles
            </Link>
          </nav>
        </div>

        {/* Right: Streamlined 2-Action Box (Instant Quote & Book Call) */}
        <div className="flex items-center">
          <div
            className={`hidden sm:flex items-center divide-x border text-xs uppercase tracking-[0.2em] ${
              showDarkText
                ? 'border-[#D9D4CC] divide-[#D9D4CC] bg-white/80 text-[#1A1A1A]'
                : 'border-white/30 divide-white/30 bg-black/20 backdrop-blur-sm text-white'
            }`}
          >
            <button
              onClick={() => onOpenQuoteModal()}
              className="px-5 py-2 hover:bg-black/5 transition-colors cursor-pointer font-medium whitespace-nowrap"
            >
              Instant Quote
            </button>
            <button
              onClick={() => onOpenBookCall({ service: 'Contractor & Material Consultation' })}
              className={`px-5 py-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
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
            className={`md:hidden p-2 rounded border cursor-pointer ml-3 ${
              showDarkText ? 'border-[#D9D4CC] text-[#1A1A1A]' : 'border-white/30 text-white'
            }`}
            aria-label="Toggle Navigation Menu"
          >
            <span className="text-xs uppercase tracking-[0.25em] font-medium">Menu</span>
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
