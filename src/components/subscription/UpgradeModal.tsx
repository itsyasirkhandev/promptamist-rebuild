'use client';

import { useTransition } from 'react';
import { createCheckoutSession } from '@/app/actions/polar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

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

  const handleUpgrade = () => {
    const currentOrigin =
      typeof window !== 'undefined' ? window.location.origin : undefined;
    startTransition(async () => {
      const result = await createCheckoutSession(currentOrigin);
      if (result && !result.success) {
        toast.error(result.error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden border-0 p-0 shadow-2xl sm:max-w-[425px]">
        {/* Background Decorative Header */}
        <div className="from-primary via-primary/80 to-primary/60 relative h-32 bg-gradient-to-br">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
          <div className="bg-card border-border absolute -bottom-10 left-1/2 -translate-x-1/2 rounded-2xl border p-4 shadow-xl">
            <Icon
              icon="solar:crown-star-bold-duotone"
              className="text-primary h-10 w-10"
            />
          </div>
        </div>

        <div className="px-6 pt-14 pb-6 text-center">
          <DialogHeader>
            <DialogTitle className="text-foreground text-center text-2xl font-bold tracking-tight">
              Upgrade to Pro
            </DialogTitle>
            <p className="text-muted-foreground mt-2 text-sm">
              {limitReached
                ? "You've reached your 50-prompt Hobby limit. Upgrade to unlock boundless creativity."
                : 'Supercharge your workflow with unlimited prompts, unlimited dynamic prompt templates, and priority support.'}
            </p>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div className="bg-primary/5 border-primary/10 rounded-2xl border p-5 text-left">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-foreground text-lg font-semibold">
                  Pro Plan
                </span>
                <span className="text-primary text-xl font-bold">
                  $5
                  <span className="text-muted-foreground text-sm font-normal">
                    /mo
                  </span>
                </span>
              </div>

              <ul className="space-y-3">
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
                    className="text-foreground/80 flex items-center gap-3 text-sm font-medium"
                  >
                    <Icon
                      icon={feature.icon}
                      className="text-primary h-5 w-5 shrink-0"
                    />
                    {feature.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-primary/10 border-primary/20 flex items-center justify-between rounded-xl border px-4 py-2 text-sm shadow-sm">
              <div className="flex items-center gap-2">
                <Icon
                  icon="solar:ticket-bold-duotone"
                  className="text-primary h-4 w-4"
                />
                <span className="text-foreground/80 font-medium">
                  Launch Promo:
                </span>
                <span className="text-primary font-mono font-bold">
                  prompt4yasir
                </span>
              </div>
              <span className="text-muted-foreground text-xs font-semibold uppercase">
                100% OFF
              </span>
            </div>

            <Button
              onClick={handleUpgrade}
              disabled={isPending}
              size="lg"
              className="h-12 w-full rounded-xl text-base shadow-md transition-all"
            >
              {isPending ? (
                <>
                  <Icon
                    icon="lucide:loader-2"
                    className="mr-2 h-5 w-5 animate-spin"
                  />
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
