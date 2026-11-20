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
        {/* Tier 1: Petersham-style Brand Crest & Top Utility Strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 items-center py-2.5 sm:py-3 transition-all duration-300">
          {/* Left Utility: Specification & Estimator Shortcuts */}
          <div className="hidden md:flex items-center space-x-6 text-[10px] uppercase tracking-[0.24em] font-sans font-medium text-current/75">
            <button
              onClick={() => {
                if (onOpenEstimator) {
                  onOpenEstimator();
                } else {
                  onOpenQuoteModal({ material: 'Porcelain Surface Package' });
                }
              }}
              className="hover:opacity-100 hover:text-amber-800 transition-colors cursor-pointer"
            >
              Takeoff Estimator
            </button>
            <span className="opacity-30">|</span>
            <button
              onClick={() => onOpenBookCall({ service: 'Curated Swatches' })}
              className="hover:opacity-100 hover:text-amber-800 transition-colors cursor-pointer"
            >
              Curated Swatches
            </button>
          </div>

          {/* Center: Heritage Architectural Crest & Wordmark */}
          <div className="col-span-1 md:col-span-1 flex justify-start md:justify-center">
            <Link
              href="/"
              className="group flex flex-col items-start md:items-center justify-center transition-opacity hover:opacity-90 py-0.5"
            >
              <VeronaCrestLogo
                size={isScrolled ? 30 : 38}
                textColor={showDarkText ? '#1A1A1A' : '#FAF8F5'}
                crestColor={showDarkText ? '#8C6D46' : '#E6C687'}
                showSubtitle={!isScrolled}
                className="transition-all duration-300"
              />
            </Link>
          </div>

          {/* Right Utility: Book Consultation CTA & Mobile Toggle */}
          <div className="flex items-center justify-end space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => onOpenBookCall({ service: 'Architectural Consultation' })}
              className={`hidden md:inline-flex items-center px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] font-medium transition-all duration-300 cursor-pointer border backdrop-blur-sm ${
                showDarkText
                  ? 'border-[#1A1A1A]/30 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAF8F5]'
                  : 'border-white/40 text-white hover:bg-white hover:text-[#1A1A1A]'
              }`}
            >
              <span>Book Consultation</span>
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
        <nav className="hidden md:flex items-center justify-center space-x-10 lg:space-x-14 py-2 text-xs tracking-[0.22em] font-sans font-medium uppercase">
          {/* 1. Products Dropdown Trigger */}
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
          </div>

          {/* 2. Design Tools Dropdown Trigger */}
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

      {/* Petersham Nurseries-Inspired 4-Column Architectural Ledger Ribbon */}
      <AnimatePresence>
        {activeDropdown && (activeDropdown === 'products' || activeDropdown === 'design-tools') && (
          <div
            onMouseEnter={() => {
              if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current);
                closeTimerRef.current = null;
              }
            }}
            onMouseLeave={handleMouseLeave}
            className="hidden md:block absolute top-full left-0 right-0 w-full select-none"
          >
            <motion.div
              key={activeDropdown}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="w-full bg-[#FAF8F5]/98 backdrop-blur-2xl border-b border-[#1A1A1A]/10 text-[#1A1A1A] shadow-[0_30px_60px_-15px_rgba(26,23,20,0.12)]"
            >
              <div className="max-w-[1680px] mx-auto px-6 md:px-12 py-8">
                {activeDropdown === 'products' ? (
                  <div>
                    {/* 4-Column Petersham Ledger with Hairline Dividers */}
                    <div className="grid grid-cols-4 divide-x divide-[#1A1A1A]/10">
                      {/* Column 1: Countertops */}
                      <div className="pr-8">
                        <div className="text-xs font-serif uppercase tracking-[0.2em] font-semibold text-[#1A1A1A] mb-1.5">
                          Countertops &amp; Islands
                        </div>
                        <Link
                          href="/countertops"
                          onClick={() => setActiveDropdown(null)}
                          className="text-[10px] uppercase tracking-[0.22em] text-amber-800 hover:text-amber-950 font-medium mb-4 block"
                        >
                          View All Countertops &rarr;
                        </Link>
                        <div className="flex flex-col space-y-2 text-[11px] uppercase tracking-[0.16em] text-[#4A4642] font-normal">
                          <Link href="/countertops" onClick={() => setActiveDropdown(null)} className="hover:text-[#1A1A1A] hover:translate-x-0.5 transition-all">
                            Kitchen Waterfall Islands
                          </Link>
                          <Link href="/countertops" onClick={() => setActiveDropdown(null)} className="hover:text-[#1A1A1A] hover:translate-x-0.5 transition-all">
                            Integrated Seamless Sinks
                          </Link>
                          <Link href="/countertops" onClick={() => setActiveDropdown(null)} className="hover:text-[#1A1A1A] hover:translate-x-0.5 transition-all">
                            High-Temperature Cooktop Slabs
                          </Link>
                          <Link href="/countertops" onClick={() => setActiveDropdown(null)} className="hover:text-[#1A1A1A] hover:translate-x-0.5 transition-all">
                            Outdoor Alfresco Kitchens
                          </Link>
                          <Link href="/countertops" onClick={() => setActiveDropdown(null)} className="hover:text-[#1A1A1A] hover:translate-x-0.5 transition-all">
                            Calacatta &amp; Statuario Veins
                          </Link>
                        </div>
                        <div className="mt-5 pt-3 border-t border-[#1A1A1A]/10 text-[9px] font-mono tracking-widest uppercase text-[#736E68]">
                          9mm · 12mm · 20mm Solid Mass
                        </div>
                      </div>

                      {/* Column 2: Backsplash & Wall Tile */}
                      <div className="px-8">
                        <div className="text-xs font-serif uppercase tracking-[0.2em] font-semibold text-[#1A1A1A] mb-1.5">
                          Backsplash &amp; Wall Tile
                        </div>
                        <Link
                          href="/backsplash-walltile"
                          onClick={() => setActiveDropdown(null)}
                          className="text-[10px] uppercase tracking-[0.22em] text-amber-800 hover:text-amber-950 font-medium mb-4 block"
                        >
                          View All Backsplash &rarr;
                        </Link>
                        <div className="flex flex-col space-y-2 text-[11px] uppercase tracking-[0.16em] text-[#4A4642] font-normal">
                          <Link href="/backsplash-walltile" onClick={() => setActiveDropdown(null)} className="hover:text-[#1A1A1A] hover:translate-x-0.5 transition-all">
                            Full-Height Vertical Cladding
                          </Link>
                          <Link href="/backsplash-walltile" onClick={() => setActiveDropdown(null)} className="hover:text-[#1A1A1A] hover:translate-x-0.5 transition-all">
                            Mirror-Matched Bookvein Walls
                          </Link>
                          <Link href="/backsplash-walltile" onClick={() => setActiveDropdown(null)} className="hover:text-[#1A1A1A] hover:translate-x-0.5 transition-all">
                            Calibrated 600&times;1200 Field Tiles
                          </Link>
                          <Link href="/backsplash-walltile" onClick={() => setActiveDropdown(null)} className="hover:text-[#1A1A1A] hover:translate-x-0.5 transition-all">
                            Architectural Fireplace Hearths
                          </Link>
                          <Link href="/backsplash-walltile" onClick={() => setActiveDropdown(null)} className="hover:text-[#1A1A1A] hover:translate-x-0.5 transition-all">
                            Zero-Grout Spa Enclosures
                          </Link>
                        </div>
                        <div className="mt-5 pt-3 border-t border-[#1A1A1A]/10 text-[9px] font-mono tracking-widest uppercase text-[#736E68]">
                          6mm · 9mm Calibrated
                        </div>
                      </div>

                      {/* Column 3: Flooring */}
                      <div className="px-8">
                        <div className="text-xs font-serif uppercase tracking-[0.2em] font-semibold text-[#1A1A1A] mb-1.5">
                          Architectural Flooring
                        </div>
                        <Link
                          href="/flooring"
                          onClick={() => setActiveDropdown(null)}
                          className="text-[10px] uppercase tracking-[0.22em] text-amber-800 hover:text-amber-950 font-medium mb-4 block"
                        >
                          View All Flooring &rarr;
                        </Link>
                        <div className="flex flex-col space-y-2 text-[11px] uppercase tracking-[0.16em] text-[#4A4642] font-normal">
                          <Link href="/flooring" onClick={() => setActiveDropdown(null)} className="hover:text-[#1A1A1A] hover:translate-x-0.5 transition-all">
                            Grand-Format Vitrified Slabs
                          </Link>
                          <Link href="/flooring" onClick={() => setActiveDropdown(null)} className="hover:text-[#1A1A1A] hover:translate-x-0.5 transition-all">
                            20mm Exterior Paver Profiles
                          </Link>
                          <Link href="/flooring" onClick={() => setActiveDropdown(null)} className="hover:text-[#1A1A1A] hover:translate-x-0.5 transition-all">
                            Indoor-to-Outdoor Continuity
                          </Link>
                          <Link href="/flooring" onClick={() => setActiveDropdown(null)} className="hover:text-[#1A1A1A] hover:translate-x-0.5 transition-all">
                            R11 Anti-Slip Structured Finish
                          </Link>
                          <Link href="/flooring" onClick={() => setActiveDropdown(null)} className="hover:text-[#1A1A1A] hover:translate-x-0.5 transition-all">
                            Radiant Heat Optimized
                          </Link>
                        </div>
                        <div className="mt-5 pt-3 border-t border-[#1A1A1A]/10 text-[9px] font-mono tracking-widest uppercase text-[#736E68]">
                          9mm · 20mm Paver Profile
                        </div>
                      </div>

                      {/* Column 4: Specification & Atelier */}
                      <div className="pl-8">
                        <div className="text-xs font-serif uppercase tracking-[0.2em] font-semibold text-[#1A1A1A] mb-1.5">
                          Specification Desk
                        </div>
                        <button
                          onClick={() => {
                            setActiveDropdown(null);
                            onOpenBookCall({ service: 'Architectural Surface Review' });
                          }}
                          className="text-[10px] uppercase tracking-[0.22em] text-amber-800 hover:text-amber-950 font-medium mb-4 block text-left cursor-pointer"
                        >
                          Architectural Review &rarr;
                        </button>
                        <div className="flex flex-col space-y-2 text-[11px] uppercase tracking-[0.16em] text-[#4A4642] font-normal">
                          <button
                            onClick={() => {
                              setActiveDropdown(null);
                              if (onOpenEstimator) onOpenEstimator();
                              else onOpenQuoteModal({ material: 'Porcelain Surface Package' });
                            }}
                            className="hover:text-[#1A1A1A] text-left hover:translate-x-0.5 transition-all cursor-pointer"
                          >
                            Surface Takeoff Estimator
                          </button>
                          <button
                            onClick={() => {
                              setActiveDropdown(null);
                              openVisualizerWip();
                            }}
                            className="hover:text-[#1A1A1A] text-left hover:translate-x-0.5 transition-all cursor-pointer flex items-center justify-between"
                          >
                            <span>Room Visualizer Studio</span>
                            <span className="text-[9px] font-mono text-amber-700">Preview</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveDropdown(null);
                              onOpenBookCall({ service: 'Curated Swatches' });
                            }}
                            className="hover:text-[#1A1A1A] text-left hover:translate-x-0.5 transition-all cursor-pointer"
                          >
                            Curated Sample Kit
                          </button>
                          <button
                            onClick={() => {
                              setActiveDropdown(null);
                              onOpenBookCall({ service: 'CAD Drawings' });
                            }}
                            className="hover:text-[#1A1A1A] text-left hover:translate-x-0.5 transition-all cursor-pointer"
                          >
                            CAD Architectural Takeoff
                          </button>
                          <button
                            onClick={() => {
                              setActiveDropdown(null);
                              onOpenBookCall({ service: 'Architectural Consultation' });
                            }}
                            className="hover:text-[#1A1A1A] text-left hover:translate-x-0.5 transition-all cursor-pointer"
                          >
                            1-on-1 Materials Consultant
                          </button>
                        </div>
                        <div className="mt-5 pt-3 border-t border-[#1A1A1A]/10 text-[9px] font-mono tracking-widest uppercase text-amber-800 font-medium">
                          Direct Jobsite Freight Delivery
                        </div>
                      </div>
                    </div>

                    {/* Bottom Horizon Action Shelf */}
                    <div className="mt-6 pt-5 border-t border-[#1A1A1A]/10 flex items-center justify-between text-xs font-sans">
                      <div className="opacity-60 font-light flex items-center gap-4 text-[11px]">
                        <span>Monolithic porcelain surfaces sculpted for architectural continuity</span>
                        <span>·</span>
                        <span>ASTM C373 Water Absorption &lt;0.04%</span>
                        <span>·</span>
                        <span>Thermal shock proof</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => {
                            setActiveDropdown(null);
                            onOpenBookCall({ service: 'Sample Swatch Request' });
                          }}
                          className="hover:text-amber-800 uppercase tracking-[0.2em] text-[10.5px] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Request Curated Swatches</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setActiveDropdown(null);
                            onOpenBookCall({ service: 'Architectural Consultation' });
                          }}
                          className="hover:text-amber-800 uppercase tracking-[0.2em] text-[10.5px] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Book Consultation</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* 4-Column Design Tools Ledger */}
                    <div className="grid grid-cols-4 divide-x divide-[#1A1A1A]/10">
                      {/* Tool 1: Takeoff Estimator */}
                      <div className="pr-8">
                        <div className="text-xs font-serif uppercase tracking-[0.2em] font-semibold text-[#1A1A1A] mb-1.5">
                          Surface Estimator
                        </div>
                        <button
                          onClick={() => {
                            setActiveDropdown(null);
                            if (onOpenEstimator) onOpenEstimator();
                            else onOpenQuoteModal({ material: 'Porcelain Surface Package' });
                          }}
                          className="text-[10px] uppercase tracking-[0.22em] text-amber-800 hover:text-amber-950 font-medium mb-4 block text-left cursor-pointer"
                        >
                          Launch Estimator &rarr;
                        </button>
                        <div className="flex flex-col space-y-2 text-[11px] uppercase tracking-[0.16em] text-[#4A4642] font-normal">
                          <span>Instant Square-Foot Takeoff</span>
                          <span>Slab Yield &amp; Cut Optimization</span>
                          <span>Waterfall &amp; Miter Apron Costing</span>
                          <span>Live Budget Summary in 30s</span>
                        </div>
                        <div className="mt-5 pt-3 border-t border-[#1A1A1A]/10 text-[9px] font-mono tracking-widest uppercase text-[#736E68]">
                          Real-Time Estimation Engine
                        </div>
                      </div>

                      {/* Tool 2: Room Visualizer Studio */}
                      <div className="px-8">
                        <div className="text-xs font-serif uppercase tracking-[0.2em] font-semibold text-[#1A1A1A] mb-1.5">
                          Room Visualizer Studio
                        </div>
                        <button
                          onClick={() => {
                            setActiveDropdown(null);
                            openVisualizerWip();
                          }}
                          className="text-[10px] uppercase tracking-[0.22em] text-amber-800 hover:text-amber-950 font-medium mb-4 block text-left cursor-pointer"
                        >
                          Open Preview Studio &rarr;
                        </button>
                        <div className="flex flex-col space-y-2 text-[11px] uppercase tracking-[0.16em] text-[#4A4642] font-normal">
                          <span>Perspective Room Homography</span>
                          <span>Calacatta &amp; Statuario Vein Flows</span>
                          <span>Ambient Lighting Transfer</span>
                          <span>In-Browser AI Segmentation</span>
                        </div>
                        <div className="mt-5 pt-3 border-t border-[#1A1A1A]/10 text-[9px] font-mono tracking-widest uppercase text-amber-800 font-medium flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                          <span>In Calibration</span>
                        </div>
                      </div>

                      {/* Tool 3: Architectural Consultation */}
                      <div className="px-8">
                        <div className="text-xs font-serif uppercase tracking-[0.2em] font-semibold text-[#1A1A1A] mb-1.5">
                          Architectural Review
                        </div>
                        <button
                          onClick={() => {
                            setActiveDropdown(null);
                            onOpenBookCall({ service: 'Architectural Surface Review' });
                          }}
                          className="text-[10px] uppercase tracking-[0.22em] text-amber-800 hover:text-amber-950 font-medium mb-4 block text-left cursor-pointer"
                        >
                          Schedule Review &rarr;
                        </button>
                        <div className="flex flex-col space-y-2 text-[11px] uppercase tracking-[0.16em] text-[#4A4642] font-normal">
                          <span>1-on-1 Materials Consultant</span>
                          <span>CAD Architectural Drawing Review</span>
                          <span>ASTM Physical Durability Reports</span>
                          <span>Contractor Wet-Saw Manuals</span>
                        </div>
                        <div className="mt-5 pt-3 border-t border-[#1A1A1A]/10 text-[9px] font-mono tracking-widest uppercase text-[#736E68]">
                          15-Minute Dedicated Session
                        </div>
                      </div>

                      {/* Tool 4: Physical Swatch Kit */}
                      <div className="pl-8">
                        <div className="text-xs font-serif uppercase tracking-[0.2em] font-semibold text-[#1A1A1A] mb-1.5">
                          Physical Swatch Kit
                        </div>
                        <button
                          onClick={() => {
                            setActiveDropdown(null);
                            onOpenBookCall({ service: 'Curated Swatches' });
                          }}
                          className="text-[10px] uppercase tracking-[0.22em] text-amber-800 hover:text-amber-950 font-medium mb-4 block text-left cursor-pointer"
                        >
                          Order Swatch Box &rarr;
                        </button>
                        <div className="flex flex-col space-y-2 text-[11px] uppercase tracking-[0.16em] text-[#4A4642] font-normal">
                          <span>Box of 4 Architectural Slabs</span>
                          <span>Matte Honed &amp; Polished Silk</span>
                          <span>Delivered in 48h to Jobsite</span>
                          <span>Trade &amp; Designer Kits</span>
                        </div>
                        <div className="mt-5 pt-3 border-t border-[#1A1A1A]/10 text-[9px] font-mono tracking-widest uppercase text-amber-800 font-medium">
                          Complimentary for Architects
                        </div>
                      </div>
                    </div>

                    {/* Bottom Horizon Action Shelf */}
                    <div className="mt-6 pt-5 border-t border-[#1A1A1A]/10 flex items-center justify-between text-xs font-sans">
                      <div className="opacity-60 font-light flex items-center gap-4 text-[11px]">
                        <span>Digital CAD surface maps</span>
                        <span>·</span>
                        <span>Itemized architectural takeoffs dispatched same day</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => {
                            setActiveDropdown(null);
                            onOpenBookCall({ service: 'Architectural Drawing Review' });
                          }}
                          className="hover:text-amber-800 uppercase tracking-[0.2em] text-[10.5px] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Submit Architectural Drawings</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5]/95 backdrop-blur-2xl text-[#1A1A1A] px-6 py-6 space-y-6 max-h-[85vh] overflow-y-auto shadow-2xl">
          {/* Products Accordion */}
          <div className="border-b border-[#E8E4DC] pb-4">
            <button
              onClick={() => setMobileOpenSection(mobileOpenSection === 'products' ? null : 'products')}
              className="w-full flex items-center justify-between text-left py-1 text-xs uppercase tracking-[0.25em] font-medium text-[#1A1A1A] cursor-pointer"
            >
              <span>Products</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  mobileOpenSection === 'products' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {mobileOpenSection === 'products' && (
              <div className="mt-3 pl-2 flex flex-col space-y-2 text-xs uppercase tracking-wider">
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
              className="w-full flex items-center justify-between text-left py-1 text-xs uppercase tracking-[0.25em] font-medium text-[#1A1A1A] cursor-pointer"
            >
              <span>Design Tools</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  mobileOpenSection === 'tools' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {mobileOpenSection === 'tools' && (
              <div className="mt-3 pl-2 flex flex-col space-y-2 text-xs uppercase tracking-wider">
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
              className="w-full flex items-center justify-between text-left py-1 text-xs uppercase tracking-[0.25em] font-medium text-[#1A1A1A] cursor-pointer"
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
              className="w-full flex items-center justify-between text-left py-1 text-xs uppercase tracking-[0.25em] font-medium text-[#1A1A1A] cursor-pointer"
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
