import React from 'react';
import { PhoneMissed, MessageSquareText, Star, Repeat } from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';

const steps = [
  {
    id: "01",
    title: 'The Text-Back',
    description: 'Miss a call on your business line and the caller gets a text back automatically, in your business name, before they ring the next company on Google.',
    icon: PhoneMissed,
  },
  {
    id: "02",
    title: 'The Follow-Up',
    description: "Every form fill hits your phone by text and email the moment it lands. The customer gets a text back in your name, so they know you've got it.",
    icon: MessageSquareText,
  },
  {
    id: "03",
    title: 'The Review Engine',
    description: "After every job, your customer gets a text with your Google review link. If they don't tap it, it comes again once a week, up to four times. Every customer asked, no screening.",
    icon: Star,
  },
  {
    id: "04",
    title: 'The Comeback',
    description: 'Every two to three months for a year, past customers get a short text with an offer their friends and family can use too.',
    icon: Repeat,
  },
];

export const Methodology: React.FC = () => {
  return (
    <div id="system" className="py-20 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Left Column: Sticky Title */}
          <div className="lg:w-5/12">
            <div className="lg:sticky lg:top-32">
                <SectionWrapper>
                  <h2 className="text-xs md:text-sm font-mono text-accent uppercase tracking-widest mb-4">The System</h2>
                  <h3 className="text-3xl md:text-5xl font-sans font-bold text-white mb-6">
                    The Canadian Trades <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">Lead Engine.</span>
                  </h3>
                  <p className="text-text-secondary font-mono leading-relaxed mb-8 text-base md:text-lg">
                    Four systems running behind your website, day and night. Set up once for your trade, then working while you're on the job.
                  </p>
                  <div className="hidden lg:flex items-center gap-2 text-accent font-mono text-xs uppercase tracking-wider opacity-80">
                    <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                    System Active
                  </div>
                </SectionWrapper>
            </div>
          </div>

          {/* Right Column: Stacking Cards */}
          <div className="lg:w-7/12">
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className="sticky top-24 md:top-32 mb-6 md:mb-12 last:mb-0" 
                style={{ zIndex: idx + 1 }} 
              >
                {/* Changed bg-surface to transparent glass */}
                <div className="bg-black/40 border border-white/10 p-8 md:p-12 rounded-2xl backdrop-blur-md min-h-[240px] md:min-h-[300px] flex flex-col justify-center group transition-all duration-500 hover:border-accent/40 hover:bg-black/60 relative overflow-hidden">
                    
                    {/* Technical Corner Accents */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-white/10 rounded-tl-2xl transition-colors group-hover:border-accent/30" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-white/10 rounded-br-2xl transition-colors group-hover:border-accent/30" />

                    {/* Hover Glow */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10 relative z-10">
                        <div className="shrink-0 flex flex-col items-center md:items-start gap-2">
                           <span className="text-4xl md:text-6xl font-sans font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 group-hover:from-accent group-hover:to-accent/20 transition-all duration-500">
                            {step.id}
                           </span>
                           <div className="h-px w-12 bg-gradient-to-r from-accent/50 to-transparent" />
                        </div>
                        
                        <div className="flex-1">
                           <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-accent group-hover:bg-accent/10 group-hover:border-accent/20 transition-colors">
                                <step.icon className="w-5 h-5" />
                              </div>
                              <h4 className="text-2xl md:text-3xl font-sans font-semibold text-white tracking-tight">
                                {step.title}
                              </h4>
                           </div>
                           
                           <p className="text-text-secondary font-mono text-sm md:text-base leading-relaxed max-w-lg">
                            {step.description}
                           </p>

                           <div className="mt-6 md:mt-8 flex items-center gap-2">
                                <span className="text-[10px] font-mono text-accent/50 uppercase tracking-widest group-hover:text-accent transition-colors">
                                  System {step.id}
                                </span>
                                <div className="h-px flex-1 bg-white/5 group-hover:bg-accent/20 transition-colors" />
                           </div>
                        </div>
                    </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
