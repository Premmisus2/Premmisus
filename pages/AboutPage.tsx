import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SectionWrapper } from '../components/SectionWrapper';

const Stat: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="text-center">
    <div className="text-4xl md:text-5xl font-sans font-bold text-accent mb-2">{value}</div>
    <div className="font-mono text-xs text-text-secondary uppercase tracking-widest">{label}</div>
  </div>
);

const Pillar: React.FC<{ number: string; title: string; body: string }> = ({ number, title, body }) => (
  <div className="border border-white/10 p-8 hover:border-accent/30 transition-colors duration-300">
    <span className="font-mono text-xs text-accent mb-4 block">{number}</span>
    <h4 className="font-sans font-bold text-white text-lg mb-3">{title}</h4>
    <p className="font-mono text-sm text-text-secondary leading-relaxed">{body}</p>
  </div>
);

export const AboutPage: React.FC = () => {
  return (
    <main className="bg-background text-text-primary relative min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="px-6 pb-24" style={{ paddingTop: '160px' }}>
        <SectionWrapper>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xs font-mono text-accent uppercase tracking-widest mb-6">About Premmisus</h2>
            <h1 className="text-5xl md:text-7xl font-sans font-bold text-white tracking-tighter mb-8 leading-tight">
              Built for trades.<br />
              <span className="text-accent">Engineered</span> to scale.
            </h1>
            <p className="font-mono text-text-secondary text-sm md:text-base leading-relaxed max-w-2xl">
              Premmisus is a Canadian growth agency built exclusively for Canadian trades and home service businesses. We don't serve everyone — we partner selectively with operators who are serious about scaling, and we engineer the full system to get them there.
            </p>
          </div>
        </SectionWrapper>
      </section>

      {/* Stats */}
      <section className="py-16 border-t border-b border-white/5">
        <SectionWrapper>
          <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
            <Stat value="10" label="Partners per quarter" />
            <Stat value="6+" label="Active niches served" />
            <Stat value="$48" label="Avg. cost per lead" />
            <Stat value="3.2x" label="Avg. client ROAS" />
          </div>
        </SectionWrapper>
      </section>

      {/* Story */}
      <section className="py-24">
        <SectionWrapper>
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-xs font-mono text-accent uppercase tracking-widest mb-6">Our Story</h2>
            <div className="space-y-5 font-mono text-sm text-text-secondary leading-relaxed">
              <p>
                Premmisus was founded with a single observation: Canadian trades businesses were being underserved by generic marketing agencies that didn't understand the industry, couldn't track results, and charged premium rates for average outcomes.
              </p>
              <p>
                We built a different model. One built around a specific type of client — the trades operator generating real revenue, with a real team, who understands that growth requires infrastructure, not just ads.
              </p>
              <p>
                Every service we offer — paid social acquisition, creative strategy, CRO funnels, retention systems, and AI automation — is engineered specifically for the economics of Canadian home service businesses. We know your close rates, your seasonality, your job values, and your margins. That knowledge is built into everything we build.
              </p>
              <p>
                We operate on a partnership model. We cap intake at 10 new clients per quarter to ensure every partner receives the attention and execution they deserve. If we take you on, we're fully invested in your growth.
              </p>
            </div>
          </div>
        </SectionWrapper>
      </section>

      {/* Pillars */}
      <section className="py-24 border-t border-white/5">
        <SectionWrapper>
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-xs font-mono text-accent uppercase tracking-widest mb-4">How We Operate</h2>
            <h3 className="text-3xl md:text-4xl font-sans font-bold text-white mb-12">
              Our operating principles.
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Pillar
                number="01"
                title="Selective Partnerships"
                body="We don't accept every client. We run a qualification process to ensure we're the right fit — and that you are too. This protects both parties and guarantees our attention is never diluted."
              />
              <Pillar
                number="02"
                title="Full Transparency"
                body="If we can't track it, we don't do it. Every campaign is measured with server-side GA4 and CRM integration so you know exactly which ad generated which lead and which job."
              />
              <Pillar
                number="03"
                title="Niche Depth"
                body="We operate exclusively in Canadian trades and home services. That focus means faster creative, better targeting, and benchmarks built on real industry data — not guesswork."
              />
            </div>
          </div>
        </SectionWrapper>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-white/5">
        <SectionWrapper>
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="text-xs font-mono text-accent uppercase tracking-widest mb-4">Ready to Apply?</h2>
            <h3 className="text-3xl md:text-4xl font-sans font-bold text-white mb-6">
              See if you qualify.
            </h3>
            <p className="font-mono text-sm text-text-secondary mb-10 max-w-md mx-auto">
              We review every application and only move forward when we're confident we can deliver. Start the qualifier below.
            </p>
            <a
              href="/#qualify"
              className="neon-button inline-block px-12 py-4 font-mono font-bold uppercase tracking-wider text-sm"
            >
              Check Availability
            </a>
          </div>
        </SectionWrapper>
      </section>

      <Footer />
    </main>
  );
};
