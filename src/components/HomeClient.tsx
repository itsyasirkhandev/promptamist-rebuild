'use client';
import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';
import { DashboardClient } from './DashboardClient';
import { LandingPage } from './marketing/LandingPage';
import { Loader } from '@/components/ui/Loader';

export function HomeClient() {
  return (
    <div className="relative min-h-screen bg-neutral-50 transition-colors duration-500 dark:bg-stone-950">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute top-0 left-1/2 h-[500px] w-full max-w-6xl -translate-x-1/2 rounded-full opacity-50 blur-[120px]" />
      </div>
      <main className="relative z-10 flex-1">
        <AuthLoading>
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="bg-primary/10 absolute -inset-6 animate-pulse rounded-full blur-2xl" />
              <Loader size={64} className="text-primary" variant="session" />
            </div>
          </div>
        </AuthLoading>
        <Authenticated>
          <DashboardClient />
        </Authenticated>
        <Unauthenticated>
          <LandingPage />
        </Unauthenticated>
      </main>
    </div>
  );
}
