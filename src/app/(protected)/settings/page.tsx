import { Metadata } from 'next';
import { ManageSubscriptionButton } from '@/components/subscription/ManageSubscriptionButton';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account and subscription settings.',
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg leading-6 font-medium text-neutral-900 dark:text-neutral-100">
            Settings
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="border-t border-neutral-200 pt-6 dark:border-neutral-800">
          <dl className="divide-y divide-neutral-200 dark:divide-neutral-800">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                Subscription
              </dt>
              <dd className="mt-1 flex text-sm text-neutral-900 sm:col-span-2 sm:mt-0 dark:text-neutral-100">
                <span className="flex-grow">
                  Manage your subscription, billing details, and view invoices
                  through the customer portal.
                </span>
                <span className="ml-4 flex-shrink-0">
                  <ManageSubscriptionButton />
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
