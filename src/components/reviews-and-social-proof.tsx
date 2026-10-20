'use client';

import React from 'react';
import Image from 'next/image';
import { Star, ShieldCheck, CheckCircle2, MessageSquareQuote } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  role: string;
  location: string;
  avatar: string;
  stone: string;
  quote: string;
  date: string;
}

const REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Victoria Sterling',
    role: 'Interior Designer & Homeowner',
    location: 'Austin, TX',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    stone: 'Calacatta Gold Supreme Quartz',
    quote: 'As an interior architect, I am usually terrified of countertop seam lines. Verona’s waterjet laser matching matched the veining across our 12-foot island seamlessly. My clients are mesmerized.',
    date: 'March 2026',
  },
  {
    id: '2',
    author: 'Julian Rodriguez',
    role: 'Custom Home Builder',
    location: 'Denver, CO',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    stone: 'Taj Mahal Exotic Quartzite',
    quote: 'We used to wait 5-6 weeks for fabricators. Verona’s 5-day template-to-install turnaround allowed us to close our luxury spec home 3 weeks ahead of schedule. The mitered edges are flawless.',
    date: 'February 2026',
  },
  {
    id: '3',
    author: 'Claire & Thomas Whitmore',
    role: 'Homeowners',
    location: 'Dallas, TX',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    stone: 'Bianco Carrara Marble & Zellige Tile',
    quote: 'Booking our call was so easy. Our stone specialist reviewed our cabinet dimensions and showed us 3 live slab options on video. We saved over $2,400 compared to the big box retailer quote!',
    date: 'January 2026',
  },
];

export function ReviewsAndSocialProof() {
  return (
    <section id="reviews" className="py-24 relative bg-[#090d13]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Metric Bar Header */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 text-center">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#fce6bb]">50,000+</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Slabs Fabricated</div>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-white flex items-center justify-center gap-1">
              <span>4.9</span>
              <Star className="w-5 h-5 text-amber-400 fill-amber-400 inline" />
            </div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Trustpilot / Google</div>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-emerald-400">5 Days</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Laser to Install</div>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#fce6bb]">15 Years</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Stain & Seal Warranty</div>
          </div>
        </div>

        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Loved by Homeowners, Trusted by Architects
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Read unedited reviews from homeowners who transformed their living spaces with Verona Stone & Tile.
          </p>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="glass-panel p-7 rounded-2xl border border-slate-800 hover:border-[#c59f60]/40 transition flex flex-col justify-between space-y-6"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                  <span className="text-[11px] text-slate-400 font-medium ml-2">{review.date}</span>
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>

              {/* Author & Stone Info */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#c59f60]/40 shrink-0">
                  <Image
                    src={review.avatar}
                    alt={review.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <span>{review.author}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-[10px] text-slate-400">{review.role} • {review.location}</div>
                  <div className="text-[10px] text-[#fce6bb] font-medium mt-0.5">{review.stone}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
