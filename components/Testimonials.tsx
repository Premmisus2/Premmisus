import React from 'react';
import { Marquee } from './Marquee';
import { SectionWrapper } from './SectionWrapper';

const reviews = [
  {
    name: "Umesh",
    username: "Trydentt Building Services",
    body: "Premmisus built our entire digital presence from scratch — website, ads, booking system, the works. We went from zero online presence to a full pipeline of qualified leads. Premium service, premium results.",
  },
  {
    name: "D'Andre",
    username: "Principle Property Care",
    body: "When I started, I had no team and no systems. Premmisus built my entire backend — CRM, follow-up automation, lead tracking. They acted as my marketing team and helped me grow from a one-man operation to a real business.",
  },
  {
    name: "Senay",
    username: "Detailing Business & Academy",
    body: "Premmisus helped us launch our detailing business and academy from the ground up. Website, branding, marketing systems — everything. Now I'm teaching others to build their own service businesses. That's the kind of impact they have.",
  },
];

interface ReviewCardProps {
  name: string;
  username: string;
  body: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ name, username, body }) => {
  return (
    <figure
      className="relative w-80 cursor-pointer overflow-hidden rounded-sm border border-white/10 bg-black/20 backdrop-blur-sm p-5 transition-all duration-300 hover:border-accent/30 hover:bg-white/5"
    >
      <div className="flex flex-row items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
          <span className="text-sm font-mono text-zinc-400">{name[0]}</span>
        </div>
        <div className="flex flex-col">
          <figcaption className="text-base font-medium font-sans text-white">
            {name}
          </figcaption>
          <span className="text-xs font-mono text-accent/70">{username}</span>
        </div>
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
  const firstRow = reviews;
  const secondRow = reviews;

  return (
    <section className="py-32 relative overflow-hidden">
      <SectionWrapper>
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
            <h2 className="text-sm font-mono text-accent uppercase tracking-widest mb-4">Social Proof</h2>
            <h3 className="text-4xl md:text-5xl font-sans font-bold text-white mb-6">
            What Our <span className="text-accent">Clients</span> Say
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