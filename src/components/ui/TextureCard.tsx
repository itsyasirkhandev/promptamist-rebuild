import * as React from 'react';
import { cn } from '@/lib/utils';

interface TextureCardProps {
  children?: React.ReactNode;
  className?: string;
  popular?: boolean;
}

export const TextureCard = ({ children, className, popular }: TextureCardProps) => (
  <div className={cn(
    "rounded-[24px] border border-white/60 dark:border-stone-950/60 bg-gradient-to-b transition-all duration-300",
    popular 
        ? "from-neutral-50 to-white/90 ring-1 ring-black/5 dark:from-neutral-800 dark:to-neutral-950 dark:ring-white/10 shadow-2xl shadow-neutral-200/50 dark:shadow-black/50" 
        : "from-neutral-100 to-white/70 dark:from-neutral-800 dark:to-neutral-900",
    className
  )}>
    <div className="rounded-[23px] border border-black/10 dark:border-neutral-900/80 flex flex-col h-full">
      <div className="rounded-[22px] border border-white/50 dark:border-neutral-950 flex flex-col h-full">
        <div className="rounded-[21px] border border-neutral-950/20 dark:border-neutral-900/70 flex flex-col h-full">
          <div className="w-full rounded-[20px] border border-white/50 text-neutral-500 dark:border-neutral-700/50 flex flex-col h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  </div>
);
