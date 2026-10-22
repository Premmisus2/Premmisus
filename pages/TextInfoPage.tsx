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

import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xs font-mono text-accent uppercase tracking-widest mb-4">{title}</h2>
    <div className="font-mono text-sm text-gray-300 leading-relaxed space-y-3">{children}</div>
  </div>
);

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
        </div>
      </section>

      <Footer />
    </main>
  );
};
