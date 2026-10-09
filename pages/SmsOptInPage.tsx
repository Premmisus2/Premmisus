// Standalone SMS opt-in page.
//
// Why this exists separately from the Qualifier: the Qualifier is a multi-step wizard.
// Its contact fields and consent checkbox only mount once every qualification question
// has been answered, so an automated carrier/A2P compliance scanner loading the page
// sees "Question 1 of N" and never reaches the checkbox. That failed all eight opt-in
// checks in GHL's review while Terms and Privacy passed 7/7.
//
// This page puts the whole thing in the initial DOM: name, phone, email, and an
// unticked, OPTIONAL consent checkbox carrying every required disclosure. It is a real,
// working form that posts to the same pipeline as the Qualifier, not a decoy for
// reviewers. Submitting without ticking the box is valid and means call/email only.

import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Loader2, CheckCircle2 } from 'lucide-react';

// Window.turnstile is already declared in types/turnstile.d.ts — do not redeclare it.

export const SmsOptInPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', businessName: '' });
  // Carrier rule (Twilio error 30913): marketing consent must be collected separately from
  // informational consent. One checkbox covering both got the A2P campaign rejected on
  // 2026-10-08. Two independent, optional, unticked boxes — never recombine them.
  const [smsConsentService, setSmsConsentService] = useState(false);
  const [smsConsentMarketing, setSmsConsentMarketing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    if (turnstileRef.current && window.turnstile && !widgetId.current) {
      widgetId.current = window.turnstile.render(turnstileRef.current, {
        sitekey: '0x4AAAAAACwEfcixkS53YLBM',
        callback: (token: string) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(''),
        theme: 'dark',
        size: 'flexible',
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const consentAt = new Date().toISOString();
    const payload = {
      formData,
      answers: {},
      source: 'SMS Opt-In Page',
      turnstileToken,
      website: '',
      // Legacy combined flag kept so downstream consumers (GHL webhook mapping, Sheets
      // column L) keep working; the split fields are the source of truth for A2P proof.
      smsConsent: smsConsentService || smsConsentMarketing,
      smsConsentAt: smsConsentService || smsConsentMarketing ? consentAt : null,
      smsConsentService,
      smsConsentServiceAt: smsConsentService ? consentAt : null,
      smsConsentMarketing,
      smsConsentMarketingAt: smsConsentMarketing ? consentAt : null,
    };

    try {
      await Promise.all([
        fetch('/api/ghl', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
        fetch('/api/lead-notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(err => console.error('Lead notify error:', err)),
      ]);
    } catch (error) {
      console.error('SMS opt-in submission error:', error);
    } finally {
      setDone(true);
      setIsSubmitting(false);
    }
  };

  const inputClass = 'w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-white placeholder:text-zinc-600 focus:border-accent focus:outline-none transition-colors';

  return (
    <main className="bg-background text-text-primary relative min-h-screen">
      <Navbar />

      <section className="px-6 pb-32" style={{ paddingTop: '160px' }}>
        <div className="max-w-xl mx-auto">

          <div className="mb-10">
            <h2 className="text-xs font-mono text-accent uppercase tracking-widest mb-4">Contact</h2>
            <h1 className="text-4xl md:text-5xl font-sans font-bold text-white tracking-tighter mb-4">
              Get a Text Back
            </h1>
            <p className="font-mono text-sm text-text-secondary leading-relaxed">
              Leave your details and we will get back to you. If you would rather we text you,
              tick the box below. You can opt out at any time.
            </p>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-2xl backdrop-blur-md p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-white/10 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-white/10 rounded-br-2xl" />

            <div className="relative z-10">
              {done ? (
                <div className="text-center py-8">
                  <CheckCircle2 size={40} className="text-accent mx-auto mb-4" />
                  <h2 className="font-sans text-xl font-bold text-white mb-2">Got it</h2>
                  <p className="font-mono text-sm text-text-secondary">
                    Thanks {formData.name.split(' ')[0]}. We will be in touch shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text" required placeholder="Full Name" className={inputClass}
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                  <input
                    type="email" required placeholder="Email Address" className={inputClass}
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                  <input
                    type="tel" required placeholder="Phone Number" className={inputClass}
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <input
                    type="text" placeholder="Business Name (optional)" className={inputClass}
                    value={formData.businessName}
                    onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                  />

                  {/* Honeypot */}
                  <input type="text" name="website" className="absolute -left-[9999px]" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                  {/* Two SEPARATE consent checkboxes — carrier requirement (Twilio 30913).
                      Marketing consent must never share a control with informational consent.
                      The service-messages text below is quoted VERBATIM in the Twilio A2P
                      campaign MessageFlow; changing it means updating the campaign filing. */}
                  <label className="flex items-start gap-3 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      name="smsConsentService"
                      checked={smsConsentService}
                      onChange={e => setSmsConsentService(e.target.checked)}
                      className="mt-[3px] h-4 w-4 shrink-0 accent-accent cursor-pointer"
                    />
                    <span className="text-[11px] font-mono text-text-secondary leading-relaxed">
                      <span className="text-text-primary">Optional:</span> I agree to receive informational SMS messages from Premmisus Inc. at the number provided: call recaps, meeting confirmations and reminders. Messages may be sent by an automated system. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help at any time. Consent is not a condition of purchase. You must be 18 or older.{' '}
                      <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a> ·{' '}
                      <a href="/terms" className="text-accent hover:underline">Terms &amp; Conditions</a>
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      name="smsConsentMarketing"
                      checked={smsConsentMarketing}
                      onChange={e => setSmsConsentMarketing(e.target.checked)}
                      className="mt-[3px] h-4 w-4 shrink-0 accent-accent cursor-pointer"
                    />
                    <span className="text-[11px] font-mono text-text-secondary leading-relaxed">
                      <span className="text-text-primary">Optional:</span> I agree to receive marketing SMS messages from Premmisus Inc. at the number provided: offers and updates about our services. Messages may be sent by an automated system. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help at any time. Consent is not a condition of purchase. You must be 18 or older.{' '}
                      <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a> ·{' '}
                      <a href="/terms" className="text-accent hover:underline">Terms &amp; Conditions</a>
                    </span>
                  </label>

                  <div ref={turnstileRef} className="flex justify-center pt-2" />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent text-black font-mono font-bold uppercase tracking-wider p-4 rounded-lg hover:bg-white transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit'}
                  </button>

                  <p className="text-[11px] font-mono text-text-secondary leading-relaxed text-center pt-1">
                    Ticking the SMS box is optional. You can submit this form without it and we will
                    contact you by phone or email instead.
                  </p>
                </form>
              )}
            </div>
          </div>

          <p className="mt-8 font-mono text-[11px] text-text-secondary text-center leading-relaxed">
            Premmisus Inc. · 700 Osgoode Dr, London, ON N6E 2G2, Canada<br />
            <a href="tel:+12494682807" className="text-accent hover:underline">(249) 468-2807</a> ·{' '}
            <a href="mailto:contact@premmisus.com" className="text-accent hover:underline">contact@premmisus.com</a>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
};
