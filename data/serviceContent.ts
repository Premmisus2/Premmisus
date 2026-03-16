import { Target, BarChart2, Zap, Layers, Bot } from 'lucide-react';

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
    slug: 'paid-social',
    id: '01',
    title: 'Paid Social Acquisition',
    tagline: 'Meta is our weapon. We know how to use it.',
    overview:
      'Most agencies run ads. We engineer acquisition systems. Our paid social practice is built exclusively for Canadian trades and industrial businesses — companies that need qualified leads, not clicks. Meta (Facebook & Instagram) is our core weapon. We also deploy Google Ads for intent-based search and service ad capture. Every campaign is built around your cost per lead, your close rate, and your actual revenue. Not impressions. Not reach. Revenue.',
    included: [
      'Meta (Facebook & Instagram) campaign architecture and full management',
      'Google Ads — Search and Service Ads for high-intent capture',
      'Audience research and targeting built for blue-collar markets',
      'Multi-angle creative testing to find what converts fastest',
      'Real-time CPA monitoring and budget optimization',
      'Reporting tied to revenue — zero vanity metrics',
    ],
    howItWorks: [
      {
        step: 'Audit & Profile',
        description:
          'We start by auditing your current presence and defining your ideal lead profile. Who is your best customer? What does it cost you to acquire them today? We need to know the baseline before we can break it.',
      },
      {
        step: 'Build the System',
        description:
          'We build the campaign infrastructure from scratch — targeting, copy, creative direction, and conversion tracking. Nothing goes live until the measurement is airtight.',
      },
      {
        step: 'Test, Optimize, Scale',
        description:
          'We monitor performance weekly, cut what loses, scale what wins, and report on the numbers that actually move your business forward.',
      },
    ],
    techStack: ['Meta Ads Manager', 'Google Ads', 'Server-Side GA4', 'GoHighLevel', 'Offline Conversion Tracking'],
    whoItsFor:
      'Plumbing, roofing, cleaning, landscaping, renovation, and trades businesses across Canada that need a predictable, trackable flow of qualified leads — not guesswork.',
    icon: Target,
  },
  {
    slug: 'creative-strategy',
    id: '02',
    title: 'Creative Strategy',
    tagline: 'Data decides the design. We build what converts.',
    overview:
      'Ad creative is the single biggest performance lever in paid social. We do not guess what works — we test systematically. Our creative strategy is built around your industry, your audience, and what makes a blue-collar buyer take action. We develop the full creative direction, coordinate with vetted production partners for video, and handle everything from brief to live asset. You focus on running your business. We focus on building the creative that fills your pipeline.',
    included: [
      'Creative brief development and full campaign direction',
      'Static ad design built for scroll-stopping performance',
      'Video ad coordination with trusted production partners',
      'Multi-angle testing — headline, hook, offer, and format variations',
      'Performance analysis: winners scaled, losers cut fast',
      'Industry-specific messaging crafted for trades and industrial audiences',
    ],
    howItWorks: [
      {
        step: 'Define the Angle',
        description:
          'We start with your offer and your audience. What does your ideal customer care about? What objection do they have before they pick up the phone? We build creative angles around the answers.',
      },
      {
        step: 'Direct & Produce',
        description:
          'We develop the creative briefs and direct production or design — whether that is static graphics, video, or both. Every asset is built to a conversion objective, not an aesthetic one.',
      },
      {
        step: 'Test & Feed the Loop',
        description:
          'We run structured tests and feed winning data directly back into the next creative sprint. Over time, your creative library compounds — and so does your performance.',
      },
    ],
    techStack: ['Meta Creative Hub', 'Canva Pro', 'Adobe Suite (via partners)', 'Proprietary Testing Frameworks'],
    whoItsFor:
      'Businesses running — or ready to run — paid social who want creative that converts, not just creative that looks good.',
    icon: Zap,
  },
  {
    slug: 'cro-funnel',
    id: '03',
    title: 'CRO & Funnel Optimization',
    tagline: 'Traffic is worthless without conversion architecture.',
    overview:
      'You can spend thousands on ads and lose all of it on a landing page that was never built to convert. We build and optimize the full conversion path — from the first ad click to the submitted quote request. We construct landing pages from scratch using GoHighLevel, Google\'s web infrastructure, and modern AI-assisted tools, engineered specifically for high-ticket trades and industrial leads. We have built funnels for businesses across the sector, and we know exactly what makes a contractor or operations manager stop and fill out a form.',
    included: [
      'Landing page design and full build — from scratch',
      'Conversion path mapping from ad click to qualified lead',
      'Form design and lead qualification logic',
      'A/B testing frameworks tied to revenue metrics',
      'Page speed and mobile optimization',
      'Full CRM and tracking stack integration',
    ],
    howItWorks: [
      {
        step: 'Funnel Audit',
        description:
          'We map your current conversion path and find where leads are leaking. Most businesses are losing 60–80% of their traffic before a form is ever submitted.',
      },
      {
        step: 'Build the Infrastructure',
        description:
          'We rebuild what needs rebuilding and build what does not exist. New landing pages, new forms, new qualification logic — all connected to your CRM and tracking from day one.',
      },
      {
        step: 'Optimize Continuously',
        description:
          'We test, report on revenue per session — not just traffic — and keep improving. A 10% lift in conversion rate is worth more than doubling your ad spend.',
      },
    ],
    techStack: ['GoHighLevel', 'Google Web Infrastructure', 'AI-Assisted Build Tools', 'Traditional Builders (as needed)', 'Server-Side GA4'],
    whoItsFor:
      'Any business running paid traffic that wants more qualified leads out of the same ad spend.',
    icon: Layers,
  },
  {
    slug: 'retention-systems',
    id: '04',
    title: 'Retention Systems',
    tagline: 'The money is in the follow-up. We automate it.',
    overview:
      'Most businesses lose the majority of their leads simply by not following up fast enough — or at all. The average lead goes cold within minutes. We build the automated systems that follow up for you: email sequences, SMS flows, remarketing campaigns, and CRM pipelines that keep every lead warm until they are ready to buy. We set it up, we manage it, and we keep it running. You close the deals. We handle everything before the call.',
    included: [
      'CRM setup and full pipeline management (GoHighLevel)',
      'Email marketing sequences and ongoing campaign management',
      'SMS follow-up automation — triggered by lead behaviour',
      'Remarketing campaign management across Meta and Google',
      'Workflow automation via n8n and Zapier',
      'Reporting through your preferred tools — Notion, Slack, Google Sheets, Excel — your call',
    ],
    howItWorks: [
      {
        step: 'Audit the Gap',
        description:
          'We review your current follow-up process. In most cases, leads are sitting in a spreadsheet with no automated touchpoint. We identify every gap and map the fix.',
      },
      {
        step: 'Build the Engine',
        description:
          'We build the CRM pipeline, automation flows, and email and SMS sequences. Everything is integrated — your ads feed the CRM, the CRM triggers the automations, and the automations book the calls.',
      },
      {
        step: 'Manage and Optimize',
        description:
          'We manage ongoing campaigns and optimize based on open rates, reply rates, and booked calls. You get a weekly report in whatever format works best for your team.',
      },
    ],
    techStack: ['GoHighLevel', 'n8n', 'Zapier', 'Google Sheets', 'Slack', 'Notion'],
    whoItsFor:
      'Businesses generating leads but not closing enough of them. The problem is almost always in the follow-up — and almost always fixable.',
    icon: BarChart2,
  },
  {
    slug: 'ai-automation',
    id: '05',
    title: 'AI Automation',
    tagline: 'Your competitors are still doing this manually.',
    overview:
      'We have built and deployed AI-powered automation systems that eliminate the manual work slowing your business down. From automated lead intake and intelligent follow-up to internal workflow automation, our AI systems run around the clock so your team does not have to. We use these same systems internally — which is how we take on more without sacrificing the quality of what we deliver. This is not a future offering. It is live, it is running, and it is available to you now.',
    included: [
      'AI-powered lead intake, routing, and qualification',
      'Automated follow-up sequences triggered by lead behaviour and intent signals',
      'Internal workflow automation — reduce admin, increase throughput',
      'CRM automation and intelligent pipeline management',
      'Custom AI workflow builds using n8n and Zapier',
      'Ongoing monitoring, refinement, and expansion as your business grows',
    ],
    howItWorks: [
      {
        step: 'Workflow Audit',
        description:
          'We map your current operations and identify every manual, repetitive task that is costing your team time. Most businesses have 5–10 hours per week of work that can be fully automated.',
      },
      {
        step: 'Build the AI Stack',
        description:
          'We build the automation systems and integrate them into your existing tools. Lead intake, CRM updates, follow-up sequences, internal notifications — all handled without human input.',
      },
      {
        step: 'Scale the Automation',
        description:
          'We monitor what is running, fix what needs fixing, and continuously expand the automation footprint as your business grows. The system gets smarter the longer it runs.',
      },
    ],
    techStack: ['n8n', 'Zapier', 'GoHighLevel AI', 'OpenAI APIs', 'Custom Automation Frameworks', 'Notion', 'Slack'],
    whoItsFor:
      'Growth-minded trades and industrial businesses that want to scale operations without proportionally scaling their headcount or their stress.',
    icon: Bot,
  },
];
