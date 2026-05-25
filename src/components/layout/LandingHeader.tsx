'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Unauthenticated } from 'convex/react';
import { Menu } from 'lucide-react';
import { Icon } from '@iconify/react';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function LandingHeader() {
  const pathname = usePathname();

  // Helper function to check active path
  const isActive = (path: string) => pathname === path;

  // Common nav link style with elegant underline expand and glow on hover
  const navLinkStyle = (path: string) => {
    const active = isActive(path);
    return `relative text-sm font-medium transition-all duration-300 py-1 ${
      active
        ? 'text-neutral-900 dark:text-neutral-50 after:w-full'
        : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50 after:w-0'
    } after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full hover:after:shadow-[0_0_8px_var(--primary)]`;
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full shrink-0 items-center justify-between border-b border-neutral-200/60 bg-white/50 px-4 backdrop-blur-xl transition-all sm:px-6 dark:border-neutral-800/80 dark:bg-stone-950/50">
      {/* Left Section: Logo & Branding */}
      <Link
        href="/"
        className="flex items-center gap-2 font-semibold tracking-tight text-neutral-900 transition-colors hover:opacity-90 dark:text-neutral-50"
      >
        <Logo className="h-8 w-8" />
        <span className="text-xl font-semibold">Promptamist</span>
      </Link>

      {/* Center Section: Navigation Links (Desktop) */}
      <nav className="hidden items-center gap-8 md:flex">
        <Link href="/pricing" className={navLinkStyle('/pricing')}>
          Pricing
        </Link>
        <Link href="/marketplace" className={navLinkStyle('/marketplace')}>
          Marketplace
        </Link>
        <a
          href="https://github.com/itsyasirkhandev/promptamist-rebuild"
          target="_blank"
          rel="noopener noreferrer"
          className="after:bg-primary relative py-1 text-sm font-medium text-neutral-600 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:transition-all after:duration-300 hover:text-neutral-900 hover:after:w-full hover:after:shadow-[0_0_8px_var(--primary)] dark:text-neutral-400 dark:hover:text-neutral-50"
        >
          GitHub
        </a>
      </nav>

      {/* Right Section: Theme Toggle & CTA (Desktop & Mobile) */}
      <div className="flex items-center gap-4">
        <ThemeToggle />

        {/* Desktop Premium CTA for Unauthenticated Users */}
        <div className="hidden md:block">
          <Unauthenticated>
            <Link
              href="/sign-up"
              className="group relative inline-block rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="rounded-full bg-gradient-to-b from-black/10 to-black p-[1px] dark:bg-gradient-to-b dark:from-white dark:to-white/80">
                <div className="rounded-full bg-gradient-to-b from-neutral-800 to-black px-5 py-2 text-sm font-semibold text-white/90 shadow-sm transition-all duration-300 hover:from-neutral-700 hover:to-black/90 dark:from-neutral-200 dark:to-neutral-50 dark:text-black/80 dark:hover:from-white dark:hover:to-neutral-100">
                  Get Started
                </div>
              </div>
            </Link>
          </Unauthenticated>
        </div>

        {/* Mobile Hamburger / Sheet Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-50"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-full flex-col border-l border-neutral-200/60 bg-white/80 p-6 backdrop-blur-xl sm:max-w-sm dark:border-neutral-800/80 dark:bg-stone-950/80"
            >
              <div className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>
                  Explore pricing, marketplace, open-source code on GitHub, and
                  get started with Promptamist.
                </SheetDescription>
              </div>

              {/* Top Branding Section in Mobile Drawer */}
              <div className="mt-2 mb-8 flex items-center gap-2">
                <Logo className="h-8 w-8" />
                <span className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
                  Promptamist
                </span>
              </div>

              {/* Stacked Links for Mobile */}
              <nav className="flex flex-grow flex-col gap-2">
                <SheetTrigger asChild>
                  <Link
                    href="/pricing"
                    className={`flex items-center justify-between border-b border-neutral-100 py-3 text-base font-medium transition-colors dark:border-neutral-900 ${
                      isActive('/pricing')
                        ? 'text-neutral-900 dark:text-neutral-50'
                        : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50'
                    }`}
                  >
                    <span>Pricing</span>
                  </Link>
                </SheetTrigger>
                <SheetTrigger asChild>
                  <Link
                    href="/marketplace"
                    className={`flex items-center justify-between border-b border-neutral-100 py-3 text-base font-medium transition-colors dark:border-neutral-900 ${
                      isActive('/marketplace')
                        ? 'text-neutral-900 dark:text-neutral-50'
                        : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50'
                    }`}
                  >
                    <span>Marketplace</span>
                  </Link>
                </SheetTrigger>
                <a
                  href="https://github.com/itsyasirkhandev/promptamist-rebuild"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-neutral-100 py-3 text-base font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:border-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
                >
                  GitHub
                </a>
              </nav>

              {/* Get Started Button at Bottom of Drawer (Unauthenticated Only) */}
              <Unauthenticated>
                <div className="mt-auto border-t border-neutral-100 pt-6 dark:border-neutral-900">
                  <SheetTrigger asChild>
                    <Link
                      href="/sign-up"
                      className="group relative block w-full rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <div className="rounded-full bg-gradient-to-b from-black/10 to-black p-[1px] dark:bg-gradient-to-b dark:from-white dark:to-white/80">
                        <div className="rounded-full bg-gradient-to-b from-neutral-800 to-black py-3 text-center text-sm font-semibold text-white/90 shadow-sm transition-all duration-300 hover:from-neutral-700 hover:to-black/90 dark:from-neutral-200 dark:to-neutral-50 dark:text-black/80 dark:hover:from-white dark:hover:to-neutral-100">
                          Get Started
                        </div>
                      </div>
                    </Link>
                  </SheetTrigger>
                </div>
              </Unauthenticated>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
