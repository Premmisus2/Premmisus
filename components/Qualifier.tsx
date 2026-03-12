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
    options: ["Plumbing & Drain", "Roofing & Exterior", "Property Care / Cleaning", "Handyman & Renovation", "Tiling & Flooring", "Other"]
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
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', businessName: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionClick = (option: string) => {
    if (currentStep === 0 && option === 'Other') {
      setIsDisqualified(true);
      return;
    }
    const currentQuestion = questions[currentStep].text;
    setAnswers(prev => ({ ...prev, [currentQuestion]: option }));

    if (currentStep < questions.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const GHL_KEY = 'pit-9060b84c-83ba-47d9-8ad8-7d43f080721d';
    const LOCATION_ID = 'ugg4v4G1WJMtqGcWFUp5';
    const PIPELINE_ID = 'M3vmZOkpNgw7SzdZr4rY';
    const STAGE_ID = '9050e688-40df-4978-96cf-de41935cd791';
    const WORKFLOW_ID = '606fef15-6e78-4e9b-b48e-a12f5872433c';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GHL_KEY}`,
      'Version': '2021-07-28',
    };

    try {
      // 1. Create contact
      const nameParts = formData.name.trim().split(' ');
      const contactRes = await fetch('https://services.leadconnectorhq.com/contacts/', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          locationId: LOCATION_ID,
          firstName: nameParts[0],
          lastName: nameParts.slice(1).join(' ') || '',
          email: formData.email,
          phone: formData.phone,
          companyName: formData.businessName,
          source: 'Website Qualifier',
          tags: ['website-lead'],
          customFields: [
            { id: 'vShDN6Xro4OB7rNCQRU5', value: answers['Which industry describes you best?'] ?? '' },
            { id: 'bRhvYPPoorVc4PSj2QrP', value: answers['What is your current monthly revenue?'] ?? '' },
            { id: 'BS8ZhC5sYkNoku3PH59w', value: formData.businessName },
            { id: 'Kp9u8kpsPLH1ps31VR7d', value: 'Website Qualifier' },
          ],
        }),
      });
      const contactData = await contactRes.json();
      const contactId = contactData?.contact?.id;

      // 2. Add to pipeline + enroll in workflow
      if (contactId) {
        await fetch('https://services.leadconnectorhq.com/opportunities/', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            locationId: LOCATION_ID,
            pipelineId: PIPELINE_ID,
            pipelineStageId: STAGE_ID,
            contactId,
            name: `${formData.businessName} — ${answers['Which industry describes you best?'] ?? 'Website Lead'}`,
            status: 'open',
            monetaryValue: 0,
          }),
        });

        await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/workflow/${WORKFLOW_ID}`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ eventStartTime: new Date().toISOString() }),
        });
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
              {isDisqualified ? (
                <motion.div
                  key="disqualified"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center flex flex-col items-center"
                >
                  <h4 className="text-3xl font-sans font-bold text-white mb-4">Not quite a fit — yet.</h4>
                  <p className="text-text-secondary font-mono mb-8 max-w-md">
                    Our system is built specifically for Canadian trades and home service businesses. If that changes, we'd love to work with you.
                  </p>
                  <a
                    href="/contact"
                    className="border border-white/20 text-text-secondary font-mono text-sm uppercase tracking-widest py-3 px-8 hover:border-accent hover:text-accent transition-colors"
                  >
                    Get in Touch Anyway
                  </a>
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
                    <div>
                      <textarea
                        required
                        placeholder="Brief description of your business and what you're looking to achieve"
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 p-4 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors resize-none"
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
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