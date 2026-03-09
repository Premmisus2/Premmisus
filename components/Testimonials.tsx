import React from 'react';
import { Marquee } from './Marquee';
import { SectionWrapper } from './SectionWrapper';

const reviews = [
  {
    name: "Alex Rivera",
    username: "@apex_construct",
    body: "Nexus Growth didn't just run ads; they restructured our entire acquisition funnel. We went from $20k to $85k/mo in 60 days.",
    img: "https://avatar.vercel.sh/alex",
  },
  {
    name: "Sarah Chen",
    username: "@weld_master",
    body: "The creative velocity is insane. They test 20+ angles a week. Our ROAS stabilized at 4.5x even while scaling spend.",
    img: "https://avatar.vercel.sh/sarah",
  },
  {
    name: "Marcus Thorne",
    username: "@hvac_pro",
    body: "Finally an agency that understands unit economics. No vanity metrics, just pure profit contribution.",
    img: "https://avatar.vercel.sh/marcus",
  },
  {
    name: "Elena Rodriguez",
    username: "@steel_fab",
    body: "The 'Method' works. Our CAC dropped by 40% within the first month of their creative sprint.",
    img: "https://avatar.vercel.sh/elena",
  },
  {
    name: "David Kim",
    username: "@heavy_machinery",
    body: "Professional, data-driven, and extremely aggressive with scaling winners. Exactly what we needed.",
    img: "https://avatar.vercel.sh/david",
  },
  {
    name: "Jessica Vance",
    username: "@logistics_plus",
    body: "We were stuck at a plateau for 6 months. Nexus broke through it in 3 weeks. The team is elite.",
    img: "https://avatar.vercel.sh/jessica",
  },
];

interface ReviewCardProps {
  img: string;
  name: string;
  username: string;
  body: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  img,
  name,
  username,
  body,
}) => {
  return (
    // Removed bg-surface, added transparent glass style
    <figure
      className="relative w-96 cursor-pointer overflow-hidden rounded-sm border border-white/10 bg-black/20 backdrop-blur-sm p-8 transition-all duration-300 hover:border-accent/30 hover:bg-white/5"
    >
      <div className="flex flex-row items-center gap-3">
        <img className="rounded-full" width="40" height="40" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-base font-medium font-sans text-white">
            {name}
          </figcaption>
          <p className="text-sm font-mono text-text-secondary">{username}</p>
        </div>
      </div>
      <blockquote className="mt-6 text-base font-mono text-gray-300 leading-relaxed">
        "{body}"
      </blockquote>
      
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-accent/5 to-transparent pointer-events-none" />
    </figure>
  );
};

export const Testimonials: React.FC = () => {
  const firstRow = reviews.slice(0, reviews.length / 2);
  const secondRow = reviews.slice(reviews.length / 2);

  return (
    <section className="py-32 relative overflow-hidden">
      <SectionWrapper>
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
            <h2 className="text-sm font-mono text-accent uppercase tracking-widest mb-4">Social Proof</h2>
            <h3 className="text-4xl md:text-5xl font-sans font-bold text-white mb-6">
            Trusted by the <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">fastest growing</span> brands.
            </h3>
        </div>
      </SectionWrapper>

      <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden">
        <Marquee pauseOnHover className="[--duration:20s]">
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:20s]">
          {secondRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        
        {/* Gradients to fade edges - updated to transparent/black */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-black to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-black to-transparent"></div>
      </div>
    </section>
  );
};