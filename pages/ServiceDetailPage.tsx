import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

import { motion } from 'framer-motion';
import { serviceDetails } from '../data/serviceContent';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const service = serviceDetails.find((s) => s.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!service) {
    navigate('/');
    return null;
  }

  const currentIndex = serviceDetails.findIndex((s) => s.slug === slug);
  const nextService = serviceDetails[currentIndex + 1] || null;
  const prevService = serviceDetails[currentIndex - 1] || null;

  return (
    <main className="bg-background text-text-primary selection:bg-accent selection:text-black relative min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pb-24 px-6 overflow-hidden" style={{ paddingTop: '200px' }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[80px] md:text-[140px] font-sans font-bold text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-transparent leading-none block mb-4 select-none">
              {service.id}
            </span>
            <h2 className="text-xs font-mono text-accent uppercase tracking-widest mb-4">
              Service {service.id}
            </h2>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-sans font-bold text-white tracking-tighter mb-6">
              {service.title}
            </h1>
            <p className="text-xl md:text-2xl font-mono text-text-secondary max-w-2xl">
              {service.tagline}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-black/40 border border-white/10 rounded-2xl backdrop-blur-md p-8 md:p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-white/10 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-white/10 rounded-br-2xl" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <h3 className="text-xs font-mono text-accent uppercase tracking-widest mb-6">Overview</h3>
            <p className="text-base md:text-lg text-gray-300 font-mono leading-relaxed relative z-10">
              {service.overview}
            </p>
          </motion.div>
        </div>
      </section>

      {/* What's Included + How It Works */}
      <section className="py-8 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* What's Included */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-black/40 border border-white/10 rounded-2xl backdrop-blur-md p-8 md:p-10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-white/10 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-white/10 rounded-br-2xl" />
            <h3 className="text-xs font-mono text-accent uppercase tracking-widest mb-8">What's Included</h3>
            <ul className="space-y-7 relative z-10">
              {service.included.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-accent" />
                  </div>
                  <span className="font-mono text-sm text-gray-300 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-black/40 border border-white/10 rounded-2xl backdrop-blur-md p-8 md:p-10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-white/10 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-white/10 rounded-br-2xl" />
            <h3 className="text-xs font-mono text-accent uppercase tracking-widest mb-8">How It Works</h3>
            <div className="space-y-10 relative z-10">
              {service.howItWorks.map((phase, i) => (
                <div key={i} className="flex gap-8">
                  <div className="shrink-0 flex flex-col items-center">
                    <span className="text-3xl font-sans font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 leading-none mb-3">
                      0{i + 1}
                    </span>
                    {i < service.howItWorks.length - 1 && (
                      <div className="w-px flex-1 bg-white/10 mt-1" style={{ minHeight: '2rem' }} />
                    )}
                  </div>
                  <div>
                    <h4 className="text-white font-sans font-semibold text-base mb-2">{phase.step}</h4>
                    <p className="font-mono text-sm text-text-secondary leading-relaxed">{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Who It's For — full width */}
      <section className="py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-black/40 border border-white/10 rounded-2xl backdrop-blur-md p-8 md:p-10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-white/10 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-white/10 rounded-br-2xl" />
            <h3 className="text-xs font-mono text-accent uppercase tracking-widest mb-4">Who This Is For</h3>
            <p className="font-mono text-sm md:text-base text-gray-300 leading-relaxed relative z-10 max-w-3xl">
              {service.whoItsFor}
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-black/40 border border-accent/20 rounded-2xl backdrop-blur-md relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-accent/[0.03] pointer-events-none rounded-2xl" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-accent/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10 text-center px-8 py-16 md:py-20">
              <h2 className="text-xs font-mono text-accent uppercase tracking-widest mb-4">Ready to Deploy</h2>
              <h3 className="text-2xl md:text-4xl font-sans font-bold text-white mb-4 tracking-tighter">
                Let's build your system.
              </h3>
              <p className="font-mono text-text-secondary max-w-lg mx-auto mb-10 text-sm">
                Your competitors are already running systems like this. See how we can build yours.
              </p>
              <a
                href="/#qualify"
                className="neon-button inline-flex items-center gap-3 font-mono font-bold uppercase tracking-wider px-10 py-4 text-sm"
              >
                Book a Free Strategy Call
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Prev / Next Navigation */}
      {(prevService || nextService) && (
        <section className="pb-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-xs font-mono text-text-secondary uppercase tracking-widest text-center mb-6">
              Continue Exploring
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prevService ? (
                <Link
                  to={`/services/${prevService.slug}`}
                  className="group flex items-center gap-4 bg-black/40 border border-white/10 rounded-2xl p-6 hover:border-accent/40 transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4 text-text-secondary group-hover:text-accent transition-colors shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-1">Previous</div>
                    <div className="font-sans font-semibold text-white group-hover:text-accent transition-colors">{prevService.title}</div>
                  </div>
                </Link>
              ) : <div />}

              {nextService ? (
                <Link
                  to={`/services/${nextService.slug}`}
                  className="group flex items-center justify-end gap-4 bg-black/40 border border-white/10 rounded-2xl p-6 hover:border-accent/40 transition-all duration-300 text-right"
                >
                  <div>
                    <div className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-1">Next</div>
                    <div className="font-sans font-semibold text-white group-hover:text-accent transition-colors">{nextService.title}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-accent transition-colors shrink-0" />
                </Link>
              ) : <div />}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
};
