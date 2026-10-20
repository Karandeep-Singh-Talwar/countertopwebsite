'use client';

import React from 'react';
import Image from 'next/image';
import { Card3DTilt } from '@/components/card-3d-tilt';

interface MaterialCard {
  id: string;
  name: string;
  image: string;
  pricePerSqFt: number;
  highlightText?: string;
  shortDesc: string;
}

const MATERIALS_ROW_1: MaterialCard[] = [
  {
    id: 'quartz',
    name: 'QUARTZ',
    image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=900&q=80',
    pricePerSqFt: 68,
    shortDesc: 'Engineered durability with zero porosity. Stain-free without routine sealing.',
  },
  {
    id: 'mineral',
    name: 'MINERAL',
    image: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=900&q=80',
    pricePerSqFt: 74,
    shortDesc: 'Hybrid mineral composition engineered for low silica and ultra-tactile matte finishes.',
  },
  {
    id: 'porcelain',
    name: 'PORCELAIN',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80',
    pricePerSqFt: 92,
    shortDesc: 'Sintered ultra-compact slabs. Completely impervious to UV, red wine, and direct heat.',
  },
];

const MATERIALS_ROW_2: MaterialCard[] = [
  {
    id: 'natural-quartzite',
    name: 'NATURAL QUARTZITE',
    image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=900&q=80',
    pricePerSqFt: 88,
    shortDesc: '100% natural Brazilian rock with marble veining and diamond hardness.',
  },
  {
    id: 'granite',
    name: 'GRANITE',
    image: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=900&q=80',
    pricePerSqFt: 52,
    shortDesc: 'Classic natural igneous stone with crystalline depth and exceptional family durability.',
  },
  {
    id: 'marble',
    name: 'MARBLE',
    image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=900&q=80',
    pricePerSqFt: 58,
    highlightText:
      'Marble adds a touch of luxury and sophistication to any kitchen. Ideal for residential spaces where elegance is a priority, marble creates a stunning focal point that enhances the overall aesthetic of your home.',
    shortDesc: 'The timeless stone of European architecture with soft, feathered veining.',
  },
];

const MATERIALS_ROW_3: MaterialCard[] = [
  {
    id: 'soapstone',
    name: 'SOAPSTONE',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
    pricePerSqFt: 78,
    shortDesc: 'Velvety talc-rich natural stone chemically impervious to acids, citrus, and stains.',
  },
  {
    id: 'view-all',
    name: 'VIEW ALL',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=900&q=80',
    pricePerSqFt: 45,
    shortDesc: 'Browse our full catalog of over 200 hand-quarried slabs and bespoke tiles.',
  },
];

const TILES_ROW_1: MaterialCard[] = [
  {
    id: 'zellige',
    name: 'ARTISAN ZELLIGE',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80',
    pricePerSqFt: 18,
    shortDesc: 'Hand-molded Moroccan glazed terracotta with organic undulating light reflection.',
  },
  {
    id: 'backsplash',
    name: 'KITCHEN BACKSPLASH',
    image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=900&q=80',
    pricePerSqFt: 14,
    shortDesc: 'Classic subway, picket, and herringbone ceramic tiles engineered for grease and moisture resistance.',
  },
  {
    id: 'porcelain-tile',
    name: 'LARGE FORMAT PORCELAIN',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80',
    pricePerSqFt: 16,
    shortDesc: 'Monolithic 24x48 and 48x48 rectified porcelain tiles for continuous, nearly grout-free walls.',
  },
];

const TILES_ROW_2: MaterialCard[] = [
  {
    id: 'fluted-tile',
    name: '3D FLUTED & REEDED',
    image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=900&q=80',
    pricePerSqFt: 24,
    highlightText:
      'Architectural 3D fluted natural stone and ceramics add dramatic tactile rhythm, shadow lines, and luxury depth behind countertops, vanity mirrors, and statement walls.',
    shortDesc: 'Precision grooved marble and ceramic tiles adding sculptural rhythm to walls.',
  },
  {
    id: 'chevron-mosaic',
    name: 'VOLCANIC CHEVRON',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
    pricePerSqFt: 22,
    shortDesc: 'Interlocking matte volcanic basalt and marble arranged in sharp Parisian chevron mosaics.',
  },
  {
    id: 'terrazzo-tile',
    name: 'VENETIAN TERRAZZO',
    image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=900&q=80',
    pricePerSqFt: 19,
    shortDesc: 'Authentic Italian micro-aggregate embedded with natural Carrara marble chips.',
  },
];

const TILES_ROW_3: MaterialCard[] = [
  {
    id: 'natural-stone-tile',
    name: 'NATURAL STONE TILES',
    image: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=900&q=80',
    pricePerSqFt: 21,
    shortDesc: 'Honed travertine, tumbled limestone, and cleft slate tiles for organic architectural grounding.',
  },
  {
    id: 'view-all-tiles',
    name: 'VIEW ALL TILES',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=900&q=80',
    pricePerSqFt: 12,
    shortDesc: 'Browse our full catalog of over 300 artisanal, mosaic, and architectural tile collections.',
  },
];

