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
//
// Since 2026-10-23 it posts to /api/enquiry, which lands the lead in the Sales Portal
// (Canadian floor, Inbox, the portal's Telegram). "Got it" shows only when that worked.

import React, { useState, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Loader2, CheckCircle2 } from 'lucide-react';
import {
  useTurnstile, newRequestId, submitEnquiry, consentTextFrom, enquiryErrorMessage, turnstileWaitMessage, CONSENT_VERSION,
} from '../lib/enquiry';

// Window.turnstile is already declared in types/turnstile.d.ts. Do not redeclare it.

export const SmsOptInPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', businessName: '' });
  // Carrier rule (Twilio error 30913): marketing consent must never share a control with
  // informational consent. The A2P campaign was rejected twice on 2026-10-08/09. Since
  // 2026-10-09 this form collects INFORMATIONAL consent only: the marketing checkbox was
  // removed because no marketing campaign exists. Do not add one back without a separate,
  // approved marketing campaign and an update to Privacy s5 and Terms s3.
  const [smsConsentService, setSmsConsentService] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstile = useTurnstile(turnstileRef);
  const requestId = useRef(newRequestId());
  const consentLabelRef = useRef<HTMLLabelElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!turnstile.token) { setError(turnstileWaitMessage(turnstile.status)); return; }
    setIsSubmitting(true);
    const result = await submitEnquiry({
      requestId: requestId.current,
      form: 'sms-opt-in',
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      businessName: formData.businessName,
      // No marketing checkbox on this form (removed 2026-10-09).
      consent: { service: smsConsentService, marketing: false, text: consentTextFrom(consentLabelRef.current), version: CONSENT_VERSION },
      turnstileToken: turnstile.token,
    });
    setIsSubmitting(false);
    if (result.ok) { setDone(true); return; }
    setError(enquiryErrorMessage(result.error));
    turnstile.reset();
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
              Text Messages
            </h1>
            <p className="font-mono text-sm text-text-secondary leading-relaxed">
              Leave your details and we will get back to you by phone or email. If you would also
              like call recaps, meeting confirmations and reminders by text, tick the box below. You can
              opt out at any time.
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

                  {/* Informational-only SMS consent checkbox (carrier requirement, Twilio 30913).
                      The text below is quoted VERBATIM in the Twilio A2P campaign MessageFlow;
                      changing it means updating the campaign filing. */}
                  <label ref={consentLabelRef} className="flex items-start gap-3 cursor-pointer pt-2">
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

                  <div ref={turnstileRef} className="flex justify-center pt-2" />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent text-black font-mono font-bold uppercase tracking-wider p-4 rounded-lg hover:bg-white transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit'}
                  </button>

                  {error && (
                    <p role="alert" className="text-[12px] font-mono text-red-400 leading-relaxed text-center">{error}</p>
                  )}

                  <p className="text-[11px] font-mono text-text-secondary leading-relaxed text-center pt-1">
                    Ticking the SMS box is optional. You can submit this form without it and we will
                    contact you by phone or email instead.
                  </p>
                </form>
              )}
            </div>
          </div>

          <p className="mt-8 font-mono text-[11px] text-text-secondary text-center leading-relaxed">
            Premmisus Inc. · 700 Osgoode Dr, London, ON N6E 2H1, Canada<br />
            <a href="tel:+12494682807" className="text-accent hover:underline">(249) 468-2807</a> ·{' '}
            <a href="mailto:elliott@premmisus.com" className="text-accent hover:underline">elliott@premmisus.com</a>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
};
