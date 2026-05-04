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
  const remaining = Math.max(0, 50 - stats.total);

  return (
    <>
      <button
        onClick={() => !isPro && setShowUpgradeModal(true)}
        className={cn(
          'group flex items-center gap-2.5 rounded-full border px-3.5 py-1.5 transition-all duration-200 active:scale-95',
          isPro
            ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400'
            : 'border-neutral-200 bg-white text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100',
          !isPro &&
            'cursor-pointer hover:border-primary/50 hover:bg-neutral-50 dark:hover:bg-neutral-800',
        )}
      >
        <div
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-full transition-transform group-hover:scale-110',
            isPro
              ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40'
              : 'bg-primary/10 text-primary',
          )}
        >
          <Icon
            icon={
              isPro
                ? 'solar:crown-minimalistic-bold-duotone'
                : 'solar:bolt-circle-bold-duotone'
            }
            className="h-3.5 w-3.5"
          />
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-[11px] font-bold uppercase tracking-tight',
              !isPro && 'hidden sm:inline',
            )}
          >
            {isPro ? 'Pro' : 'Free'}
          </span>

          {!isPro && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="h-3 w-px bg-neutral-200 dark:bg-neutral-800" />
              <span className="text-[10px] font-semibold tabular-nums text-neutral-500 dark:text-neutral-400">
                <span className="hidden sm:inline">
                  {stats.total}/50 Prompts
                </span>
                <span className="sm:hidden">{remaining} Left</span>
              </span>
              <Icon
                icon="lucide:chevron-right"
                className="hidden h-3 w-3 text-neutral-400 transition-transform group-hover:translate-x-0.5 sm:block"
              />
            </div>
          )}
        </div>
      </button>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
      />
    </>
  );
}
