'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Sparkles, Calculator, Eye, Hammer, Package, HelpCircle, Phone, Mail, X } from 'lucide-react';

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
}

interface NavSection {
  id: string;
  title: string;
  items?: DropdownItem[];
  action?: () => void;
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
  const [resourcesWipOpen, setResourcesWipOpen] = useState(false);

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
          subtitle: 'Porcelain, Granite, Quartz & Quartzite slabs for kitchen islands',
          href: '/countertops',
        },
        {
          name: 'Backsplash & WallTile',
          subtitle: 'Continuous veined slabs & moisture-proof wall tiles',
          href: '/backsplash-walltile',
        },
        {
          name: 'Flooring',
          subtitle: 'High-traffic vitrified pavers & natural stone floor tiles',
          href: '/flooring',
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
        },
        {
          name: 'Project Sizing Calculator',
          subtitle: 'Estimate surface area, crate quantities and freight logistics',
          action: () => onOpenQuoteModal(),
        },
      ],
    },
    {
      id: 'resources',
      title: 'Resources',
      action: () => setResourcesWipOpen(true),
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
              const hasDropdown = Boolean(section.items && section.items.length > 0);

              if (!hasDropdown) {
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveDropdown(null);
                      section.action?.();
                    }}
                    className={`inline-flex items-center gap-1.5 py-2 whitespace-nowrap cursor-pointer transition-opacity duration-200 hover:opacity-70 font-medium uppercase tracking-[0.2em] text-xs ${
                      showDarkText ? 'text-[#1A1A1A]' : 'text-white'
                    }`}
                  >
                    <span>{section.title}</span>
                  </button>
                );
              }

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
                  {isOpen && section.items && (
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
                              <span className="font-medium text-xs tracking-wider uppercase text-[#1A1A1A]">
                                {item.name}
                              </span>
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

        {/* Right: Desktop Consultation CTA + Mobile Menu Trigger */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onOpenBookCall({ service: 'Architectural Consultation' })}
            className={`hidden md:inline-flex items-center px-5 py-2 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-200 cursor-pointer ${
              showDarkText
                ? 'border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white'
                : 'border border-white/40 text-white hover:bg-white hover:text-[#1A1A1A]'
            }`}
          >
            <span>Book Consultation</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded border cursor-pointer md:hidden ${
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
            const hasItems = Boolean(section.items && section.items.length > 0);

            if (!hasItems) {
              return (
                <div key={section.id} className="border-b border-[#E8E4DC] pb-4">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      section.action?.();
                    }}
                    className="w-full flex items-center justify-between text-left py-1 text-xs uppercase tracking-[0.25em] font-medium text-[#1A1A1A] cursor-pointer"
                  >
                    <span>{section.title}</span>
                    <span className="text-[10px] text-amber-800 font-sans tracking-widest uppercase">In Progress</span>
                  </button>
                </div>
              );
            }

            return (
              <div key={section.id} className="border-b border-[#E8E4DC] pb-4">
                <button
                  onClick={() => setMobileOpenSection(isSectionOpen ? null : section.id)}
                  className="w-full flex items-center justify-between text-left py-1 text-xs uppercase tracking-[0.25em] font-medium text-[#1A1A1A] cursor-pointer"
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
                    {section.items?.map((item) => {
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
              className="w-full py-3 bg-[#1A1A1A] text-white text-xs uppercase tracking-widest text-center cursor-pointer"
            >
              Book 1-on-1 Consultation
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuoteModal();
              }}
              className="w-full py-3 border border-[#1A1A1A] text-[#1A1A1A] text-xs uppercase tracking-widest text-center cursor-pointer"
            >
              Request Itemized Quote
            </button>
          </div>
        </div>
      )}

      {/* Work In Progress Modal for Resources */}
      <AnimatePresence>
        {resourcesWipOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-[#FAF8F5] border border-[#1A1A1A]/20 shadow-2xl p-8 sm:p-10 text-[#1A1A1A]"
            >
              <button
                onClick={() => setResourcesWipOpen(false)}
                className="absolute top-5 right-5 p-2 text-[#6C6863] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-[11px] uppercase tracking-[0.25em] text-amber-800 font-sans font-medium mb-3">
                Architectural Resource Library
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#1A1A1A] leading-tight">
                Work in <span className="italic font-light text-amber-900">Progress</span>
              </h3>

              <p className="mt-4 text-sm text-[#59534E] leading-relaxed font-normal">
                Our architectural technical dossiers, contractor wet-saw fabrication manuals, ASTM physical durability certificates, and freight logistics guides are currently being curated.
              </p>

              <p className="mt-3 text-sm text-[#1A1A1A] font-serif italic">
                Please check back soon. Connect directly with our advisory desk for instant material specifications.
              </p>

              <div className="mt-8 pt-6 border-t border-[#1A1A1A]/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => {
                    setResourcesWipOpen(false);
                    onOpenBookCall({ service: 'Architectural Resource Consultation' });
                  }}
                  className="flex-1 py-3 bg-[#1A1A1A] hover:bg-black text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer text-center"
                >
                  Contact Specialist
                </button>
                <button
                  onClick={() => setResourcesWipOpen(false)}
                  className="px-6 py-3 border border-[#1A1A1A]/20 hover:border-[#1A1A1A] text-[#1A1A1A] text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer text-center"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
