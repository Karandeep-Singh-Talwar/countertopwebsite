'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ArrowRight,
  X,
} from 'lucide-react';
import { VeronaCrestLogo } from '@/components/verona-crest-logo';

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
}: InCommonNavProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpenSection, setMobileOpenSection] = useState<string | null>('products');
  const [wipModal, setWipModal] = useState<{ open: boolean; title: string; subtitle: string; description: string } | null>(null);

  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
        setWipModal(null);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const showDarkText = isScrolled || !isHomePage;

  const handleMouseEnter = (sectionId: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveDropdown(sectionId);
  };

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const openResourcesWip = () => {
    setWipModal({
      open: true,
      title: 'Website Updates',
      subtitle: 'Architectural Resource Library',
      description:
        'WE ARE CURRENTLY CURATING OUR ARCHITECTURAL SPECIFICATION GUIDES, CONTRACTOR WET-SAW MANUALS, ASTM DURABILITY CERTIFICATES, AND FREIGHT DISPATCH PROTOCOLS. WE APOLOGIZE FOR ANY TEMPORARY INCONVENIENCE. THE COMPLETE REPOSITORY WILL BE ACCESSIBLE SHORTLY. THANK YOU IN ADVANCE FOR YOUR UNDERSTANDING.',
    });
  };

  const openVisualizerWip = () => {
    setWipModal({
      open: true,
      title: 'Website Updates',
      subtitle: 'Perspective Room Visualizer Studio',
      description:
        'WE ARE CURRENTLY CALIBRATING OUR IN-BROWSER 3D SURFACE VISUALIZER AND PERSPECTIVE HOMOGRAPHY STUDIO. WE APOLOGIZE FOR ANY TEMPORARY INCONVENIENCE. THE INTERACTIVE STUDIO WILL BE ACCESSIBLE SHORTLY. IN THE MEANTIME, OUR ATELIER CONSULTANTS ARE AVAILABLE FOR DIRECT 1-ON-1 DIGITAL REVIEWS.',
    });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[0.16,1,0.3,1] ${
        showDarkText
          ? 'bg-[#FAF8F5]/85 md:bg-[#FAF8F5]/80 backdrop-blur-xl backdrop-saturate-150 text-[#1A1A1A] border-b border-[#1A1A1A]/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.03)]'
          : 'bg-black/20 backdrop-blur-md text-white border-b border-white/10'
      }`}
    >
      <div ref={navRef} className="max-w-[1680px] mx-auto px-6 md:px-12">
        {/* Tier 1: Petersham-style Brand Crest */}
        <div className="grid grid-cols-2 md:grid-cols-3 items-center py-2.5 sm:py-3 transition-all duration-300">
          {/* Left: Spacer to ensure absolute center alignment */}
          <div className="hidden md:block" />

          {/* Center: Heritage Architectural Crest & Wordmark (Without Subtitle) */}
          <div className="col-span-1 md:col-span-1 flex justify-start md:justify-center">
            <Link
              href="/"
              className="group flex flex-col items-start md:items-center justify-center transition-opacity hover:opacity-90 py-0.5"
            >
              <VeronaCrestLogo
                size={isScrolled ? 32 : 38}
                textColor={showDarkText ? '#1A1A1A' : '#FAF8F5'}
                crestColor={showDarkText ? '#8C6D46' : '#E6C687'}
                showSubtitle={false}
                className="transition-all duration-300"
              />
            </Link>
          </div>

          {/* Right Utility: Book Consultation CTA & Mobile Toggle */}
          <div className="flex items-center justify-end space-x-4">
            <motion.button
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
              onClick={() => onOpenBookCall({ service: 'Architectural Consultation' })}
              className={`hidden md:inline-flex items-center gap-2 py-1 text-[11px] tracking-[0.2em] font-medium transition-colors duration-300 cursor-pointer group ${
                showDarkText
                  ? 'text-[#1A1A1A] hover:text-amber-800'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              <span className="border-b border-current/30 group-hover:border-current pb-0.5 transition-colors">
                Book Consultation
              </span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-amber-800" />
            </motion.button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded border cursor-pointer md:hidden backdrop-blur-sm ${
                showDarkText ? 'border-[#1A1A1A]/20 text-[#1A1A1A]' : 'border-white/30 text-white'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className={`block h-0.5 w-full ${showDarkText ? 'bg-[#1A1A1A]' : 'bg-white'}`} />
                <span className={`block h-0.5 w-full ${showDarkText ? 'bg-[#1A1A1A]' : 'bg-white'}`} />
                <span className={`block h-0.5 w-full ${showDarkText ? 'bg-[#1A1A1A]' : 'bg-white'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Delicate Hairline Separator Between Crest Tier and Nav Row */}
        <div className="hidden md:block w-full border-b border-current/10" />

        {/* Tier 2: Centered Heritage Navigation Bar */}
        <nav className="hidden md:flex items-center justify-center space-x-10 lg:space-x-14 py-2 text-xs tracking-[0.22em] font-sans font-medium relative">
          {/* 1. Products Dropdown Trigger & Clean Floating Menu */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('products')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'products' ? null : 'products')}
              aria-expanded={activeDropdown === 'products'}
              className={`inline-flex items-center gap-1.5 py-1.5 cursor-pointer transition-all duration-200 ${
                activeDropdown === 'products'
                  ? 'text-amber-800 font-semibold'
                  : 'hover:opacity-70'
              }`}
            >
              <span>Products</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-300 ease-[0.16,1,0.3,1] ${
                  activeDropdown === 'products' ? 'rotate-180 text-amber-800' : 'opacity-60'
                }`}
              />
            </button>

            {/* Minimalist Floating Menu: Products */}
            <AnimatePresence>
              {activeDropdown === 'products' && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 min-w-[270px] select-none"
                >
                  <div className="bg-[#FAF8F5]/96 backdrop-blur-2xl border border-[#1A1A1A]/10 shadow-[0_16px_40px_rgba(26,23,20,0.12)] p-2 text-[#1A1A1A]">
                    <div className="p-1 divide-y divide-[#1A1A1A]/8">
                      {/* 1. Countertops */}
                      <Link
                        href="/countertops"
                        onClick={() => setActiveDropdown(null)}
                        className="group block py-2.5 px-3 hover:bg-[#1A1A1A]/[0.03] transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-[0.18em] font-serif font-medium text-[#1A1A1A] group-hover:text-amber-800 transition-colors">
                            Countertops &amp; Islands
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-amber-800" />
                        </div>
                      </Link>

                      {/* 2. Backsplash & Wall Tile */}
                      <Link
                        href="/backsplash-walltile"
                        onClick={() => setActiveDropdown(null)}
                        className="group block py-2.5 px-3 hover:bg-[#1A1A1A]/[0.03] transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-[0.18em] font-serif font-medium text-[#1A1A1A] group-hover:text-amber-800 transition-colors">
                            Backsplash &amp; Wall Tile
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-amber-800" />
                        </div>
                      </Link>

                      {/* 3. Flooring */}
                      <Link
                        href="/flooring"
                        onClick={() => setActiveDropdown(null)}
                        className="group block py-2.5 px-3 hover:bg-[#1A1A1A]/[0.03] transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-[0.18em] font-serif font-medium text-[#1A1A1A] group-hover:text-amber-800 transition-colors">
                            Architectural Flooring
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-amber-800" />
                        </div>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2. Design Tools Dropdown Trigger & Clean Floating Menu */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('design-tools')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'design-tools' ? null : 'design-tools')}
              aria-expanded={activeDropdown === 'design-tools'}
              className={`inline-flex items-center gap-1.5 py-1.5 cursor-pointer transition-all duration-200 ${
                activeDropdown === 'design-tools'
                  ? 'text-amber-800 font-semibold'
                  : 'hover:opacity-70'
              }`}
            >
              <span>Design Tools</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-300 ease-[0.16,1,0.3,1] ${
                  activeDropdown === 'design-tools' ? 'rotate-180 text-amber-800' : 'opacity-60'
                }`}
              />
            </button>

            {/* Minimalist Floating Menu: Design Tools */}
            <AnimatePresence>
              {activeDropdown === 'design-tools' && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 min-w-[270px] select-none"
                >
                  <div className="bg-[#FAF8F5]/96 backdrop-blur-2xl border border-[#1A1A1A]/10 shadow-[0_16px_40px_rgba(26,23,20,0.12)] p-2 text-[#1A1A1A]">
                    <div className="p-1 divide-y divide-[#1A1A1A]/8">
                      {/* Tool 1: Estimator */}
                      <button
                        onClick={() => {
                          setActiveDropdown(null);
                          if (onOpenEstimator) {
                            onOpenEstimator();
                          } else {
                            onOpenQuoteModal({ material: 'Porcelain Surface Package' });
                          }
                        }}
                        className="w-full text-left group block py-2.5 px-3 hover:bg-[#1A1A1A]/[0.03] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-[0.18em] font-serif font-medium text-[#1A1A1A] group-hover:text-amber-800 transition-colors">
                            Takeoff Estimator
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-amber-800" />
                        </div>
                      </button>

                      {/* Tool 2: Visualizer (WIP Trigger) */}
                      <button
                        onClick={() => {
                          setActiveDropdown(null);
                          openVisualizerWip();
                        }}
                        className="w-full text-left group block py-2.5 px-3 hover:bg-[#1A1A1A]/[0.03] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-[0.18em] font-serif font-medium text-[#1A1A1A] group-hover:text-amber-800 transition-colors">
                            Room Visualizer 3D
                          </span>
                          <span className="text-[9px] font-mono uppercase tracking-wider text-amber-800 font-medium">Preview</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. Resources (WIP Trigger) */}
          <button
            onClick={openResourcesWip}
            className="inline-flex items-center gap-1.5 py-1.5 cursor-pointer transition-opacity duration-200 hover:opacity-70"
          >
            <span>Resources</span>
          </button>

          {/* 4. Contact Us */}
          <Link
            href="/contact"
            className={`inline-flex items-center gap-1.5 py-1.5 cursor-pointer transition-opacity duration-200 hover:opacity-70 ${
              pathname === '/contact' ? 'text-amber-800 font-semibold' : ''
            }`}
          >
            <span>Contact Us</span>
          </Link>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5]/95 backdrop-blur-2xl text-[#1A1A1A] px-6 py-6 space-y-6 max-h-[85vh] overflow-y-auto shadow-2xl">
          {/* Products Accordion */}
          <div className="border-b border-[#E8E4DC] pb-4">
            <button
              onClick={() => setMobileOpenSection(mobileOpenSection === 'products' ? null : 'products')}
              className="w-full flex items-center justify-between text-left py-1 text-xs tracking-[0.22em] font-medium text-[#1A1A1A] cursor-pointer"
            >
              <span>Products</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  mobileOpenSection === 'products' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {mobileOpenSection === 'products' && (
              <div className="mt-3 pl-2 flex flex-col space-y-2 text-xs tracking-wider">
                <Link
                  href="/countertops"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 text-[#4A4642] hover:text-[#1A1A1A] flex items-center justify-between"
                >
                  <span>Countertops &amp; Islands</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                </Link>
                <Link
                  href="/backsplash-walltile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 text-[#4A4642] hover:text-[#1A1A1A] flex items-center justify-between"
                >
                  <span>Backsplash &amp; Wall Tile</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                </Link>
                <Link
                  href="/flooring"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 text-[#4A4642] hover:text-[#1A1A1A] flex items-center justify-between"
                >
                  <span>Architectural Flooring</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                </Link>
              </div>
            )}
          </div>

          {/* Design Tools Accordion */}
          <div className="border-b border-[#E8E4DC] pb-4">
            <button
              onClick={() => setMobileOpenSection(mobileOpenSection === 'tools' ? null : 'tools')}
              className="w-full flex items-center justify-between text-left py-1 text-xs tracking-[0.22em] font-medium text-[#1A1A1A] cursor-pointer"
            >
              <span>Design Tools</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  mobileOpenSection === 'tools' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {mobileOpenSection === 'tools' && (
              <div className="mt-3 pl-2 flex flex-col space-y-2 text-xs tracking-wider">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenEstimator) onOpenEstimator();
                    else onOpenQuoteModal({ material: 'Porcelain Surface Package' });
                  }}
                  className="py-1.5 text-left text-[#4A4642] hover:text-[#1A1A1A] flex items-center justify-between cursor-pointer"
                >
                  <span>Takeoff Estimator</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openVisualizerWip();
                  }}
                  className="py-1.5 text-left text-[#4A4642] hover:text-[#1A1A1A] flex items-center justify-between cursor-pointer"
                >
                  <span>Room Visualizer 3D</span>
                  <span className="text-[9px] font-mono text-amber-700">Preview</span>
                </button>
              </div>
            )}
          </div>

          {/* Resources */}
          <div className="border-b border-[#E8E4DC] pb-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openResourcesWip();
              }}
              className="w-full flex items-center justify-between text-left py-1 text-xs tracking-[0.22em] font-medium text-[#1A1A1A] cursor-pointer"
            >
              <span>Resources</span>
              <span className="text-[10px] text-amber-800 font-sans tracking-widest uppercase">In Calibration</span>
            </button>
          </div>

          {/* Contact Us */}
          <div className="border-b border-[#E8E4DC] pb-4">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-between text-left py-1 text-xs tracking-[0.22em] font-medium text-[#1A1A1A] cursor-pointer"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4 text-[#8C827A]" />
            </Link>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookCall({ service: 'Architectural Consultation' });
              }}
              className="w-full py-3 bg-[#1A1A1A] text-white text-xs uppercase tracking-widest text-center cursor-pointer"
            >
              Book 1-on-1 Consultation
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookCall({ service: 'Curated Swatches' });
              }}
              className="w-full py-3 border border-[#1A1A1A] text-[#1A1A1A] text-xs uppercase tracking-widest text-center cursor-pointer"
            >
              Request Swatch Samples
            </button>
          </div>
        </div>
      )}

      {/* Classical Petersham Nurseries-Inspired Double-Hairline "Website Updates" Modal */}
      <AnimatePresence>
        {wipModal && wipModal.open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl"
            >
              {/* Outer Delicate Hairline Frame */}
              <div className="border border-[#1A1A1A]/20 p-2 sm:p-2.5 bg-[#FAF8F5] shadow-2xl">
                {/* Inner Delicate Hairline Frame with Symmetrical Inset */}
                <div className="border border-[#1A1A1A]/30 p-8 sm:p-12 text-center flex flex-col items-center bg-[#FAF8F5]">
                  {/* Close Cross */}
                  <button
                    onClick={() => setWipModal(null)}
                    className="absolute top-5 right-5 p-2 text-[#6C6863] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Classical Architectural Keystone Ornament */}
                  <div className="w-10 h-0.5 bg-amber-800/40 mb-4" />

                  {/* Classical Serif Title */}
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal tracking-tight">
                    {wipModal.title}
                  </h3>

                  {/* Tracked Architectural Department Subtitle */}
                  <div className="text-[10px] font-sans uppercase tracking-[0.25em] text-amber-800 mt-1 mb-5 font-medium">
                    {wipModal.subtitle}
                  </div>

                  {/* Uppercase Tracked Notice (Petersham Typography Style) */}
                  <div className="max-w-md text-[11px] sm:text-xs font-sans uppercase tracking-[0.2em] text-[#59534E] leading-relaxed">
                    {wipModal.description}
                  </div>

                  {/* Classical Italic Assurance */}
                  <p className="mt-4 text-xs font-serif italic text-[#1A1A1A]">
                    Connect directly with our advisory desk for instant material specifications.
                  </p>

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        setWipModal(null);
                        onOpenBookCall({ service: `${wipModal.subtitle} Inquiry` });
                      }}
                      className="w-full sm:w-auto px-8 py-3 bg-[#1A1A1A] hover:bg-black text-[#FAF8F5] text-xs uppercase tracking-[0.25em] font-medium transition-colors cursor-pointer"
                    >
                      Contact Us
                    </button>
                    <button
                      onClick={() => setWipModal(null)}
                      className="w-full sm:w-auto px-6 py-3 border border-[#1A1A1A]/30 hover:border-[#1A1A1A] text-[#1A1A1A] text-xs uppercase tracking-[0.25em] font-medium transition-colors cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
