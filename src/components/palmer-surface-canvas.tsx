'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Grid3X3, 
  Sparkles, 
  Menu, 
  X, 
  ArrowRight, 
  Calendar, 
  Mail, 
  ShieldCheck, 
  Layers, 
  Clock, 
  Check, 
  Eye, 
  Compass,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { Card3DTilt } from '@/components/card-3d-tilt';

export interface PalmerSpecimen {
  id: string;
  name: string;
  subtitle: string;
  category: 'countertops' | 'tiles';
  materialType: 'quartz' | 'natural-quartzite' | 'marble' | 'porcelain' | 'granite' | 'soapstone' | 'fluted-tile' | 'zellige';
  materialLabel: string;
  colorCategory: 'white' | 'gray' | 'black' | 'beige' | 'green' | 'accent';
  colorLabel: string;
  colorHex: string;
  image: string;
  pricePerSqFt: number;
  originalPrice?: number;
  stockCount: string;
  thickness: string;
  finish: string;
  veining: string;
  origin: string;
  hardness: string;
  porosity: string;
  heatTolerance: string;
  leadTime: string;
  description: string;
  bestFor: string;
  // Canvas placement configuration (only for items featured on floating canvas)
  canvas?: {
    top: string;
    left: string;
    size: number;
    floatDuration: number;
    floatDelay: number;
    rotationOffset: number;
  };
}

