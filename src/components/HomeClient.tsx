'use client';

import {
  Authenticated,
  Unauthenticated,
  AuthLoading,
  useQuery,
} from 'convex/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useMemo } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { PromptCard } from '@/components/prompts/PromptCard';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@iconify/react';
import { api } from '../../convex/_generated/api';
import { cn } from '@/lib/utils';
import { Doc } from '../../convex/_generated/dataModel';

export function HomeClient() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-chart-1/10 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[25%] h-[25%] rounded-full bg-chart-2/5 blur-[80px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <main className="relative z-10 flex-1">
        <AuthLoading>
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 blur-xl rounded-full animate-pulse" />
              <div className="border-primary relative h-12 w-12 animate-spin rounded-full border-4 border-t-transparent shadow-xl" />
            </div>
            <p className="text-muted-foreground animate-pulse font-medium">Securing your session...</p>
          </div>
        </AuthLoading>

        <Authenticated>
          <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 lg:px-8">
            <div className="space-y-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>Home</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h1 className="text-4xl font-semibold tracking-tight">
                    Welcome Back
                  </h1>
                  <p className="text-muted-foreground">
                    Here's what's happening with your prompt library.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Button asChild className="gap-2">
                    <Link href="/prompts/create">
                      <Icon icon="lucide:plus" width={18} />
                      New Prompt
                    </Link>
                  </Button>
                </div>
              </header>
            </div>

            <DashboardStats />

            <Separator />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">Recent Prompts</h2>
                  <p className="text-muted-foreground text-sm">
                    Continue where you left off.
                  </p>
                </div>
                <Button variant="ghost" asChild>
                  <Link href="/prompts" className="gap-2">
                    View All <Icon icon="lucide:arrow-right" width={16} />
                  </Link>
                </Button>
              </div>
              <RecentPrompts />
            </div>
          </div>
        </Authenticated>

        <Unauthenticated>
          {/* Hero Section */}
          <section
            aria-label="Hero — AI Prompt Management Platform"
            className="px-4 py-24 md:py-32 text-center"
          >
            <div className="mx-auto max-w-4xl space-y-8">
              <div className="bg-primary/10 text-primary border border-primary/20 mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-500">
                <Icon icon="lucide:sparkles" className="h-4 w-4" />
                The AI Prompt Manager Built for Power Users
              </div>
              <h1 className="font-heading font-extrabold tracking-tight text-balance animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ fontSize: 'var(--text-4xl)', lineHeight: '1' }}>
                Organize, Test & Share
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-chart-1 block mt-2">
                  Your AI Prompts
                </span>
              </h1>
              <p className="text-muted-foreground mx-auto max-w-2xl text-balance animate-in fade-in slide-in-from-bottom-6 duration-1000"
                style={{ fontSize: 'var(--text-base)' }}>
                Stop losing your best prompts in endless chat logs. Promptamist gives you a structured library for all your{' '}
                <strong className="text-foreground">ChatGPT, Claude, and Gemini</strong> prompts — with reusable templates, dynamic variables, and one-click public sharing.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row pt-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <Button size="lg" className="h-16 rounded-2xl gap-2 px-10 text-lg font-bold shadow-2xl shadow-primary/20 transition-all hover:scale-[1.05] active:scale-[0.95]" asChild>
                  <Link href="/sign-up">
                    <Icon icon="lucide:rocket" className="h-6 w-6" />
                    Start Free — No Credit Card
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-16 rounded-2xl gap-2 px-10 text-lg font-bold bg-card/40 backdrop-blur-xl transition-all hover:scale-[1.05] active:scale-[0.95]" asChild>
                  <Link href="/sign-in">
                    <Icon icon="lucide:log-in" className="h-6 w-6" />
                    Sign In
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section
            aria-label="Key Features"
            className="relative px-4 py-24 md:py-32"
          >
            <div className="absolute inset-0 bg-muted/30 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]" />
            <div className="relative mx-auto max-w-6xl">
              <div className="mb-20 text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Everything You Need for AI Prompt Engineering
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  A professional workspace purpose-built for AI prompt management.
                </p>
                <div className="h-1.5 w-16 bg-primary/40 mx-auto rounded-full" />
              </div>
              <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                  <Card
                    key={term}
                    className="group relative border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl hover:shadow-primary/5"
                  >
                    <CardHeader>
                      <div className="bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 flex h-12 w-12 items-center justify-center rounded-2xl mb-4">
                        <Icon icon={icon} className="text-primary h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl font-bold">{term}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {desc}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </dl>
            </div>
          </section>

          {/* Solutions Section */}
          <section
            aria-label="Industry Solutions"
            className="px-4 py-24 md:py-32"
          >
            <div className="mx-auto max-w-6xl">
              <div className="mb-20 text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Built for Every Professional AI Workflow
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Specialized tools for the world&apos;s most demanding AI power users.
                </p>
                <div className="h-1.5 w-16 bg-chart-1/40 mx-auto rounded-full" />
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                <Card className="group relative overflow-hidden border-border/40 bg-card/40 backdrop-blur-xl p-4 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:translate-y-[-4px]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:scale-150" />
                  <CardHeader className="p-6">
                    <div className="mb-6 h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-110">
                      <Icon icon="lucide:pen-tool" className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold">Content Writing</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 pt-0">
                    <p className="mb-8 text-muted-foreground text-lg leading-relaxed">
                      Scale your blog production and maintain brand voice with structured storytelling templates.
                    </p>
                    <Button variant="link" className="px-0 text-primary group/link text-base font-bold" asChild>
                      <Link href="/solutions/content-writing">
                        Explore Writing Solutions <Icon icon="lucide:arrow-right" className="ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="group relative overflow-hidden border-border/40 bg-card/40 backdrop-blur-xl p-4 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:translate-y-[-4px]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-chart-1/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:scale-150" />
                  <CardHeader className="p-6">
                    <div className="mb-6 h-14 w-14 rounded-2xl bg-chart-1/10 flex items-center justify-center transition-transform group-hover:scale-110">
                      <Icon icon="lucide:code-2" className="h-8 w-8 text-chart-1" />
                    </div>
                    <CardTitle className="text-3xl font-bold">Software Development</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 pt-0">
                    <p className="mb-8 text-muted-foreground text-lg leading-relaxed">
                      Manage complex system prompts and architectural context for your AI coding agents.
                    </p>
                    <Button variant="link" className="px-0 text-primary group/link text-base font-bold" asChild>
                      <Link href="/solutions/software-development">
                        Explore Dev Solutions <Icon icon="lucide:arrow-right" className="ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
              <div className="mt-16 text-center animate-bounce duration-[3000ms]">
                <Button variant="outline" size="lg" className="rounded-2xl border-primary/20 hover:bg-primary/5 px-10 h-14 font-bold" asChild>
                  <Link href="/solutions">View All Solutions</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Social Proof / CTA */}
          <section
            aria-label="Call to action"
            className="relative px-4 py-32 text-center"
          >
            <div className="absolute inset-0 bg-primary/5 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
            <div className="relative mx-auto max-w-3xl space-y-8">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Your Prompt Library Awaits
              </h2>
              <p className="text-muted-foreground text-xl max-w-xl mx-auto">
                Join AI power users who have already organized their prompt workflows with Promptamist. Free to start, no credit card required.
              </p>
              <Button size="lg" className="h-16 rounded-2xl gap-3 px-12 text-lg font-bold shadow-2xl shadow-primary/25 transition-all hover:scale-110 active:scale-95" asChild>
                <Link href="/sign-up">
                  <Icon icon="lucide:sparkles" className="h-6 w-6" />
                  Get Started for Free
                </Link>
              </Button>
            </div>
          </section>
        </Unauthenticated>
      </main>
    </div>
  );
}

