'use client';

import {
  Authenticated,
  Unauthenticated,
  AuthLoading,
  useQuery,
} from 'convex/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '../../convex/_generated/api';
import { FileText, LayoutTemplate, Globe } from 'lucide-react';
import { Icon } from '@iconify/react';

export function HomeClient() {
  return (
    <main>
      <AuthLoading>
        <div className="flex justify-center py-20">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
        </div>
      </AuthLoading>

      <Authenticated>
        <div className="container mx-auto px-4 py-10 md:px-6">
          <section className="mb-10 text-center">
            <h1 className="mb-4 text-4xl font-semibold">
              Welcome back to Promptamist!
            </h1>
            <p className="text-muted-foreground mb-8">
              Here is an overview of your prompt repository.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/prompts">Go to Prompts →</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a
                  href="https://github.com/itsyasirkhandev/promptamist-rebuild"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Icon icon="mdi:github" className="h-5 w-5" />
                  GitHub Repository
                </a>
              </Button>
            </div>
          </section>

          <DashboardStats />
        </div>
      </Authenticated>

      <Unauthenticated>
        <section className="py-20 text-center">
          <h1 className="mb-6 text-4xl font-semibold">
            AI-Powered Prompt Management
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-2xl">
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
  );
}

function DashboardStats() {
  const stats = useQuery(api.authed.prompts.getPromptStats);

  if (stats === undefined) {
    return (
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
        <Skeleton className="h-[120px] w-full rounded-xl" />
        <Skeleton className="h-[120px] w-full rounded-xl" />
        <Skeleton className="h-[120px] w-full rounded-xl" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="py-4 text-center text-red-500">
        Failed to load statistics.
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
          <FileText className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Template Prompts
          </CardTitle>
          <LayoutTemplate className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.templates}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Public Prompts</CardTitle>
          <Globe className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.public}</div>
        </CardContent>
      </Card>
    </div>
  );
}
