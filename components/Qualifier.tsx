import React, { useState } from 'react';
import { SectionWrapper } from './SectionWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, ChevronDown } from 'lucide-react';
import { ScannerAnimation } from './ScannerAnimation';

interface Question {
  id: number;
  text: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "Which industry describes you best?",
    options: ["Construction / General Contracting", "HVAC / Plumbing / Electrical", "Manufacturing / Logistics", "Other"]
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

const countryCodes = [
  { code: '+1', name: 'US/CA' },
  { code: '+44', name: 'UK' },
  { code: '+61', name: 'AU' },
  { code: '+49', name: 'DE' },
  { code: '+33', name: 'FR' },
  { code: '+91', name: 'IN' },
  { code: '+81', name: 'JP' },
  { code: '+86', name: 'CN' },
  { code: '+55', name: 'BR' },
  { code: '+52', name: 'MX' },
  { code: '+971', name: 'UAE' },
  { code: '+27', name: 'ZA' },
];

export const Qualifier: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isQualified, setIsQualified] = useState<boolean | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', countryCode: '+1' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const handleOptionClick = (option: string) => {
    const currentQuestion = questions[currentStep].text;
    setAnswers(prev => ({ ...prev, [currentQuestion]: option }));

    if (currentStep < questions.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const validatePhone = (num: string) => {
    // Basic validation: length check for most countries (7-15 digits)
    const digits = num.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) {
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhone(formData.phone)) {
      setPhoneError('Please enter a valid phone number');
      return;
    }
    setPhoneError('');
    setIsSubmitting(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: `${formData.countryCode}${formData.phone.replace(/\D/g, '')}`,
      industry: answers["Which industry describes you best?"],
      revenue: answers["What is your current monthly revenue?"],
      bottleneck: answers["What is your primary bottleneck?"],
      source: 'Website Qualifier Protocol'
    };

    try {
      await fetch('https://services.leadconnectorhq.com/hooks/ugg4v4G1WJMtqGcWFUp5/webhook-trigger/b74f8aec-ff76-4669-a25f-7146fa35bd50', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      setIsQualified(true);
    } catch (error) {
      console.error('Error submitting to webhook:', error);
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
              Are you ready to scale?
            </h3>
            
            <p className="text-text-secondary font-mono max-w-lg mx-auto mt-8">
              We operate on a partnership model. We do not accept every client. Use the calculator below to check availability for your territory.
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-white/10 p-8 md:p-12 min-h-[400px] flex flex-col justify-center relative overflow-hidden shadow-2xl mb-16">
            {/* Progress Bar */}
            {!isQualified && (
                <div className="absolute top-0 left-0 h-1 bg-accent transition-all duration-500" style={{ width: `${((currentStep) / (questions.length + 1)) * 100}%` }} />
            )}

            <AnimatePresence mode="wait">
              {!isQualified && currentStep < questions.length ? (
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
                      Protocol Generated
                    </h4>
                    <p className="text-sm font-mono text-text-secondary">
                      Where should we send your custom growth protocol?
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
                    <div className="flex gap-2">
                      <div className="relative group min-w-[100px]">
                        <select
                          className="w-full bg-white/5 border border-white/10 p-4 pt-1 font-mono text-sm text-white appearance-none focus:outline-none focus:border-accent transition-colors h-full"
                          value={formData.countryCode}
                          onChange={e => setFormData({...formData, countryCode: e.target.value})}
                        >
                          {countryCodes.map(c => (
                            <option key={c.code} value={c.code} className="bg-surface text-white">
                              {c.code} ({c.name})
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none group-hover:text-accent transition-colors" />
                      </div>
                      <input 
                        type="tel" 
                        required
                        placeholder="Phone Number" 
                        className={`flex-1 bg-white/5 border ${phoneError ? 'border-red-500' : 'border-white/10'} p-4 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors`}
                        value={formData.phone}
                        onChange={e => {
                          setFormData({...formData, phone: e.target.value});
                          if (phoneError) setPhoneError('');
                        }}
                      />
                    </div>
                    {phoneError && (
                      <p className="text-red-500 text-xs font-mono">{phoneError}</p>
                    )}
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-accent text-black font-mono font-bold uppercase tracking-wider p-4 hover:bg-white transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
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

          <ScannerAnimation />
        </div>
      </SectionWrapper>
    </div>
  );
};