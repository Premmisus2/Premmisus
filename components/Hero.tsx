import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { AnimatedLogos } from './AnimatedLogos';

export const Hero: React.FC = () => {
  const pairs = [
    { first: "REVENUE", second: "SYSTEMS." },
    { first: "PREDICTABLE", second: "PIPELINES." },
    { first: "SCALING", second: "ENGINES." }
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % pairs.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 md:pt-32 overflow-hidden">
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-accent/30 bg-accent/5 backdrop-blur-sm mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-[pulse_1.5s_infinite]" />
          <span className="text-xs font-mono text-accent tracking-widest uppercase">Ontario Industrial & Trades Only</span>
        </motion.div>

        <div className="flex flex-col items-center text-center mb-8 w-full">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-sans font-medium tracking-tighter leading-[1.1] uppercase w-full">
            <span className="text-white block mb-2">WE ENGINEER</span>
            
            <div className="relative h-[1.2em] overflow-hidden w-full flex justify-center"> 
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-row justify-center gap-2 md:gap-5 w-full"
                >
                  {/* First Word - White */}
                  <span className="text-white">
                    {pairs[index].first}
                  </span>
                  {/* Second Word - Gradient */}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">
                    {pairs[index].second}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </h1>
        </div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl text-base md:text-lg text-text-secondary mb-10 font-mono leading-relaxed px-4"
        >
          Predictable lead acquisition for Ontario's <span className="text-white font-bold">HVAC, Construction, and Manufacturing</span> leaders.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button withArrow>Deploy the System</Button>
          <Button variant="outline">View The Data</Button>
        </motion.div>
      </div>

      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="w-full py-6 mt-20 relative z-10">
          <div className="text-center mb-4">
             <span className="text-xs font-mono text-text-secondary uppercase tracking-[0.3em]">
                Powered by Trusted Infrastructure
             </span>
          </div>
          <AnimatedLogos />
        </div>
      </motion.div>
    </section>
  );
};