import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SectionWrapper } from '../components/SectionWrapper';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const GHL_KEY = 'pit-5e9f78ef-6844-437c-8ab1-e3bea48ba900';
    const LOCATION_ID = 'ugg4v4G1WJMtqGcWFUp5';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GHL_KEY}`,
      'Version': '2021-07-28',
    };

    try {
      const nameParts = formData.name.trim().split(' ');
      await fetch('https://services.leadconnectorhq.com/contacts/', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          locationId: LOCATION_ID,
          firstName: nameParts[0],
          lastName: nameParts.slice(1).join(' ') || '',
          email: formData.email,
          source: 'Website Contact Form',
          tags: ['contact-form'],
          customFields: [
            { id: 'Kp9u8kpsPLH1ps31VR7d', value: 'Website Contact Form' },
          ],
        }),
      });
    } catch (error) {
      console.error('GHL submission error:', error);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <main className="bg-background text-text-primary relative min-h-screen">
      <Navbar />

      <section className="py-32 relative overflow-hidden" style={{ paddingTop: '160px' }}>
        <SectionWrapper>
          <div className="max-w-2xl mx-auto px-6 relative z-10">

            <div className="text-center mb-16">
              <h2 className="text-sm font-mono text-accent uppercase tracking-widest mb-4">Get In Touch</h2>
              <h3 className="text-3xl md:text-5xl font-sans font-bold text-white mb-6">
                Contact Us
              </h3>
              <p className="text-text-secondary font-mono max-w-md mx-auto">
                Have a question? Reach us directly at{' '}
                <a href="mailto:contact@premmisus.com" className="text-accent hover:underline">
                  contact@premmisus.com
                </a>{' '}
                or use the form below.
              </p>
            </div>

            <div
              className="bg-black/40 backdrop-blur-md border border-accent/20 p-8 md:p-12 min-h-[400px] flex flex-col justify-center relative overflow-hidden"
              style={{ borderRadius: '16px', boxShadow: '0 0 40px rgba(0, 240, 255, 0.12), 0 0 80px rgba(0, 240, 255, 0.05)' }}
            >
              {/* Accent top line */}
              <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-accent/60 via-accent/20 to-transparent" style={{ borderRadius: '16px 16px 0 0' }} />

              {/* Subtle inner glow */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-32 bg-accent/5 blur-3xl pointer-events-none" />

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 relative z-10"
                  >
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      className="w-full bg-white/5 border border-white/10 p-4 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      className="w-full bg-white/5 border border-white/10 p-4 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                    <textarea
                      required
                      placeholder="Your message..."
                      rows={5}
                      className="w-full bg-white/5 border border-white/10 p-4 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors resize-none"
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-accent text-black font-mono font-bold uppercase tracking-wider p-4 hover:bg-white transition-colors flex justify-center items-center gap-2 disabled:opacity-70 neon-button"
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Message'}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center flex flex-col items-center relative z-10"
                  >
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent mb-6 border border-accent/50">
                      <Check className="w-8 h-8" />
                    </div>
                    <h4 className="text-3xl font-sans font-bold text-white mb-4">Message Received.</h4>
                    <p className="text-text-secondary font-mono mb-2 max-w-sm">
                      We've received your message and will be in touch shortly.
                    </p>
                    <p className="text-text-secondary font-mono text-xs mb-8">
                      You can also reach us directly at{' '}
                      <a href="mailto:contact@premmisus.com" className="text-accent hover:underline">
                        contact@premmisus.com
                      </a>
                    </p>
                    <a
                      href="/"
                      className="border border-accent text-accent font-mono font-bold uppercase py-4 px-12 hover:bg-accent hover:text-black transition-colors"
                    >
                      Back to Home
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </SectionWrapper>
      </section>

      <Footer />
    </main>
  );
};
