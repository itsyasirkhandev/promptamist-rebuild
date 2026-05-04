'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Skeleton } from '@/components/ui/skeleton';
import { UpgradeModal } from './UpgradeModal';
import { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';

export function SubscriptionButton() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const currentUser = useQuery(api.users.getCurrentUser);
  // eslint-disable-next-line react-hooks/purity
  const oneWeekAgo = useMemo(() => Date.now() - 7 * 24 * 60 * 60 * 1000, []);
  const stats = useQuery(api.authed.prompts.getPromptStats, { oneWeekAgo });

  if (currentUser === undefined || stats === undefined) {
    return <Skeleton className="h-10 w-36 rounded-full" />;
  }

  if (!currentUser) return null;

  const isPro = currentUser.subscriptionTier === 'pro';

  return (
    <>
      <div
        onClick={() => !isPro && setShowUpgradeModal(true)}
        className={cn(
          'group relative cursor-pointer select-none transition-all duration-300 active:scale-95',
          !isPro && 'hover:-translate-y-0.5'
        )}
      >
        {/* Layered Border System */}
        <div className={cn(
          "rounded-full border border-white/60 p-[1px] shadow-lg transition-all duration-300 dark:border-stone-950/60",
          isPro 
            ? "bg-gradient-to-b from-primary/40 to-primary shadow-primary/20" 
            : "bg-gradient-to-b from-neutral-200 to-neutral-50 shadow-neutral-200/50 dark:from-neutral-800 dark:to-neutral-900 dark:shadow-black/50"
        )}>
          <div className="rounded-full border border-black/5 dark:border-white/5">
            <div className={cn(
              "flex items-center gap-3 rounded-full border border-white/50 px-4 py-1.5 backdrop-blur-xl transition-all duration-300",
              isPro 
                ? "bg-primary/10 dark:bg-primary/20 border-primary/20" 
                : "bg-white/40 dark:bg-black/40 border-neutral-200/50 dark:border-neutral-700/50"
            )}>
              {/* Plan Icon/Label */}
              <div className="flex items-center gap-2">
                <div className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-lg border shadow-sm transition-transform group-hover:scale-110",
                  isPro
                    ? "bg-primary border-primary/20 text-white"
                    : "bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                )}>
                  <Icon 
                    icon={isPro ? "lucide:zap" : "lucide:shield"} 
                    className={cn("h-3 w-3", isPro && "fill-current")} 
                  />
                </div>
                <span className={cn(
                  "text-[10px] font-black tracking-[0.2em] uppercase",
                  isPro ? "text-primary dark:text-primary-foreground" : "text-neutral-500 dark:text-neutral-400"
                )}>
                  {isPro ? 'Pro' : 'Free'}
                </span>
              </div>

              {!isPro && (
                <>
                  <div className="h-3 w-px bg-neutral-200 dark:bg-neutral-800" />
                  <div className="flex items-center gap-2">
                    <div className="relative h-1.5 w-16 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                      <div 
                        className="absolute inset-y-0 left-0 bg-primary transition-all duration-500"
                        style={{ width: `${Math.min((stats.total / 50) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400 tabular-nums">
                      {stats.total}/50
                    </span>
                    <Icon
                      icon="lucide:arrow-up-circle"
                      className="text-primary h-3.5 w-3.5 animate-bounce group-hover:scale-110 transition-transform"
                    />
                  </div>
                </>
              )}

              {isPro && (
                <Icon
                  icon="lucide:check-circle"
                  className="text-primary h-4 w-4 ml-1"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
      />
    </>
  );
}
