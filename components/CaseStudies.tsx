import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { CaseStudy } from '../types';

const cases: CaseStudy[] = [
  {
    id: '01',
    client: 'Canadian Roofing Co.',
    metric: 'Pipeline Value',
    value: '$380K',
    image: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?q=80&w=1740&auto=format&fit=crop',
    description: 'Generated 12 qualified residential roofing estimates in 60 days via paid social.',
    tags: ['Roofing', 'Paid Social'],
  },
  {
    id: '02',
    client: 'GTA Plumbing & Drain',
    metric: 'Lead Volume',
    value: '+149%',
    image: '/plumbing.jpg',
    description: 'Year-over-year call volume growth through a combined paid social and funnel system.',
    tags: ['Plumbing', 'Service'],
  },
  {
    id: '03',
    client: 'Property Care Business',
    metric: 'Cost Per Lead',
    value: '-42%',
    image: 'https://images.unsplash.com/photo-1482449609509-eae2a7ea42b7?w=800&auto=format&fit=crop&q=60',
    description: 'Cut acquisition costs through audience refinement and landing page optimization.',
    tags: ['Property Care', 'CRO'],
  },
  {
    id: '04',
    client: 'Handyman & Reno Co.',
    metric: 'Revenue Added',
    value: '$91K',
    image: '/handyman.jpg',
    description: 'Booked 90 days of consistent project pipeline from a standing start in 3 months.',
    tags: ['Handyman', 'Local Ads'],
  },
];

export const CaseStudies: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const scrollAmount = 480;
    containerRef.current.scrollBy({ left: direction === 'right' ? scrollAmount : -scrollAmount, behavior: 'smooth' });
  };

  return (
    <section id="work" className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-sm font-mono text-accent uppercase tracking-widest mb-4">Proven Results</h2>
          <h3 className="text-4xl md:text-5xl font-sans font-bold text-white">
            Blue Collar Data.
          </h3>
          <p className="text-xs font-mono text-text-secondary mt-3">Results anonymized to protect client privacy.</p>
        </div>
        <div className="flex gap-2">
            <button onClick={() => scroll('left')} className="w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:border-accent hover:text-accent transition cursor-pointer">←</button>
            <button onClick={() => scroll('right')} className="w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:border-accent hover:text-accent transition cursor-pointer">→</button>
        </div>
      </div>

      {/* Horizontal Slider */}
      <div 
        ref={containerRef}
        className="flex overflow-x-auto gap-6 px-6 pb-12 snap-x snap-mandatory no-scrollbar md:px-[calc((100vw-80rem)/2)]"
      >
        {cases.map((study) => (
          <motion.a
            key={study.id}
            href="#qualify"
            className="flex-shrink-0 w-[85vw] md:w-[450px] snap-center group cursor-pointer"
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Image Container - Removed bg-surface, made it transparent/seamless */}
            <div className="relative aspect-[4/5] overflow-hidden border border-white/10 mb-6">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500 z-10" />
              
              <img 
                src={study.image} 
                alt={study.client}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
              />
              
              {/* Scanline Effect overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[5] bg-[length:100%_2px,3px_100%] pointer-events-none" />

              {/* Floating Stat Card - Transparent/Glass */}
              <div className="absolute top-6 right-6 z-20 bg-black/60 backdrop-blur-md border border-white/10 p-4 min-w-[100px] text-center">
                <p className="text-xs font-mono text-text-secondary uppercase mb-1">{study.metric}</p>
                <p className="text-2xl font-bold text-accent">{study.value}</p>
              </div>

              {/* View Project Button */}
              <div className="absolute bottom-0 right-0 p-6 z-20">
                <div className="w-12 h-12 border border-white/20 bg-black/50 backdrop-blur flex items-center justify-center text-white group-hover:border-accent group-hover:text-accent transition-all">
                   <ArrowUpRight />
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="pr-4">
              <div className="flex gap-3 mb-3">
                {study.tags.map(tag => (
                   <span key={tag} className="text-[10px] font-mono border border-white/10 px-2 py-1 text-text-secondary uppercase group-hover:border-accent/30 transition-colors">{tag}</span>
                ))}
              </div>
              <h4 className="text-2xl font-sans font-bold text-white mb-2 group-hover:text-accent transition-colors">{study.client}</h4>
              <p className="text-text-secondary font-mono text-sm border-l-2 border-white/10 pl-4 group-hover:border-accent transition-colors">
                {study.description}
              </p>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};