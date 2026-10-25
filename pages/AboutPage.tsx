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
              Premmisus Inc. is a Canadian company based in London, Ontario. We set up the systems that catch the work trades and home service businesses already get: missed calls texted back, every lead sent to the owner, review requests after every job and past customers brought back, with the website that ties it together.
            </p>
          </div>
        </SectionWrapper>
      </section>

      {/* Stats */}
      <section className="py-16 border-t border-b border-white/5">
        <SectionWrapper>
          <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
            {/* Facts, not results (2026-10-25): the offer, the Client Agreement (about 14 days,
                month to month) and who builds it today. The old figures were invented. */}
            <Stat value="4" label="Systems, one setup" />
            <Stat value="14" label="Days to set up, about" />
            <Stat value="0" label="Long-term contracts" />
            <Stat value="1" label="Founder who builds it" />
          </div>
        </SectionWrapper>
      </section>

      {/* Story */}
      <section className="py-24">
        <SectionWrapper>
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-xs font-mono text-accent uppercase tracking-widest mb-6">From the Founder</h2>
            {/* Elliott's own words, dictated for premmisus.com on 2026-10-08 ("Elliott's final wording,
                verbatim"). SHELF LIFE: "I stay closely involved" is true while Elliott builds every
                client; whoever adds the first assistant rewrites this. */}
            <div className="space-y-5 font-mono text-sm text-text-secondary leading-relaxed">
              <p>
                I've been doing this for 3 years, going on 4, and what I'm striving to build is simple: a reliable software-as-a-service product for everyday business people like yourself.
              </p>
              <p>
                I stay closely involved in the communication and the building of the systems. Whatever level of quality you get from me at the start is what you'll get across the board: the delivery, the communication, and how problems get solved.
              </p>
              <p className="text-white">Elliott Cuthbert, Founder</p>
              <p>
                Premmisus started in Germany and is now based in London, Ontario.
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
                title="You see it first"
                body="Every system is set up for your business, and you see it working on your own phone before it reaches a customer."
              />
              <Pillar
                number="02"
                title="Month to month"
                body="No long-term contract. If it isn't working for you, cancel by email and you won't be charged again."
              />
              <Pillar
                number="03"
                title="Built for trades"
                body="Cleaning, landscaping, plumbing, pressure washing, window washing, construction and handyman: businesses that miss calls because they're on the job."
              />
            </div>
          </div>
        </SectionWrapper>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-white/5">
        <SectionWrapper>
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="text-xs font-mono text-accent uppercase tracking-widest mb-4">Next Step</h2>
            <h3 className="text-3xl md:text-4xl font-sans font-bold text-white mb-6">
              Let's talk.
            </h3>
            <p className="font-mono text-sm text-text-secondary mb-10 max-w-md mx-auto">
              A short call about how you work, and we'll show you what it would look like for your business.
            </p>
            <a
              href="/#qualify"
              className="neon-button inline-block px-12 py-4 font-mono font-bold uppercase tracking-wider text-sm"
            >
              Book a Free Strategy Call
            </a>
          </div>
        </SectionWrapper>
      </section>

      <Footer />
    </main>
  );
};
