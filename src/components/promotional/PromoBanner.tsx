'use client';

import * as React from 'react';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';

export function PromoBanner() {
  const [hasMounted, setHasMounted] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const [isDismissed, setIsDismissed] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
    const dismissed = document.cookie
      .split('; ')
      .some((row) => row.startsWith('promo_banner_dismissed='));
    if (dismissed) {
      setIsDismissed(true);
    } else {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Save cookie to expire in 365 days
    const expires = new Date();
    expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = `promo_banner_dismissed=true;path=/;expires=${expires.toUTCString()};SameSite=Lax`;

    // Wait for the transition to complete before unmounting
    setTimeout(() => {
      setIsDismissed(true);
    }, 500); // matches the transition duration
  };

  if (!hasMounted || isDismissed) return null;

  return (
    <div
      className={cn(
        'relative z-[100] w-full px-4 pt-4 transition-all duration-500 ease-in-out sm:px-6 lg:px-8',
        isVisible
          ? 'max-h-64 sm:max-h-40 opacity-100'
          : 'max-h-0 overflow-hidden opacity-0',
      )}
    >
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[24px] border border-white/60 bg-gradient-to-b from-neutral-100 to-white/70 shadow-2xl shadow-neutral-200/50 transition-all duration-300 dark:border-stone-950/60 dark:from-neutral-800 dark:to-neutral-900 dark:shadow-black/50">
          <div className="rounded-[23px] border border-black/10 dark:border-neutral-900/80">
            <div className="rounded-[22px] border border-white/50 dark:border-neutral-950">
              <div className="rounded-[21px] border border-neutral-950/20 dark:border-neutral-900/70">
                <div className="relative flex w-full flex-col gap-3 rounded-[20px] border border-white/50 bg-white/40 p-4 pr-14 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-2.5 sm:px-6 dark:border-neutral-700/50 dark:bg-black/40">
                  <div className="flex flex-1 flex-col items-center gap-3 text-center sm:flex-row sm:flex-wrap sm:text-left lg:justify-center lg:gap-x-6">
                    <div className="flex items-center gap-3 text-left">
                      <div className="bg-primary/10 border-primary/20 dark:bg-primary/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border shadow-sm backdrop-blur-sm">
                        <Icon
                          icon="solar:gift-bold-duotone"
                          className="text-primary h-5 w-5"
                        />
                      </div>
                      <p className="text-sm font-medium text-neutral-900 sm:text-base dark:text-neutral-50">
                        <span className="font-bold">
                          Exclusive Launch Offer!
                        </span>{' '}
                        <span className="hidden min-[380px]:inline">First 100 users get Pro for </span>
                        <span className="inline min-[380px]:hidden">Pro for </span>
                        <span className="decoration-primary/40 font-bold underline decoration-2 underline-offset-4">
                          FREE
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl bg-neutral-950/5 px-3 py-1.5 shadow-inner ring-1 ring-black/5 backdrop-blur-md dark:bg-white/5 dark:ring-white/10">
                      <Icon
                        icon="solar:ticket-bold-duotone"
                        className="h-4 w-4 text-neutral-500 dark:text-neutral-400"
                      />
                      <span className="text-xs font-bold tracking-wider text-neutral-600 uppercase sm:text-sm dark:text-neutral-300">
                        Code:{' '}
                        <span className="text-primary font-mono select-all">
                          prompt4yasir
                        </span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleDismiss}
                    className="absolute top-3.5 right-3.5 shrink-0 rounded-2xl p-2 text-neutral-400 transition-all hover:bg-black/5 hover:text-neutral-900 dark:text-neutral-500 dark:hover:bg-white/10 dark:hover:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary/20 sm:relative sm:top-auto sm:right-auto sm:ml-4"
                    aria-label="Dismiss banner"
                  >
                    <Icon
                      icon="solar:close-circle-bold-duotone"
                      className="h-8 w-8"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
