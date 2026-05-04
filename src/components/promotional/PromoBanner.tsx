'use client';

import * as React from 'react';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';

export function PromoBanner() {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "relative z-[100] w-full overflow-hidden transition-all duration-500 ease-in-out",
        isVisible ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
      )}
    >
      {/* Premium Background using project primary color */}
      <div className="absolute inset-0 bg-primary" />
      
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent_50%)] opacity-50" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
      
      <div className="relative mx-auto flex max-w-7xl items-center justify-center px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/20 shadow-sm backdrop-blur-sm">
              <Icon icon="solar:gift-bold-duotone" className="text-primary-foreground h-4 w-4" />
            </div>
            <p className="text-primary-foreground text-sm font-medium sm:text-base">
              <span className="font-bold">Exclusive Launch Offer!</span> First 100 users get Pro for <span className="underline decoration-primary-foreground/40 underline-offset-4 font-bold">FREE</span>
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 shadow-inner backdrop-blur-md ring-1 ring-primary-foreground/20">
            <Icon icon="solar:ticket-bold-duotone" className="text-primary-foreground/80 h-4 w-4" />
            <span className="text-primary-foreground text-xs font-bold tracking-wider uppercase sm:text-sm">
              Code: <span className="select-all font-mono underline decoration-dashed decoration-primary-foreground/40 underline-offset-2">prompt4yasir</span>
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-primary-foreground/70 transition-all hover:bg-primary-foreground/10 hover:text-primary-foreground"
          aria-label="Dismiss banner"
        >
          <Icon icon="solar:close-circle-bold-duotone" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
