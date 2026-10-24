import { Globe, Megaphone, MapPin, Headset, Calculator } from 'lucide-react';

// What else we build, beyond the four systems (components/Methodology.tsx). Co-authored with
// Elliott 2026-10-24. Every sentence here is something already built and shown working, or plain
// mechanism; no results, no numbers, no speeds we have not timed. The website is included in the
// package; the rest are add-ons. Old slugs (paid-social and the rest) redirect in vercel.json.

export interface ServiceDetail {
  slug: string;
  id: string;
  title: string;
  tagline: string;
  overview: string;
  included: string[];
  howItWorks: { step: string; description: string }[];
  techStack: string[];
  whoItsFor: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const serviceDetails: ServiceDetail[] = [
  {
    slug: 'website',
    id: '01',
    title: 'Your Website',
    tagline: 'Included. Built around your trade and the towns you serve, with every form sending the lead straight to your phone.',
    overview:
      'Every Premmisus system comes with a website. It says clearly what you do and which towns you serve, it works properly on a phone, and every form on it sends the lead straight to your phone. You own your domain, your content and your customer data. When you want something small changed, like your text, photos, hours or services, you tell us and we change it.',
    included: [
      'Built around your services and the towns you serve',
      'Made for phones, with tap-to-call',
      'Every form sends the lead straight to your phone',
      'Hosted and looked after by us',
      'Small changes to text, photos, hours and services when you ask',
      'Your domain, your content and your customer data stay yours',
    ],
    howItWorks: [
      {
        step: 'A short call',
        description: 'We go over your services, the towns you work in and how customers reach you today.',
      },
      {
        step: 'We build it',
        description: 'We write the site around your trade and build it. You check it and tell us what to change before anything goes live.',
      },
      {
        step: 'It goes live',
        description: 'We put it on your domain, connect the forms and send a test lead so you see it arrive on your phone.',
      },
    ],
    techStack: [],
    whoItsFor:
      'Trades and home service businesses across Canada with no website, or with one that sits there and brings in nothing.',
    icon: Globe,
  },
  {
    slug: 'google-meta-ads',
    id: '02',
    title: 'Google & Meta Ads',
    tagline: 'When you want more work than word of mouth brings, we set up and run your ads on Google, Facebook and Instagram.',
    overview:
      'When you want more work than word of mouth brings, we set up and run your ads on Google, Facebook and Instagram. Every ad sends people to your own website, where every form goes straight to your phone. You decide the budget, and you can change it whenever you like.',
    included: [
      'Google Search ads for people already looking for your service',
      'Facebook and Instagram ads in the towns you serve',
      'Ads written for your trade',
      'Every ad pointed at your own website',
      'A budget you decide, changed when you say',
    ],
    howItWorks: [
      {
        step: 'Plan',
        description: 'We agree the towns, the services to push and the monthly budget.',
      },
      {
        step: 'Build',
        description: 'We write the ads and set up the campaigns on Google and Meta.',
      },
      {
        step: 'Run',
        description: "We watch them, switch off what isn't working and tell you what we changed.",
      },
    ],
    techStack: [],
    whoItsFor:
      'Businesses that already have a website and follow-up in place, and want more calls coming in.',
    icon: Megaphone,
  },
  {
    slug: 'google-profile-local-seo',
    id: '03',
    title: 'Google Profile & Local SEO',
    tagline: 'Your Google Business Profile set up right, plus a page on your site for every town you serve.',
    overview:
      'Your Google Business Profile is what people see when they search your name or your trade on Google. We set yours up right: your services, the area you cover, your hours, your photos and the right categories. Then we add a page on your site for each town you serve, written for that town.',
    included: [
      'Google Business Profile set up: services, area, hours, photos and categories',
      'A page on your site for each town you serve',
      'Your name, address and phone number the same everywhere',
      'Your Google review link ready for the review engine',
      'Profile changes made carefully, one at a time',
    ],
    howItWorks: [
      {
        step: 'Check',
        description: 'We look at your profile and your site and list what is missing.',
      },
      {
        step: 'Fix',
        description: 'We set up the profile and build the town pages, making profile changes one at a time.',
      },
      {
        step: 'Keep it right',
        description: 'When your hours, services or area change, you tell us and we update the profile.',
      },
    ],
    techStack: [],
    whoItsFor:
      'Businesses with a thin, unclaimed or out-of-date Google profile, and anyone who works across more than one town.',
    icon: MapPin,
  },
  {
    slug: 'ai-receptionist',
    id: '04',
    title: 'AI Receptionist',
    tagline: "An AI voice that answers when you can't, day or night, takes the caller's details and sends them to you.",
    overview:
      "An AI voice that answers your business line when you can't: on a job, after hours or on the weekend. It greets the caller in your business name, takes their name, number and what they need, and sends the details to you after the call. A call you couldn't take still leaves you with a lead to call back.",
    included: [
      'Answers when you are busy, after hours and on weekends',
      'Greets callers in your business name',
      "Takes the caller's name, number and what they need",
      'Sends you the details after every call',
      'What it says, written with you',
      'You test it yourself before it answers a customer',
    ],
    howItWorks: [
      {
        step: 'Script',
        description: 'We write what it says with you: your services, your area and what to ask.',
      },
      {
        step: 'Connect',
        description: 'We connect it to your business line for the times you choose.',
      },
      {
        step: 'Test',
        description: 'You call it yourself and hear it before it answers a single customer.',
      },
    ],
    techStack: [],
    whoItsFor:
      'Owners who miss calls because they are on the tools, and businesses that get a lot of calls after hours.',
    icon: Headset,
  },
  {
    slug: 'instant-quotes',
    id: '05',
    title: 'Instant Quotes',
    tagline: 'Customers pick their job on your site and see a price range on the spot, before they ever call.',
    overview:
      'Customers pick their job on your site, answer a couple of quick questions and see a price range on the spot. They know roughly what it will cost before they call, and when they send it, you get their details with the job already described.',
    included: [
      'A price calculator built from your own prices',
      'Questions that fit your trade',
      'A price range, not a fixed promise',
      "The customer's answers sent to you with their details",
      'Works on phones',
    ],
    howItWorks: [
      {
        step: 'Your prices',
        description: 'You give us your prices and what makes a job cost more or less.',
      },
      {
        step: 'We build it',
        description: 'We add the calculator to your site and connect it to your lead alerts.',
      },
      {
        step: 'You test it',
        description: 'You run your own quotes and check the numbers before it goes live.',
      },
    ],
    techStack: [],
    whoItsFor:
      'Trades with fairly set prices, like cleaning, window washing, pressure washing and lawn care. Not a fit for jobs that need a site visit to price.',
    icon: Calculator,
  },
];
