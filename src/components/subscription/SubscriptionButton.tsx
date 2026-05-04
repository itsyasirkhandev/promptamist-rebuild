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
    return <Skeleton className="h-9 w-32 rounded-full" />;
  }

  if (!currentUser) return null;

  const isPro = currentUser.subscriptionTier === 'pro';

  return (
    <>
      <div
        onClick={() => !isPro && setShowUpgradeModal(true)}
        className={cn(
          'group flex cursor-pointer items-center gap-2.5 rounded-full border px-4 py-1.5 transition-all duration-300 select-none',
          isPro
            ? 'bg-primary/10 border-primary/40 text-primary shadow-primary/10 hover:bg-primary/20 shadow-lg'
            : 'bg-muted/50 border-border/50 text-foreground hover:bg-muted hover:border-border hover:shadow-sm',
        )}
      >
        <div className="flex items-center gap-1.5">
          {isPro ? (
            <Icon icon="lucide:zap" className="h-3.5 w-3.5 fill-current" />
          ) : (
            <Icon
              icon="lucide:shield"
              className="text-primary/70 group-hover:text-primary h-3.5 w-3.5 transition-colors"
            />
          )}
          <span className="text-foreground text-[10px] font-bold tracking-widest">
            {isPro ? 'PRO' : 'FREE'}
          </span>
        </div>

        {!isPro && (
          <>
            <div className="bg-border h-3 w-[1px]" />
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground group-hover:text-foreground text-[10px] font-semibold whitespace-nowrap transition-colors">
                {stats.total}/50 Used
              </span>
              <Icon
                icon="lucide:chevron-up"
                className="text-primary h-3 w-3 animate-pulse"
              />
            </div>
          </>
        )}
      </div>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
      />
    </>
  );
}
