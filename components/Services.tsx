import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';
import { serviceDetails } from '../data/serviceContent';

export const Services: React.FC = () => {
  // Bento order: 01, 02, 03 in top row (01 first + most prominent); 04, 05 in bottom row
  const topRow = [serviceDetails[0], serviceDetails[1], serviceDetails[2]];
  const bottomRow = [serviceDetails[3], serviceDetails[4]];

  return (
    <div id="services" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionWrapper>
          <div className="mb-16">
            <h2 className="text-sm font-mono text-accent uppercase tracking-widest mb-4">Our Protocol</h2>
            <h3 className="text-4xl md:text-5xl font-sans font-bold text-white max-w-2xl">
              A holistic ecosystem for aggressive scaling.
            </h3>
          </div>
        </SectionWrapper>

        <div className="flex flex-col gap-3">

          {/* Top row — 3 portrait cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {topRow.map((service) => {
              const isPrimary = service.id === '01';
              return (
                <SectionWrapper key={service.id}>
                  <Link
                    to={`/services/${service.slug}`}
                    className={`block p-8 md:p-10 rounded-2xl backdrop-blur-md flex flex-col justify-between group transition-all duration-500 relative overflow-hidden min-h-[320px] border ${
                      isPrimary
                        ? 'bg-black/60 border-accent/40 shadow-[0_0_40px_rgba(0,240,255,0.07)]'
                        : 'bg-black/40 border-white/10 hover:border-accent/40 hover:bg-black/60'
                    }`}
                  >
                    {/* Corner accents */}
                    <div className={`absolute top-0 left-0 w-16 h-16 border-t border-l rounded-tl-2xl transition-colors ${isPrimary ? 'border-accent/40' : 'border-white/10 group-hover:border-accent/30'}`} />
                    <div className={`absolute bottom-0 right-0 w-16 h-16 border-b border-r rounded-br-2xl transition-colors ${isPrimary ? 'border-accent/40' : 'border-white/10 group-hover:border-accent/30'}`} />

                    {/* Primary glow */}
                    {isPrimary && (
                      <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    )}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Arrow */}
                    <div className={`absolute top-6 right-6 w-8 h-8 border flex items-center justify-center transition-all duration-300 rounded-lg z-10 ${isPrimary ? 'border-accent/50 text-accent' : 'border-white/10 text-white/30 group-hover:border-accent/50 group-hover:text-accent'}`}>
                      <ArrowUpRight className="w-4 h-4" />
                    </div>

                    <div className="flex flex-col gap-6 relative z-10 h-full">
                      <div className="flex items-start gap-4">
                        <span className={`text-5xl font-sans font-bold text-transparent bg-clip-text bg-gradient-to-b transition-all duration-500 ${isPrimary ? 'from-accent to-accent/20' : 'from-white to-white/20 group-hover:from-accent group-hover:to-accent/20'}`}>
                          {service.id}
                        </span>
                        <div className={`p-2 rounded-lg border transition-colors ${isPrimary ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-white/5 border-white/5 text-accent group-hover:bg-accent/10 group-hover:border-accent/20'}`}>
                          <service.icon className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <h4 className="text-xl md:text-2xl font-sans font-semibold text-white tracking-tight mb-3">
                          {service.title}
                        </h4>
                        <p className="text-text-secondary font-mono text-sm leading-relaxed">
                          {service.tagline}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-auto">
                        <span className={`text-[10px] font-mono uppercase tracking-widest transition-colors ${isPrimary ? 'text-accent' : 'text-accent/50 group-hover:text-accent'}`}>
                          Service {service.id}
                        </span>
                        <div className={`h-px flex-1 transition-colors ${isPrimary ? 'bg-accent/20' : 'bg-white/5 group-hover:bg-accent/20'}`} />
                      </div>
                    </div>
                  </Link>
                </SectionWrapper>
              );
            })}
          </div>

          {/* Bottom row — 2 landscape cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bottomRow.map((service, idx) => (
              <SectionWrapper key={service.id} delay={idx * 0.1}>
                <Link
                  to={`/services/${service.slug}`}
                  className="block bg-black/40 border border-white/10 p-8 md:p-10 rounded-2xl backdrop-blur-md flex flex-col justify-between group transition-all duration-500 hover:border-accent/40 hover:bg-black/60 relative overflow-hidden min-h-[200px]"
                >
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-white/10 rounded-tl-2xl transition-colors group-hover:border-accent/30" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-white/10 rounded-br-2xl transition-colors group-hover:border-accent/30" />

                  {/* Hover glow */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Arrow */}
                  <div className="absolute top-6 right-6 w-8 h-8 border border-white/10 flex items-center justify-center text-white/30 group-hover:border-accent/50 group-hover:text-accent transition-all duration-300 rounded-lg z-10">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>

                  <div className="flex flex-row items-center gap-6 relative z-10">
                    <span className="text-5xl md:text-6xl font-sans font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 group-hover:from-accent group-hover:to-accent/20 transition-all duration-500 shrink-0">
                      {service.id}
                    </span>
                    <div className="h-12 w-px bg-white/10 group-hover:bg-accent/20 transition-colors shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-accent group-hover:bg-accent/10 group-hover:border-accent/20 transition-colors">
                          <service.icon className="w-5 h-5" />
                        </div>
                        <h4 className="text-xl md:text-2xl font-sans font-semibold text-white tracking-tight">
                          {service.title}
                        </h4>
                      </div>
                      <p className="text-text-secondary font-mono text-sm leading-relaxed">
                        {service.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-6 relative z-10">
                    <span className="text-[10px] font-mono text-accent/50 uppercase tracking-widest group-hover:text-accent transition-colors">
                      Service {service.id}
                    </span>
                    <div className="h-px flex-1 bg-white/5 group-hover:bg-accent/20 transition-colors" />
                  </div>
                </Link>
              </SectionWrapper>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
