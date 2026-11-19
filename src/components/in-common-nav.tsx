'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ArrowRight, Sparkles, Calculator, Eye, Hammer, Package, HelpCircle, Phone, Mail } from 'lucide-react';

interface InCommonNavProps {
  onOpenBookCall: (opts?: { material?: string; service?: string }) => void;
  onOpenQuoteModal: (opts?: { material?: string }) => void;
  onOpenEstimator?: () => void;
  onSelectSection?: (sectionId: string) => void;
  onOpenMaterials?: () => void;
}

interface DropdownItem {
  name: string;
  subtitle: string;
  href?: string;
  action?: () => void;
  badge?: string;
}

interface NavSection {
  id: string;
  title: string;
  items: DropdownItem[];
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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpenSection, setMobileOpenSection] = useState<string | null>('products');

  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
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

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onSelectSection) {
      onSelectSection(id);
    }
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const navSections: NavSection[] = [
    {
      id: 'products',
      title: 'Products',
      items: [
        {
          name: 'Countertop',
          subtitle: '9mm monolithic porcelain slabs for islands & perimeter counters',
          href: '/porcelain-countertops',
          badge: 'Flagship',
        },
        {
          name: 'Backsplash & WallTile',
          subtitle: 'Full-height continuous veining & vertical shower surrounds',
          href: '/porcelain-countertops#categories-section',
        },
        {
          name: 'Flooring',
          subtitle: 'Architectural vitrified tiles in 600×1200mm & 600×600mm',
          href: '/porcelain-tiles',
        },
      ],
    },
    {
      id: 'design-tools',
      title: 'Design Tools',
      items: [
        {
          name: 'Room Visualizer',
          subtitle: 'Interactive in-browser AI tool to preview slabs in your kitchen',
          href: '/visualizer',
          badge: 'Interactive',
        },
        {
          name: 'Savings Calculator',
          subtitle: 'Compare direct porcelain wholesale against stone fabricator costs',
          action: () => onOpenQuoteModal(),
        },
      ],
    },
    {
      id: 'resources',
      title: 'Resources',
      items: [
        {
          name: 'Contractor Wet-Saw Guide',
          subtitle: 'Step-by-step on-site diamond wet saw cutting & miter calibration',
          href: '/porcelain-countertops',
        },
        {
          name: 'Tile Packaging & Freight',
          subtitle: '15.5 sq.ft / 29kg box standards and jobsite crate logistics',
          href: '/porcelain-tiles',
        },
        {
          name: 'Architectural Specs & FAQ',
          subtitle: '1000°C heat-proof & <0.04% zero-porosity technical data',
          href: '/#categories-section',
        },
      ],
    },
    {
      id: 'contact-us',
      title: 'Contact Us',
      items: [
        {
          name: 'Book 1-on-1 Consultation',
          subtitle: '15-min phone review with a porcelain surface specialist',
          action: () => onOpenBookCall({ service: 'Contractor & Material Consultation' }),
        },
        {
          name: 'Request Custom Quote',
          subtitle: 'Instant material, crate quantity, and freight calculation',
          action: () => onOpenQuoteModal(),
        },
        {
          name: 'Direct Inquiries Desk',
          subtitle: 'quotes@veronasurfaces.com · Direct trade & builder support',
          href: 'mailto:quotes@veronasurfaces.com',
        },
      ],
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showDarkText
          ? 'bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E4DC] text-[#1A1A1A] py-3.5 shadow-sm'
          : 'bg-transparent text-white py-5'
      }`}
    >
      <div
        ref={navRef}
        className="max-w-[1680px] mx-auto px-6 md:px-12 flex items-center justify-between text-xs tracking-[0.2em] font-sans"
      >
        {/* Left: Brand Identity + 4 Core Architectural Headings */}
        <div className="flex items-center space-x-8 lg:space-x-12">
          <Link
            href="/"
            className={`font-serif text-lg tracking-tight whitespace-nowrap transition-opacity hover:opacity-80 shrink-0 ${
              showDarkText ? 'text-[#1A1A1A]' : 'text-white'
            }`}
          >
            Verona <span className="italic font-light">Surfaces</span>
          </Link>

          {/* Desktop Navigation: Products, Design Tools, Resources, Contact Us */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navSections.map((section) => {
              const isOpen = activeDropdown === section.id;
              return (
                <div
                  key={section.id}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(section.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => setActiveDropdown(isOpen ? null : section.id)}
                    aria-expanded={isOpen}
                    className={`inline-flex items-center gap-1.5 py-2 whitespace-nowrap cursor-pointer transition-opacity duration-200 hover:opacity-70 font-medium uppercase tracking-[0.2em] text-xs ${
                      showDarkText ? 'text-[#1A1A1A]' : 'text-white'
                    }`}
                  >
                    <span>{section.title}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 opacity-70 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu Flyout */}
                  {isOpen && (
                    <div
                      className={`absolute top-full left-0 mt-1.5 w-80 sm:w-96 rounded-none p-3 shadow-2xl transition-all duration-150 z-50 ${
                        showDarkText
                          ? 'bg-[#FAF8F5] border border-[#E8E4DC] text-[#1A1A1A]'
                          : 'bg-[#1A1714]/98 border border-white/20 text-white backdrop-blur-md'
                      }`}
                    >
                      <div className="text-[10px] uppercase font-mono tracking-[0.25em] px-3 pt-2 pb-2 opacity-50 border-b border-current/10 mb-2">
                        {section.title}
                      </div>
                      <div className="flex flex-col gap-1">
                        {section.items.map((item) => {
                          const content = (
                            <div className="flex flex-col text-left">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-xs tracking-wider uppercase">
                                  {item.name}
                                </span>
                                {item.badge && (
                                  <span className="text-[9px] uppercase px-1.5 py-0.5 tracking-wider bg-amber-800/10 text-amber-800 font-mono">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] normal-case tracking-normal opacity-70 font-sans mt-0.5 leading-snug">
                                {item.subtitle}
                              </span>
                            </div>
                          );

                          if (item.action) {
                            return (
                              <button
                                key={item.name}
                                onClick={() => {
                                  setActiveDropdown(null);
                                  item.action?.();
                                }}
                                className={`w-full p-2.5 text-left transition-colors cursor-pointer ${
                                  showDarkText
                                    ? 'hover:bg-[#F2EFE9] text-[#1A1A1A]'
                                    : 'hover:bg-white/10 text-white'
                                }`}
                              >
                                {content}
                              </button>
                            );
                          }

                          return (
                            <Link
                              key={item.name}
                              href={item.href || '/'}
                              onClick={() => setActiveDropdown(null)}
                              className={`w-full p-2.5 text-left transition-colors cursor-pointer ${
                                showDarkText
                                  ? 'hover:bg-[#F2EFE9] text-[#1A1A1A]'
                                  : 'hover:bg-white/10 text-white'
                              }`}
                            >
                              {content}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#E8E4DC] text-[#1A1A1A] px-6 py-6 space-y-6 max-h-[85vh] overflow-y-auto">
          {navSections.map((section) => {
            const isSectionOpen = mobileOpenSection === section.id;
            return (
              <div key={section.id} className="border-b border-[#E8E4DC] pb-4">
                <button
                  onClick={() => setMobileOpenSection(isSectionOpen ? null : section.id)}
                  className="w-full flex items-center justify-between text-left py-1 text-xs uppercase tracking-[0.25em] font-medium text-[#1A1A1A]"
                >
                  <span>{section.title}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isSectionOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isSectionOpen && (
                  <div className="mt-3 pl-2 flex flex-col space-y-3">
                    {section.items.map((item) => {
                      if (item.action) {
                        return (
                          <button
                            key={item.name}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              item.action?.();
                            }}
                            className="text-left w-full group py-1"
                          >
                            <div className="text-xs uppercase tracking-wider font-medium text-[#1A1A1A] group-hover:text-amber-800">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-[#6C6863] normal-case tracking-normal">
                              {item.subtitle}
                            </div>
                          </button>
                        );
                      }

                      return (
                        <Link
                          key={item.name}
                          href={item.href || '/'}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-left w-full group py-1"
                        >
                          <div className="text-xs uppercase tracking-wider font-medium text-[#1A1A1A] group-hover:text-amber-800">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-[#6C6863] normal-case tracking-normal">
                            {item.subtitle}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-2 flex flex-col gap-2.5">
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
