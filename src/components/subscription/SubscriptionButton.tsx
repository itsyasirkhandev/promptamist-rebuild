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
  const oneWeekAgo = useMemo(() => Date.now() - 7 * 24 * 60 * 60 * 1000, []);
  const stats = useQuery(api.authed.prompts.getPromptStats, { oneWeekAgo });

  if (currentUser === undefined || stats === undefined) {
    return <Skeleton className="h-9 w-32 rounded-full" />;
  }

  if (!currentUser) return null;

  const isPro = currentUser.subscriptionTier === 'pro';

  return (
    <>
      <div 
        onClick={() => !isPro && setShowUpgradeModal(true)}
        className={cn(
          "group flex items-center gap-2.5 px-4 py-1.5 rounded-full border transition-all duration-300 cursor-pointer select-none",
          isPro 
            ? "bg-primary/10 border-primary/30 text-primary shadow-lg shadow-primary/5 hover:bg-primary/15"
            : "bg-secondary/50 border-secondary/80 hover:bg-secondary hover:border-primary/30"
        )}
      >
        <div className="flex items-center gap-1.5">
          {isPro ? (
            <Icon icon="lucide:zap" className="h-3.5 w-3.5 fill-current" />
          ) : (
            <Icon icon="lucide:shield" className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
          <span className="text-[10px] font-bold tracking-widest">
            {isPro ? 'PRO' : 'FREE'}
          </span>
        </div>

        <div className="h-3 w-[1px] bg-foreground/10" />

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold opacity-80 whitespace-nowrap">
            {isPro ? 'Lifetime Plan' : `${stats.total}/50 Used`}
          </span>
          {!isPro && (
            <Icon icon="lucide:chevron-up" className="h-3 w-3 text-primary animate-pulse" />
          )}
        </div>
      </div>

      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
    </>
  );
}
