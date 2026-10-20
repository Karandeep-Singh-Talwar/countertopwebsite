'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function InCommonNewsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail('');
    }
  };

  return (
    <section id="newsletter-section" className="w-full bg-[#FAF8F5] py-20 md:py-28 border-b border-[#E8E4DC] text-[#1A1A1A]">
      <div className="max-w-[1680px] mx-auto px-6 md:px-12">
        {/* Split Grid matching In Common With */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column Label */}
          <div className="md:col-span-3 lg:col-span-2">
            <h2 className="text-[12px] uppercase tracking-[0.18em] font-normal text-[#1A1A1A]/70">
              Newsletter
            </h2>
          </div>

          {/* Right Main Form Area */}
          <div className="md:col-span-9 lg:col-span-10">
            <h3 className="text-2xl sm:text-3xl md:text-[34px] font-sans font-normal leading-[1.3] text-[#1A1A1A] tracking-[-0.015em] max-w-2xl mb-8">
              Subscribe to our newsletter to stay in the know and up to date on the latest news and happenings.
            </h3>

            {/* Email Form with hairline border matching In Common With */}
            <form onSubmit={handleSubmit} className="max-w-xl">
              <div className="flex border border-[#1A1A1A] bg-white">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email Address"
                  required
                  className="flex-1 px-4 py-3.5 text-[13px] text-[#1A1A1A] placeholder-[#767168] bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-[#FAF8F5] hover:bg-[#F0EDE6] border-l border-[#1A1A1A] text-[#1A1A1A] text-[11px] uppercase tracking-[0.16em] font-medium transition-colors cursor-pointer shrink-0"
                >
                  Sign Up
                </button>
              </div>

              {subscribed ? (
                <p className="mt-3 text-[12px] text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Thank you for subscribing. You will receive our latest slab arrivals.
                </p>
              ) : (
                <p className="mt-3 text-[11px] text-[#767168]">
                  By signing up you are agreeing to our{' '}
                  <span className="underline cursor-pointer">Privacy Policy</span>.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
