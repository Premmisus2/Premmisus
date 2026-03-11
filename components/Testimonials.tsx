import React from 'react';
import { Marquee } from './Marquee';
import { SectionWrapper } from './SectionWrapper';

const reviews = [
  {
    name: "Umesh",
    username: "Trydentt Building Services",
    body: "I've gotten to know the founder of Premmisus on a personal level, and I can say for a fact that these guys offer premium marketing services. I would recommend them to my closest and most valued colleagues — a true testament to excellence.",
    img: "https://avatar.vercel.sh/umesh",
  },
  {
    name: "Randy",
    username: "Easy Touch Soccer Academy",
    body: "Been working with Premmisus for four years now. We've just made plans to expand into other avenues of online marketing and revenue generation. Would not trade this partnership up. Absolutely premium marketing and attention to detail.",
    img: "https://avatar.vercel.sh/randy",
  },
  {
    name: "Charles",
    username: "Standard Property Care",
    body: "Have known Elliott and the team since 2023. I was mentored by him, and then we were blessed to get into business together. I expected nothing less than a state-of-the-art operation — and some of the plans for the future are jaw-dropping. Really don't need to say much more.",
    img: "https://avatar.vercel.sh/charles",
  },
  {
    name: "D'Andre",
    username: "Principle Property Care",
    body: "These guys helped me out when I was barely established with no team. They acted as my team, helped me grow, and built an entire backend for me. Real-life collaboration, digital leverage — these are the building blocks for the future. Really appreciate the team at Premmisus.",
    img: "https://avatar.vercel.sh/dandre",
  },
  {
    name: "Senay",
    username: "Detailing Business & Academy",
    body: "The founder helped my cousin and me start our detailing business and academy to help young people in our community on their service-building journey. We built a real relationship. He helped us launch, scale, and now I'm teaching others to do the same. Absolutely brilliant work. Hats off.",
    img: "https://avatar.vercel.sh/senay",
  },
];

interface ReviewCardProps {
  name: string;
  body: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ name, body }) => {
  return (
    // Removed bg-surface, added transparent glass style
    <figure
      className="relative w-80 cursor-pointer overflow-hidden rounded-sm border border-white/10 bg-black/20 backdrop-blur-sm p-5 transition-all duration-300 hover:border-accent/30 hover:bg-white/5"
    >
      <div className="flex flex-row items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
          <span className="text-sm font-mono text-zinc-400">{name[0]}</span>
        </div>
        <figcaption className="text-base font-medium font-sans text-white">
          {name}
        </figcaption>
      </div>
      <blockquote className="mt-3 text-xs font-mono text-gray-300 leading-relaxed">
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
            Trusted by <span className="text-accent">High-Velocity</span> Brands.
            </h3>
        </div>
      </SectionWrapper>

      <div className="relative flex h-[600px] w-full flex-col items-center justify-center overflow-hidden">
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