import React from 'react';
import { Button } from './Button';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    // Removed bg-background, made border more subtle
    <footer className="pt-32 pb-12 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-accent/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start mb-24 gap-12">
          <div className="max-w-xl">
            <h2 className="text-5xl md:text-7xl font-sans font-bold text-white mb-8 tracking-tighter">
              Ready to <span className="text-accent">dominate</span> your niche?
            </h2>
            <p className="text-text-secondary font-mono text-lg mb-8 max-w-md">
              We only work with 5 new partners per quarter to ensure maximum attention and results.
            </p>
            <Button withArrow className="bg-accent text-black text-lg py-6 px-10 border-none hover:bg-white hover:text-black">
              Apply for Partnership
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-12 md:gap-24">
            <div>
              <h4 className="font-mono text-sm text-white font-bold uppercase mb-6">Socials</h4>
              <ul className="space-y-4 font-mono text-sm text-text-secondary">
                <li><a href="#" className="hover:text-accent transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Twitter</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-sm text-white font-bold uppercase mb-6">Company</h4>
              <ul className="space-y-4 font-mono text-sm text-text-secondary">
                <li><a href="#" className="hover:text-accent transition-colors">About</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
          <div className="flex items-center gap-2">
            <Logo className="scale-75 origin-left" />
          </div>
          <p className="font-mono text-xs text-zinc-600">
            © {new Date().getFullYear()} Premmisus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};