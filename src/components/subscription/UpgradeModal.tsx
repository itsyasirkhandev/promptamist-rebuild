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

export function UpgradeModal({ open, onOpenChange, limitReached = false }: UpgradeModalProps) {
  const [isPending, startTransition] = useTransition();

  const handleUpgrade = () => {
    startTransition(async () => {
      const result = await createCheckoutSession();
      if (result && !result.success) {
        toast.error(result.error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden p-0 border-0 shadow-2xl">
        {/* Background Decorative Header */}
        <div className="h-32 bg-gradient-to-br from-primary via-primary/80 to-primary/60 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 p-4 bg-card rounded-2xl shadow-xl border border-border">
            <Icon icon="solar:crown-star-bold-duotone" className="w-10 h-10 text-primary" />
          </div>
        </div>

        <div className="px-6 pb-6 pt-14 text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-foreground text-center">
              Upgrade to Pro
            </DialogTitle>
            <p className="text-muted-foreground text-sm mt-2">
              {limitReached 
                ? "You've reached your 50-prompt Hobby limit. Upgrade to unlock boundless creativity."
                : "Supercharge your workflow with unlimited prompts, premium templates, and priority support."}
            </p>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10 text-left">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-lg text-foreground">Pro Plan</span>
                <span className="text-xl font-bold text-primary">$5<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
              </div>
              
              <ul className="space-y-3">
                {[
                  { icon: 'solar:infinity-bold-duotone', text: 'Unlimited Prompts' },
                  { icon: 'solar:layers-bold-duotone', text: 'Unlimited Templates' },
                  { icon: 'solar:bolt-circle-bold-duotone', text: 'Premium Support' },
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                    <Icon icon={feature.icon} className="w-5 h-5 text-primary shrink-0" />
                    {feature.text}
                  </li>
                ))}
              </ul>
            </div>

            <Button 
              onClick={handleUpgrade} 
              disabled={isPending}
              size="lg"
              className="w-full shadow-md transition-all rounded-xl h-12 text-base"
            >
              {isPending ? (
                <>
                  <Icon icon="lucide:loader-2" className="mr-2 h-5 w-5 animate-spin" />
                  Securing checkout...
                </>
              ) : (
                <span className="flex items-center gap-2">
                  <Icon icon="solar:rocket-bold-duotone" className="w-5 h-5" />
                  Subscribe for $5/month
                </span>
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
              <Icon icon="solar:lock-keyhole-minimalistic-bold-duotone" className="w-4 h-4" />
              Secure payment via Polar.sh
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
