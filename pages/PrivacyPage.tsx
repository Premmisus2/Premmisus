import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xs font-mono text-accent uppercase tracking-widest mb-4">{title}</h2>
    <div className="font-mono text-sm text-gray-300 leading-relaxed space-y-3">{children}</div>
  </div>
);

export const PrivacyPage: React.FC = () => {
  return (
    <main className="bg-background text-text-primary relative min-h-screen">
      <Navbar />

      <section className="px-6 pb-32" style={{ paddingTop: '160px' }}>
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-16">
            <h2 className="text-xs font-mono text-accent uppercase tracking-widest mb-4">Legal</h2>
            <h1 className="text-4xl md:text-6xl font-sans font-bold text-white tracking-tighter mb-6">
              Privacy Policy
            </h1>
            <p className="font-mono text-sm text-text-secondary">
              Effective Date: {new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Card */}
          <div className="bg-black/40 border border-white/10 rounded-2xl backdrop-blur-md p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-white/10 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-white/10 rounded-br-2xl" />

            <div className="relative z-10">

              <Section title="1. Who We Are">
                <p>
                  Premmisus ("we," "us," or "our") is a Canadian marketing agency operating at{' '}
                  <a href="https://premmisus.ca" className="text-accent hover:underline">premmisus.ca</a>.
                  We are committed to protecting the personal information of individuals who interact with our website
                  in accordance with the <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA)
                  and Canada's Anti-Spam Legislation (CASL).
                </p>
                <p>
                  For privacy-related inquiries, contact us at:{' '}
                  <a href="mailto:contact@premmisus.com" className="text-accent hover:underline">contact@premmisus.com</a>
                </p>
              </Section>

              <Section title="2. Information We Collect">
                <p>When you submit our qualification form, we collect the following personal information:</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Business qualification responses (industry, revenue range, primary bottleneck)</li>
                </ul>
                <p>
                  We also collect standard technical data automatically (IP address, browser type, pages visited)
                  through our hosting and analytics infrastructure for security and performance purposes.
                </p>
              </Section>

              <Section title="3. Why We Collect It">
                <p>We use your personal information solely to:</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Respond to your inquiry about our services</li>
                  <li>Determine whether our services are a fit for your business</li>
                  <li>Contact you via email or phone to schedule a discovery call</li>
                  <li>Send you relevant follow-up communications (with your consent)</li>
                </ul>
                <p>We do not sell, rent, or trade your personal information to third parties.</p>
              </Section>

              <Section title="4. Third-Party Services">
                <p>
                  Your form submission data is processed and stored using{' '}
                  <strong className="text-white">GoHighLevel (LeadConnector)</strong>, our CRM platform.
                  GoHighLevel processes data on our behalf under a data processing agreement. Their privacy policy
                  is available at{' '}
                  <span className="text-accent">gohighlevel.com</span>.
                </p>
                <p>
                  We may also use standard analytics tools (such as Google Analytics) to understand website
                  traffic patterns. These tools may set cookies on your device.
                </p>
              </Section>

              <Section title="5. Your Consent (CASL)">
                <p>
                  By submitting our qualification form, you provide express consent to receive commercial electronic
                  messages (email, SMS) from Premmisus related to our services. This consent is obtained at the
                  point of form submission via an explicit acknowledgment.
                </p>
                <p>
                  You may withdraw your consent and unsubscribe from communications at any time by replying
                  "STOP" to any SMS, clicking "Unsubscribe" in any email, or contacting us directly at{' '}
                  <a href="mailto:contact@premmisus.com" className="text-accent hover:underline">contact@premmisus.com</a>.
                </p>
              </Section>

              <Section title="6. Data Retention">
                <p>
                  We retain your personal information for as long as necessary to fulfill the purposes described
                  in this policy, or as required by law. If you do not become a client, your data is retained
                  for up to 12 months from the date of submission and then securely deleted.
                </p>
              </Section>

              <Section title="7. Your Rights">
                <p>Under PIPEDA, you have the right to:</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your data (subject to legal retention obligations)</li>
                  <li>Withdraw consent to marketing communications at any time</li>
                  <li>File a complaint with the Office of the Privacy Commissioner of Canada</li>
                </ul>
                <p>
                  To exercise any of these rights, contact us at{' '}
                  <a href="mailto:contact@premmisus.com" className="text-accent hover:underline">contact@premmisus.com</a>.
                  We will respond within 30 days.
                </p>
              </Section>

              <Section title="8. Security">
                <p>
                  We implement industry-standard security measures to protect your personal information,
                  including encrypted data transmission (HTTPS) and access controls on our CRM platform.
                  No method of transmission over the internet is 100% secure, but we take all reasonable
                  precautions to protect your data.
                </p>
              </Section>

              <Section title="9. Changes to This Policy">
                <p>
                  We may update this Privacy Policy from time to time. The effective date at the top of
                  this page will reflect the most recent revision. Continued use of our website after
                  any changes constitutes acceptance of the updated policy.
                </p>
              </Section>

              <Section title="10. Contact">
                <p>
                  For any questions or concerns about this Privacy Policy or our data practices, contact us at:
                </p>
                <p>
                  <strong className="text-white">Premmisus</strong><br />
                  <a href="mailto:contact@premmisus.com" className="text-accent hover:underline">contact@premmisus.com</a>
                </p>
              </Section>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};
