'use client';

import { useTransition } from 'react';
import { useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';
import { Loader } from '@/components/ui/Loader';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  limitReached?: boolean;
}

export function UpgradeModal({
  open,
  onOpenChange,
  limitReached = false,
}: UpgradeModalProps) {
  const [isPending, startTransition] = useTransition();
  const generateCheckout = useAction(api.authed.polar.generateCheckoutUrl);

  const handleUpgrade = () => {
    const currentOrigin =
      typeof window !== 'undefined' ? window.location.origin : undefined;
    startTransition(async () => {
      try {
        const result = await generateCheckout({ clientOrigin: currentOrigin });
        if (result && result.url) {
          window.location.href = result.url;
        } else {
          toast.error('Failed to generate checkout session URL');
        }
      } catch (error) {
        toast.error((error as Error).message || 'Checkout failed');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden border-0 p-0 shadow-2xl sm:max-w-[425px]">
        {/* Background Decorative Header */}
        <div className="from-primary via-primary/80 to-primary/60 relative h-28 bg-gradient-to-br sm:h-32">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
          <div className="bg-card border-border absolute -bottom-8 left-1/2 -translate-x-1/2 rounded-2xl border p-3.5 shadow-xl sm:-bottom-10 sm:p-4">
            <Icon
              icon="solar:crown-star-bold-duotone"
              className="text-primary h-8 w-8 sm:h-10 sm:w-10"
            />
          </div>
        </div>

        <div className="px-6 pt-14 pb-6 text-center">
          <DialogHeader>
            <DialogTitle className="text-foreground text-center text-xl font-bold tracking-tight sm:text-2xl">
              Upgrade to Pro
            </DialogTitle>
            <p className="text-muted-foreground mt-1.5 text-xs sm:mt-2 sm:text-sm">
              {limitReached
                ? "You've reached your 50-prompt Hobby limit. Upgrade to unlock boundless creativity."
                : 'Supercharge your workflow with unlimited prompts, templates, and priority support.'}
            </p>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div className="bg-primary/5 border-primary/10 rounded-2xl border p-5 text-left">
              <div className="mb-3 flex items-center justify-between sm:mb-4">
                <span className="text-foreground text-base font-semibold sm:text-lg">
                  Pro Plan
                </span>
                <span className="text-primary text-lg font-bold sm:text-xl">
                  $5
                  <span className="text-muted-foreground text-xs font-normal sm:text-sm">
                    /mo
                  </span>
                </span>
              </div>

              <ul className="space-y-2.5 sm:space-y-3">
                {[
                  {
                    icon: 'solar:infinity-bold-duotone',
                    text: 'Create Unlimited Dynamic Prompts',
                  },
                  {
                    icon: 'solar:layers-bold-duotone',
                    text: ' Create Unlimited Static prompts',
                  },
                  {
                    icon: 'solar:bolt-circle-bold-duotone',
                    text: 'Premium Support',
                  },
                ].map((feature, i) => (
                  <li
                    key={i}
                    className="text-foreground/80 flex items-center gap-2.5 text-[13px] font-medium sm:gap-3 sm:text-sm"
                  >
                    <Icon
                      icon={feature.icon}
                      className="text-primary h-4.5 w-4.5 shrink-0 sm:h-5 sm:w-5"
                    />
                    {feature.text}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              onClick={handleUpgrade}
              disabled={isPending}
              size="lg"
              className="h-12 w-full rounded-xl text-base shadow-md transition-all"
            >
              {isPending ? (
                <>
                  <Loader size={20} className="mr-2" />
                  Securing checkout...
                </>
              ) : (
                <span className="flex items-center gap-2">
                  <Icon icon="solar:rocket-bold-duotone" className="h-5 w-5" />
                  Subscribe for $5/month
                </span>
              )}
            </Button>

            <p className="text-muted-foreground mt-3 flex items-center justify-center gap-1.5 text-xs">
              <Icon
                icon="solar:lock-keyhole-minimalistic-bold-duotone"
                className="h-4 w-4"
              />
              Secure payment via Polar.sh
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
