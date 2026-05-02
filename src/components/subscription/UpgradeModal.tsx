'use client';

import { useTransition } from 'react';
import { createCheckoutSession } from '@/app/actions/polar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Sparkles } from 'lucide-react';

import { toast } from 'sonner';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            Upgrade to Pro
          </DialogTitle>
          <DialogDescription>
            You have reached the maximum limit of 50 prompts on the Hobby tier.
            Upgrade to Pro to create unlimited prompts and unlock more features!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 flex flex-col gap-2">
            <h3 className="font-semibold text-lg">Pro Tier</h3>
            <p className="text-sm text-muted-foreground">
              $5/month
            </p>
            <ul className="text-sm space-y-2 mt-2">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Unlimited Prompts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Unlimited Templates
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Premium Support
              </li>
            </ul>
          </div>
          <Button 
            onClick={handleUpgrade} 
            disabled={isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Subscribe for $5/mo'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
