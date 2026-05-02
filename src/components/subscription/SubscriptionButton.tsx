'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { UpgradeModal } from './UpgradeModal';
import { useState, useMemo } from 'react';

export function SubscriptionButton() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const currentUser = useQuery(api.users.getCurrentUser);
  // eslint-disable-next-line react-hooks/purity
  const oneWeekAgo = useMemo(() => Date.now() - 7 * 24 * 60 * 60 * 1000, []);
  const stats = useQuery(api.authed.prompts.getPromptStats, { oneWeekAgo });

  if (currentUser === undefined || stats === undefined) {
    return <div className="h-9 w-24 animate-pulse bg-muted rounded-md" />;
  }

  if (!currentUser) return null;

  const isPro = currentUser.subscriptionTier === 'pro';

  return (
    <>
      <div className="flex items-center gap-4">
        {!isPro && (
          <div className="text-sm text-muted-foreground hidden md:block">
            {stats.total} / 50 Prompts
          </div>
        )}
        {!isPro ? (
          <Button 
            variant="default" 
            onClick={() => setShowUpgradeModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
          >
            Upgrade to Pro
          </Button>
        ) : (
          <div className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
            Pro Member
          </div>
        )}
      </div>

      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
    </>
  );
}
