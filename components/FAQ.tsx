import React, { useState } from 'react';
import { SectionWrapper } from './SectionWrapper';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "I get all my work from referrals. Why would I need this?",
    answer: "Referrals are great — but they're unpredictable. 70% of homeowners search Google before asking a neighbour. We build the system that catches the ones who don't know you yet, so referrals become the bonus, not the lifeline."
  },
  {
    question: "I've been burned by a marketing agency before.",
    answer: "So have most of our clients. The difference: we only work with trades businesses, we show you exactly where every dollar goes in a live dashboard, and we're performance-based. If we don't deliver, you don't pay. No long-term contracts."
  },
  {
    question: "How much does this cost?",
    answer: "Our systems start at $1,599/month depending on scope. Every dollar is tracked to a cost-per-lead number so you know exactly what you're paying per job booked. We'll walk you through the math on a call."
  },
  {
    question: "How long until I see results?",
    answer: "Most clients see their first qualified leads within 2–3 weeks of launch. Full pipeline momentum typically hits around the 60-day mark as the system learns and optimizes."
  },
  {
    question: "What makes you different from other agencies?",
    answer: "We specialize in Canadian trades — plumbing, roofing, cleaning, landscaping, renovation. That's where our systems are sharpest and our results are strongest. Every ad template, every follow-up sequence, every automation is built with your industry in mind."
  },
  {
    question: "Do I need to be tech-savvy?",
    answer: "Not at all. We handle everything — the tech, the ads, the follow-up automation. You just answer the phone when it rings."
  },
  {
    question: "What if it doesn't work?",
    answer: "We're performance-based. If we don't deliver results, you don't pay. We're that confident in what we build — because we've seen it work across every trades niche we've touched."
  },
];

interface TimelineStep {
  month: string;
  title: string;
  description: string;
}

const timeline: TimelineStep[] = [
  {
    month: "Month 1",
    title: "Foundation",
    description: "Website, CRM, ad accounts, tracking — we build the infrastructure from scratch so every dollar is measurable from day one."
  },
  {
    month: "Month 2",
    title: "Launch",
    description: "Ads go live, leads start flowing, follow-up automation is active. You start getting calls and booked jobs."
  },
  {
    month: "Month 3",
    title: "Scale",
    description: "Optimize what's working, increase budget on winners, compound results. This is where the system hits its stride."
  },
];

const AccordionItem: React.FC<{ item: FAQItem; isOpen: boolean; onClick: () => void }> = ({ item, isOpen, onClick }) => {
  return (
    <div
      className="border border-white/10 bg-black/20 backdrop-blur-sm transition-all duration-300 hover:border-accent/30"
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left gap-4"
      >
        <span className="font-sans text-sm md:text-base font-medium text-white">
          {item.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-accent shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="px-5 md:px-6 pb-5 md:pb-6 font-mono text-sm text-text-secondary leading-relaxed">
          {item.answer}
        </p>
      </div>
    </div>
  );
};

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-32 relative overflow-hidden">
      <SectionWrapper>
        <div className="max-w-4xl mx-auto px-6">
          {/* FAQ Section */}
          <div className="text-center mb-16">
            <h2 className="text-sm font-mono text-accent uppercase tracking-widest mb-4">Common Questions</h2>
            <h3 className="text-4xl md:text-5xl font-sans font-bold text-white mb-6">
              Questions Trades Owners <span className="text-accent">Ask Us</span>
            </h3>
          </div>

          <div className="space-y-3 mb-32">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                item={item}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>

          {/* How It Works Timeline */}
          <div className="text-center mb-16">
            <h2 className="text-sm font-mono text-accent uppercase tracking-widest mb-4">The Process</h2>
            <h3 className="text-4xl md:text-5xl font-sans font-bold text-white mb-6">
              How It <span className="text-accent">Works</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {timeline.map((step, index) => (
              <div
                key={index}
                className="border border-white/10 bg-black/20 backdrop-blur-sm p-6 md:p-8 relative group hover:border-accent/30 transition-all duration-300"
              >
                {/* Month label */}
                <span className="text-xs font-mono text-accent uppercase tracking-widest mb-3 block">
                  {step.month}
                </span>
                <h4 className="text-xl font-sans font-bold text-white mb-3">
                  {step.title}
                </h4>
                <p className="font-mono text-sm text-text-secondary leading-relaxed">
                  {step.description}
                </p>

                {/* Decorative accent corner */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-accent/5 to-transparent pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </section>
  );
};
