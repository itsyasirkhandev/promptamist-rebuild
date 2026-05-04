'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { AppSidebar } from './AppSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { Authenticated, Unauthenticated } from 'convex/react';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';

import { Logo } from '@/components/Logo';
import { SubscriptionButton } from '@/components/subscription/SubscriptionButton';
import { Footer } from './Footer';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPromptPage = pathname?.startsWith('/p/');
  const isAuthPage =
    pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up');

  if (isAuthPage) {
    return (
      <div className="min-h-screen w-full bg-neutral-50 transition-colors duration-500 dark:bg-stone-950">
        {children}
      </div>
    );
  }

  if (isPublicPromptPage) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-neutral-50 transition-colors duration-500 dark:bg-stone-950">
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-neutral-200/60 bg-white/50 px-4 backdrop-blur-xl transition-all dark:border-neutral-800/80 dark:bg-stone-950/50">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
          >
            <Logo className="h-8 w-8" />
            <span className="text-2xl">Promptamist</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Unauthenticated>
              <Button size="sm" asChild className="rounded-full px-5">
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </Unauthenticated>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-neutral-50 transition-colors duration-500 dark:bg-stone-950">
        <Authenticated>
          <AppSidebar />
        </Authenticated>

        <SidebarInset className="flex flex-1 flex-col bg-transparent">
          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-neutral-200/60 bg-white/50 px-4 backdrop-blur-xl transition-all sm:px-6 dark:border-neutral-800/80 dark:bg-stone-950/50">
            <div className="flex items-center gap-2 sm:gap-4">
              <Authenticated>
                <SidebarTrigger className="hidden text-neutral-500 hover:text-neutral-900 lg:flex dark:text-neutral-400 dark:hover:text-neutral-50" />
              </Authenticated>
              <Link
                href="/"
                className="flex items-center gap-1.5 font-semibold tracking-tight text-neutral-900 sm:gap-2 dark:text-neutral-50"
              >
                <Logo className="h-7 w-7 sm:h-8 sm:w-8" />
                <span className="text-xl sm:text-2xl">Promptamist</span>
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggle />
              <Authenticated>
                <div className="hidden sm:flex">
                  <SubscriptionButton />
                </div>
                <UserButton />
              </Authenticated>
              <Unauthenticated>
                <Button size="sm" asChild className="rounded-full px-5">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </Unauthenticated>
            </div>
          </header>

          <main className="flex-1 pb-20 lg:pb-0">{children}</main>

          <Unauthenticated>
            <Footer />
          </Unauthenticated>

          <Authenticated>
            <MobileBottomNav />
          </Authenticated>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
