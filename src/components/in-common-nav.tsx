'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  ArrowRight,
  X,
} from 'lucide-react';

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
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavSection {
  id: string;
  title: string;
  href?: string;
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
  const [visualizerWipOpen, setVisualizerWipOpen] = useState(false);

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
          name: 'Countertops',
          subtitle: 'Large-format porcelain slabs',
          href: '/countertops',
        },
        {
          name: 'Backsplash & Wall Tile',
          subtitle: 'Continuous wall slabs & tiles',
          href: '/backsplash-walltile',
        },
        {
          name: 'Flooring',
          subtitle: 'High-traffic vitrified pavers & tiles',
          href: '/flooring',
        },
      ],
    },
    {
      id: 'design-tools',
      title: 'Design Tools',
      items: [
        {
          name: 'Estimator',
          subtitle: 'Instant square footage & budget estimation',
          action: () => {
            if (onOpenEstimator) {
              onOpenEstimator();
            } else {
              onOpenQuoteModal({ material: 'Porcelain Surface Package' });
            }
          },
        },
        {
          name: 'Visualizer',
          subtitle: 'In-browser perspective room studio',
          badge: 'Under Progress',
          action: () => {
            setVisualizerWipOpen(true);
          },
        },
      ],
    },
    {
      id: 'resources',
      title: 'Resources',
      action: () => {
        setResourcesWipOpen(true);
      },
    },
    {
      id: 'contact',
      title: 'Contact Us',
      href: '/contact',
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[0.16,1,0.3,1] ${
        showDarkText
          ? 'bg-[#FAF8F5]/70 md:bg-white/60 backdrop-blur-2xl backdrop-saturate-180 text-[#1A1A1A] py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.03)]'
          : 'bg-transparent text-white py-4.5'
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

              if (section.href) {
                const isCurrent = pathname === section.href;
                return (
                  <Link
                    key={section.id}
                    href={section.href}
                    className={`inline-flex items-center gap-1.5 py-2 whitespace-nowrap cursor-pointer transition-opacity duration-200 hover:opacity-70 font-medium uppercase tracking-[0.2em] text-xs ${
                      showDarkText ? 'text-[#1A1A1A]' : 'text-white'
                    } ${isCurrent ? 'text-amber-800 font-semibold' : ''}`}
                  >
                    <span>{section.title}</span>
                  </Link>
                );
              }

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

                  {/* Dropdown Menu Flyout: Luminous Warm Architectural Theme */}
                  <AnimatePresence>
                    {isOpen && section.items && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-full left-0 mt-2.5 w-64 bg-[#FAF8F5]/95 md:bg-white/92 backdrop-blur-2xl border border-[#E8E4DC] text-[#1A1A1A] p-2 rounded-xl shadow-[0_20px_45px_-10px_rgba(26,23,20,0.15)] z-50 text-left select-none"
                      >
                        <div className="flex flex-col gap-1">
                          {section.items.map((item) => {
                            if (item.action) {
                              return (
                                <button
                                  key={item.name}
                                  onClick={() => {
                                    setActiveDropdown(null);
                                    item.action?.();
                                  }}
                                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs uppercase tracking-[0.16em] font-medium text-[#2C2825] hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/[0.05] transition-all cursor-pointer text-left group"
                                >
                                  <div className="flex items-center gap-2">
                                    <span>{item.name}</span>
                                    {item.badge && (
                                      <span className="text-[9px] uppercase font-sans tracking-widest px-2 py-0.5 rounded-full bg-amber-900/10 text-amber-900 border border-amber-900/20 font-medium">
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  <ChevronRight className="w-3.5 h-3.5 text-[#8C827A] group-hover:text-amber-800 group-hover:translate-x-0.5 transition-all" />
                                </button>
                              );
                            }

                            return (
                              <Link
                                key={item.name}
                                href={item.href || '/'}
                                onClick={() => setActiveDropdown(null)}
                                className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs uppercase tracking-[0.16em] font-medium text-[#2C2825] hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/[0.05] transition-all cursor-pointer group"
                              >
                                <div className="flex items-center gap-2">
                                  <span>{item.name}</span>
                                  {item.badge && (
                                    <span className="text-[9px] uppercase font-sans tracking-widest px-2 py-0.5 rounded-full bg-amber-900/10 text-amber-900 border border-amber-900/20 font-medium">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-[#8C827A] group-hover:text-amber-800 group-hover:translate-x-0.5 transition-all" />
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Right: Desktop Consultation CTA + Mobile Menu Trigger */}
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => onOpenBookCall({ service: 'Architectural Consultation' })}
            className={`hidden md:inline-flex items-center px-5 py-2 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 cursor-pointer relative overflow-hidden backdrop-blur-sm ${
              showDarkText
                ? 'border border-[#1A1A1A]/30 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white shimmer-liquid-sheen'
                : 'border border-white/40 text-white hover:bg-white hover:text-[#1A1A1A] shimmer-liquid-sheen'
            }`}
          >
            <span>Book Consultation</span>
          </motion.button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded border cursor-pointer md:hidden backdrop-blur-sm ${
              showDarkText ? 'border-[#1A1A1A]/20 text-[#1A1A1A]' : 'border-white/30 text-white'
            }`}
            aria-label="Toggle Navigation Menu"
          >
            <span className="text-xs uppercase tracking-[0.25em] font-medium">Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5]/90 backdrop-blur-2xl text-[#1A1A1A] px-6 py-6 space-y-6 max-h-[85vh] overflow-y-auto shadow-2xl">
          {navSections.map((section) => {
            const isSectionOpen = mobileOpenSection === section.id;
            const hasItems = Boolean(section.items && section.items.length > 0);

            if (section.href) {
              return (
                <div key={section.id} className="border-b border-[#E8E4DC] pb-4">
                  <Link
                    href={section.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-between text-left py-1 text-xs uppercase tracking-[0.25em] font-medium text-[#1A1A1A] cursor-pointer"
                  >
                    <span>{section.title}</span>
                    <ArrowRight className="w-4 h-4 text-[#8C827A]" />
                  </Link>
                </div>
              );
            }

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
                  <div className="mt-3 pl-2 flex flex-col space-y-2">
                    {section.items?.map((item) => {
                      const Icon = item.icon;
                      const itemBody = (
                        <div className="flex items-start gap-3 w-full">
                          {Icon && (
                            <div className="w-8 h-8 rounded-sm bg-[#1A1A1A]/5 border border-[#1A1A1A]/10 flex items-center justify-center text-amber-800 shrink-0">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs uppercase tracking-wider font-medium text-[#1A1A1A] group-hover:text-amber-800 flex items-center gap-1.5">
                              <span>{item.name}</span>
                              {item.badge && (
                                <span className="text-[8px] uppercase font-mono tracking-widest px-1 py-0.5 bg-amber-800/10 text-amber-800 border border-amber-800/20">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#6C6863] normal-case tracking-normal mt-0.5 leading-snug">
                              {item.subtitle}
                            </div>
                          </div>
                        </div>
                      );

                      if (item.action) {
                        return (
                          <button
                            key={item.name}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              item.action?.();
                            }}
                            className="text-left w-full group p-2 rounded hover:bg-black/5 transition-colors cursor-pointer"
                          >
                            {itemBody}
                          </button>
                        );
                      }

                      return (
                        <Link
                          key={item.name}
                          href={item.href || '/'}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-left w-full group p-2 rounded hover:bg-black/5 transition-colors cursor-pointer"
                        >
                          {itemBody}
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
                onOpenBookCall({ service: 'Sample Swatch Request' });
              }}
              className="w-full py-3 border border-[#1A1A1A] text-[#1A1A1A] text-xs uppercase tracking-widest text-center cursor-pointer"
            >
              Request Swatch Samples
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
                Our architectural guides, contractor wet-saw fabrication manuals, ASTM physical durability certificates, and freight logistics guides are currently being curated.
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

      {/* Work In Progress Modal for Visualizer */}
      <AnimatePresence>
        {visualizerWipOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-[#FAF8F5] border border-[#1A1A1A]/20 shadow-2xl p-8 sm:p-10 text-[#1A1A1A]"
            >
              <button
                onClick={() => setVisualizerWipOpen(false)}
                className="absolute top-5 right-5 p-2 text-[#6C6863] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-[11px] uppercase tracking-[0.25em] text-amber-800 font-sans font-medium mb-3">
                Architectural Visualizer Studio
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#1A1A1A] leading-tight">
                Work in <span className="italic font-light text-amber-900">Progress</span>
              </h3>

              <p className="mt-4 text-sm text-[#59534E] leading-relaxed font-normal">
                Our in-browser 3D surface visualizer and real-time room perspective tool is currently undergoing calibration and performance upgrades.
              </p>

              <p className="mt-3 text-sm text-[#1A1A1A] font-serif italic">
                In the meantime, request curated sample swatches or schedule a 1-on-1 digital consultation with our surface design team.
              </p>

              <div className="mt-8 pt-6 border-t border-[#1A1A1A]/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => {
                    setVisualizerWipOpen(false);
                    onOpenBookCall({ service: 'Room Visualizer Consultation' });
                  }}
                  className="flex-1 py-3 bg-[#1A1A1A] hover:bg-black text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer text-center"
                >
                  Book Consultation
                </button>
                <button
                  onClick={() => setVisualizerWipOpen(false)}
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
