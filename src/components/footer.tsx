'use client';

import React from 'react';
import { ArrowUp, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  brandName: string;
  onOpenBookCall: () => void;
  onOpenQuoteModal: () => void;
}

export function Footer({ brandName, onOpenBookCall, onOpenQuoteModal }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const brandUpper = brandName.toUpperCase();

  return (
    <footer className="bg-black text-white text-xs pt-14 pb-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. FOLLOW SECTION (Exact Daltile match) */}
        <div className="mb-12">
          <div className="text-[11px] font-bold tracking-[0.2em] text-white uppercase mb-4">
            FOLLOW {brandUpper}
          </div>
          <div className="flex items-center gap-6 text-gray-400 text-lg">
            <span className="cursor-pointer hover:text-white transition font-mono font-bold">&gt;</span>
            <span className="cursor-pointer hover:text-white transition font-serif font-bold">P</span>
            <span className="cursor-pointer hover:text-white transition font-serif font-bold">h</span>
            <span className="cursor-pointer hover:text-white transition font-sans font-bold">f</span>
            <span className="cursor-pointer hover:text-white transition font-sans font-bold">X</span>
            <span className="cursor-pointer hover:text-white transition font-sans font-bold">IG</span>
            <span className="cursor-pointer hover:text-white transition font-sans font-bold">YT</span>
            <span className="cursor-pointer hover:text-white transition font-sans font-bold">in</span>
          </div>
        </div>

        {/* 2. 5 COLUMNS SITEMAP (Exact Daltile match) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 pb-12 border-b border-gray-800 text-[11px] leading-relaxed">
          {/* QUICK LINKS */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-white mb-3">
              COUNTERTOPS &amp; TILES
            </h4>
            <ul className="space-y-1.5 text-gray-400">
              <li><a href="#materials" className="hover:text-white transition">Quartz Countertops</a></li>
              <li><a href="#materials" className="hover:text-white transition">Natural Quartzite Slabs</a></li>
              <li><a href="#tiles" className="hover:text-white transition">Artisan Zellige Tiles</a></li>
              <li><a href="#tiles" className="hover:text-white transition">Kitchen Backsplash Tiles</a></li>
              <li><a href="#visualizer" className="hover:text-white transition">3D Room Visualizer</a></li>
              <li><a href="#estimator" className="hover:text-white transition">Instant Price Estimator</a></li>
            </ul>
          </div>

          {/* ABOUT US */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-white mb-3">
              ABOUT US
            </h4>
            <ul className="space-y-1.5 text-gray-400">
              <li><a href="#materials" className="hover:text-white transition">Why {brandName}</a></li>
              <li><a href="#materials" className="hover:text-white transition">Direct Mill Sourcing</a></li>
              <li><a href="#materials" className="hover:text-white transition">Laser Templating &amp; Install</a></li>
              <li><a href="#materials" className="hover:text-white transition">Sustainable Quarrying</a></li>
            </ul>
          </div>

          {/* CUSTOMER SERVICE */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-white mb-3">
              CUSTOMER SERVICE
            </h4>
            <ul className="space-y-1.5 text-gray-400">
              <li>
                <button onClick={onOpenQuoteModal} className="hover:text-white transition text-left">
                  Request Itemized Quote
                </button>
              </li>
              <li>
                <button onClick={onOpenBookCall} className="hover:text-white transition text-left">
                  Schedule Free Consultation
                </button>
              </li>
              <li>
                <a href="tel:18005847866" className="hover:text-white transition">
                  (800) 584-STONE
                </a>
              </li>
              <li>
                <a href="mailto:quotes@veronastone.com" className="hover:text-white transition">
                  quotes@veronastone.com
                </a>
              </li>
            </ul>
          </div>

          {/* TRADE PROFESSIONALS */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-white mb-3">
              TRADE PROFESSIONALS
            </h4>
            <ul className="space-y-1.5 text-gray-400">
              <li><a href="#materials" className="hover:text-white transition">Architects &amp; Designers</a></li>
              <li><a href="#materials" className="hover:text-white transition">Fabricators &amp; Installers</a></li>
              <li><a href="#materials" className="hover:text-white transition">Custom Home Builders</a></li>
              <li><a href="#materials" className="hover:text-white transition">Commercial Tile &amp; Slab Specs</a></li>
            </ul>
          </div>

          {/* RELATED INFORMATION */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-white mb-3">
              SURFACE GUIDES
            </h4>
            <ul className="space-y-1.5 text-gray-400">
              <li><a href="#materials" className="hover:text-white transition">Quartzite vs Quartz Slabs</a></li>
              <li><a href="#tiles" className="hover:text-white transition">Zellige Backsplash Installation</a></li>
              <li><a href="#materials" className="hover:text-white transition">Mitered Waterfall Edge Guide</a></li>
              <li><a href="#tiles" className="hover:text-white transition">Large-Format Porcelain Grout Care</a></li>
              <li><a href="#materials" className="hover:text-white transition">Sealing Natural Marble &amp; Granite</a></li>
            </ul>
          </div>
        </div>

        {/* 3. LEGAL & BOTTOM BAR */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-gray-400">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2">
            <span>Site Map</span>
            <span>Privacy Policy</span>
            <span>Legal Notice</span>
            <span>Vendors</span>
            <span>UGC Terms of Use</span>
            <span>Internet Selling Policy</span>
            <span>Code of Conduct</span>
          </div>

          <div className="flex items-center gap-4 text-gray-500">
            <span>WCAG 2.1 Compliant</span>
            <span>Your Privacy Choices</span>
          </div>
        </div>
      </div>

      {/* 4. CIRCULAR BACK-TO-TOP BUTTON (Exact Daltile match on bottom right) */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-30 w-11 h-11 rounded-full bg-white text-black shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform border border-gray-300"
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
}
