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
        'relative z-[100] w-full overflow-hidden transition-all duration-500 ease-in-out',
        isVisible ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0',
      )}
    >
      {/* Premium Background using project primary color */}
      <div className="bg-primary absolute inset-0" />

      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent_50%)] opacity-50" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />

      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex flex-1 flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center sm:justify-start lg:justify-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary-foreground/20 flex h-6 w-6 shrink-0 items-center justify-center rounded-full shadow-sm backdrop-blur-sm">
              <Icon
                icon="solar:gift-bold-duotone"
                className="text-primary-foreground h-4 w-4"
              />
            </div>
            <p className="text-primary-foreground text-sm font-medium sm:text-base">
              <span className="font-bold">Exclusive Launch Offer!</span> First
              100 users get Pro for{' '}
              <span className="decoration-primary-foreground/40 font-bold underline underline-offset-4">
                FREE
              </span>
            </p>
          </div>

          <div className="bg-primary-foreground/15 ring-primary-foreground/20 flex items-center gap-2 rounded-full px-3 py-1 shadow-inner ring-1 backdrop-blur-md">
            <Icon
              icon="solar:ticket-bold-duotone"
              className="text-primary-foreground/80 h-4 w-4"
            />
            <span className="text-primary-foreground text-xs font-bold tracking-wider uppercase sm:text-sm">
              Code:{' '}
              <span className="decoration-primary-foreground/40 font-mono underline decoration-dashed underline-offset-2 select-all">
                prompt4yasir
              </span>
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground ml-4 shrink-0 rounded-full p-1 transition-all"
          aria-label="Dismiss banner"
        >
          <Icon icon="solar:close-circle-bold-duotone" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
