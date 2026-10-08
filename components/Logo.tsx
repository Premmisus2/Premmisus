import React from 'react';

/**
 * The REAL Premmisus wordmark.
 *
 * This component used to redraw the mark in JSX: two <span>PREMM</span> /
 * <span>SUS</span> text nodes with a hand-coded three-chevron SVG between
 * them. It was a close approximation and it was not the logo. The actual
 * art lives in /Documents/Premmisus/Logos; the file served here was cut
 * from PHOTO-2026-02-09-17-57-16.jpg with the dark background removed, so
 * it sits on any surface.
 *
 * Never redraw the mark. Swap the file if the art changes.
 */
export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <span className="sr-only">Premmisus</span>
      <img
        src="/premmisus-wordmark.png"
        alt=""
        aria-hidden="true"
        width={1600}
        height={352}
        className="h-8 w-auto"
        loading="eager"
        decoding="async"
      />
    </div>
  );
};
