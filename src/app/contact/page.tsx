'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Calendar,
  Calculator,
  ShieldCheck,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { InCommonNav } from '@/components/in-common-nav';
import { InCommonFooter } from '@/components/in-common-footer';
import { BookCallModal } from '@/components/book-call-modal';

export default function ContactPage() {
  // Modal states
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);
  const [modalInitialMaterial, setModalInitialMaterial] = useState('Calcatta Extra Porcelain');
  const [modalInitialSqFt, setModalInitialSqFt] = useState(55);
  const [modalInitialService, setModalInitialService] = useState('Architectural Project Consultation');

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('General Contractor');
  const [application, setApplication] = useState('Countertops');
  const [material, setMaterial] = useState('Vitrified Porcelain (9mm)');
  const [estimatedSqFt, setEstimatedSqFt] = useState('55');
  const [zipCode, setZipCode] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ quoteId: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenBookCall = (opts?: { material?: string; sqFt?: number; service?: string }) => {
    if (opts?.material) setModalInitialMaterial(opts.material);
    if (opts?.sqFt) setModalInitialSqFt(opts.sqFt);
    if (opts?.service) setModalInitialService(opts.service);
    setIsBookCallOpen(true);
  };

  const handleOpenQuoteModal = (opts?: { material?: string; sqFt?: number }) => {
    handleOpenBookCall({
      material: opts?.material,
      sqFt: opts?.sqFt,
      service: 'Sample Swatch Request',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email,
          phone,
          sqFt: Number(estimatedSqFt) || 55,
          materialName: `${material} - ${application}`,
          edgeProfile: 'Mitered Waterfall Edge (Contractor Wet-Saw)',
          addons: [`Role: ${role}`, `Zip: ${zipCode}`],
          totalEstimate: 0,
          notes: message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry.');
      }

      setSubmittedData({ quoteId: data.quoteId || 'VRN-DIRECT' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed. Please call our desk.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1A1A] selection:bg-[#1A1A1A] selection:text-white">
      {/* 1. Header Navigation */}
      <InCommonNav
        onOpenBookCall={handleOpenBookCall}
        onOpenQuoteModal={handleOpenQuoteModal}
      />

      <main className="flex-1 pt-28 pb-24 md:pt-36 md:pb-32">
        <div className="max-w-[1680px] mx-auto px-6 md:px-12">
          {/* Breadcrumb & Section Pretitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <div className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.25em] text-[#8C827A] font-medium font-sans mb-3">
              <Link href="/" className="hover:text-[#1A1A1A] transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-[#1A1A1A]">Contact</span>
            </div>

            <div className="text-xs uppercase tracking-[0.25em] text-amber-800 font-sans font-medium mb-2">
              Customer Support &amp; Consultations
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal tracking-tight text-[#1A1A1A] leading-[1.05]">
              Contact <span className="italic font-light text-amber-900">Verona Surfaces</span>
            </h1>

            <p className="mt-4 text-[#6C6863] text-base sm:text-lg max-w-3xl font-light leading-relaxed">
              Speak directly with our surface team. Inquire about porcelain slabs, wall and floor tiles, sample orders, or technical details for your renovation.
            </p>
          </motion.div>

          {/* Main Grid: Form (Left) & Concierge Desks (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mt-12 pt-8 border-t border-[#1A1A1A]/10">
            {/* Left Column: Direct Project Inquiry Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 bg-white border border-[#1A1A1A]/10 p-8 sm:p-12 shadow-sm"
            >
              <div className="mb-8 pb-6 border-b border-[#1A1A1A]/10">
                <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#1A1A1A] tracking-tight">
                  Send Us a Message
                </h2>
                <p className="text-xs text-[#6C6863] mt-2 font-normal leading-relaxed">
                  Share your project dimensions, rooms, or surface questions. We respond within one business day.
                </p>
              </div>

              {submittedData ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-5"
                >
                  <div className="w-16 h-16 bg-amber-50 text-amber-900 border border-amber-200/60 rounded-full mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.25em] text-amber-800 font-medium font-sans">
                      Reference #{submittedData.quoteId}
                    </span>
                    <h3 className="text-3xl font-serif font-normal text-[#1A1A1A] mt-1">
                      Message Sent Successfully
                    </h3>
                  </div>
                  <p className="text-sm text-[#6C6863] max-w-md mx-auto leading-relaxed">
                    Thank you, {fullName || 'there'}. We have received your inquiry. A surface specialist will follow up with you at <strong>{email}</strong> within one business day.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={() => setSubmittedData(null)}
                      className="px-6 py-2.5 border border-[#1A1A1A] text-[#1A1A1A] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                    >
                      Send Another Message
                    </button>
                    <Link
                      href="/visualizer"
                      className="shimmer-liquid-sheen relative overflow-hidden px-6 py-2.5 bg-[#1A1A1A] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-black transition-colors cursor-pointer inline-flex items-center gap-2"
                    >
                      <span>Preview in Room Visualizer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  {/* Row 1: Name & Professional Role */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A] font-medium mb-2 font-sans">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Julian Vance"
                        className="w-full bg-[#FAF8F5] border border-[#E8E4DC] px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#8C827A] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A] font-medium mb-2 font-sans">
                        Professional Role
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#E8E4DC] px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors cursor-pointer"
                      >
                        <option value="General Contractor">General Contractor / Builder</option>
                        <option value="Architect">Architect / Specifier</option>
                        <option value="Interior Designer">Interior Designer</option>
                        <option value="Tile Setter">Tile Setter / Fabricator</option>
                        <option value="Homeowner">Homeowner / Property Owner</option>
                        <option value="Commercial Developer">Commercial Developer</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A] font-medium mb-2 font-sans">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="julian@architecturestudio.com"
                        className="w-full bg-[#FAF8F5] border border-[#E8E4DC] px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#8C827A] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A] font-medium mb-2 font-sans">
                        Direct Phone / Mobile *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-[#FAF8F5] border border-[#E8E4DC] px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#8C827A] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 3: Application & Material Preference */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A] font-medium mb-2 font-sans">
                        Primary Application
                      </label>
                      <select
                        value={application}
                        onChange={(e) => setApplication(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#E8E4DC] px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors cursor-pointer"
                      >
                        <option value="Countertops">Kitchen Island Countertops &amp; Returns</option>
                        <option value="Backsplash & Wall Tile">Backsplash &amp; Full Height Wall Cladding</option>
                        <option value="Flooring">Large-Format Vitrified Flooring</option>
                        <option value="Full Package">Full Monolithic Surface Package</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A] font-medium mb-2 font-sans">
                        Mineral Technology
                      </label>
                      <select
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#E8E4DC] px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors cursor-pointer"
                      >
                        <option value="Vitrified Porcelain (9mm)">Vitrified Porcelain (Contractor Wet-Saw)</option>
                        <option value="Natural Granite">Dense Volcanic Granite</option>
                        <option value="Engineered Quartz">Zero-Sealing Engineered Quartz</option>
                        <option value="Metamorphic Quartzite">Crown-Jewel Metamorphic Quartzite</option>
                        <option value="Multi-Material Coordination">Multi-Material Coordination Package</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Square Footage & Jobsite Zip Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A] font-medium mb-2 font-sans">
                        Estimated Scope (Sq.Ft)
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="10000"
                        value={estimatedSqFt}
                        onChange={(e) => setEstimatedSqFt(e.target.value)}
                        placeholder="55"
                        className="w-full bg-[#FAF8F5] border border-[#E8E4DC] px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#8C827A] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A] font-medium mb-2 font-sans">
                        Jobsite Zip Code / City
                      </label>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="e.g. 78701 or Austin, TX"
                        className="w-full bg-[#FAF8F5] border border-[#E8E4DC] px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#8C827A] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 5: Project Details & Floorplan Notes */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A] font-medium mb-2 font-sans">
                      Project Notes, Slabs of Interest, or Schedule Requirements
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Specify island dimensions, waterfall edge returns, target installation dates, or request custom bookmatched lot numbers..."
                      className="w-full bg-[#FAF8F5] border border-[#E8E4DC] px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#8C827A] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                    />
                  </div>

                  {/* Action Button with Liquid Glass Shimmer */}
                  <div className="pt-2">
                    <motion.button
                      whileHover={{ y: -2, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="shimmer-liquid-sheen relative overflow-hidden w-full py-4 bg-[#1A1A1A] hover:bg-black text-white text-xs uppercase tracking-[0.25em] font-medium flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-2xl cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Sending Message...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </motion.button>
                    <p className="text-[11px] text-[#8C827A] text-center mt-3 font-normal">
                      We reply within one business day. No spam, no unsolicited calls.
                    </p>
                  </div>
                </form>
              )}
            </motion.div>

            {/* Right Column: Concierge & Consultations */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 space-y-8"
            >
              {/* Concierge Desk 1: Direct Trade & Orders Line */}
              <div className="bg-white border border-[#1A1A1A]/10 p-8 shadow-sm space-y-6">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-amber-800 font-sans font-medium mb-1">
                    Direct Concierge
                  </div>
                  <h3 className="text-2xl font-serif font-normal text-[#1A1A1A]">
                    Customer &amp; Trade Inquiries
                  </h3>
                </div>

                <div className="space-y-4 text-sm text-[#6C6863]">
                  <a
                    href="mailto:concierge@veronasurfaces.com"
                    className="flex items-center gap-3 text-[#1A1A1A] hover:text-amber-800 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-center text-amber-800 group-hover:border-[#1A1A1A] transition-colors shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#8C827A] block">Email Inquiries</span>
                      <span className="font-medium text-sm text-[#1A1A1A]">concierge@veronasurfaces.com</span>
                    </div>
                  </a>

                  <a
                    href="tel:18005557522"
                    className="flex items-center gap-3 text-[#1A1A1A] hover:text-amber-800 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-center text-amber-800 group-hover:border-[#1A1A1A] transition-colors shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#8C827A] block">Toll-Free Phone</span>
                      <span className="font-medium text-sm text-[#1A1A1A]">+1 (800) 555-SLAB (7522)</span>
                    </div>
                  </a>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-center text-amber-800 shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#8C827A] block">Hours</span>
                      <span className="text-xs text-[#1A1A1A] font-medium">Monday – Saturday: 7:00 AM – 7:00 PM EST</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Concierge Desk 2: Direct Consultation & Swatches */}
              <div className="bg-[#FAF8F5] border border-[#1A1A1A]/10 p-8 space-y-5">
                <h3 className="text-xl font-serif font-normal text-[#1A1A1A]">
                  Direct Consultation
                </h3>
                <p className="text-xs text-[#6C6863] leading-relaxed">
                  Have questions about slab formats, veining patterns, or installation? Schedule a call or request swatches.
                </p>

                <div className="space-y-3 pt-2">
                  <motion.button
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOpenBookCall({ service: 'Surface Consultation' })}
                    className="shimmer-liquid-sheen relative overflow-hidden w-full py-3.5 bg-[#1A1A1A] hover:bg-black text-white text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-lg transition-all cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule 15-Min Call</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOpenBookCall({ service: 'Sample Swatch Request' })}
                    className="w-full py-3.5 bg-white border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#EFECE6] text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Request Swatches</span>
                  </motion.button>
                </div>
              </div>

              {/* Concierge Desk 3: Safe Freight & Delivery */}
              <div className="border border-[#1A1A1A]/10 bg-white p-8 space-y-4">
                <div className="flex items-center gap-2 text-amber-800 text-xs uppercase tracking-[0.2em] font-medium font-sans">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Direct Delivery</span>
                </div>
                <h4 className="text-lg font-serif font-normal text-[#1A1A1A]">
                  Safe Packaging &amp; Transit
                </h4>
                <p className="text-xs text-[#6C6863] leading-relaxed">
                  Slabs and tiles are packaged in reinforced timber frames and delivered with liftgate freight directly to your home or contractor's site nationwide.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Architectural FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20 pt-16 border-t border-[#1A1A1A]/10"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-amber-800 font-sans font-medium mb-2">
                  Technical Specifications
                </div>
                <h3 className="text-3xl sm:text-4xl font-serif font-normal text-[#1A1A1A] tracking-tight">
                  Frequently Specified Details
                </h3>
              </div>
              <p className="text-sm text-[#6C6863] max-w-lg font-light leading-relaxed">
                Key questions answered for general contractors, kitchen designers, and architects specifying Verona vitrified porcelain.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border border-[#1A1A1A]/10 bg-white p-8 space-y-3">
                <h4 className="text-lg font-serif text-[#1A1A1A] font-normal">
                  Can our tile contractor install 9mm porcelain?
                </h4>
                <p className="text-xs text-[#6C6863] leading-relaxed">
                  Yes. Verona calibrated 9mm mass is engineered specifically for installation by tile setters and general contractors using standard continuous-rim diamond wet saws. No expensive specialized stone fabrication shop waits.
                </p>
              </div>

              <div className="border border-[#1A1A1A]/10 bg-white p-8 space-y-3">
                <h4 className="text-lg font-serif text-[#1A1A1A] font-normal">
                  How does delivery and transit work?
                </h4>
                <p className="text-xs text-[#6C6863] leading-relaxed">
                  Stocked slabs and tiles ship within 24 to 48 hours in protective timber A-frames with liftgate offloading at your driveway or jobsite. Tracking details are emailed as soon as your shipment departs.
                </p>
              </div>

              <div className="border border-[#1A1A1A]/10 bg-white p-8 space-y-3">
                <h4 className="text-lg font-serif text-[#1A1A1A] font-normal">
                  Do you provide trade &amp; architect submittals?
                </h4>
                <p className="text-xs text-[#6C6863] leading-relaxed">
                  Yes. Physical sample swatch boxes, ASTM technical certifications, and high-resolution CAD texture maps are shipped via express courier to homeowners, architects, and trade partners.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* 4. Footer */}
      <InCommonFooter
        onOpenBookCall={handleOpenBookCall}
        onOpenQuoteModal={handleOpenQuoteModal}
        onOpenSwatches={() => handleOpenQuoteModal()}
      />

      {/* 5. Conversion Modals */}
      <BookCallModal
        isOpen={isBookCallOpen}
        onClose={() => setIsBookCallOpen(false)}
        initialMaterial={modalInitialMaterial}
        initialSqFt={modalInitialSqFt}
        initialService={modalInitialService}
      />
    </div>
  );
}
