import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

// Client Agreement (Canada). Clients accept it by ticking the required box at
// checkout, so this page IS the contract for every Canadian client.
// Source text: Premmisus/Legal/client-agreement-ca.md. Change both together,
// bump the date, and email existing clients 30 days before a change that
// affects them (section 13).

const EMAIL = 'elliott@premmisus.com';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xs font-mono text-accent uppercase tracking-widest mb-4">{title}</h2>
    <div className="font-mono text-sm text-gray-300 leading-relaxed space-y-3">{children}</div>
  </div>
);

const List: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ul className="list-disc pl-5 space-y-2">{children}</ul>
);

const Mail = () => (
  <a href={`mailto:${EMAIL}`} className="text-accent hover:underline">{EMAIL}</a>
);

export const ClientAgreementPage: React.FC = () => {
  return (
    <main className="bg-background text-text-primary relative min-h-screen">
      <Navbar />

      <section className="px-6 pb-32" style={{ paddingTop: '160px' }}>
        <div className="max-w-3xl mx-auto">

          <div className="mb-16">
            <h2 className="text-xs font-mono text-accent uppercase tracking-widest mb-4">Legal</h2>
            <h1 className="text-4xl md:text-6xl font-sans font-bold text-white tracking-tighter mb-6">
              Client Agreement
            </h1>
            <p className="font-mono text-sm text-text-secondary">
              Version 1. Effective Date: October 19, 2026
            </p>
            <p className="font-mono text-sm text-text-secondary mt-3">
              The agreement between your business and Premmisus. Month to month, in plain English.
            </p>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-2xl backdrop-blur-md p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-white/10 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-white/10 rounded-br-2xl" />

            <div className="relative z-10">

              <Section title="The short version">
                <List>
                  <li>Month to month. No long-term commitment. Cancel any time by email. Your service runs to the end of the month you've paid for, and you're not charged again.</li>
                  <li>Your first payment is your first month plus a one-time setup fee. After that, your card is charged the monthly price automatically, every month, until you cancel.</li>
                  <li>You own your domain, your content and your customer data.</li>
                  <li>We don't promise specific results.</li>
                  <li>Before our systems text your customers, you need the right permission from them. That part is your responsibility.</li>
                  <li>Ticking "I agree" at checkout is your signature.</li>
                </List>
              </Section>

              <Section title="1. Who this agreement is between">
                <p>
                  This Client Agreement is between Premmisus Inc., a Canadian corporation ("Premmisus", "we", "us"), and the
                  business that buys our services ("you"). The service is for business use. By accepting, you confirm you're
                  buying it for your business, not for personal or household use.
                </p>
              </Section>

              <Section title="2. How you accept">
                <p>
                  You accept this agreement by ticking the box at checkout and paying, or by signing it. That counts as your
                  signature. If you accept for a business, you confirm you're allowed to.
                </p>
                <p>
                  Your order is the package and price shown at checkout, or in a written quote from us. If your order and this
                  agreement disagree on the package or the price, your order wins.
                </p>
              </Section>

              <Section title="3. What we provide">
                <List>
                  <li>
                    <strong className="text-white">Presence:</strong> a website built on our platform, hosting, a quote form, an
                    automatic alert to you when a new lead comes in, and small edits and updates to your site (changes to text,
                    photos, hours and services, not redesigns or new pages).
                  </li>
                  <li>
                    <strong className="text-white">Reputation:</strong> everything in Presence, plus an automatic text reply to new
                    leads, a text back to anyone whose call you miss, a Google review request to your customers after each job,
                    and seasonal check-ins with past customers. We set these up and manage them for you.
                  </li>
                  <li>
                    <strong className="text-white">Booking Machine:</strong> everything in Reputation, plus online booking with
                    reminders and instant quotes, a login to the system, and training on how to use it.
                  </li>
                </List>
                <p>
                  Not included unless we agree in writing: ads and ad spend, SEO, an AI receptionist, custom development, and any
                  third-party subscriptions you choose to add.
                </p>
              </Section>

              <Section title="4. Getting started">
                <p>
                  To build your system we need your business details, logo, photos, services, hours and service area. Most setups
                  are ready within about 14 days of your first payment and of us receiving what we need from you.
                </p>
                <p>
                  Some carriers require business texting numbers to be registered before texts can go out. Where they do, we file
                  that registration for you as part of setup. Texts start once it's approved, and we don't control how long
                  carriers take. Until then, new leads reach you by email.
                </p>
              </Section>

              <Section title="5. Fees and payment">
                <List>
                  <li>Prices are in Canadian dollars and don't include GST/HST, which we add where it applies.</li>
                  <li>
                    Your first payment is your first month plus a one-time setup fee.{' '}
                    <strong className="text-white">By paying, you agree to a monthly subscription that renews automatically.</strong>{' '}
                    After that, your card is charged the monthly price in advance, on the same date each month, until you cancel.
                  </li>
                  <li>The setup fee isn't refundable once we've started building.</li>
                  <li>
                    If a payment fails, we'll let you know and try again. If it's still unpaid 14 days later, we may pause your
                    service until it's paid.
                  </li>
                  <li>
                    We'll give you at least 30 days' notice by email before we change your price. You can cancel before the new
                    price applies.
                  </li>
                  <li>
                    If you think a charge is wrong, email us within 30 days and we'll sort it out. Please talk to us before you
                    dispute a charge with your bank.
                  </li>
                  <li>
                    A dispute doesn't cancel this agreement or what you owe. We may pause your service while it's open, and if you
                    disputed a charge you authorized, you'll cover the dispute fee our payment processor charges us.
                  </li>
                </List>
              </Section>

              <Section title="6. Cancelling or pausing">
                <p>
                  You can cancel any time by emailing <Mail />. Your service runs until the end of the month you've already paid
                  for, and you won't be charged again. We don't refund partial months.
                </p>
                <p>
                  We can end this agreement with 30 days' notice by email, or right away if you don't pay, break section 7, or use
                  the service for anything illegal.
                </p>
                <p>
                  We may also pause any part of the service right away if a payment is overdue, a carrier or platform flags your
                  messages, or we believe a text lacks permission or breaks the law. We'll tell you why.
                </p>
                <p>
                  When it ends, we switch off the systems. Ask within 60 days and we'll send you your content and customer data in
                  a standard format, such as a spreadsheet. After that, we may delete it. Your domain stays yours, and we'll help
                  you point it somewhere else. Your website runs on our platform. If you'd like to keep it, you can buy it outright
                  for a one-time fee. We'll quote you, and the quote will say exactly what's included.
                </p>
              </Section>

              <Section title="7. Texts to your customers">
                <p>
                  Our systems send texts on your behalf: replies to new leads, texts back to missed callers, review requests and
                  check-ins with past customers. Canada's Anti-Spam Legislation (CASL) and carrier rules require permission from
                  the people who receive them. Permission can be express (they said yes) or implied, for example someone who bought
                  from you in the last two years or asked about your services in the last six months. So you agree to:
                </p>
                <List>
                  <li>give us, or load into the system, only contact details of people you have consent to text, express or implied as above, and keep a record of it;</li>
                  <li>never ask us to text a purchased list, or people who haven't dealt with your business;</li>
                  <li>tell us right away if someone asks you to stop contacting them.</li>
                </List>
                <p>
                  Every text identifies your business and how to reach you, and anyone can reply STOP to opt out. We honour
                  opt-outs automatically, well inside CASL's 10 business days. We'll show you the message templates during setup,
                  and we may pause or refuse any message we believe lacks permission.
                </p>
                <p>
                  Review requests go to every customer you can text under this section. We never leave out unhappy customers,
                  because Google's rules don't allow it.
                </p>
                <p>
                  You're responsible for your contact list and the permission behind it, and for the claims your business makes,
                  such as licences, insurance and prices.
                </p>
              </Section>

              <Section title="8. Who owns what">
                <p>
                  You own your domain, your business name and logo, the photos and text you give us, and your customer data. You
                  give us permission to use them to provide your service. You confirm you have the right to use everything you give
                  us. If we buy a domain for you, it's yours, and we'll transfer it to you whenever you ask.
                </p>
                <p>
                  We own our platform, templates, designs, workflows and know-how. You can use them while your service is active.
                  We may show your website as an example of our work unless you tell us not to.
                </p>
              </Section>

              <Section title="9. Your customer data">
                <p>
                  We use your customer data only to run your service. We never sell it. It's stored with the service providers we
                  use to run your system, such as hosting, CRM and texting providers. We protect it with reasonable safeguards, and
                  we'll tell you if a security breach affects it, as the law requires. We handle it in line with Canadian privacy
                  law, and our <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a> explains more.
                </p>
              </Section>

              <Section title="10. No guarantees">
                <p>
                  We don't promise any number of leads, calls, jobs, reviews, rankings or revenue. Your results depend on things we
                  don't control.
                </p>
                <p>
                  Your service runs on third-party platforms, such as Google, mobile carriers and hosting providers. We're not
                  responsible for their outages or rule changes, but we'll work to fix any problem quickly. Texts and alerts travel
                  through carriers and other systems, so we can't guarantee every one arrives, or when. Beyond what this agreement
                  says, the service is provided as is, to the extent the law allows.
                </p>
              </Section>

              <Section title="11. Limitation of liability">
                <p className="text-white border-l-2 border-white/20 pl-4">
                  Neither of us is liable to the other for indirect or consequential losses, including lost profits or lost
                  business. Our total liability for anything related to this agreement is limited to what you paid us in the 3
                  months before the claim. This cap doesn't reduce what you owe us for the service, or your promise in section 12.
                </p>
              </Section>

              <Section title="12. Claims caused by your lists or content">
                <p>
                  You'll cover us for claims, fines, regulator investigations and costs, including reasonable legal fees, that come
                  from the contact lists you give us and the permission behind them, the content and claims you give us, or a
                  breach of section 7. That includes claims under CASL.
                </p>
              </Section>

              <Section title="13. Changes to this agreement">
                <p>
                  We may update this agreement. We'll email you at least 30 days before a change that affects you takes effect. If
                  you don't want the change, you can cancel before then.
                </p>
              </Section>

              <Section title="14. Governing law">
                <p>
                  This agreement is governed by the laws of the Province of Ontario, Canada, and the federal laws of Canada that
                  apply there. Disputes go to the courts of Ontario. Nothing here takes away rights you have that can't be waived
                  by contract.
                </p>
              </Section>

              <Section title="15. General">
                <List>
                  <li>We're an independent contractor.</li>
                  <li>You can't transfer this agreement without our written OK. We may transfer it if we sell or reorganize our business.</li>
                  <li>If part of this agreement can't be enforced, the rest still applies.</li>
                  <li>If we don't enforce a right right away, we can still enforce it later.</li>
                  <li>Notices go by email: to the email you gave us at checkout, and to us at <Mail />.</li>
                  <li>
                    This agreement, your order and our{' '}
                    <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a> are the whole agreement between
                    us about the service. They replace anything said before.
                  </li>
                </List>
              </Section>

              <Section title="16. Contact">
                <p>
                  <strong className="text-white">Premmisus Inc.</strong><br />
                  Email: <Mail />
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
