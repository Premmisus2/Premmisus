import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';
import { serviceDetails } from '../data/serviceContent';

export const Services: React.FC = () => {
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {serviceDetails.map((service, idx) => (
            <SectionWrapper key={idx} delay={idx * 0.1}>
              <Link
                to={`/services/${service.slug}`}
                className="block bg-black/40 border border-white/10 p-8 md:p-12 rounded-2xl backdrop-blur-md flex flex-col justify-center group transition-all duration-500 hover:border-accent/40 hover:bg-black/60 relative overflow-hidden"
              >
                {/* Technical Corner Accents */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-white/10 rounded-tl-2xl transition-colors group-hover:border-accent/30" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-white/10 rounded-br-2xl transition-colors group-hover:border-accent/30" />

                {/* Hover Glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Arrow */}
                <div className="absolute top-6 right-6 w-8 h-8 border border-white/10 flex items-center justify-center text-white/30 group-hover:border-accent/50 group-hover:text-accent transition-all duration-300 rounded-lg z-10">
                  <ArrowUpRight className="w-4 h-4" />
                </div>

                <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10 relative z-10">
                  <div className="shrink-0 flex flex-col items-center md:items-start gap-2">
                    <span className="text-4xl md:text-6xl font-sans font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 group-hover:from-accent group-hover:to-accent/20 transition-all duration-500">
                      {service.id}
                    </span>
                    <div className="h-px w-12 bg-gradient-to-r from-accent/50 to-transparent" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-accent group-hover:bg-accent/10 group-hover:border-accent/20 transition-colors">
                        <service.icon className="w-5 h-5" />
                      </div>
                      <h4 className="text-2xl md:text-3xl font-sans font-semibold text-white tracking-tight">
                        {service.title}
                      </h4>
                    </div>

                    <p className="text-text-secondary font-mono text-sm md:text-base leading-relaxed max-w-lg">
                      {service.tagline}
                    </p>

                    <div className="mt-6 md:mt-8 flex items-center gap-2">
                      <span className="text-[10px] font-mono text-accent/50 uppercase tracking-widest group-hover:text-accent transition-colors">
                        Service {service.id}
                      </span>
                      <div className="h-px flex-1 bg-white/5 group-hover:bg-accent/20 transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            </SectionWrapper>
          ))}
        </div>
      </div>
    </div>
  );
};
