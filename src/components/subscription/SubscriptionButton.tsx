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
          'group relative cursor-pointer transition-all duration-300 select-none active:scale-95',
          !isPro && 'hover:-translate-y-0.5',
        )}
      >
        {/* Layered Border System */}
        <div
          className={cn(
            'rounded-full border border-white/60 p-[1px] shadow-lg transition-all duration-300 dark:border-stone-950/60',
            isPro
              ? 'from-primary/60 to-primary shadow-primary/30 bg-gradient-to-b'
              : 'bg-gradient-to-b from-neutral-200 to-neutral-50 shadow-neutral-200/50 dark:from-neutral-800 dark:to-neutral-900 dark:shadow-black/50',
          )}
        >
          <div className="rounded-full border border-black/5 dark:border-white/5">
            <div
              className={cn(
                'flex items-center gap-3 rounded-full border border-white/50 px-4 py-1.5 backdrop-blur-xl transition-all duration-300',
                isPro
                  ? 'bg-primary/10 dark:bg-primary/20 border-primary/30'
                  : 'border-neutral-200/80 bg-white/60 dark:border-neutral-700/80 dark:bg-black/60',
              )}
            >
              {/* Plan Icon/Label */}
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-lg border shadow-md transition-transform group-hover:scale-110',
                    isPro
                      ? 'border-amber-400/30 bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-amber-500/20'
                      : 'border-blue-400/30 bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-blue-500/20',
                  )}
                >
                  <Icon
                    icon={
                      isPro
                        ? 'solar:crown-minimalistic-bold-duotone'
                        : 'solar:user-bold-duotone'
                    }
                    className="h-4 w-4"
                  />
                </div>
                <span
                  className={cn(
                    'text-[10px] font-black tracking-[0.2em] uppercase',
                    isPro
                      ? 'text-primary-foreground dark:text-primary-foreground bg-primary rounded-md px-1.5 py-0.5'
                      : 'text-neutral-900 dark:text-neutral-50',
                  )}
                >
                  {isPro ? 'Pro' : 'Free'}
                </span>
              </div>

              {!isPro && (
                <>
                  <div className="h-3 w-px bg-neutral-300 dark:bg-neutral-700" />
                  <div className="flex items-center gap-2">
                    <div className="relative h-1.5 w-16 overflow-hidden rounded-full border border-black/5 bg-neutral-200 dark:border-white/5 dark:bg-neutral-800">
                      <div
                        className="bg-primary absolute inset-y-0 left-0 shadow-[0_0_8px_rgba(var(--primary),0.5)] transition-all duration-500"
                        style={{
                          width: `${Math.min((stats.total / 50) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-neutral-800 tabular-nums dark:text-neutral-200">
                      <span className="md:hidden">
                        {stats.total} Created • {Math.max(0, 50 - stats.total)}{' '}
                        Left
                      </span>
                      <span className="hidden md:inline">{stats.total}/50</span>
                    </span>
                    <Icon
                      icon="lucide:arrow-up-circle"
                      className="text-primary h-3.5 w-3.5 animate-bounce transition-transform group-hover:scale-110"
                    />
                  </div>
                </>
              )}

              {isPro && (
                <Icon
                  icon="lucide:check-circle"
                  className="text-primary ml-1 h-4 w-4"
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