interface BrowseByMaterialProps {
  activeCategory?: 'countertops' | 'tiles';
  onCategoryChange?: (category: 'countertops' | 'tiles') => void;
  onOpenMaterialCatalog: (materialId: string) => void;
  onSelectMaterial: (materialName: string) => void;
  onOpenBookCall: (materialName?: string) => void;
}

export function BrowseByMaterial({
  activeCategory = 'countertops',
  onCategoryChange,
  onOpenMaterialCatalog,
  onSelectMaterial,
  onOpenBookCall,
}: BrowseByMaterialProps) {
  const [internalCategory, setInternalCategory] = React.useState<'countertops' | 'tiles'>(activeCategory);

  React.useEffect(() => {
    if (activeCategory) {
      setInternalCategory(activeCategory);
    }
  }, [activeCategory]);

  const currentCategory = activeCategory || internalCategory;

  const handleTabChange = (cat: 'countertops' | 'tiles') => {
    setInternalCategory(cat);
    onCategoryChange?.(cat);
  };

  const isTile = currentCategory === 'tiles';
  const row1 = isTile ? TILES_ROW_1 : MATERIALS_ROW_1;
  const row2 = isTile ? TILES_ROW_2 : MATERIALS_ROW_2;
  const row3 = isTile ? TILES_ROW_3 : MATERIALS_ROW_3;

  const renderCard = (item: MaterialCard) => (
    <Card3DTilt
      key={item.id}
      maxTilt={5}
      scale={1.02}
      className="relative aspect-[3/4] overflow-hidden bg-gray-100 shadow-sm cursor-pointer group transition-all duration-300 hover:shadow-2xl"
      onClick={() => onOpenMaterialCatalog(item.id)}
    >
      <div className="w-full h-full relative" style={{ position: 'relative' }}>
        {/* Background Image */}
        <Image
          src={item.image}
          alt={item.name}
          fill
          loading="eager"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.88]"
        />

        {/* Subtle Vignette Overlay */}
        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/45 transition-colors duration-300" />

        {/* Centered Title (Exact Daltile match) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
          <h3 className="text-xl sm:text-2xl font-sans font-medium tracking-[0.22em] text-white uppercase drop-shadow-md">
            {item.name}
          </h3>

          {/* Special Highlight Quote Box (Matching MARBLE / 3D FLUTED card in Daltile reference) */}
          {item.highlightText && (
            <div className="mt-4 p-3.5 bg-black/55 backdrop-blur-sm border border-white/20 text-[11px] text-gray-100 leading-relaxed font-light max-w-xs text-center shadow-lg">
              {item.highlightText}
            </div>
          )}

          {/* Hover Action Pill */}
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenMaterialCatalog(item.id);
              }}
              className="px-4 py-2 bg-white text-black hover:bg-black hover:text-white text-xs font-bold uppercase tracking-wider transition shadow-lg cursor-pointer"
            >
              Explore Colors
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenBookCall(item.name);
              }}
              className="px-3.5 py-2 bg-black/80 text-white hover:bg-black text-xs font-medium uppercase tracking-wider border border-white/30 transition cursor-pointer"
            >
              Book Call
            </button>
          </div>
        </div>
      </div>
    </Card3DTilt>
  );

  return (
    <section id="materials" className="py-20 bg-white">
      <div id="countertops" className="sr-only" />
      <div id="tiles" className="sr-only" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Heading with Underline (Exact Daltile match) */}
        <div className="text-center mb-10">
          <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400 mb-2">
            NATURAL STONE &amp; ARCHITECTURAL SURFACES
          </div>
          <h2 className="text-2xl sm:text-3xl font-sans font-light tracking-[0.25em] text-black uppercase">
            BROWSE BY MATERIAL
          </h2>
          <div className="w-12 h-[2px] bg-black mx-auto mt-3 mb-6" />

          {/* Clean, luxury tabs between Countertops and Architectural Tiles */}
          <div className="inline-flex items-center gap-6 border-b border-gray-200 pb-1">
            <button
              onClick={() => handleTabChange('countertops')}
              className={`pb-2 text-xs font-bold tracking-[0.18em] uppercase transition relative cursor-pointer ${
                !isTile ? 'text-black' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <span>Countertops &amp; Slabs</span>
              {!isTile && (
                <div className="absolute -bottom-[5px] inset-x-0 h-[2px] bg-black" />
              )}
            </button>
            <button
              onClick={() => handleTabChange('tiles')}
              className={`pb-2 text-xs font-bold tracking-[0.18em] uppercase transition relative cursor-pointer ${
                isTile ? 'text-black' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <span>Architectural Tiles</span>
              {isTile && (
                <div className="absolute -bottom-[5px] inset-x-0 h-[2px] bg-black" />
              )}
            </button>
          </div>
        </div>

        {/* Rows 1 & 2: 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {row1.map(renderCard)}
          {row2.map(renderCard)}
        </div>

        {/* Row 3: Exactly 2 Centered Cards (Matching Daltile Reference) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto mt-6 sm:mt-8">
          {row3.map(renderCard)}
        </div>
      </div>
    </section>
  );
}
