'use client';

import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="bg-background min-h-screen">
      <nav className="border-border border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            Promptamist
          </Link>

          <div className="flex items-center gap-4">
            <Authenticated>
              <Button variant="ghost" asChild>
                <Link href="/prompts">Prompts</Link>
              </Button>
              <UserButton />
            </Authenticated>

            <Unauthenticated>
              <div className="flex gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </div>
            </Unauthenticated>
          </div>
        </div>
      </nav>

      <main>
        <AuthLoading>
          <div className="flex justify-center py-20">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          </div>
        </AuthLoading>

        <Authenticated>
          <section className="py-20 text-center">
            <h1 className="mb-4 text-4xl font-bold">
              Welcome back to Promptamist!
            </h1>
            <p className="text-muted-foreground mb-8">
              Continue managing your AI prompts
            </p>
            <Button size="lg" asChild>
              <Link href="/prompts">Go to Prompts →</Link>
            </Button>
          </section>
        </Authenticated>

        <Unauthenticated>
          <section className="py-20 text-center">
            <h1 className="mb-6 text-5xl font-bold">
              AI-Powered Prompt Management
            </h1>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
              Organize, test, and optimize your AI prompts with our intelligent
              platform built for power users.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/sign-up">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </div>
          </section>
        </Unauthenticated>
      </main>
    </div>
  );
}
