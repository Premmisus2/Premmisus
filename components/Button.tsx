import React from 'react';
import { ArrowRight } from 'lucide-react';

type ButtonBaseProps = {
  variant?: 'primary' | 'secondary' | 'outline';
  withArrow?: boolean;
  href?: string;
  className?: string;
  children?: React.ReactNode;
};

type ButtonProps = ButtonBaseProps &
  (
    | (React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
    | (React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
  );

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  withArrow = false,
  className = '',
  href,
  ...props
}) => {
  const baseStyles = "relative font-sans font-bold uppercase tracking-wider text-sm py-4 px-10 transition-all duration-300 flex items-center justify-center gap-2 group overflow-hidden border backdrop-blur-sm rounded-xl";

  const variants = {
    primary: "neon-button border-transparent font-bold",
    secondary: "border-white/10 text-text-secondary hover:border-white/30 hover:text-white",
    outline: "border-white/20 text-white hover:border-accent hover:text-accent"
  };

  const combinedClass = `${baseStyles} ${variants[variant]} ${className}`;

  const inner = (
    <>
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {withArrow && (
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        )}
      </span>
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/50 group-hover:border-accent transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/50 group-hover:border-accent transition-colors" />
    </>
  );

  if (href) {
    return (
      <a href={href} className={combinedClass} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {inner}
      </a>
    );
  }

  return (
    <button className={combinedClass} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {inner}
    </button>
  );
};