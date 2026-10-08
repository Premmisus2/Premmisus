import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xs font-mono text-accent uppercase tracking-widest mb-4">{title}</h2>
    <div className="font-mono text-sm text-gray-300 leading-relaxed space-y-3">{children}</div>
  </div>
);

export const TermsPage: React.FC = () => {
  return (
    <main className="bg-background text-text-primary relative min-h-screen">
      <Navbar />

      <section className="px-6 pb-32" style={{ paddingTop: '160px' }}>
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-16">
            <h2 className="text-xs font-mono text-accent uppercase tracking-widest mb-4">Legal</h2>
            <h1 className="text-4xl md:text-6xl font-sans font-bold text-white tracking-tighter mb-6">
              Terms of Service
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
                  These Terms of Service ("Terms") govern your use of the website at{' '}
                  <a href="https://premmisus.ca" className="text-accent hover:underline">premmisus.ca</a>{' '}
                  and your engagement with the services of Premmisus Inc. ("Premmisus," "we," "us"), a
                  corporation incorporated under the laws of Canada.
                </p>
              </Section>

              <Section title="2. Our Services">
                <p>
                  Premmisus provides marketing and automation services for businesses, including website
                  design and hosting, lead follow-up systems, missed-call text-back, review management,
                  customer reactivation, and related communication automation. The specific services,
                  deliverables, and fees for any client engagement are set out in a separate written
                  agreement between Premmisus and the client. If a client agreement conflicts with these
                  Terms, the client agreement governs.
                </p>
              </Section>

              <Section title="3. Communications and Consent">
                <p>
                  By submitting a form on this website or otherwise providing your contact details to us,
                  you consent to be contacted by Premmisus by phone, email, and SMS regarding your inquiry
                  and our services, in accordance with our{' '}
                  <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a>.
                </p>
                <p>
                  For SMS: message frequency varies, and message and data rates may apply. Reply HELP for
                  help or STOP to opt out at any time. Consent to receive messages is not a condition of
                  purchasing any goods or services.
                </p>
              </Section>

              <Section title="4. Client Ownership of Deliverables">
                <p>
                  Unless a client agreement states otherwise, upon full payment of the applicable fees,
                  clients own the websites and creative deliverables we build for them. Premmisus retains
                  ownership of its internal tools, know-how, templates, and any third-party platforms used
                  to deliver the services, which remain subject to their own license terms.
                </p>
              </Section>

              <Section title="5. No Guarantee of Results">
                <p>
                  We describe the systems we build and the mechanisms by which they operate. We do not
                  guarantee any specific business outcome, including lead volume, search rankings, review
                  counts, or revenue. Marketing results depend on factors outside any provider's control.
                </p>
              </Section>

              <Section title="6. Acceptable Use">
                <p>You agree not to misuse this website, including by:</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Submitting false or misleading information through our forms</li>
                  <li>Attempting to interfere with the website's operation or security</li>
                  <li>Scraping, reverse engineering, or copying site content for competing commercial use</li>
                </ul>
              </Section>

              <Section title="7. Limitation of Liability">
                <p>
                  To the maximum extent permitted by law, Premmisus is not liable for indirect, incidental,
                  consequential, or special damages arising from use of this website. Our total liability in
                  connection with any client engagement is limited as set out in the applicable client
                  agreement, and otherwise to the amounts paid to us for the services giving rise to the claim.
                </p>
              </Section>

              <Section title="8. Governing Law">
                <p>
                  These Terms are governed by the laws of the Province of Ontario and the federal laws of
                  Canada applicable therein. Any dispute will be resolved in the courts of Ontario, Canada.
                </p>
              </Section>

              <Section title="9. Changes to These Terms">
                <p>
                  We may update these Terms from time to time. The effective date at the top of this page
                  reflects the most recent revision. Continued use of the website after changes constitutes
                  acceptance of the updated Terms.
                </p>
              </Section>

              <Section title="10. Contact">
                <p>For any questions about these Terms, contact us at:</p>
                <p>
                  <strong className="text-white">Premmisus Inc.</strong><br />
                  700 Osgoode Dr, London, ON N6E 2G2, Canada<br />
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
