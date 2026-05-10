import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import React from 'react';

interface AuthWrapperProps {
  title: string;
  subtitleText: string;
  linkText: string;
  linkHref: string;
  children: React.ReactNode;
}

export function AuthWrapper({
  title,
  subtitleText,
  linkText,
  linkHref,
  children,
}: AuthWrapperProps) {
  return (
    <div className="bg-background relative flex min-h-screen w-full flex-col items-center justify-center gap-8 px-4 py-12">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Logo Section */}
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center gap-3 transition-transform hover:scale-105"
        >
          <Logo className="text-primary h-8 w-8" />
          <span className="text-xl font-bold tracking-tight">Promptamist</span>
        </Link>
      </div>

      {/* Auth Card */}
      <div className="border-muted-foreground/20 bg-card flex w-full max-w-sm flex-col items-start gap-y-4 rounded-md border p-5 shadow-sm">
        <div className="flex flex-col items-start gap-y-1">
          <h1 className="text-foreground text-xl font-semibold">{title}</h1>
          <div className="text-sm">
            <span className="text-muted-foreground">{subtitleText} </span>
            <Link
              href={linkHref}
              className="text-primary font-medium hover:underline"
            >
              {linkText}
            </Link>
          </div>
        </div>

        <div className="flex w-full flex-col items-center">{children}</div>
      </div>

      {/* Footer Text */}
      <div className="text-muted-foreground/50 max-w-xs text-center text-xs leading-relaxed">
        By continuing, you agree to our{' '}
        <Link
          href="/terms"
          className="hover:text-primary underline transition-colors"
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href="/privacy"
          className="hover:text-primary underline transition-colors"
        >
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
}
