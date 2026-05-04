import * as React from 'react';
import { cn } from '@/lib/utils';

interface TextureCardProps {
  children?: React.ReactNode;
  className?: string;
  popular?: boolean;
}

export const TextureCard = ({
  children,
  className,
  popular,
}: TextureCardProps) => (
  <div
    className={cn(
      'rounded-[24px] border border-white/60 bg-gradient-to-b transition-all duration-300 dark:border-stone-950/60',
      popular
        ? 'from-neutral-50 to-white/90 shadow-2xl ring-1 shadow-neutral-200/50 ring-black/5 dark:from-neutral-800 dark:to-neutral-950 dark:shadow-black/50 dark:ring-white/10'
        : 'from-neutral-100 to-white/70 dark:from-neutral-800 dark:to-neutral-900',
      className,
    )}
  >
    <div className="flex h-full flex-col rounded-[23px] border border-black/10 dark:border-neutral-900/80">
      <div className="flex h-full flex-col rounded-[22px] border border-white/50 dark:border-neutral-950">
        <div className="flex h-full flex-col rounded-[21px] border border-neutral-950/20 dark:border-neutral-900/70">
          <div className="flex h-full w-full flex-col rounded-[20px] border border-white/50 text-neutral-500 dark:border-neutral-700/50">
            {children}
          </div>
        </div>
      </div>
    </div>
  </div>
);
