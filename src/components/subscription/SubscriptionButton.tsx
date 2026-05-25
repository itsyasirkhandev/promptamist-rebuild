'use client';

import { useQuery, useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Skeleton } from '@/components/ui/skeleton';
import { UpgradeModal } from './UpgradeModal';
import { useState, useTransition } from 'react';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';

export function SubscriptionButton() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const currentUser = useQuery(api.authed.users.getCurrentUser);
  const stats = useQuery(api.authed.prompts.getPromptStats);
  const generatePortal = useAction(api.authed.polar.generatePortalUrl);

  if (currentUser === undefined || stats === undefined) {
    return <Skeleton className="h-9 w-32 rounded-none" />;
  }

  if (!currentUser) return null;

  const isPro = currentUser.subscriptionTier === 'pro';

  const handleProClick = () => {
    startTransition(async () => {
      try {
        const result = await generatePortal();
        if (result && result.url) {
          window.open(result.url, '_blank');
        } else {
          console.error(
            'Failed to create customer portal session: No URL returned',
          );
        }
      } catch (error) {
        console.error('Failed to create customer portal session:', error);
      }
    });
  };

  return (
    <>
      <button
        onClick={() => {
          if (!isPro) {
            setShowUpgradeModal(true);
          } else {
            handleProClick();
          }
        }}
        disabled={isPending}
        className={cn(
          'group flex cursor-pointer items-center gap-2 rounded-none border-2 px-4 py-1.5 font-mono text-[11px] font-bold tracking-wider uppercase transition-colors duration-200 select-none active:translate-y-[1px]',
          isPro
            ? 'border-neutral-950 bg-neutral-950 text-white hover:bg-transparent hover:text-neutral-950 dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-transparent dark:hover:text-white'
            : 'border-neutral-900 bg-transparent text-neutral-900 hover:bg-neutral-900 hover:text-white dark:border-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-100 dark:hover:text-neutral-950',
          isPending && 'pointer-events-none opacity-55',
        )}
      >
        {/* Icon */}
        <div className="flex h-4 w-4 shrink-0 items-center justify-center">
          {isPending ? (
            <Icon icon="lucide:loader-2" className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Icon
              icon={
                isPro
                  ? 'solar:crown-minimalistic-bold-duotone'
                  : 'solar:bolt-circle-bold-duotone'
              }
              className="h-3.5 w-3.5"
            />
          )}
        </div>

        {/* Label and Limits */}
        <div className="flex items-center gap-2">
          <span>{isPro ? 'Pro' : 'Hobby'}</span>

          {!isPro && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] opacity-70">({stats.total}/50)</span>
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
