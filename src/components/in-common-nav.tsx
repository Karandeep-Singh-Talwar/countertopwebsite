'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Calculator,
  Eye,
  Hammer,
  Package,
  Layers,
  HelpCircle,
  Phone,
  Mail,
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
          name: 'Countertops & Waterfalls',
          subtitle: 'Large-format porcelain slabs cut on-site. Heat, wine & knife impervious.',
          href: '/countertops',
          icon: Layers,
          badge: 'Flagship',
        },
        {
          name: 'Backsplash & Wall Tile',
          subtitle: 'Continuous veined slabs & calibrated tiles for cooking zones & showers.',
          href: '/backsplash-walltile',
          icon: Sparkles,
        },
        {
          name: 'Architectural Flooring',
          subtitle: 'High-traffic vitrified pavers & large tiles for unbroken room continuity.',
          href: '/flooring',
          icon: Package,
        },
      ],
    },
    {
      id: 'design-tools',
      title: 'Design Tools',
      items: [
        {
          name: 'Room Visualizer AI',
          subtitle: 'Snap a phone photo or try luxury rooms to test slabs live in your space.',
          href: '/visualizer',
          icon: Eye,
          badge: 'Proprietary AI',
        },
        {
          name: 'Project Sizing Calculator',
          subtitle: 'Calculate square footage and estimate slab requirements.',
          href: '/contact',
          icon: Calculator,
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
      href: '/contact',
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

              if (section.href) {
                const isCurrent = pathname === section.href;
                return (
                  <Link
                    key={section.id}
                    href={section.href}
                    className={`inline-flex items-center gap-1.5 py-2 whitespace-nowrap cursor-pointer transition-opacity duration-200 hover:opacity-70 font-medium uppercase tracking-[0.2em] text-xs ${
                      showDarkText ? 'text-[#1A1A1A]' : 'text-white'
                    } ${isCurrent ? 'border-b border-amber-600 font-semibold' : ''}`}
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

                  {/* Dropdown Menu Flyout: Luxury Dark Architectural Card (Exact Match to Design Reference) */}
                  <AnimatePresence>
                    {isOpen && section.items && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-full left-0 mt-3 w-[480px] sm:w-[500px] bg-[#141413]/98 backdrop-blur-2xl border border-amber-500/20 text-white p-6 rounded-2xl shadow-[0_24px_70px_rgba(0,0,0,0.65)] z-50 text-left select-none"
                      >
                        {/* Top Header Tag */}
                        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08] mb-4">
                          <span className="text-[10.5px] uppercase font-mono tracking-[0.25em] text-[#D4AF37] font-semibold">
                            {section.id === 'products' ? 'ARCHITECTURAL SURFACES' : 'DESIGN & SPECIFICATION'}
                          </span>
                          <span className="text-[10px] uppercase font-mono tracking-[0.22em] text-[#D4AF37] font-medium">
                            VERONA STUDIO
                          </span>
                        </div>

                        {/* Items List */}
                        <div className="flex flex-col gap-2.5">
                          {section.items.map((item) => {
                            const Icon = item.icon || Layers;
                            const content = (
                              <div className="flex items-start gap-3.5 w-full">
                                <div className="w-10 h-10 rounded-lg bg-[#1C1A17] border border-[#2E2A24] flex items-center justify-center text-[#D4AF37] group-hover:border-[#D4AF37]/50 group-hover:text-amber-300 transition-colors shrink-0 mt-0.5">
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-serif text-[15px] sm:text-[16px] font-normal tracking-tight text-white group-hover:text-amber-100 transition-colors">
                                      {item.name}
                                    </span>
                                    {item.badge && (
                                      <span className="text-[9px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded-xs border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] font-medium">
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[12px] font-sans text-[#9E988F] group-hover:text-[#D1CBC2] leading-relaxed mt-1 transition-colors">
                                    {item.subtitle}
                                  </p>
                                </div>
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
                                  className="group w-full p-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer hover:bg-white/[0.04]"
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
                                className="group w-full p-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer hover:bg-white/[0.04]"
                              >
                                {content}
                              </Link>
                            );
                          })}
                        </div>

                        {/* Bottom Footer Bar */}
                        <div className="border-t border-[#262420] pt-3.5 mt-3 flex items-center justify-between text-xs">
                          {section.id === 'products' ? (
                            <>
                              <span className="text-[#9E988F] font-sans">Test our slabs in your space:</span>
                              <Link
                                href="/visualizer"
                                onClick={() => setActiveDropdown(null)}
                                className="text-[#D4AF37] hover:text-amber-300 font-medium font-sans inline-flex items-center gap-1.5 transition-colors cursor-pointer group/link"
                              >
                                <span>Open Studio AI</span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                              </Link>
                            </>
                          ) : (
                            <>
                              <span className="text-[#9E988F] font-sans">Direct material consultation:</span>
                              <button
                                onClick={() => {
                                  setActiveDropdown(null);
                                  onOpenBookCall();
                                }}
                                className="text-[#D4AF37] hover:text-amber-300 font-medium font-sans inline-flex items-center gap-1.5 transition-colors cursor-pointer group/link"
                              >
                                <span>Book 15-Min Call</span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                              </button>
                            </>
                          )}
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
            className={`hidden md:inline-flex items-center px-5 py-2 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-200 cursor-pointer relative overflow-hidden ${
              showDarkText
                ? 'border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white shimmer-liquid-sheen'
                : 'border border-white/40 text-white hover:bg-white hover:text-[#1A1A1A] shimmer-liquid-sheen'
            }`}
          >
            <span>Book Consultation</span>
          </motion.button>

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