function DashboardStats() {
  const [oneWeekAgo] = useState(() => Date.now() - 7 * 24 * 60 * 60 * 1000);
  const stats = useQuery(api.authed.prompts.getPromptStats, { oneWeekAgo });

  if (stats === undefined) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {[
        { label: 'Total Prompts', value: stats.total, icon: 'lucide:file-text', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
        { label: 'Templates', value: stats.templates, icon: 'lucide:layout-template', color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
        { label: 'Public', value: stats.public, icon: 'lucide:globe', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
        { label: 'New This Week', value: stats.newThisWeek, icon: 'lucide:calendar-plus', color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
      ].map((stat) => (
        <Card key={stat.label} className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            <div className={cn("p-2 rounded-lg", stat.bg)}>
              <Icon
                icon={stat.icon}
                className={cn("h-4 w-4", stat.color)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RecentPrompts() {
  const prompts = useQuery(api.authed.prompts.getPrompts);

  if (prompts === undefined) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[250px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 text-center">
        <div className="bg-primary/10 mb-4 rounded-full p-4">
          <Icon icon="lucide:plus" className="text-primary h-8 w-8" />
        </div>
        <h3 className="text-lg font-semibold">No prompts yet</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Create your first prompt to see it here and start building your library.
        </p>
        <Button asChild>
          <Link href="/prompts/create">Create Prompt</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
      {prompts.slice(0, 3).map((prompt: Doc<'prompts'>) => (
        <PromptCard key={prompt._id} prompt={prompt} />
      ))}
    </div>
  );
}
