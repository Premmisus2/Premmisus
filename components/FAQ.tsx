import React, { useState } from 'react';
import { SectionWrapper } from './SectionWrapper';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

// Co-authored with Elliott 2026-10-24. Every answer is checked against the Client Agreement
// (pages/ClientAgreementPage.tsx) and the locked offer: no prices (the agreement sets them at
// checkout or in a written quote), no results promised, no "performance-based".
const faqItems: FAQItem[] = [
  {
    question: "I get all my work from referrals. Why would I need this?",
    answer: "Referrals are great, and this doesn't replace them. It catches the work that slips past you: the call you couldn't answer, the form you saw too late, the review nobody asked for. The past-customer texts even carry an offer your customers can pass on to friends and family."
  },
  {
    question: "I've been burned by a marketing agency before.",
    answer: "We don't sell you clicks or reports. We set up four systems that each do one job, you see each one working on your own phone before it goes live, and it's month to month. If it isn't working for you, you cancel by email."
  },
  {
    question: "How much does this cost?",
    answer: "It depends on which systems you want. It's a monthly price, month to month, and we'll give you the exact number on a short call."
  },
  {
    question: "How long does it take to set up?",
    answer: "Most setups are ready within about 14 days of your first payment and of us getting what we need from you: your logo, photos, services, hours and service area."
  },
  {
    question: "What makes you different from other agencies?",
    answer: "We set up systems that catch the work you already get, instead of selling you more ad spend. You see everything working before it goes live. And the founder builds it."
  },
  {
    question: "Do I need to be tech-savvy?",
    answer: "Not at all. We set it up and run it for you. If you can read a text message, you're set."
  },
  {
    question: "What if it doesn't work for me?",
    answer: "We don't promise results we can't back up. It's month to month, so if it isn't working for you, cancel by email and you won't be charged again."
  },
  {
    question: "Will the texts go out in my business name?",
    answer: "Yes. Every text identifies your business and how to reach you, and anyone can reply STOP to opt out. We only text people who have dealt with your business, the way Canada's anti-spam law (CASL) requires."
  },
  {
    question: "Do you only work in London, Ontario?",
    answer: "No. We work with businesses across Canada. The call and the setup all happen online."
  },
];

interface TimelineStep {
  label: string;
  title: string;
  description: string;
}

const timeline: TimelineStep[] = [
  {
    label: "Step 1",
    title: "A short call",
    description: "We talk through how calls and requests reach you today, and which systems you want."
  },
  {
    label: "Step 2",
    title: "Built in about 14 days",
    description: "Built around your business, and you see every piece working on your own phone before a customer does."
  },
  {
    label: "Step 3",
    title: "It runs",
    description: "It works in the background while you're on the job. When you want a message or a setting changed, you tell us and we change it."
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
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
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
    <section id="faq" className="py-32 relative overflow-hidden">
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
                {/* Step label */}
                <span className="text-xs font-mono text-accent uppercase tracking-widest mb-3 block">
                  {step.label}
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
