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
import { Icon } from '@iconify/react';
import { formatRelativeTime } from '@/lib/utils';

import { useState } from 'react';

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
  const [oneWeekAgo] = useState(() => Date.now() - 7 * 24 * 60 * 60 * 1000);
  const stats = useQuery(api.authed.prompts.getPromptStats, { oneWeekAgo });

  if (stats === undefined) {
    return (
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-[120px] w-full rounded-xl" />
        <Skeleton className="h-[120px] w-full rounded-xl" />
        <Skeleton className="h-[120px] w-full rounded-xl" />
        <Skeleton className="h-[120px] w-full rounded-xl" />
        <Skeleton className="col-span-1 h-[60px] w-full rounded-xl md:col-span-2 lg:col-span-4" />
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

  const hasNoActivity = stats.total === 0;

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
            <Icon
              icon="lucide:file-text"
              className="text-muted-foreground h-4 w-4"
            />
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
            <Icon
              icon="lucide:layout-template"
              className="text-muted-foreground h-4 w-4"
            />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.templates}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Public Prompts
            </CardTitle>
            <Icon
              icon="lucide:globe"
              className="text-muted-foreground h-4 w-4"
            />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.public}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Week</CardTitle>
            <Icon
              icon="lucide:calendar-plus"
              className="text-muted-foreground h-4 w-4"
            />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.newThisWeek}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="flex items-center gap-2 py-4">
          <Icon icon="lucide:clock" className="text-muted-foreground h-5 w-5" />
          <span className="text-muted-foreground text-sm font-medium">
            {hasNoActivity || !stats.lastActivityAt
              ? 'No activity yet.'
              : `Last prompt created ${formatRelativeTime(stats.lastActivityAt)}.`}
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
