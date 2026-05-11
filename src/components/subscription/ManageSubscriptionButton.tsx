'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { createCustomerPortalSession } from '@/app/actions/polar';
import { toast } from 'sonner';

export function ManageSubscriptionButton() {
  const [isPending, startTransition] = useTransition();

  const handleManage = () => {
    startTransition(async () => {
      try {
        const result = await createCustomerPortalSession();
        if (result.success) {
          window.location.href = result.url;
        } else {
          toast.error(result.error || 'Failed to open customer portal');
        }
      } catch (error) {
        toast.error('An unexpected error occurred');
        console.error(error);
      }
    });
  };

  return (
    <Button onClick={handleManage} disabled={isPending} variant="outline">
      {isPending ? 'Loading...' : 'Manage Subscription'}
    </Button>
  );
}
