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

  if (isPublicPromptPage) {
    return (
      <div className="bg-background flex min-h-screen w-full flex-col">
        <header className="bg-background/80 sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b px-4 backdrop-blur">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight"
          >
            <Logo className="text-primary h-8 w-8" />
            <span className="text-2xl">Promptamist</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Unauthenticated>
              <Button size="sm" asChild>
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
      <div className="bg-background flex min-h-screen w-full">
        <Authenticated>
          <AppSidebar />
        </Authenticated>

        <SidebarInset className="flex flex-1 flex-col">
          <header className="bg-background/80 sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b px-4 backdrop-blur">
            <div className="flex items-center gap-4">
              <Authenticated>
                <SidebarTrigger className="hidden lg:flex" />
              </Authenticated>
              <Link
                href="/"
                className="flex items-center gap-2 font-semibold tracking-tight"
              >
                <Logo className="text-primary h-8 w-8" />
                <span className="text-2xl">Promptamist</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Authenticated>
                <SubscriptionButton />
                <UserButton />
              </Authenticated>
              <Unauthenticated>
                <Button size="sm" asChild>
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
