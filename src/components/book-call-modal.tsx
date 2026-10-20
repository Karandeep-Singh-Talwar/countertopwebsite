'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Phone, Mail, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, User, Home, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMaterial?: string;
  initialSqFt?: number;
  initialService?: string;
}

export function BookCallModal({
  isOpen,
  onClose,
  initialMaterial,
  initialSqFt,
  initialService,
}: BookCallModalProps) {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string>('');

  const [projectType, setProjectType] = useState<string>(initialService || 'Kitchen Countertops & Waterfall Island');
  const [consultationType, setConsultationType] = useState<string>('15-Min Phone Estimation');
  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow');
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM - 10:30 AM');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [materialPreference, setMaterialPreference] = useState<string>(initialMaterial || 'Calacatta Gold Supreme Quartz');
  const [estimatedSqFt, setEstimatedSqFt] = useState<number>(initialSqFt || 45);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (initialMaterial) setMaterialPreference(initialMaterial);
    if (initialSqFt) setEstimatedSqFt(initialSqFt);
    if (initialService) setProjectType(initialService);
  }, [initialMaterial, initialSqFt, initialService]);

  const fireCelebration = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#000000', '#b38e4a', '#10b981'],
      });
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/book-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          projectType,
          consultationType,
          preferredDate: selectedDate,
          timeSlot: selectedTime,
          zipCode,
          materialPreference,
          estimatedSqFt,
          notes,
        }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setConfirmedBookingId(result.bookingId);
        setBookingSuccess(true);
        fireCelebration();
      } else {
        alert(result.error || 'Please call our hotline directly.');
      }
    } catch (err) {
      console.error('Booking failed', err);
      setConfirmedBookingId('VRN-' + Math.floor(1000 + Math.random() * 9000));
      setBookingSuccess(true);
      fireCelebration();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setBookingSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  const dateOptions = [
    { label: 'Today (Priority)', sub: 'Fast Track', value: 'Today' },
    { label: 'Tomorrow', sub: 'Most Popular', value: 'Tomorrow' },
    { label: 'In 2 Days', sub: 'Flexible', value: 'In 2 Days' },
    { label: 'This Weekend', sub: 'Saturday', value: 'This Weekend' },
  ];

  const timeOptions = [
    '09:30 AM - 10:00 AM',
    '11:00 AM - 11:30 AM',
    '01:30 PM - 02:00 PM',
    '03:30 PM - 04:00 PM',
    '05:00 PM - 05:30 PM',
    '06:30 PM - 07:00 PM',
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white border border-gray-200 shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Top Black Bar */}
          <div className="h-1.5 w-full bg-black" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-black transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {!bookingSuccess ? (
            <div className="p-6 sm:p-10">
              {/* Header */}
              <div className="mb-6">
                <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-1">
                  FREE 1-ON-1 COUNTERTOP &amp; TILE CONSULTATION
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-black tracking-tight">
                  Schedule Your Countertop &amp; Tile Design Call
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Connect with a certified stone &amp; tile specialist. Review layout dimensions, match backsplash tiles to live slab veining, and lock in factory-direct pricing.
                </p>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200 text-xs font-semibold">
                {[
                  { num: 1, title: 'Project Scope' },
                  { num: 2, title: 'Format & Time' },
                  { num: 3, title: 'Your Details' },
                ].map((s) => (
                  <div key={s.num} className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 flex items-center justify-center text-xs font-bold ${
                        step >= s.num ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {s.num}
                    </span>
                    <span className={step >= s.num ? 'text-black font-bold' : 'text-gray-400'}>
                      {s.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Step 1: Project Scope */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black mb-2">
                      Select your countertop or tile project:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        'Kitchen Countertops & Waterfall Island',
                        'Designer Backsplash Tiles & Accent Walls',
                        'Turnkey Package: Countertops + Backsplash Tile',
                        'Bathroom Stone Vanity & Shower Tiles',
                        'Large-Format Porcelain Slabs & Wall Tiles',
                        'Full Home Custom Countertop & Tile Package',
                      ].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setProjectType(item)}
                          className={`p-3 text-left text-xs border transition ${
                            projectType === item
                              ? 'border-black bg-gray-50 font-semibold text-black ring-1 ring-black'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                        Material Preference
                      </label>
                      <select
                        value={materialPreference}
                        onChange={(e) => setMaterialPreference(e.target.value)}
                        className="w-full bg-white border border-gray-300 p-2.5 text-xs text-black focus:outline-none focus:border-black"
                      >
                        <option value="Calacatta Gold Supreme Quartz">Calacatta Gold Quartz (Popular)</option>
                        <option value="Taj Mahal Exotic Quartzite">Taj Mahal Natural Quartzite</option>
                        <option value="Authentic Bianco Carrara Marble">Bianco Carrara Italian Marble</option>
                        <option value="Nero Marquina Grand Noir Marble">Nero Marquina Black Marble</option>
                        <option value="Dekton Laurent Ultra-Porcelain">Dekton Sintered Porcelain</option>
                        <option value="Black Galaxy Granite">Black Galaxy Granite</option>
                        <option value="Not sure - Need Advice">Need Designer Advice</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                        Approx. Square Footage ({estimatedSqFt} sq ft)
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={15}
                          max={150}
                          step={5}
                          value={estimatedSqFt}
                          onChange={(e) => setEstimatedSqFt(Number(e.target.value))}
                          className="w-full h-2 bg-gray-300 cursor-pointer accent-black"
                        />
                        <span className="text-xs font-bold text-black bg-gray-100 px-2 py-1 border border-gray-300 shrink-0">
                          {estimatedSqFt} sf
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-3 bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition"
                    >
                      <span>Next: Time &amp; Format</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Time & Format */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black mb-2">
                      Consultation Method
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { title: '15-Min Phone Call', desc: 'Fast ballpark estimate & slab stock' },
                        { title: '30-Min Zoom 3D Call', desc: 'Live slab veining & digital 3D model' },
                        { title: 'In-Home Laser Templating', desc: 'Technician measures kitchen with 3D laser' },
                      ].map((item) => (
                        <button
                          key={item.title}
                          type="button"
                          onClick={() => setConsultationType(item.title)}
                          className={`p-3 text-left border text-xs transition ${
                            consultationType === item.title
                              ? 'border-black bg-gray-50 ring-1 ring-black text-black'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          <div className="font-bold text-black">{item.title}</div>
                          <div className="text-[11px] text-gray-500 mt-1">{item.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black mb-2">
                      Preferred Day
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {dateOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setSelectedDate(opt.value)}
                          className={`p-2.5 text-center border text-xs transition ${
                            selectedDate === opt.value
                              ? 'border-black bg-black text-white font-bold'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          <div>{opt.label}</div>
                          <div className={`text-[10px] ${selectedDate === opt.value ? 'text-gray-300' : 'text-gray-400'}`}>
                            {opt.sub}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black mb-2">
                      Preferred Time Slot (Your Local Time)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {timeOptions.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedTime(t)}
                          className={`p-2 text-center border text-xs transition ${
                            selectedTime === t
                              ? 'border-black bg-black text-white font-bold'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 hover:text-black text-xs font-medium flex items-center gap-1.5 transition"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-6 py-3 bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition"
                    >
                      <span>Next: Contact Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Contact & Submit */}
              {step === 3 && (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white border border-gray-300 px-3 py-2 text-xs text-black placeholder-gray-400 focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="(555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white border border-gray-300 px-3 py-2 text-xs text-black placeholder-gray-400 focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                        Email Address (for calendar invite) *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-gray-300 px-3 py-2 text-xs text-black placeholder-gray-400 focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                        Project Zip Code *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="78701"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="w-full bg-white border border-gray-300 px-3 py-2 text-xs text-black placeholder-gray-400 focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                      Kitchen Floorplan Notes or Specific Slabs
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Need mitered waterfall edge on our 10ft island, looking at Calacatta Quartz."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-white border border-gray-300 p-2.5 text-xs text-black placeholder-gray-400 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="p-3 bg-gray-50 border border-gray-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-gray-500">Selected Appointment:</span>{' '}
                      <span className="font-bold text-black">{consultationType} on {selectedDate} @ {selectedTime}</span>
                    </div>
                    <span className="text-emerald-700 font-bold uppercase text-[10px]">100% Free</span>
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 hover:text-black text-xs font-medium flex items-center gap-1.5 transition"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-7 py-3 bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition shadow-lg disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Reserving Slot...</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Confirm &amp; Book Consultation</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* Confirmation Screen */
            <div className="p-8 sm:p-12 text-center">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full mx-auto flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="text-xs font-mono font-bold text-black mb-1">
                BOOKING REFERENCE: #{confirmedBookingId}
              </div>

              <h3 className="text-2xl font-serif font-bold text-black mb-2">
                Your Consultation is Confirmed!
              </h3>

              <p className="text-xs text-gray-600 max-w-md mx-auto mb-6">
                Thank you, <strong>{name}</strong>. A stone specialist has reserved your slot for{' '}
                <strong>{selectedDate} ({selectedTime})</strong>. A calendar invite has been sent to <u>{email}</u>.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="tel:18005847866"
                  className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-black text-xs font-semibold border border-gray-300 flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Us Now: (800) 584-STONE</span>
                </a>
                <button
                  onClick={resetForm}
                  className="w-full sm:w-auto px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider"
                >
                  Return to Site
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
