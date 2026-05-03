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
              Your AI Prompt Library
            </h1>
            <p className="text-muted-foreground mb-8">
              Manage your ChatGPT, Claude, and Gemini prompts in one place.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/prompts">Go to Prompts &rarr;</Link>
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
        {/* Hero Section */}
        <section
          aria-label="Hero — AI Prompt Management Platform"
          className="px-4 py-24 text-center"
        >
          <div className="mx-auto max-w-4xl">
            <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
              <Icon icon="lucide:sparkles" className="h-4 w-4" />
              The AI Prompt Manager Built for Power Users
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
              Organize, Test &amp; Share
              <span className="text-primary block">
                Your AI Prompts
              </span>
            </h1>
            <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-xl leading-relaxed">
              Stop losing your best prompts in endless chat logs. Promptamist gives you a structured library for all your{' '}
              <strong>ChatGPT, Claude, and Gemini</strong> prompts — with reusable templates, dynamic variables, and one-click public sharing.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="gap-2 px-8" asChild>
                <Link href="/sign-up">
                  <Icon icon="lucide:rocket" className="h-5 w-5" />
                  Start Free — No Credit Card
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <Link href="/sign-in">
                  <Icon icon="lucide:log-in" className="h-5 w-5" />
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          aria-label="Key Features"
          className="bg-muted/30 border-t px-4 py-20"
        >
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold tracking-tight">
                Everything You Need for AI Prompt Engineering
              </h2>
              <p className="text-muted-foreground text-lg">
                A professional workspace purpose-built for AI prompt management.
              </p>
            </div>
            <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: 'lucide:layout-template',
                  term: 'Dynamic Prompt Templates',
                  desc: 'Build reusable prompt templates with named variables. Fill in values instantly to generate customized prompts for any task.',
                },
                {
                  icon: 'lucide:library',
                  term: 'Organized Prompt Library',
                  desc: 'Tag, filter, and search your entire prompt collection. Never lose a great prompt again — find it in seconds.',
                },
                {
                  icon: 'lucide:share-2',
                  term: 'One-Click Public Sharing',
                  desc: 'Share any prompt via a public URL. Anyone can view and use your prompt template without needing an account.',
                },
                {
                  icon: 'lucide:zap',
                  term: 'Works with Any LLM',
                  desc: 'Use your prompts with ChatGPT, Claude, Gemini, Mistral, Llama, or any other AI model — Promptamist is model-agnostic.',
                },
                {
                  icon: 'lucide:shield-check',
                  term: 'Private by Default',
                  desc: 'Your prompts are private by default. Choose exactly which prompts to share publicly and which to keep for yourself.',
                },
                {
                  icon: 'lucide:trending-up',
                  term: 'Prompt Statistics',
                  desc: 'Track your prompt library growth. See total prompts, templates, public shares, and your activity over time.',
                },
              ].map(({ icon, term, desc }) => (
                <div
                  key={term}
                  className="bg-background rounded-xl border p-6 shadow-sm"
                >
                  <dt className="mb-3 flex items-center gap-3">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                      <Icon icon={icon} className="text-primary h-5 w-5" />
                    </div>
                    <span className="font-semibold">{term}</span>
                  </dt>
                  <dd className="text-muted-foreground text-sm leading-relaxed">
                    {desc}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Solutions Section */}
        <section
          aria-label="Industry Solutions"
          className="px-4 py-20"
        >
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold tracking-tight">
                Built for Every Professional AI Workflow
              </h2>
              <p className="text-muted-foreground text-lg">
                Specialized tools for the world&apos;s most demanding AI power users.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="group relative overflow-hidden rounded-2xl border bg-card p-8 transition-all hover:shadow-md">
                <Icon icon="lucide:pen-tool" className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-2xl font-bold">Content Writing</h3>
                <p className="mb-6 text-muted-foreground">
                  Scale your blog production and maintain brand voice with structured storytelling templates.
                </p>
                <Button variant="link" className="px-0 text-primary" asChild>
                  <Link href="/solutions/content-writing">
                    Explore Writing Solutions &rarr;
                  </Link>
                </Button>
              </div>
              <div className="group relative overflow-hidden rounded-2xl border bg-card p-8 transition-all hover:shadow-md">
                <Icon icon="lucide:code-2" className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-2xl font-bold">Software Development</h3>
                <p className="mb-6 text-muted-foreground">
                  Manage complex system prompts and architectural context for your AI coding agents.
                </p>
                <Button variant="link" className="px-0 text-primary" asChild>
                  <Link href="/solutions/software-development">
                    Explore Dev Solutions &rarr;
                  </Link>
                </Button>
              </div>
            </div>
            <div className="mt-12 text-center">
              <Button variant="outline" asChild>
                <Link href="/solutions">View All Solutions</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Social Proof / CTA */}
        <section
          aria-label="Call to action"
          className="px-4 py-20 text-center"
        >
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Your Prompt Library Awaits
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Join AI power users who have already organized their prompt workflows with Promptamist. Free to start, no credit card required.
            </p>
            <Button size="lg" className="gap-2 px-10" asChild>
              <Link href="/sign-up">
                <Icon icon="lucide:arrow-right" className="h-5 w-5" />
                Get Started Free
              </Link>
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
