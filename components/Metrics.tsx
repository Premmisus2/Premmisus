import React from 'react';
import { SectionWrapper } from './SectionWrapper';

export const Metrics: React.FC = () => {
  return (
    <div id="metrics" className="py-12 md:py-16 relative">
      <SectionWrapper>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
          
          {/* Text Section - Narrower & Compact */}
          <div className="w-full md:w-auto md:max-w-xs shrink-0">
             <h2 className="text-[10px] font-mono text-accent uppercase tracking-widest mb-2">Total Transparency</h2>
             <h3 className="text-xl md:text-2xl font-sans font-bold text-white mb-3">
               If we can't track it, <br/> we don't do it.
             </h3>
             <p className="text-text-secondary font-mono mb-4 leading-relaxed text-xs">
               We utilize Server-Side GA4 tracking and offline conversion events. We know exactly which ad creative generated the lead that signed the $50k contract.
             </p>
             <ul className="space-y-2 font-mono text-[10px] text-white">
                <li className="flex items-center gap-2">
                   <div className="w-1 h-1 bg-accent" />
                   Real-time CPA Monitoring
                </li>
                <li className="flex items-center gap-2">
                   <div className="w-1 h-1 bg-accent" />
                   CRM Integration (HubSpot, Pipedrive)
                </li>
                <li className="flex items-center gap-2">
                   <div className="w-1 h-1 bg-accent" />
                   Weekly Strategy Audits
                </li>
             </ul>
          </div>
          
          {/* Live Dashboard - Larger & Prominent */}
          <div className="w-full md:flex-1 relative max-w-2xl">
             {/* Abstract Dashboard Visualization */}
             <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-6 md:p-8 relative z-10 rounded-xl">
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                   <span className="font-mono text-xs text-text-secondary">Live Campaign Data</span>
                   <div className="flex gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="font-mono text-xs text-green-500">Active</span>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                   <div className="bg-black/20 p-4 border border-white/5 rounded-lg">
                      <div className="text-xs text-text-secondary mb-1">Total Leads</div>
                      <div className="text-2xl font-bold text-white">427</div>
                      <div className="text-xs text-green-400 mt-1">↑ 12% vs last mo</div>
                   </div>
                   <div className="bg-black/20 p-4 border border-white/5 rounded-lg">
                      <div className="text-xs text-text-secondary mb-1">Cost Per Lead</div>
                      <div className="text-2xl font-bold text-white">$24.10</div>
                      <div className="text-xs text-green-400 mt-1">↓ 18% optimized</div>
                   </div>
                </div>

                <div className="h-32 flex items-end justify-between gap-1 opacity-50">
                   {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                      <div key={i} className="w-full bg-accent rounded-t-sm" style={{ height: `${h}%` }} />
                   ))}
                </div>
             </div>
             
             {/* Glow behind dashboard */}
             <div className="absolute -top-10 -right-10 w-full h-full bg-accent/5 blur-3xl -z-10" />
          </div>

        </div>
      </SectionWrapper>
    </div>
  );
};