export function StoneTextureDisc({
  specimen,
  className = '',
}: {
  specimen: PalmerSpecimen;
  className?: string;
}) {
  const { id, colorCategory } = specimen;

  return (
    <div className={`relative w-full h-full rounded-full overflow-hidden ${className}`}>
      {/* 1. Procedural Vector Architectural Stone / Tile Texture */}
      {id.includes('calacatta') || id.includes('statuario') || id.includes('bianco') ? (
        <svg viewBox="0 0 400 400" className="w-full h-full object-cover">
          <defs>
            <radialGradient id={`marble-base-${id}`} cx="45%" cy="40%" r="75%">
              <stop offset="0%" stopColor="#faf9f6" />
              <stop offset="60%" stopColor="#f3efe8" />
              <stop offset="100%" stopColor="#e8e2d5" />
            </radialGradient>
            <filter id={`marble-vein-filter-${id}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.012 0.035" numOctaves="4" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          <rect width="400" height="400" fill={`url(#marble-base-${id})`} />
          <path d="M-20,90 Q90,130 180,110 T340,160 T420,280" fill="none" stroke="#78716c" strokeWidth="8" opacity="0.32" filter={`url(#marble-vein-filter-${id})`} />
          <path d="M-10,100 Q80,140 175,115 T345,165 T415,285" fill="none" stroke="#b45309" strokeWidth="3" opacity="0.65" filter={`url(#marble-vein-filter-${id})`} />
          <path d="M120,-20 Q160,110 260,220 T420,380" fill="none" stroke="#a8a29e" strokeWidth="6" opacity="0.3" filter={`url(#marble-vein-filter-${id})`} />
          <path d="M220,-10 Q280,80 320,180 T420,290" fill="none" stroke="#d97706" strokeWidth="2.5" opacity="0.5" filter={`url(#marble-vein-filter-${id})`} />
          <path d="M-20,280 Q80,320 200,310 T380,390" fill="none" stroke="#78716c" strokeWidth="5" opacity="0.25" filter={`url(#marble-vein-filter-${id})`} />
        </svg>
      ) : id.includes('nero') || id.includes('charcoal') || id.includes('laurent') ? (
        <svg viewBox="0 0 400 400" className="w-full h-full object-cover">
          <defs>
            <radialGradient id={`nero-base-${id}`} cx="35%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#27272a" />
              <stop offset="100%" stopColor="#09090b" />
            </radialGradient>
            <filter id={`nero-vein-filter-${id}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.018 0.05" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          <rect width="400" height="400" fill={`url(#nero-base-${id})`} />
          <path d="M-20,140 Q110,120 210,180 T380,120 T420,220" fill="none" stroke={id.includes('laurent') ? '#d97706' : '#ffffff'} strokeWidth="5" opacity="0.9" filter={`url(#nero-vein-filter-${id})`} />
          <path d="M120,-20 Q140,90 240,240 T320,420" fill="none" stroke={id.includes('laurent') ? '#f59e0b' : '#e2e8f0'} strokeWidth="3" opacity="0.75" filter={`url(#nero-vein-filter-${id})`} />
          <path d="M240,240 Q310,290 420,310" fill="none" stroke="#ffffff" strokeWidth="1.8" opacity="0.65" filter={`url(#nero-vein-filter-${id})`} />
        </svg>
      ) : id.includes('taj') || colorCategory === 'beige' ? (
        <svg viewBox="0 0 400 400" className="w-full h-full object-cover">
          <defs>
            <radialGradient id={`taj-base-${id}`} cx="45%" cy="40%" r="75%">
              <stop offset="0%" stopColor="#f4eee4" />
              <stop offset="60%" stopColor="#ebe1cf" />
              <stop offset="100%" stopColor="#dacdb5" />
            </radialGradient>
            <filter id={`taj-strata-${id}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.008 0.03" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          <rect width="400" height="400" fill={`url(#taj-base-${id})`} />
          <path d="M-30,80 Q100,120 240,90 T430,160" fill="none" stroke="#c4b59d" strokeWidth="14" opacity="0.35" filter={`url(#taj-strata-${id})`} />
          <path d="M-20,190 Q120,220 260,180 T430,260" fill="none" stroke="#bfa98d" strokeWidth="9" opacity="0.4" filter={`url(#taj-strata-${id})`} />
          <path d="M-20,200 Q120,230 260,190 T430,270" fill="none" stroke="#d97706" strokeWidth="2.5" opacity="0.35" filter={`url(#taj-strata-${id})`} />
        </svg>
      ) : id.includes('green') || id.includes('midori') || id.includes('sage') || colorCategory === 'green' ? (
        <svg viewBox="0 0 400 400" className="w-full h-full object-cover">
          <defs>
            <radialGradient id={`verde-base-${id}`} cx="40%" cy="35%" r="75%">
              <stop offset="0%" stopColor="#065f46" />
              <stop offset="60%" stopColor="#064e3b" />
              <stop offset="100%" stopColor="#022c22" />
            </radialGradient>
            <filter id={`verde-vein-filter-${id}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.02 0.05" numOctaves="4" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          <rect width="400" height="400" fill={`url(#verde-base-${id})`} />
          <path d="M-20,110 Q120,80 230,170 T420,240" fill="none" stroke="#a7f3d0" strokeWidth="4" opacity="0.8" filter={`url(#verde-vein-filter-${id})`} />
          <path d="M90,-20 Q160,140 250,260 T340,420" fill="none" stroke="#d1fae5" strokeWidth="3" opacity="0.7" filter={`url(#verde-vein-filter-${id})`} />
          <path d="M-10,290 Q140,320 280,300 T420,380" fill="none" stroke="#34d399" strokeWidth="5" opacity="0.4" filter={`url(#verde-vein-filter-${id})`} />
        </svg>
      ) : id.includes('zellige') ? (
        <svg viewBox="0 0 400 400" className="w-full h-full object-cover">
          <defs>
            <radialGradient id={`zellige-gloss-${id}`} cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#f5f3ef" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#dcd7ce" stopOpacity="0.6" />
            </radialGradient>
          </defs>
          <rect width="400" height="400" fill={id.includes('olive') ? '#4d5d36' : '#ede8de'} />
          <rect x="25" y="25" width="160" height="160" rx="4" fill={id.includes('olive') ? '#596d3f' : '#faf8f5'} stroke={id.includes('olive') ? '#3c492a' : '#d6cfbe'} strokeWidth="3" />
          <rect x="215" y="25" width="160" height="160" rx="4" fill={id.includes('olive') ? '#495833' : '#f7f5f0'} stroke={id.includes('olive') ? '#3c492a' : '#d6cfbe'} strokeWidth="3" />
          <rect x="25" y="215" width="160" height="160" rx="4" fill={id.includes('olive') ? '#52643a' : '#f4f1ea'} stroke={id.includes('olive') ? '#3c492a' : '#d6cfbe'} strokeWidth="3" />
          <rect x="215" y="215" width="160" height="160" rx="4" fill={id.includes('olive') ? '#5a6e40' : '#f8f6f2'} stroke={id.includes('olive') ? '#3c492a' : '#d6cfbe'} strokeWidth="3" />
          <rect width="400" height="400" fill={`url(#zellige-gloss-${id})`} />
        </svg>
      ) : id.includes('fluted') ? (
        <svg viewBox="0 0 400 400" className="w-full h-full object-cover">
          <defs>
            <linearGradient id={`fluted-gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f5f5f4" />
              <stop offset="35%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#e7e5e4" />
              <stop offset="100%" stopColor="#d6d3d1" />
            </linearGradient>
            <pattern id={`fluted-pattern-${id}`} width="36" height="400" patternUnits="userSpaceOnUse">
              <rect width="36" height="400" fill={`url(#fluted-gradient-${id})`} />
              <line x1="0" y1="0" x2="0" y2="400" stroke="#a8a29e" strokeWidth="1" opacity="0.35" />
              <line x1="36" y1="0" x2="36" y2="400" stroke="#78716c" strokeWidth="1.5" opacity="0.45" />
            </pattern>
          </defs>
          <rect width="400" height="400" fill={`url(#fluted-pattern-${id})`} />
        </svg>
      ) : id.includes('concrete') || colorCategory === 'gray' ? (
        <svg viewBox="0 0 400 400" className="w-full h-full object-cover">
          <defs>
            <radialGradient id={`concrete-base-${id}`} cx="40%" cy="35%" r="80%">
              <stop offset="0%" stopColor="#a1a1aa" />
              <stop offset="60%" stopColor="#71717a" />
              <stop offset="100%" stopColor="#52525b" />
            </radialGradient>
            <filter id={`concrete-grain-${id}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="4" result="noise" />
              <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.15 0" />
            </filter>
          </defs>
          <rect width="400" height="400" fill={`url(#concrete-base-${id})`} />
          <rect width="400" height="400" filter={`url(#concrete-grain-${id})`} opacity="0.7" />
        </svg>
      ) : id.includes('amber') || id.includes('onyx') || colorCategory === 'accent' ? (
        <svg viewBox="0 0 400 400" className="w-full h-full object-cover">
          <defs>
            <radialGradient id={`onyx-base-${id}`} cx="45%" cy="35%" r="80%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </radialGradient>
            <filter id={`onyx-vein-filter-${id}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.015 0.04" numOctaves="4" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          <rect width="400" height="400" fill={`url(#onyx-base-${id})`} />
          <path d="M-20,100 Q120,60 240,160 T420,220" fill="none" stroke="#fef3c7" strokeWidth="5" opacity="0.85" filter={`url(#onyx-vein-filter-${id})`} />
          <path d="M100,-20 Q170,120 260,240 T360,420" fill="none" stroke="#fde68a" strokeWidth="3" opacity="0.75" filter={`url(#onyx-vein-filter-${id})`} />
          <path d="M-10,270 Q130,300 270,280 T420,360" fill="none" stroke="#92400e" strokeWidth="7" opacity="0.45" filter={`url(#onyx-vein-filter-${id})`} />
        </svg>
      ) : (
        <svg viewBox="0 0 400 400" className="w-full h-full object-cover">
          <defs>
            <radialGradient id={`arctic-base-${id}`} cx="35%" cy="35%" r="80%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#f8f9fa" />
              <stop offset="100%" stopColor="#e9ecef" />
            </radialGradient>
          </defs>
          <rect width="400" height="400" fill={`url(#arctic-base-${id})`} />
          <circle cx="150" cy="120" r="1.5" fill="#94a3b8" opacity="0.6" />
          <circle cx="280" cy="180" r="1.5" fill="#94a3b8" opacity="0.6" />
          <circle cx="200" cy="270" r="2" fill="#94a3b8" opacity="0.5" />
          <circle cx="100" cy="230" r="1" fill="#94a3b8" opacity="0.7" />
        </svg>
      )}

      {/* 2. Outer Bevel Sheen & Inner Rim Highlight (Simulates Polished/Leathered Bullnose Edge) */}
      <div className="absolute inset-0 rounded-full pointer-events-none shadow-[inset_0_3px_6px_rgba(255,255,255,0.7),inset_0_-6px_12px_rgba(0,0,0,0.35)]" />

      {/* 3. Specular Light Reflection Sweep on Hover */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
}

export const PALMER_SPECIMENS: PalmerSpecimen[] = [
  // --- FEATURED CANVAS SPECIMENS ---
  {
    id: 'calacatta-gold-supreme',
    name: 'Calacatta Gold Supreme',
    subtitle: 'Warm White & Honey Gold Vein',
    category: 'countertops',
    materialType: 'quartz',
    materialLabel: 'Engineered Quartz',
    colorCategory: 'white',
    colorLabel: 'Warm White & Gold',
    colorHex: '#f8f6f0',
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80',
    pricePerSqFt: 68,
    originalPrice: 89,
    stockCount: '12 Slabs In-Stock',
    thickness: '3cm (1 1/4")',
    finish: 'Polished Mirror Luster',
    veining: 'Dramatic Ribbon Veining',
    origin: 'Milan Precision Studio',
    hardness: '7 Mohs (Diamond Hardness)',
    porosity: '0.0% Non-Porous (No Sealing)',
    heatTolerance: '300°F Continuous Safe',
    leadTime: '5-Day Turnkey Delivery & Install',
    description: 'Luminous milky white base crossed by warm honey-gold, amber, and charcoal feathered veins. The benchmark for architectural kitchen islands and seamless waterfall ends.',
    bestFor: 'Waterfall Island & Full-Height Backsplash',
    canvas: {
      top: '12%',
      left: '8%',
      size: 260,
      floatDuration: 6.2,
      floatDelay: 0,
      rotationOffset: 2,
    },
  },
  {
    id: 'nero-marquina-natural',
    name: 'Nero Marquina Natural',
    subtitle: 'Spanish Velvet Black & White Lightning',
    category: 'countertops',
    materialType: 'marble',
    materialLabel: 'Natural European Marble',
    colorCategory: 'black',
    colorLabel: 'Noir Black & Crisp White',
    colorHex: '#18181b',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80',
    pricePerSqFt: 65,
    originalPrice: 85,
    stockCount: '8 Slabs Available',
    thickness: '3cm',
    finish: 'Honed Velvet Touch',
    veining: 'Fractured Monolithic Veins',
    origin: 'Markina, Basque Country, Spain',
    hardness: '4.5 Mohs (Fine Marble)',
    porosity: 'Nano-Shield Pre-Treated',
    heatTolerance: 'Natural Heat Dissipating',
    leadTime: '5-7 Days Turnkey',
    description: 'Quarried in the Basque region of Northern Spain. Deep midnight carbon base highlighted by jagged lightning white calcite veins that create high-drama culinary stages.',
    bestFor: 'Dramatic Wet Bars & Butler Pantries',
    canvas: {
      top: '10%',
      left: '68%',
      size: 280,
      floatDuration: 7.1,
      floatDelay: 0.8,
      rotationOffset: -3,
    },
  },
  {
    id: 'taj-mahal-quartzite',
    name: 'Taj Mahal Quartzite',
    subtitle: 'Natural Brazilian Luminous Stone',
    category: 'countertops',
    materialType: 'natural-quartzite',
    materialLabel: 'Natural Brazilian Quartzite',
    colorCategory: 'beige',
    colorLabel: 'Soft Cream & Golden Amber',
    colorHex: '#ede5d8',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    pricePerSqFt: 88,
    originalPrice: 115,
    stockCount: '15 Slabs Available',
    thickness: '3cm',
    finish: 'Leathered Suede Finish',
    veining: 'Soft Luminous Strata',
    origin: 'Ceará, Northern Brazil',
    hardness: '7.5 Mohs (Harder than Granite)',
    porosity: '0.1% Natural Crystalline',
    heatTolerance: '600°F Direct Pot Heat',
    leadTime: '5 Days Turnkey',
    description: '100% natural earth rock offering the serene warm cream aesthetics of marble with scratch resistance that surpasses granite. Highly coveted by custom home architects.',
    bestFor: 'Gourmet Chef Kitchens & Outdoor Entertaining',
    canvas: {
      top: '62%',
      left: '12%',
      size: 240,
      floatDuration: 5.8,
      floatDelay: 1.2,
      rotationOffset: 4,
    },
  },
  {
    id: 'midori-emerald-quartzite',
    name: 'Verde Alpi & Midori',
    subtitle: 'Deep Forest Jade & Crystalline Breccia',
    category: 'countertops',
    materialType: 'marble',
    materialLabel: 'Italian Alpine Stone',
    colorCategory: 'green',
    colorLabel: 'Alpine Forest Green',
    colorHex: '#14532d',
    image: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&w=1000&q=80',
    pricePerSqFt: 78,
    originalPrice: 98,
    stockCount: '6 Slabs In-Stock',
    thickness: '2cm & 3cm',
    finish: 'Polished High Reflection',
    veining: 'Brecciated Jade Quartz',
    origin: 'Aosta Valley, Italian Alps',
    hardness: '5.5 Mohs',
    porosity: 'Triple Sealed',
    heatTolerance: '450°F Heat Dissipation',
    leadTime: '7 Days Turnkey',
    description: 'A masterpiece from the Italian Western Alps. Serpentine emerald greens fractured with icy quartz ribbons that reflect ambient architectural downlighting.',
    bestFor: 'Powder Room Vanities & Cocktail Islands',
    canvas: {
      top: '58%',
      left: '74%',
      size: 250,
      floatDuration: 6.7,
      floatDelay: 0.4,
      rotationOffset: -2,
    },
  },
  {
    id: 'pure-arctic-white-quartz',
    name: 'Pure Arctic White Quartz',
    subtitle: 'Monolithic Crystalline Minimalist',
    category: 'countertops',
    materialType: 'quartz',
    materialLabel: 'Engineered Quartz',
    colorCategory: 'white',
    colorLabel: 'Pure Monolithic White',
    colorHex: '#ffffff',
    image: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=1000&q=80',
    pricePerSqFt: 58,
    originalPrice: 72,
    stockCount: '22 Slabs In-Stock',
    thickness: '2cm & 3cm',
    finish: 'Polished Mirror Finish',
    veining: 'Monolithic Solid',
    origin: 'Clean Tech Laboratory',
    hardness: '7 Mohs',
    porosity: 'Zero Porosity',
    heatTolerance: '300°F Safe',
    leadTime: '3-5 Days Turnkey',
    description: 'Ultra-clean, crisp solid white with microscopic quartz luminosity. The definitive choice for modern Scandinavian, Japandi, and minimalist cabinetry.',
    bestFor: 'Minimalist Kitchens & Primary Vanities',
    canvas: {
      top: '78%',
      left: '42%',
      size: 190,
      floatDuration: 5.4,
      floatDelay: 1.6,
      rotationOffset: 1,
    },
  },
  {
    id: 'laurent-noir-porcelain',
    name: 'Laurent Sintered Porcelain',
    subtitle: 'Ultra-Compact Dark Copper & Gold',
    category: 'countertops',
    materialType: 'porcelain',
    materialLabel: 'Sintered Porcelain Slab',
    colorCategory: 'black',
    colorLabel: 'Matte Noir & Copper',
    colorHex: '#1c1917',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80',
    pricePerSqFt: 92,
    originalPrice: 118,
    stockCount: '10 Slabs Available',
    thickness: '12mm & 20mm Sintered',
    finish: 'Velvet Satin Matte',
    veining: 'Geometric Copper Vein',
    origin: 'Castellón Ceramic Center, Spain',
    hardness: '8 Mohs (Scratch-Proof)',
    porosity: '0.01% Impervious',
    heatTolerance: '800°F+ Direct Pot Safe',
    leadTime: '5-7 Days Turnkey',
    description: 'Compacted under 25,000 metric tons and fired at 1200°C. Totally impervious to blowtorches, red wine spills, lemon juice, and razor knives. Seamless indoor and outdoor luxury.',
    bestFor: 'Outdoor Kitchens & Indoor Chef Islands',
    canvas: {
      top: '6%',
      left: '40%',
      size: 170,
      floatDuration: 6.9,
      floatDelay: 0.2,
      rotationOffset: -1.5,
    },
  },
  {
    id: 'zellige-artisan-snow',
    name: 'Artisan Zellige Snow',
    subtitle: 'Hand-Glazed Terracotta Wall Tile',
    category: 'tiles',
    materialType: 'zellige',
    materialLabel: 'Artisan Wall Tile',
    colorCategory: 'white',
    colorLabel: 'Glazed Pearlescent White',
    colorHex: '#f4f3ed',
    image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1000&q=80',
    pricePerSqFt: 18,
    originalPrice: 24,
    stockCount: '3,200 Sq.Ft Ready',
    thickness: '3/8" Hand-Molded',
    finish: 'Gloss Glazed Luster',
    veining: 'Organic Textured Cleft',
    origin: 'Fez, Morocco',
    hardness: 'Glazed Ceramic',
    porosity: 'Waterproof Glaze',
    heatTolerance: 'Behind Cooktop Approved',
    leadTime: 'Ships in 48 Hours',
    description: 'Each tile is hand-chiseled from Moroccan clay and wood-fired. Gentle surface undulations catch natural morning daylight, creating a living shimmering kitchen backsplash.',
    bestFor: 'Countertop-to-Ceiling Backsplashes & Shower Enclosures',
    canvas: {
      top: '32%',
      left: '2%',
      size: 150,
      floatDuration: 5.6,
      floatDelay: 1.0,
      rotationOffset: 3,
    },
  },
  {
    id: 'tile-fluted-carrara',
    name: '3D Fluted Carrara Marble',
    subtitle: 'Sculptural Reeded Wall Tile',
    category: 'tiles',
    materialType: 'fluted-tile',
    materialLabel: 'Architectural 3D Tile',
    colorCategory: 'white',
    colorLabel: 'Carrara Marble & Deep Shadow',
    colorHex: '#e5e7eb',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80',
    pricePerSqFt: 32,
    originalPrice: 42,
    stockCount: '1,800 Sq.Ft In-Stock',
    thickness: '1/2" Sculptural Fluting',
    finish: 'Silken Matte Honed',
    veining: 'Fluted Shadow Lines',
    origin: 'Tuscany, Italy',
    hardness: 'Natural Marble',
    porosity: 'Nano-Shield Sealed',
    heatTolerance: 'Fireplace & Wall Safe',
    leadTime: 'Ships in 3-5 Days',
    description: 'Precision CNC-carved fluted grooves create mesmerizing rhythm and shadow play. Tailored to wrap around curved kitchen islands, bar fronts, and fireplace surrounds.',
    bestFor: 'Island Facings, Powder Rooms & Fireplace Surrounds',
    canvas: {
      top: '34%',
      left: '84%',
      size: 160,
      floatDuration: 6.4,
      floatDelay: 0.6,
      rotationOffset: -2.5,
    },
  },
  {
    id: 'concrete-gris-matte',
    name: 'Concrete Gris Velvet Quartz',
    subtitle: 'Industrial Matte Slate Gray',
    category: 'countertops',
    materialType: 'quartz',
    materialLabel: 'Engineered Quartz',
    colorCategory: 'gray',
    colorLabel: 'Warm Industrial Gray',
    colorHex: '#9ca3af',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1000&q=80',
    pricePerSqFt: 64,
    originalPrice: 82,
    stockCount: '11 Slabs Available',
    thickness: '3cm',
    finish: 'Suede Matte Texture',
    veining: 'Subtle Clouded Tones',
    origin: 'Milan Precision Studio',
    hardness: '7 Mohs',
    porosity: 'Zero Porosity',
    heatTolerance: '300°F Safe',
    leadTime: '5 Days Turnkey',
    description: 'The organic tactile warmth of architectural concrete without the porosity, staining, or hairline cracking. Resistant to red wine, lemon juice, and oils.',
    bestFor: 'Urban Lofts & Modern Farmhouse Kitchens',
    canvas: {
      top: '84%',
      left: '18%',
      size: 140,
      floatDuration: 5.9,
      floatDelay: 1.4,
      rotationOffset: 2,
    },
  },

  // --- ADDITIONAL RICH SPECIMENS FOR GRID VIEW & QUARTZ COLOR RANGE ---
  {
    id: 'statuario-elegante-quartz',
    name: 'Statuario Elegante Quartz',
    subtitle: 'Alpine White & Slate Ribbon Veining',
    category: 'countertops',
    materialType: 'quartz',
    materialLabel: 'Engineered Quartz',
    colorCategory: 'white',
    colorLabel: 'Alpine White & Charcoal',
    colorHex: '#ffffff',
    image: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=1000&q=80',
    pricePerSqFt: 72,
    originalPrice: 94,
    stockCount: '14 Slabs Available',
    thickness: '3cm',
    finish: 'Polished High Luster',
    veining: 'Dramatic Ribbon',
    origin: 'Milan Precision Studio',
    hardness: '7 Mohs',
    porosity: 'Zero Porosity',
    heatTolerance: '300°F Safe',
    leadTime: '5 Days Turnkey',
    description: 'Crisp alpine white ground crossed by bold, dramatic charcoal and graphite lightning veins with translucent crystal depth.',
    bestFor: 'Modern Chef Kitchens & Wet Bars',
  },
  {
    id: 'charcoal-soapstone-quartz',
    name: 'Charcoal Soapstone Quartz',
    subtitle: 'Deep Graphite & Whispering White Veins',
    category: 'countertops',
    materialType: 'quartz',
    materialLabel: 'Engineered Quartz',
    colorCategory: 'black',
    colorLabel: 'Charcoal Slate & White',
    colorHex: '#27272a',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80',
    pricePerSqFt: 66,
    originalPrice: 84,
    stockCount: '9 Slabs In-Stock',
    thickness: '3cm',
    finish: 'Honed / Velvet',
    veining: 'Subtle Feathered',
    origin: 'Milan Precision Studio',
    hardness: '7 Mohs',
    porosity: 'Zero Porosity',
    heatTolerance: '300°F Safe',
    leadTime: '5 Days Turnkey',
    description: 'Captures the sultry, moody charisma of natural Brazilian soapstone with zero oiling, darkening, or scratching issues.',
    bestFor: 'Moody Modern Kitchens & Executive Bars',
  },
  {
    id: 'taj-cream-quartz',
    name: 'Taj Cream & Travertine Quartz',
    subtitle: 'Warm Oat Cream & Honey Sediments',
    category: 'countertops',
    materialType: 'quartz',
    materialLabel: 'Engineered Quartz',
    colorCategory: 'beige',
    colorLabel: 'Warm Cream & Sand',
    colorHex: '#e8e2d5',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    pricePerSqFt: 62,
    originalPrice: 78,
    stockCount: '16 Slabs In-Stock',
    thickness: '3cm',
    finish: 'Honed / Velvet',
    veining: 'Subtle Feathered',
    origin: 'Milan Precision Studio',
    hardness: '7 Mohs',
    porosity: 'Zero Porosity',
    heatTolerance: '300°F Safe',
    leadTime: '5 Days Turnkey',
    description: 'Warm, luminous oatmeal undertones layered with soft beige and amber swirls. Pairs seamlessly with natural white oak and walnut cabinetry.',
    bestFor: 'Warm Minimalist & Transitional Homes',
  },
  {
    id: 'sage-mist-quartz',
    name: 'Sage Mist Architectural Quartz',
    subtitle: 'Earthy Eucalyptus & Muted Mineral Dust',
    category: 'countertops',
    materialType: 'quartz',
    materialLabel: 'Engineered Quartz',
    colorCategory: 'green',
    colorLabel: 'Earthy Sage Green',
    colorHex: '#3f5745',
    image: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&w=1000&q=80',
    pricePerSqFt: 69,
    originalPrice: 88,
    stockCount: '8 Slabs Available',
    thickness: '3cm',
    finish: 'Honed / Velvet',
    veining: 'Fine Crystalline',
    origin: 'Milan Precision Studio',
    hardness: '7 Mohs',
    porosity: 'Zero Porosity',
    heatTolerance: '300°F Safe',
    leadTime: '5 Days Turnkey',
    description: 'Soft eucalyptus and muted sage stone ground with micro-mineral flecks. Imbues modern kitchens with grounding organic biophilic serenity.',
    bestFor: 'Organic Modern Kitchens & Coffee Bars',
  },
  {
    id: 'onyx-amber-quartz',
    name: 'Onyx Amber Translucent Quartz',
    subtitle: 'Honey Gold & Backlit Translucent Depth',
    category: 'countertops',
    materialType: 'quartz',
    materialLabel: 'Engineered Quartz',
    colorCategory: 'accent',
    colorLabel: 'Amber Onyx & Honey',
    colorHex: '#d97706',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    pricePerSqFt: 85,
    originalPrice: 110,
    stockCount: '5 Slabs Available',
    thickness: '2cm & 3cm (Backlightable)',
    finish: 'Polished',
    veining: 'Dramatic Ribbon',
    origin: 'Milan Precision Studio',
    hardness: '7 Mohs',
    porosity: 'Zero Porosity',
    heatTolerance: '300°F Safe',
    leadTime: '7 Days Turnkey',
    description: 'Semi-translucent crystalline structure capable of under-counter LED backlighting. A dramatic architectural statement for illuminated island edges.',
    bestFor: 'Backlit Cocktail Islands & Luxury Powder Rooms',
  },
  {
    id: 'bianco-carrara-marble',
    name: 'Bianco Carrara Classic',
    subtitle: 'Historic Italian Feathered Vein Marble',
    category: 'countertops',
    materialType: 'marble',
    materialLabel: 'Natural European Marble',
    colorCategory: 'white',
    colorLabel: 'Carrara White & Soft Gray',
    colorHex: '#f1f1f1',
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80',
    pricePerSqFt: 58,
    originalPrice: 76,
    stockCount: '18 Slabs In-Stock',
    thickness: '3cm',
    finish: 'Honed Satin Touch',
    veining: 'Subtle Feathered',
    origin: 'Apuan Alps, Carrara, Italy',
    hardness: '4.5 Mohs',
    porosity: 'Factory Nano-Shield Sealed',
    heatTolerance: 'Natural Heat Dissipating',
    leadTime: '5 Days Turnkey',
    description: 'The timeless icon of Italian architecture. Soft pearlescent white ground overlaid with delicate smoky feathered veins that age gracefully.',
    bestFor: 'Baking Stations, Islands & Historic Restorations',
  },
  {
    id: 'tile-zellige-olive',
    name: 'Artisan Zellige Olive Glaze',
    subtitle: 'Handmade Glazed Moroccan Terracotta',
    category: 'tiles',
    materialType: 'zellige',
    materialLabel: 'Artisan Wall Tile',
    colorCategory: 'green',
    colorLabel: 'Deep Forest Olive Glaze',
    colorHex: '#4d5d36',
    image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1000&q=80',
    pricePerSqFt: 19,
    originalPrice: 26,
    stockCount: '2,400 Sq.Ft Available',
    thickness: '3/8" Hand-Molded',
    finish: 'Luster Glaze',
    veining: 'Handcrafted Undulating Glaze',
    origin: 'Fez, Morocco',
    hardness: 'Ceramic',
    porosity: 'Glazed Impervious',
    heatTolerance: 'Behind Range Approved',
    leadTime: 'Ships in 48 Hours',
    description: 'Deep olive and moss glaze with rich kiln tonal variations. Each tile possesses subtle variations that create organic warmth across the wall.',
    bestFor: 'Kitchen Backsplashes, Bar Backdrops & Spas',
  },
];

interface PalmerSurfaceCanvasProps {
  initialMaterialFilter?: string | null;
  onOpenBookCall: (opts?: { material?: string; service?: string }) => void;
  onOpenQuoteModal: (opts?: { material?: string }) => void;
  onLaunchVisualizer: (materialName?: string) => void;
  onSelectMaterialCatalog?: (materialId: string) => void;
}

export function PalmerSurfaceCanvas({
  initialMaterialFilter = null,
  onOpenBookCall,
  onOpenQuoteModal,
  onLaunchVisualizer,
  onSelectMaterialCatalog,
}: PalmerSurfaceCanvasProps) {
  // View mode: 'canvas' (floating interactive) or 'grid' (Mobbin 45ebe93c-de2b-4875-a9e4-8fc67d6269e5)
  const [viewMode, setViewMode] = useState<'canvas' | 'grid'>('canvas');

  // Filter state
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [activeMaterialType, setActiveMaterialType] = useState<string>('all');
  const [activeColorFilter, setActiveColorFilter] = useState<string>('all');

  // Specimen focus / inspection modal
  const [inspectedSpecimen, setInspectedSpecimen] = useState<PalmerSpecimen | null>(null);

  // Floating bottom menu drawer
  const [isBottomMenuOpen, setIsBottomMenuOpen] = useState<boolean>(false);

  // Handle external initial material filter change (e.g. from navbar "QUARTZ COLORS")
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'grid') {
        setViewMode('grid');
      }
    }
    if (initialMaterialFilter) {
      const lower = initialMaterialFilter.toLowerCase();
      if (lower.includes('quartzite')) {
        setActiveMaterialType('natural-quartzite');
      } else if (lower.includes('quartz')) {
        setActiveMaterialType('quartz');
      } else if (lower.includes('marble')) {
        setActiveMaterialType('marble');
      } else if (lower.includes('porcelain')) {
        setActiveMaterialType('porcelain');
      } else if (lower.includes('tile') || lower.includes('zellige')) {
        setActiveCategoryFilter('tiles');
      }
      setViewMode('grid');
    }
  }, [initialMaterialFilter]);

  // Filtered specimens for Grid View
  const filteredSpecimens = useMemo(() => {
    return PALMER_SPECIMENS.filter((item) => {
      if (activeCategoryFilter !== 'all') {
        if (activeCategoryFilter === 'countertops' && item.category !== 'countertops') return false;
        if (activeCategoryFilter === 'tiles' && item.category !== 'tiles') return false;
      }
      if (activeMaterialType !== 'all') {
        if (item.materialType !== activeMaterialType) return false;
      }
      if (activeColorFilter !== 'all') {
        if (item.colorCategory !== activeColorFilter) return false;
      }
      return true;
    });
  }, [activeCategoryFilter, activeMaterialType, activeColorFilter]);

  // Floating canvas specimens (only those configured with canvas coordinates)
  const canvasSpecimens = useMemo(() => {
    return PALMER_SPECIMENS.filter((s) => Boolean(s.canvas));
  }, []);

  const handleOpenSpecimen = (specimen: PalmerSpecimen) => {
    setInspectedSpecimen(specimen);
  };

  const handleSwitchToGridWithFilter = (opts: { material?: string; category?: string }) => {
    if (opts.material) setActiveMaterialType(opts.material);
    if (opts.category) setActiveCategoryFilter(opts.category);
    setActiveColorFilter('all');
    setViewMode('grid');
    const el = document.getElementById('palmer-surface-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="palmer-surface-section" 
      className="relative w-full bg-[#f6f5f3] text-neutral-900 overflow-hidden select-none transition-colors duration-500 border-t border-b border-neutral-300/60"
    >
      {/* =========================================================================
          TOP BAR CONTROLS: Segmented View Pill [ ~ Canvas View | ::: Grid View ]
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-6 pt-10 sm:pt-14 pb-4 flex flex-col md:flex-row items-center justify-between gap-6 z-20 relative">
        <div className="flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-neutral-500">
            Awwwards SOTD Experience
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-xs text-neutral-600">
            {PALMER_SPECIMENS.length} Curated Slabs &amp; Architectural Tiles
          </span>
        </div>

        {/* View Switcher Pill - Exact Palmer Dinnerware Segmented Button */}
        <div className="inline-flex items-center p-1 rounded-full border border-neutral-300/80 bg-white/70 backdrop-blur-md shadow-sm">
          <button
            onClick={() => setViewMode('canvas')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-300 cursor-pointer ${
              viewMode === 'canvas'
                ? 'bg-neutral-900 text-white shadow-md'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Canvas</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-300 cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-neutral-900 text-white shadow-md'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>::: Grid View</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          MODE 1: INTERACTIVE FLOATING CANVAS (Mobbin media_1.webp)
          ========================================================================= */}
      {viewMode === 'canvas' && (
        <div className="relative w-full min-h-[840px] lg:min-h-[940px] flex items-center justify-center overflow-hidden px-4 py-16">
          {/* Subtle architectural stone texture guidelines */}
          <div className="absolute inset-0 bg-[radial-gradient(#d5d1c9_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />

          {/* Central Editorial Typography (Palmer Reference) */}
          <div className="relative z-10 max-w-2xl mx-auto text-center px-4 pointer-events-auto">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xs uppercase tracking-[0.3em] font-medium text-neutral-500 mb-4"
            >
              Tactile Senses &bull; Natural Earth &amp; Sintered Form
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-neutral-950 font-serif leading-[1.08] mb-6"
            >
              Discover the <br />
              <span className="font-sans font-medium italic">Surface Collection</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed max-w-lg mx-auto mb-8"
            >
              Bring the quiet luxury of hand-quarried stones and architectural tiles into your space. 
              Drag, explore, and touch our tactile specimens.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <button
                onClick={() => setViewMode('grid')}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-neutral-900 text-white text-xs uppercase tracking-widest font-medium shadow-lg hover:bg-neutral-800 transition duration-300 cursor-pointer"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onOpenBookCall()}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-neutral-300 bg-white/70 backdrop-blur-sm text-neutral-800 text-xs uppercase tracking-widest font-medium hover:border-neutral-900 hover:bg-white transition duration-300 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Consultation</span>
              </button>
            </motion.div>

            {/* Instruction tooltip badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-200/70 text-[11px] text-neutral-600 backdrop-blur-sm"
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Click any stone to inspect specs &bull; Drag freely to rearrange</span>
            </motion.div>
          </div>

          {/* Floating Drag Specimens (Palmer Interactive Canvas) */}
          <div className="absolute inset-0 pointer-events-none">
            {canvasSpecimens.map((specimen, idx) => (
              <motion.div
                key={specimen.id}
                drag
                dragMomentum={true}
                dragElastic={0.25}
                dragConstraints={{ top: -120, left: -120, right: 120, bottom: 120 }}
                whileHover={{ scale: 1.08, zIndex: 40 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOpenSpecimen(specimen)}
                animate={{
                  y: [0, -14, 0],
                  rotate: [
                    specimen.canvas!.rotationOffset,
                    specimen.canvas!.rotationOffset + 2,
                    specimen.canvas!.rotationOffset - 1,
                    specimen.canvas!.rotationOffset
                  ],
                }}
                transition={{
                  y: {
                    repeat: Infinity,
                    duration: specimen.canvas!.floatDuration,
                    delay: specimen.canvas!.floatDelay,
                    ease: 'easeInOut',
                  },
                  rotate: {
                    repeat: Infinity,
                    duration: specimen.canvas!.floatDuration * 1.5,
                    ease: 'easeInOut',
                  },
                }}
                style={{
                  top: specimen.canvas!.top,
                  left: specimen.canvas!.left,
                  width: specimen.canvas!.size,
                  height: specimen.canvas!.size,
                }}
                className="absolute pointer-events-auto cursor-grab active:cursor-grabbing group"
              >
                {/* Circular Stone Specimen Container with Ambient Drop Shadow */}
                <div 
                  className="relative w-full h-full rounded-full overflow-hidden transition-all duration-300"
                  style={{
                    filter: 'drop-shadow(0 26px 30px rgba(0, 0, 0, 0.22)) drop-shadow(0 10px 10px rgba(0, 0, 0, 0.12))',
                  }}
                >
                  <StoneTextureDisc specimen={specimen} className="group-hover:scale-105 transition-transform duration-700 pointer-events-none" />

                  {/* Minimal center indicator icon on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/25 backdrop-blur-[1px]">
                    <span className="px-3 py-1 rounded-full bg-white/95 text-neutral-900 text-[10px] uppercase font-bold tracking-wider shadow-sm">
                      Inspect
                    </span>
                  </div>
                </div>

                {/* Subtitle / Price Tooltip under or next to specimen */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
                  <div className="bg-neutral-900 text-white text-[11px] font-medium px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                    <span>{specimen.name}</span>
                    <span className="text-neutral-400">&bull;</span>
                    <span className="text-emerald-400 font-semibold">${specimen.pricePerSqFt}/sq.ft</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE 2: GRID VIEW (Exact 1:1 match to Mobbin 45ebe93c-de2b-4875-a9e4-8fc67d6269e5)
          ========================================================================= */}
      {viewMode === 'grid' && (
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          {/* Header row: Exactly matches Palmer Dinnerware Media_2.webp */}
          <div className="mb-12 md:mb-16">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-normal tracking-tighter text-neutral-900 font-sans leading-[0.95] mb-6">
              surface collections
            </h1>
            <p className="text-sm md:text-base text-neutral-600 max-w-xl leading-relaxed">
              Our collection is designed to engage all of the senses. Rich natural veining, 
              diamond-hard durability, and beautifully textured finishes transform every kitchen and bath 
              into an architectural masterpiece.
            </p>
          </div>

          {/* Primary Filter Tabs Bar (Countertops, Architectural Tiles, All) */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-neutral-300/70">
            {/* Primary Category Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Surfaces' },
                { id: 'countertops', label: 'Countertop Slabs' },
                { id: 'tiles', label: 'Architectural Tiles' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategoryFilter(cat.id);
                    setActiveMaterialType('all');
                    setActiveColorFilter('all');
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                    activeCategoryFilter === cat.id && activeMaterialType === 'all'
                      ? 'bg-neutral-900 text-white shadow-sm'
                      : 'bg-white/80 border border-neutral-300 text-neutral-700 hover:border-neutral-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}

              <span className="h-4 w-px bg-neutral-300 mx-1 hidden sm:block" />

              {/* Material Specific Filters: Quartz, Marble, Quartzite, Porcelain, Zellige, Fluted */}
              {[
                { id: 'quartz', label: 'Quartz Slabs' },
                { id: 'natural-quartzite', label: 'Natural Quartzite' },
                { id: 'marble', label: 'European Marble' },
                { id: 'porcelain', label: 'Sintered Porcelain' },
                { id: 'zellige', label: 'Moroccan Zellige' },
                { id: 'fluted-tile', label: '3D Fluted Tile' },
              ].map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => {
                    setActiveMaterialType(mat.id);
                    setActiveCategoryFilter('all');
                    setActiveColorFilter('all');
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                    activeMaterialType === mat.id
                      ? 'bg-neutral-900 text-white font-medium shadow-sm'
                      : 'bg-neutral-200/70 text-neutral-700 hover:bg-neutral-300/80'
                  }`}
                >
                  {mat.label}
                </button>
              ))}
            </div>

            {/* Quick Actions in Filter Row */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => onOpenQuoteModal()}
                className="text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:underline cursor-pointer"
              >
                Request Line-Item Quote &rarr;
              </button>
            </div>
          </div>

          {/* IN-PAGE COLOR PALETTE SWITCHER: Displays when a material like Quartz or Marble is active */}
          {activeMaterialType === 'quartz' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 p-5 rounded-2xl bg-white/80 border border-neutral-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block mb-1">
                  Engineered Quartz Palette
                </span>
                <p className="text-xs text-neutral-600">
                  Showing all curated colorways for Quartz on the same page. 100% non-porous, diamond hard, zero sealing required.
                </p>
              </div>

              {/* Color Tones Filter Swatches */}
              <div className="flex items-center gap-2">
                {[
                  { id: 'all', label: 'All', hex: '#18181b' },
                  { id: 'white', label: 'White & Gold', hex: '#f8f6f0' },
                  { id: 'gray', label: 'Slate Gray', hex: '#9ca3af' },
                  { id: 'black', label: 'Charcoal Noir', hex: '#27272a' },
                  { id: 'beige', label: 'Warm Cream', hex: '#e8e2d5' },
                  { id: 'green', label: 'Sage Green', hex: '#3f5745' },
                  { id: 'accent', label: 'Onyx Amber', hex: '#d97706' },
                ].map((swatch) => (
                  <button
                    key={swatch.id}
                    onClick={() => setActiveColorFilter(swatch.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition cursor-pointer border ${
                      activeColorFilter === swatch.id
                        ? 'border-neutral-900 bg-neutral-900 text-white font-medium'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <span>{swatch.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* 3-Column Minimalist Grid of Rounded Specimen Cards (1:1 with Palmer 45ebe93c-de2b-4875-a9e4-8fc67d6269e5) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredSpecimens.map((specimen) => (
              <div
                key={specimen.id}
                onClick={() => handleOpenSpecimen(specimen)}
                className="group relative rounded-3xl border border-[#dedcd7] bg-[#fbfbfa] p-8 sm:p-10 flex flex-col justify-between hover:border-neutral-900 transition-all duration-300 cursor-pointer overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
              >
                {/* Top Row: Material Label on Left ... Price on Right */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="uppercase tracking-widest text-[10px] font-semibold text-neutral-400">
                    {specimen.materialLabel}
                  </span>
                  <span className="text-emerald-700 font-semibold">
                    ${specimen.pricePerSqFt} <span className="text-[10px] font-normal text-neutral-500">/ sq.ft installed</span>
                  </span>
                </div>

                {/* Card Center: Isolated High-Res Specimen with Deep Ambient Drop Shadow & 3D Tilt */}
                <div className="w-full aspect-square flex items-center justify-center p-4 my-2 relative">
                  <Card3DTilt className="w-full h-full flex items-center justify-center" maxTilt={12}>
                    <div 
                      className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 rounded-full overflow-hidden transition-transform duration-500 group-hover:scale-105"
                      style={{
                        filter: 'drop-shadow(0 25px 28px rgba(0, 0, 0, 0.20)) drop-shadow(0 8px 8px rgba(0, 0, 0, 0.10))',
                      }}
                    >
                      <StoneTextureDisc specimen={specimen} className="pointer-events-none" />
                    </div>
                  </Card3DTilt>
                </div>

                {/* Bottom Row: Exact Palmer Caption Row (Name on Left ... Available Count on Right) */}
                <div className="pt-4 border-t border-neutral-200/80 flex items-baseline justify-between text-neutral-900">
                  <span className="font-normal text-base md:text-lg tracking-tight">
                    {specimen.name}
                  </span>
                  <span className="text-xs text-neutral-500 font-normal">
                    {specimen.stockCount}
                  </span>
                </div>

                {/* Hover Quick Actions Bar */}
                <div className="mt-4 pt-3 flex items-center justify-between text-xs border-t border-transparent group-hover:border-neutral-200 transition-colors">
                  <span className="inline-flex items-center gap-1 text-neutral-600 group-hover:text-neutral-950 font-medium">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Slab</span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenQuoteModal({ material: specimen.name });
                    }}
                    className="text-neutral-900 font-semibold hover:underline"
                  >
                    Quick Quote &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredSpecimens.length === 0 && (
            <div className="text-center py-24 bg-white/50 rounded-3xl border border-dashed border-neutral-300">
              <p className="text-neutral-500 text-sm mb-4">No surfaces match the selected filters.</p>
              <button
                onClick={() => {
                  setActiveCategoryFilter('all');
                  setActiveMaterialType('all');
                  setActiveColorFilter('all');
                }}
                className="px-5 py-2 rounded-full bg-neutral-900 text-white text-xs font-medium cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          BOTTOM FLOATING PILL MENU: [ = menu ] (Exact Palmer Dinnerware reference)
          ========================================================================= */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setIsBottomMenuOpen(true)}
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-neutral-950 text-white text-xs uppercase tracking-widest font-medium shadow-2xl hover:bg-neutral-800 transition duration-300 cursor-pointer border border-neutral-700/50 backdrop-blur-md"
        >
          <Menu className="w-3.5 h-3.5" />
          <span>Menu / Filter</span>
        </button>
      </div>

      {/* =========================================================================
          BOTTOM MENU DRAWER / MODAL
          ========================================================================= */}
      <AnimatePresence>
        {isBottomMenuOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-xl bg-[#faf9f7] rounded-t-3xl sm:rounded-3xl border border-neutral-300 shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <div>
                  <h3 className="text-lg font-serif font-medium text-neutral-900">
                    Surface Concierge &amp; Navigation
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Filter materials, switch view, or request line-item pricing
                  </p>
                </div>
                <button
                  onClick={() => setIsBottomMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-neutral-200 text-neutral-600 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* View Switcher inside drawer */}
              <div className="my-6">
                <span className="text-[11px] uppercase font-bold tracking-wider text-neutral-500 block mb-3">
                  Discovery Mode
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setViewMode('canvas');
                      setIsBottomMenuOpen(false);
                    }}
                    className={`p-3.5 rounded-2xl text-left border text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                      viewMode === 'canvas'
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white border-neutral-200 text-neutral-800 hover:border-neutral-400'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">Interactive Canvas</div>
                      <div className="text-[10px] opacity-75">Floating tactile stones</div>
                    </div>
                    <Compass className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setViewMode('grid');
                      setIsBottomMenuOpen(false);
                    }}
                    className={`p-3.5 rounded-2xl text-left border text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                      viewMode === 'grid'
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white border-neutral-200 text-neutral-800 hover:border-neutral-400'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">::: Grid View</div>
                      <div className="text-[10px] opacity-75">Palmer catalog layout</div>
                    </div>
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Fast Category Filter Chips */}
              <div className="mb-6">
                <span className="text-[11px] uppercase font-bold tracking-wider text-neutral-500 block mb-3">
                  Explore by Stone &amp; Tile
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All Collections' },
                    { id: 'quartz', label: 'Quartz Slabs' },
                    { id: 'natural-quartzite', label: 'Natural Quartzite' },
                    { id: 'marble', label: 'Marble' },
                    { id: 'porcelain', label: 'Sintered Porcelain' },
                    { id: 'zellige', label: 'Artisan Zellige' },
                    { id: 'fluted-tile', label: '3D Fluted Tile' },
                  ].map((chip) => (
                    <button
                      key={chip.id}
                      onClick={() => {
                        handleSwitchToGridWithFilter({ material: chip.id });
                        setIsBottomMenuOpen(false);
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 text-neutral-800 text-xs hover:border-neutral-900 transition cursor-pointer"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Actions */}
              <div className="pt-4 border-t border-neutral-200 space-y-2.5">
                <button
                  onClick={() => {
                    setIsBottomMenuOpen(false);
                    onOpenBookCall();
                  }}
                  className="w-full py-3.5 rounded-2xl bg-neutral-900 text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 hover:bg-neutral-800 transition cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book 1-on-1 Design Consultation (Free)</span>
                </button>

                <button
                  onClick={() => {
                    setIsBottomMenuOpen(false);
                    onOpenQuoteModal();
                  }}
                  className="w-full py-3 rounded-2xl bg-white border border-neutral-300 text-neutral-900 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 hover:border-neutral-900 transition cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Request Itemized Email Quote</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          SPECIMEN INSPECTOR DRAWER / LIGHTBOX (When any specimen is clicked)
          ========================================================================= */}
      <AnimatePresence>
        {inspectedSpecimen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl bg-[#faf9f7] rounded-3xl border border-neutral-300 shadow-2xl p-6 sm:p-10 overflow-hidden max-h-[92vh] overflow-y-auto"
            >
              <button
                onClick={() => setInspectedSpecimen(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-200 text-neutral-700 transition cursor-pointer z-30"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Left: Specimen Presentation */}
                <div className="flex flex-col items-center justify-center">
                  <div 
                    className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden my-4"
                    style={{
                      filter: 'drop-shadow(0 30px 40px rgba(0, 0, 0, 0.28))',
                    }}
                  >
                    <StoneTextureDisc specimen={inspectedSpecimen} />
                  </div>
                  <span className="text-xs text-neutral-500 font-mono">
                    Quarry Origin: {inspectedSpecimen.origin}
                  </span>
                </div>

                {/* Right: Technical Specs & Conversion Actions */}
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-neutral-200 text-neutral-700 text-[10px] uppercase font-bold tracking-wider">
                        {inspectedSpecimen.materialLabel}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {inspectedSpecimen.stockCount}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-serif font-normal text-neutral-900 tracking-tight mb-2">
                      {inspectedSpecimen.name}
                    </h2>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest font-mono mb-4">
                      {inspectedSpecimen.subtitle}
                    </p>

                    {/* Pricing Row */}
                    <div className="p-4 rounded-2xl bg-white border border-neutral-200 mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-neutral-900 font-mono">
                          ${inspectedSpecimen.pricePerSqFt}
                        </span>
                        <span className="text-xs text-neutral-500 uppercase">
                          / sq.ft turnkey installed
                        </span>
                        {inspectedSpecimen.originalPrice && (
                          <span className="text-xs text-neutral-400 line-through ml-auto">
                            Regular ${inspectedSpecimen.originalPrice}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
                        <Check className="w-3.5 h-3.5" />
                        Includes laser template, CNC edge fabrication &amp; lifetime seal
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                      {inspectedSpecimen.description}
                    </p>

                    {/* Technical Spec Matrix */}
                    <div className="grid grid-cols-2 gap-3 text-xs mb-6">
                      <div className="p-2.5 rounded-xl bg-neutral-100 border border-neutral-200/80">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">
                          Hardness
                        </span>
                        <span className="font-medium text-neutral-800">{inspectedSpecimen.hardness}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-neutral-100 border border-neutral-200/80">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">
                          Porosity
                        </span>
                        <span className="font-medium text-neutral-800">{inspectedSpecimen.porosity}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-neutral-100 border border-neutral-200/80">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">
                          Finish
                        </span>
                        <span className="font-medium text-neutral-800">{inspectedSpecimen.finish}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-neutral-100 border border-neutral-200/80">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">
                          Lead Time
                        </span>
                        <span className="font-medium text-neutral-800">{inspectedSpecimen.leadTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => {
                        const matName = inspectedSpecimen.name;
                        setInspectedSpecimen(null);
                        onOpenBookCall({ 
                          material: matName, 
                          service: `Virtual Slab Consultation: ${matName}` 
                        });
                      }}
                      className="w-full py-3.5 rounded-xl bg-neutral-900 text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 hover:bg-neutral-800 transition cursor-pointer shadow-lg"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Book Consultation for this Surface</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          const matName = inspectedSpecimen.name;
                          setInspectedSpecimen(null);
                          onOpenQuoteModal({ material: matName });
                        }}
                        className="py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-800 text-xs font-semibold hover:border-neutral-900 transition cursor-pointer"
                      >
                        Request Quote
                      </button>

                      <button
                        onClick={() => {
                          const matName = inspectedSpecimen.name;
                          setInspectedSpecimen(null);
                          onLaunchVisualizer(matName);
                        }}
                        className="py-2.5 rounded-xl bg-neutral-200 text-neutral-800 text-xs font-semibold hover:bg-neutral-300 transition cursor-pointer"
                      >
                        3D Visualizer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
