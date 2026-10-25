// premmisus.ca/text: the page every Canadian outreach text links to.
//
// Canada's anti-spam law requires each commercial text to carry the sender's
// name, a mailing address, a phone number, email or web address, and a way to
// unsubscribe. A text has no room for all of it, so CRTC Regulations
// SOR/2012-36 s.2(2) allow it on a web page the message links to. This is that
// page. Keep it true to what the Portal actually does: STOP writes the number
// to sms_suppressions and every send path checks that list.
//
// Not linked from the nav or footer on purpose: it is for people who got a
// text. vercel.json sends X-Robots-Tag: noindex for /text.

import React, { useRef, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useTurnstile, newRequestId, submitEnquiry, enquiryErrorMessage, turnstileWaitMessage, CONSENT_VERSION } from '../lib/enquiry';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xs font-mono text-accent uppercase tracking-widest mb-4">{title}</h2>
    <div className="font-mono text-sm text-gray-300 leading-relaxed space-y-3">{children}</div>
  </div>
);

const BEST_TIMES = ['Morning', 'Afternoon', 'Evening', 'Any time'];
const inputClass = 'w-full bg-white/5 border border-white/10 p-4 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors';

/**
 * Call-me-back form for people who got one of our texts (Elliott, 2026-10-25). Lands in the Sales
 * Portal like every .ca form, as source premmisus.ca/text, so the texts' callbacks can be counted.
 * A request for a call only: no texting checkbox, so the portal marks it call or email only.
 * Kept below the CASL information on purpose: the stop instructions come first.
 */
const CallMeBack: React.FC = () => {
  const [form, setForm] = useState({ name: '', phone: '', businessName: '', bestTime: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstile = useTurnstile(turnstileRef);
  const requestId = useRef(newRequestId());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!turnstile.token) { setError(turnstileWaitMessage(turnstile.status)); return; }
    setIsSubmitting(true);
    const result = await submitEnquiry({
      requestId: requestId.current,
      form: 'text',
      name: form.name,
      phone: form.phone,
      businessName: form.businessName || undefined,
      // The portal shows the message, not raw fields: the rep reads this line.
      message: `Call-back request from the text page.${form.bestTime ? ` Best time: ${form.bestTime}.` : ''}`,
      consent: { service: false, marketing: false, version: CONSENT_VERSION },
      turnstileToken: turnstile.token,
    });
    setIsSubmitting(false);
    if (result.ok) { setSubmitted(true); return; }
    setError(enquiryErrorMessage(result.error));
    turnstile.reset();
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center py-6">
        <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center text-accent mb-5 border border-accent/50">
          <Check className="w-7 h-7" />
        </div>
        <p className="text-xl font-sans font-bold text-white">Got it, we'll call you within one business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" required placeholder="Your Name" autoComplete="name" className={inputClass}
        value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input type="tel" required placeholder="Phone Number" autoComplete="tel" className={inputClass}
        value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
      <input type="text" placeholder="Business Name (optional)" autoComplete="organization" className={inputClass}
        value={form.businessName} onChange={e => setForm({ ...form, businessName: e.target.value })} />
      <select aria-label="Best time to call (optional)" className={inputClass}
        value={form.bestTime} onChange={e => setForm({ ...form, bestTime: e.target.value })}>
        <option value="">Best time to call (optional)</option>
        {BEST_TIMES.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <div ref={turnstileRef} className="flex justify-center" />
      <p className="text-[11px] font-mono text-text-secondary leading-relaxed text-center px-2">
        By submitting, you agree we may contact you by phone or email about your inquiry. Submitting does not sign you up for text messages.{' '}
        <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a> ·{' '}
        <a href="/terms" className="text-accent hover:underline">Terms</a>.
      </p>
      <button type="submit" disabled={isSubmitting}
        className="w-full bg-accent text-black font-mono font-bold uppercase tracking-wider p-4 hover:bg-white transition-colors flex justify-center items-center gap-2 disabled:opacity-70 neon-button">
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Call Me Back'}
      </button>
      {error && <p role="alert" className="text-[12px] font-mono text-red-400 leading-relaxed text-center">{error}</p>}
    </form>
  );
};

export const TextInfoPage: React.FC = () => {
  return (
    <main className="bg-background text-text-primary relative min-h-screen">
      <Navbar />

      <section className="px-6 pb-32" style={{ paddingTop: '160px' }}>
        <div className="max-w-3xl mx-auto">

          <div className="mb-16">
            <h2 className="text-xs font-mono text-accent uppercase tracking-widest mb-4">Text Messages</h2>
            <h1 className="text-4xl md:text-6xl font-sans font-bold text-white tracking-tighter mb-6">
              Got a text from Premmisus?
            </h1>
            <p className="font-mono text-sm text-text-secondary">
              Who we are, why you got it, and how to stop it.
            </p>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-2xl backdrop-blur-md p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-white/10 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-white/10 rounded-br-2xl" />

            <div className="relative z-10">

              <Section title="Who sent it">
                <p>
                  Premmisus Inc., a Canadian marketing company. We help local service businesses stop
                  losing work when they can't get to the phone: instant replies to new leads, missed-call
                  text-back, review requests, follow-ups to past customers, and websites.
                </p>
                <p>
                  Some of our texts are sent automatically by our software, for example after we tried to
                  call you and couldn't reach you.
                </p>
              </Section>

              <Section title="Why we texted you">
                <p>
                  We texted the phone number your business publishes, for example on its website or its
                  Google listing, about a service relevant to your business. Canada's anti-spam law
                  (CASL) allows this when a business publishes its number and does not say it doesn't
                  want these messages.
                </p>
              </Section>

              <Section title="How to stop">
                <p>
                  Reply <strong className="text-white">STOP</strong> to any text from us. Your number goes
                  on our do-not-text list straight away and we won't text it again.
                </p>
                <p>
                  You can also email{' '}
                  <a href="mailto:elliott@premmisus.com" className="text-accent hover:underline">elliott@premmisus.com</a>{' '}
                  or call{' '}
                  <a href="tel:+12494682807" className="text-accent hover:underline">(249) 468-2807</a>{' '}
                  and ask to be removed. We act on every request within 10 business days at the latest,
                  as the law requires.
                </p>
              </Section>

              <Section title="Contact us">
                <p>
                  <strong className="text-white">Premmisus Inc.</strong><br />
                  700 Osgoode Dr, London, ON N6E 2H1, Canada<br />
                  <a href="tel:+12494682807" className="text-accent hover:underline">(249) 468-2807</a><br />
                  <a href="mailto:elliott@premmisus.com" className="text-accent hover:underline">elliott@premmisus.com</a><br />
                  <a href="https://premmisus.ca" className="text-accent hover:underline">premmisus.ca</a>
                </p>
                <p>
                  How we handle information: <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a>
                  {' '}·{' '}
                  <a href="/terms" className="text-accent hover:underline">Terms of Service</a>
                </p>
              </Section>

            </div>
          </div>

          <div className="mt-10 bg-black/40 border border-accent/20 rounded-2xl backdrop-blur-md p-8 md:p-12">
            <h2 className="text-xs font-mono text-accent uppercase tracking-widest mb-4">Want us to call you?</h2>
            <p className="font-mono text-sm text-gray-300 leading-relaxed mb-8">
              Leave your name and number and we'll call you within one business day. No obligation.
            </p>
            <CallMeBack />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};
