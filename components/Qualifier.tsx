import React, { useState } from 'react';
import { SectionWrapper } from './SectionWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "Which industry describes you best?",
    options: ["Plumbing & Drain", "Roofing & Exterior", "Property Care / Cleaning", "Handyman & Renovation", "Landscaping", "Electrical", "HVAC", "Other"]
  },
  {
    id: 2,
    text: "What is your current monthly revenue?",
    options: ["Under $50k", "$50k - $150k", "$150k - $500k", "$500k+"]
  },
  {
    id: 3,
    text: "What is your primary bottleneck?",
    options: ["Not enough leads", "Poor lead quality", "Can't track ROI", "Need automated follow-up"]
  }
];

export const Qualifier: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isQualified, setIsQualified] = useState<boolean | null>(null);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherIndustry, setOtherIndustry] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', businessName: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionClick = (option: string) => {
    if (currentStep === 0 && option === 'Other') {
      setShowOtherInput(true);
      return;
    }
    const currentQuestion = questions[currentStep].text;
    setAnswers(prev => ({ ...prev, [currentQuestion]: option }));

    if (currentStep < questions.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleOtherSubmit = () => {
    if (!otherIndustry.trim()) return;
    const currentQuestion = questions[currentStep].text;
    setAnswers(prev => ({ ...prev, [currentQuestion]: `Other: ${otherIndustry}` }));
    setShowOtherInput(false);
    setCurrentStep(prev => prev + 1);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/ghl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, answers, source: 'Website Qualifier' }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error('GHL submission failed:', res.status, errData);
      }

      setIsQualified(true);
    } catch (error) {
      console.error('GHL submission error:', error);
      setIsQualified(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="qualify" className="py-32 relative overflow-hidden">
      <SectionWrapper>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-sm font-mono text-accent uppercase tracking-widest mb-4">Capacity Audit</h2>
            <h3 className="text-3xl md:text-5xl font-sans font-bold text-white mb-6">
              See If We Can Help
            </h3>
            
            <p className="text-text-secondary font-mono max-w-lg mx-auto mt-8">
              We work exclusively with Canadian trades businesses. Answer a few quick questions and we'll be in touch.
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-white/10 p-8 md:p-12 min-h-[400px] flex flex-col justify-center relative overflow-hidden shadow-2xl mb-16">
            {/* Progress Bar */}
            {!isQualified && (
                <div className="absolute top-0 left-0 h-1 bg-accent transition-all duration-500" style={{ width: `${((currentStep) / (questions.length + 1)) * 100}%` }} />
            )}

            <AnimatePresence mode="wait">
              {showOtherInput ? (
                <motion.div
                  key="other-input"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center flex flex-col items-center max-w-md mx-auto"
                >
                  <h4 className="text-2xl font-sans font-bold text-white mb-4">Tell us your industry</h4>
                  <p className="text-text-secondary font-mono mb-6 text-sm">
                    We work with all kinds of trades and service businesses.
                  </p>
                  <input
                    type="text"
                    placeholder="e.g. Painting, Fencing, Electrical..."
                    className="w-full bg-white/5 border border-white/10 p-4 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors mb-4"
                    value={otherIndustry}
                    onChange={e => setOtherIndustry(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleOtherSubmit()}
                  />
                  <button
                    onClick={handleOtherSubmit}
                    className="w-full bg-accent text-black font-mono font-bold uppercase tracking-wider p-4 hover:bg-white transition-colors neon-button"
                  >
                    Continue
                  </button>
                </motion.div>
              ) : !isQualified && currentStep < questions.length ? (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <span className="text-xs font-mono text-text-secondary mb-4 block">Question {currentStep + 1} of {questions.length}</span>
                  <h4 className="text-2xl md:text-3xl font-sans font-bold text-white mb-8">
                    {questions[currentStep].text}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {questions[currentStep].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(option)}
                        className="p-4 text-left border border-white/10 hover:border-accent hover:bg-white/5 hover:text-accent transition-all duration-200 font-mono text-sm text-text-secondary"
                      >
                        <span className="mr-3 text-white/20">0{idx + 1}</span>
                        {option}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : !isQualified && currentStep === questions.length ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-md mx-auto"
                >
                  <div className="text-center mb-8">
                    <h4 className="text-2xl font-sans font-bold text-white mb-2">
                      Almost There
                    </h4>
                    <p className="text-sm font-mono text-text-secondary">
                      Takes 30 seconds. We'll reach out within 24 hours.
                    </p>
                  </div>
                  
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <input 
                        type="text" 
                        required
                        placeholder="Full Name" 
                        className="w-full bg-white/5 border border-white/10 p-4 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <input 
                        type="email" 
                        required
                        placeholder="Email Address" 
                        className="w-full bg-white/5 border border-white/10 p-4 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        placeholder="Phone Number"
                        className="w-full bg-white/5 border border-white/10 p-4 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Business Name"
                        className="w-full bg-white/5 border border-white/10 p-4 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors"
                        value={formData.businessName}
                        onChange={e => setFormData({...formData, businessName: e.target.value})}
                      />
                    </div>
                    <p className="text-[11px] font-mono text-text-secondary leading-relaxed text-center px-2">
                      By submitting, you consent to receive commercial communications from Premmisus via email and SMS. You may unsubscribe at any time.{' '}
                      <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a>.
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-accent text-black font-mono font-bold uppercase tracking-wider p-4 hover:bg-white transition-colors flex justify-center items-center gap-2 disabled:opacity-70 neon-button"
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Get My Protocol'}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent mb-6 border border-accent/50">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-3xl font-sans font-bold text-white mb-4">You are eligible for a Growth Protocol.</h4>
                  <p className="text-text-secondary font-mono mb-8 max-w-md">
                    Based on your answers, your business structure fits our scaling parameters. We have received your information and will be in touch shortly.
                  </p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="border border-accent text-accent font-mono font-bold uppercase py-4 px-12 hover:bg-accent hover:text-black transition-colors"
                  >
                    Return Home
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </SectionWrapper>
    </div>
  );
};