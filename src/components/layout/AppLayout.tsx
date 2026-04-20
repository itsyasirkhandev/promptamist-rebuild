'use client';

import * as React from 'react';
import { Sidebar } from './Sidebar';
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

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="bg-background flex min-h-screen w-full">
        <Authenticated>
          <Sidebar />
        </Authenticated>

        <SidebarInset className="flex flex-1 flex-col">
          <header className="bg-background/80 sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b px-4 backdrop-blur">
            <div className="flex items-center gap-4">
              <Authenticated>
                <SidebarTrigger className="hidden lg:flex" />
              </Authenticated>
              <Link
                href="/"
                className="flex items-center gap-2 font-bold tracking-tight"
              >
                <span className="text-xl">Promptamist</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Authenticated>
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

          <Authenticated>
            <MobileBottomNav />
          </Authenticated>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
