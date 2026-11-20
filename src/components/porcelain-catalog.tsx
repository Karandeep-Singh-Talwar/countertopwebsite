'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  Calendar, 
  X,
  Sparkles
} from 'lucide-react';
import { PORCELAIN_CATALOG, PorcelainMaterial } from '@/data/porcelain-catalog-data';

export interface PorcelainCatalogProps {
  onOpenQuoteModal: (opts?: { material?: string }) => void;
  onOpenBookCall: (opts?: { service?: string; material?: string }) => void;
  initialCategory?: string;
  initialCatalog?: PorcelainMaterial[];
}

export function PorcelainCatalog({
  onOpenQuoteModal,
  onOpenBookCall,
  initialCategory = 'all',
  initialCatalog,
}: PorcelainCatalogProps) {
  const [catalog, setCatalog] = useState<PorcelainMaterial[]>(initialCatalog || PORCELAIN_CATALOG);
  const [selectedPalette, setSelectedPalette] = useState<'all' | 'white' | 'green' | 'black' | 'earth' | 'blue'>('all');
  const [activeMaterial, setActiveMaterial] = useState<PorcelainMaterial | null>(null);
  const [activeFaceId, setActiveFaceId] = useState<string>('room');

  useEffect(() => {
    let isMounted = true;
    fetch('/api/catalog')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data?.items && Array.isArray(data.items) && data.items.length > 0) {
          setCatalog(data.items);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenMaterial = (mat: PorcelainMaterial) => {
    setActiveMaterial(mat);
    setActiveFaceId('room');
  };

  const galleryImages = useMemo(() => {
    if (!activeMaterial) return [];
    const list: { id: string; label: string; src: string; type: 'room' | 'slab' | 'face'; faceNum?: number }[] = [];

    if (activeMaterial.roomImage) {
      list.push({ id: 'room', label: 'Room Application', src: activeMaterial.roomImage, type: 'room' });
    }
    if (activeMaterial.slabImage) {
      list.push({ id: 'slab', label: 'Full Slab', src: activeMaterial.slabImage, type: 'slab' });
    }

    if (Array.isArray(activeMaterial.faces) && activeMaterial.faces.length > 0) {
      activeMaterial.faces.forEach((src, i) => {
        list.push({
          id: `face-${i + 1}`,
          label: `Face ${i + 1}`,
          src,
          type: 'face',
          faceNum: i + 1,
        });
      });
    } else {
      // Fallback faces from slab image
      for (let i = 1; i <= Math.min(4, activeMaterial.randomFaces || 1); i++) {
        list.push({
          id: `face-${i}`,
          label: `Face ${i}`,
          src: activeMaterial.slabImage,
          type: 'face',
          faceNum: i,
        });
      }
    }

    return list;
  }, [activeMaterial]);

  const currentModalImage = galleryImages.find((g) => g.id === activeFaceId) || galleryImages[0];

  const countertopMaterials = useMemo(() => {
    const slabs = catalog.filter((mat) => mat.category === 'porcelain-countertop');
    return slabs.length > 0 ? slabs : catalog;
  }, [catalog]);

  const filteredMaterials = countertopMaterials.filter((mat) => {
    if (selectedPalette !== 'all' && mat.palette !== selectedPalette) return false;
    return true;
  });

  return (
    <section id="porcelain-catalog-section" className="scroll-mt-20 w-full bg-[#FAF8F5] py-24 md:py-32 text-[#1A1A1A]">
      <div className="max-w-[1680px] mx-auto px-6 md:px-12">
        {/* Section Header: Open & Borderless */}
        <div className="mb-16 pb-8 border-b border-[#1A1A1A]/10">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.25em] text-[#6C6863] mb-3 font-mono">
              Architectural Vitrified Collection
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal tracking-tight text-[#1A1A1A] leading-[1.05]">
              High Gloss Vitrified <span className="italic font-light text-amber-800">Porcelain Slabs</span>
            </h2>
            <p className="mt-4 text-[#6C6863] text-base sm:text-lg font-normal leading-relaxed">
              600×1200mm (24×48 in) monolithic 9mm porcelain slabs. Engineered for kitchen countertops, island waterfalls, backsplashes, and unbroken floor continuity.
            </p>
          </div>
        </div>

        {/* Minimalist Filter Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-16 pb-4 border-b border-[#1A1A1A]/10">
          <div className="flex flex-wrap items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium">
            {[
              { id: 'all', label: 'All Slabs' },
              { id: 'white', label: 'White Calacatta' },
              { id: 'green', label: 'Emerald & Jade' },
              { id: 'black', label: 'Obsidian & Gold' },
              { id: 'earth', label: 'Amber & Grigio' },
              { id: 'blue', label: 'Labradorite Blue' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedPalette(tab.id as any)}
                className={`py-1 relative transition-colors cursor-pointer ${
                  selectedPalette === tab.id
                    ? 'text-[#1A1A1A] font-medium'
                    : 'text-[#8C827A] hover:text-[#1A1A1A]'
                }`}
              >
                <span>{tab.label}</span>
                {selectedPalette === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-[#1A1A1A]" />
                )}
              </button>
            ))}
          </div>

          <div className="text-xs text-[#8C827A] font-mono tracking-wider">
            Showing <span className="font-semibold text-[#1A1A1A]">{filteredMaterials.length}</span> curated vitrified designs
          </div>
        </div>

        {/* Materials Grid: BORDERLESS ART GALLERY (ZERO BOXES) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {filteredMaterials.map((mat) => {
            const displayImg = mat.roomImage;

            return (
              <motion.div
                key={mat.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleOpenMaterial(mat)}
                className="group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Clean Visual Area */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#ECE8E1]">
                    <Image
                      src={displayImg}
                      alt={mat.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                  </div>

                  {/* Editorial Spec Caption: Clean, borderless, typography-driven */}
                  <div className="pt-6">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#6C6863] mb-1.5 font-mono">
                      <span>9mm Vitrified Porcelain</span>
                      <span>{mat.randomFaces} Faces</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-serif font-normal tracking-tight text-[#1A1A1A] mb-2 group-hover:text-amber-800 transition-colors">
                      {mat.name}
                    </h3>

                    <p className="text-sm leading-relaxed text-[#6C6863] font-normal line-clamp-2 mb-3">
                      {mat.description}
                    </p>

                    <p className="text-xs text-amber-800 font-light italic">
                      {mat.uspHighlight}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-medium text-[#1A1A1A]">
                  <span>View Material Specs</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Editorial Callout: Open Layout with Hairlines */}
        <div className="mt-28 pt-16 pb-12 border-t border-b border-[#1A1A1A]/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h4 className="text-3xl sm:text-4xl font-serif font-light tracking-tight text-[#1A1A1A]">
              Need Full Architectural Crates or CAD Layouts?
            </h4>
            <p className="mt-3 text-[15px] text-[#59534E] font-light leading-relaxed">
              We deliver full crates and custom cuts directly to homes and jobsites nationwide. Speak with our surface specialists or order samples for your project.
            </p>
          </div>

          <div className="flex items-center gap-8">
            <button
              onClick={() => onOpenBookCall({ service: 'Sample Swatch Request', material: 'Full High Gloss Vitrified Porcelain Collection' })}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#1A1A1A] py-1 border-b border-[#1A1A1A] hover:text-amber-800 hover:border-amber-800 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Request Swatches</span>
            </button>
            <button
              onClick={() => onOpenBookCall({ service: 'Contractor Porcelain Installation Consultation' })}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#59534E] hover:text-[#1A1A1A] py-1 border-b border-[#1A1A1A]/20 hover:border-[#1A1A1A] transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Contractor Call</span>
            </button>
          </div>
        </div>

        {/* Detailed Material Quick Spec Modal */}
        <AnimatePresence>
          {activeMaterial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6"
              onClick={() => setActiveMaterial(null)}
            >
              <motion.div
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.98, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-5xl w-full bg-[#FAF8F5] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh] relative"
              >
                <button
                  onClick={() => setActiveMaterial(null)}
                  className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/80 hover:bg-white text-[#1A1A1A] transition-colors cursor-pointer shadow-sm"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Left Visual Area: Interactive Multi-Face Showcase */}
                <div className="md:w-1/2 relative bg-[#0D0D0D] flex flex-col justify-between min-h-[380px]">
                  <div className="relative flex-1 min-h-[320px] w-full overflow-hidden">
                    {currentModalImage && (
                      <Image
                        key={currentModalImage.id}
                        src={currentModalImage.src}
                        alt={`${activeMaterial.name} - ${currentModalImage.label}`}
                        fill
                        className="object-cover object-center transition-all duration-300"
                        priority
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30 pointer-events-none" />

                    {/* Top Indicator Badge */}
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 bg-black/75 backdrop-blur-md text-amber-400 font-mono border border-white/10">
                        {currentModalImage?.type === 'face'
                          ? `Face ${currentModalImage.faceNum} of ${activeMaterial.randomFaces || galleryImages.filter((g) => g.type === 'face').length} · Continuous Vein`
                          : currentModalImage?.label}
                      </span>
                    </div>

                    {/* Bottom Caption */}
                    <div className="absolute bottom-4 left-6 right-6 text-white pointer-events-none">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400 block mb-1 font-mono">
                        {activeMaterial.collection} Collection
                      </span>
                      <h4 className="text-2xl sm:text-3xl font-serif font-light tracking-tight">
                        {activeMaterial.name}
                      </h4>
                      <p className="text-xs text-white/70 mt-0.5 font-light">
                        High Gloss Vitrified Porcelain Slab &amp; Matching Tile
                      </p>
                    </div>
                  </div>

                  {/* Multi-Face Thumbnail & Navigation Strip */}
                  {galleryImages.length > 1 && (
                    <div className="bg-[#141414] border-t border-white/10 p-3 flex items-center gap-2 overflow-x-auto scrollbar-thin">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-stone-400 font-mono pl-1 pr-1 shrink-0">
                        Views ({galleryImages.length}):
                      </span>
                      {galleryImages.map((img) => (
                        <button
                          key={img.id}
                          type="button"
                          onClick={() => setActiveFaceId(img.id)}
                          className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono tracking-wider transition-all cursor-pointer border ${
                            activeFaceId === img.id
                              ? 'bg-amber-800 text-white border-amber-600 font-semibold shadow-sm'
                              : 'bg-white/5 text-stone-300 border-white/10 hover:bg-white/15 hover:text-white'
                          }`}
                        >
                          {img.type === 'face' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
                          <span>{img.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Spec Details: Clean, whitespace, hairlines */}
                <div className="md:w-1/2 p-6 sm:p-8 md:p-10 overflow-y-auto space-y-6 text-[#1A1A1A]">
                  <div>
                    <h5 className="text-[11px] uppercase tracking-[0.2em] text-[#8C827A] mb-2 font-mono">
                      Material Specification
                    </h5>
                    <p className="text-[14px] leading-relaxed text-[#59534E] font-light">
                      {activeMaterial.description}
                    </p>
                  </div>

                  {/* Random Faces Grid Preview */}
                  {galleryImages.some((g) => g.type === 'face') && (
                    <div className="pt-4 border-t border-[#1A1A1A]/10">
                      <div className="flex items-center justify-between text-xs font-mono mb-2.5">
                        <span className="text-[#8C827A] uppercase tracking-wider">
                          Non-Repeating Faces ({activeMaterial.randomFaces} continuous):
                        </span>
                        <span className="text-amber-800 font-medium text-[11px]">Click face to inspect</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {galleryImages
                          .filter((g) => g.type === 'face')
                          .map((face) => (
                            <button
                              key={face.id}
                              type="button"
                              onClick={() => setActiveFaceId(face.id)}
                              className={`group relative aspect-[3/4] overflow-hidden border transition cursor-pointer ${
                                activeFaceId === face.id
                                  ? 'border-amber-800 ring-2 ring-amber-800/40'
                                  : 'border-[#1A1A1A]/15 hover:border-[#1A1A1A]/50'
                              }`}
                            >
                              <Image
                                src={face.src}
                                alt={face.label}
                                fill
                                className="object-cover object-center group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent" />
                              <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[9px] text-white font-mono py-0.5 text-center">
                                {face.label}
                              </span>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2.5 pt-4 border-t border-[#1A1A1A]/10 text-xs font-mono">
                    <div className="flex justify-between py-1 border-b border-[#1A1A1A]/5">
                      <span className="text-[#8C827A]">Format:</span>
                      <span className="text-[#1A1A1A] font-medium">{activeMaterial.dimensions.join(' · ')}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#1A1A1A]/5">
                      <span className="text-[#8C827A]">Thickness:</span>
                      <span className="text-[#1A1A1A] font-medium">{activeMaterial.thickness}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#1A1A1A]/5">
                      <span className="text-[#8C827A]">Finish:</span>
                      <span className="text-[#1A1A1A] font-medium">{activeMaterial.finish}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#1A1A1A]/5">
                      <span className="text-[#8C827A]">Random Faces:</span>
                      <span className="text-[#1A1A1A] font-medium">{activeMaterial.randomFaces} continuous</span>
                    </div>
                    {activeMaterial.sqFtPerBox && (
                      <div className="flex justify-between py-1 border-b border-[#1A1A1A]/5">
                        <span className="text-[#8C827A]">Packaging / Box:</span>
                        <span className="text-[#1A1A1A] font-medium">
                          {activeMaterial.sqFtPerBox} sq.ft {activeMaterial.weightKgPerBox ? `(${activeMaterial.weightKgPerBox} kg)` : ''}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 border-b border-[#1A1A1A]/5">
                      <span className="text-[#8C827A]">Porosity:</span>
                      <span className="text-emerald-700 font-medium">&lt; 0.04% (Impervious)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8C827A]">Pricing:</span>
                      <span className="text-[#1A1A1A] font-medium">Trade Inquiries Only</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#1A1A1A]/10 space-y-3">
                    <Link
                      href={`/visualizer?material=${encodeURIComponent(activeMaterial.id)}`}
                      className="w-full py-3 bg-[#C5A880]/15 border border-[#C5A880]/60 text-[#1A1A1A] hover:bg-[#C5A880]/25 text-xs uppercase tracking-[0.2em] font-medium transition-all cursor-pointer flex items-center justify-center gap-2 text-center"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#A67C52]" />
                      Visualize in Your Room (AI)
                    </Link>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => {
                          setActiveMaterial(null);
                          onOpenBookCall({ material: activeMaterial.name, service: 'Sample Swatch Request' });
                        }}
                        className="flex-1 py-3 bg-[#1A1A1A] hover:bg-amber-800 text-white text-xs uppercase tracking-[0.2em] font-medium transition cursor-pointer"
                      >
                        Request Sample
                      </button>
                      <button
                        onClick={() => {
                          setActiveMaterial(null);
                          onOpenBookCall({ material: activeMaterial.name, service: 'Material Consultation' });
                        }}
                        className="flex-1 py-3 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-xs uppercase tracking-[0.2em] font-medium transition cursor-pointer"
                      >
                        Book Call
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
