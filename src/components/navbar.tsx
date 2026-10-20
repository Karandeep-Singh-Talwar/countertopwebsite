'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Mail, MapPin, User, Heart, ShoppingBag, Phone, Calendar, Menu, X, Edit3, Check } from 'lucide-react';

interface NavbarProps {
  brandName: string;
  onOpenBookCall: () => void;
  onOpenQuoteModal: () => void;
  onOpenVisualizer: () => void;
  onOpenEstimator: () => void;
  onSelectCategory?: (category: 'countertops' | 'tiles') => void;
  onOpenQuartzColors?: () => void;
}

export function Navbar({
  brandName,
  onOpenBookCall,
  onOpenQuoteModal,
  onOpenVisualizer,
  onOpenEstimator,
  onSelectCategory,
  onOpenQuartzColors,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const scrollToMaterials = (category: 'countertops' | 'tiles') => {
    onSelectCategory?.(category);
    const el = document.getElementById('materials-section') || document.getElementById('materials');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { label: 'COUNTERTOPS', action: () => scrollToMaterials('countertops') },
    { label: 'TILES', action: () => scrollToMaterials('tiles') },
    { label: 'QUARTZ COLORS', action: () => onOpenQuartzColors?.() },
    { label: '3D ROOM VISUALIZER', action: onOpenVisualizer },
    { label: 'PRICE ESTIMATOR', action: onOpenEstimator },
    { label: 'FREE CONSULTATION', action: onOpenBookCall },
    { label: 'CONTACT', action: onOpenQuoteModal },
  ];

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* 1. Main Header Row: Logo, Search Input, Direct Conversion Actions */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-1.5 group">
              <span className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-black lowercase first-letter:uppercase">
                {brandName.toLowerCase()}
              </span>
              <span className="w-2 h-2 rounded-full bg-black mt-2" />
            </Link>
          </div>

          {/* Center Search Input with Search Icon */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search countertops, tiles, colors..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-none px-3.5 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black"
              />
              <Search className="w-4 h-4 text-gray-500 absolute right-3 top-2.5 cursor-pointer hover:text-black" />
            </div>
          </div>

          {/* Right Direct Conversion Actions */}
          <div className="flex items-center gap-4 sm:gap-6 text-gray-700 text-xs">
            <button
              onClick={onOpenQuoteModal}
              className="hidden sm:flex items-center gap-1.5 text-gray-700 hover:text-black font-semibold text-xs transition"
            >
              <Mail className="w-4 h-4 text-gray-600" />
              <span>Contact &amp; Quote</span>
            </button>

            <button
              onClick={onOpenBookCall}
              className="flex items-center gap-1.5 px-5 py-2 bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider transition shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5 text-white" />
              <span>Book a Call</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-gray-700 hover:text-black"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Single Architectural Category Strip (Focused strictly on countertops, tiles & key tools) */}
      <div className="bg-black text-white text-[11px] font-semibold tracking-[0.12em] uppercase hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-2.5">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="text-gray-200 hover:text-white hover:underline underline-offset-4 transition px-2 whitespace-nowrap uppercase cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search countertops, tiles..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 px-3 py-2 text-xs text-gray-800 focus:outline-none"
            />
            <Search className="w-4 h-4 text-gray-500 absolute right-3 top-2.5" />
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              Explore Surfaces &amp; Tools
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs text-gray-800">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    item.action();
                  }}
                  className="py-1.5 text-left hover:text-black font-semibold uppercase tracking-wider border-b border-gray-100"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookCall();
              }}
              className="w-full py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Consultation Call</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuoteModal();
              }}
              className="w-full py-2 bg-gray-100 text-black border border-gray-300 text-xs font-medium"
            >
              Request Email Quote
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
