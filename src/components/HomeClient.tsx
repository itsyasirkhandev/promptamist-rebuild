'use client';

import {
  Authenticated,
  Unauthenticated,
  AuthLoading,
  useQuery,
} from 'convex/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { PromptCard } from '@/components/prompts/PromptCard';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@iconify/react';
import { api } from '../../convex/_generated/api';
import { cn } from '@/lib/utils';
import { Doc } from '../../convex/_generated/dataModel';

// Reusable Texture Card Component
const TextureCard = ({
  children,
  className,
  popular,
}: {
  children: React.ReactNode;
  className?: string;
  popular?: boolean;
}) => (
  <div
    className={cn(
      'rounded-[24px] border border-white/60 bg-gradient-to-b transition-all duration-300 dark:border-stone-950/60',
      popular
        ? 'from-neutral-50 to-white/90 shadow-2xl ring-1 shadow-neutral-200/50 ring-black/5 dark:from-neutral-800 dark:to-neutral-950 dark:shadow-black/50 dark:ring-white/10'
        : 'from-neutral-100 to-white/70 dark:from-neutral-800 dark:to-neutral-900',
      className,
    )}
  >
    <div className="flex h-full flex-col rounded-[23px] border border-black/10 dark:border-neutral-900/80">
      <div className="flex h-full flex-col rounded-[22px] border border-white/50 dark:border-neutral-950">
        <div className="flex h-full flex-col rounded-[21px] border border-neutral-950/20 dark:border-neutral-900/70">
          <div className="flex h-full w-full flex-col rounded-[20px] border border-white/50 text-neutral-500 dark:border-neutral-700/50">
            {children}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export function HomeClient() {
  return (
    <div className="relative min-h-screen bg-neutral-50 transition-colors duration-500 dark:bg-stone-950">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute top-0 left-1/2 h-[500px] w-full max-w-6xl -translate-x-1/2 rounded-full opacity-50 blur-[120px]" />
      </div>

      <main className="relative z-10 flex-1">
        <AuthLoading>
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="bg-primary/10 absolute -inset-4 animate-pulse rounded-full blur-xl" />
              <div className="border-primary/20 border-t-primary relative h-12 w-12 animate-spin rounded-full border-4 shadow-xl" />
            </div>
            <p className="animate-pulse text-sm font-medium tracking-wide text-neutral-500 uppercase">
              Securing your session
            </p>
          </div>
        </AuthLoading>

        <Authenticated>
          <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 lg:px-8">
            <div className="space-y-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium text-neutral-500 dark:text-neutral-400">
                      Home
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                    Welcome Back
                  </h1>
                  <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                    Here&apos;s what&apos;s happening with your prompt library.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Link href="/prompts/create">
                    <div className="group rounded-[12px] border-[1px] border-black/10 bg-gradient-to-b from-black/70 to-black p-[1px] transition duration-300 ease-in-out dark:border-[2px] dark:border-black dark:from-white dark:to-white/80">
                      <div className="flex h-full w-full items-center justify-center gap-2 rounded-[10px] bg-gradient-to-b from-neutral-800 to-black px-4 py-2 text-sm font-medium text-white/90 transition duration-300 ease-in-out group-hover:from-stone-800 group-hover:to-neutral-800/70 active:bg-gradient-to-b active:from-black active:to-black dark:from-neutral-200 dark:to-neutral-50 dark:text-black/80 dark:hover:from-stone-200 dark:hover:to-neutral-200 dark:active:from-stone-300 dark:active:to-neutral-300">
                        <Icon icon="lucide:plus" className="h-4 w-4" />
                        New Prompt
                      </div>
                    </div>
                  </Link>
                </div>
              </header>
            </div>

            <DashboardStats />

            <Separator className="bg-neutral-200 dark:bg-neutral-800" />

            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                    Recent Prompts
                  </h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Continue where you left off.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  asChild
                  className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                >
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
          <section className="px-4 py-24 text-center md:py-32">
            <div className="mx-auto max-w-4xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/50 px-3 py-1 text-[min(2.8vw,12px)] font-bold tracking-[0.1em] text-neutral-600 uppercase sm:px-4 sm:py-1.5 sm:text-xs sm:tracking-[0.2em] dark:border-neutral-800 dark:bg-stone-900/50 dark:text-neutral-400">
                <Icon icon="lucide:sparkles" className="h-3.5 w-3.5 shrink-0" />
                <span className="whitespace-nowrap">The AI Prompt Manager Built for Power Users</span>
              </div>
              <h1 className="text-4xl leading-[1.1] font-semibold tracking-tight text-balance text-neutral-900 md:text-6xl dark:text-neutral-50">
                Organize, Test & Share <br className="hidden md:block" />
                <span className="text-neutral-500">Your AI Prompts</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-pretty text-neutral-600 md:text-xl dark:text-neutral-400">
                Stop losing your best prompts in endless chat logs. Promptamist
                gives you a structured library for all your{' '}
                <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
                  ChatGPT, Claude, and Gemini
                </strong>{' '}
                prompts — with reusable templates, dynamic variables, and
                one-click public sharing.
              </p>
              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/sign-up">
                  <div className="group rounded-[14px] border-[1px] border-black/10 bg-gradient-to-b from-black/70 to-black p-[1px] transition duration-300 ease-in-out dark:border-[2px] dark:border-black dark:from-white dark:to-white/80">
                    <div className="flex h-14 w-full min-w-[200px] items-center justify-center gap-3 rounded-[12px] bg-gradient-to-b from-neutral-800 to-black px-8 text-lg font-semibold text-white/90 transition duration-300 ease-in-out group-hover:from-stone-800 group-hover:to-neutral-800/70 active:bg-gradient-to-b active:from-black active:to-black dark:from-neutral-200 dark:to-neutral-50 dark:text-black/80 dark:hover:from-stone-200 dark:hover:to-neutral-200 dark:active:from-stone-300 dark:active:to-neutral-300">
                      <Icon icon="lucide:rocket" className="h-5 w-5" />
                      Start Free
                    </div>
                  </div>
                </Link>
                <Link href="/sign-in">
                  <div className="group/texture-button rounded-[14px] border-[1px] border-black/20 bg-white/50 p-[1px] hover:bg-gradient-to-t hover:from-neutral-100 active:bg-neutral-200 dark:border-[2px] dark:border-neutral-950 dark:bg-neutral-600/80 dark:hover:from-neutral-600/50 dark:hover:to-neutral-600/70 dark:active:bg-neutral-800">
                    <div className="flex h-14 w-full min-w-[160px] items-center justify-center gap-3 rounded-[12px] bg-gradient-to-b from-white to-neutral-50/50 px-8 text-lg font-semibold text-neutral-700 transition duration-300 ease-in-out group-hover/texture-button:bg-gradient-to-b group-hover/texture-button:from-neutral-50/50 group-hover/texture-button:to-neutral-100/60 group-active/texture-button:bg-gradient-to-b group-active/texture-button:from-neutral-100/60 group-active/texture-button:to-neutral-100/90 dark:from-neutral-800 dark:to-neutral-700/50 dark:text-neutral-200 dark:group-hover/texture-button:from-neutral-700 dark:group-hover/texture-button:to-neutral-700/60 dark:group-active/texture-button:from-neutral-800 dark:group-active/texture-button:to-neutral-700">
                      Sign In
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="relative overflow-hidden px-4 py-24 md:py-32">
            <div className="mx-auto max-w-6xl">
              <div className="mb-16 text-center">
                <p className="mb-2 text-xs font-bold tracking-[0.2em] text-neutral-600 uppercase dark:text-neutral-400">
                  Features
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-balance text-neutral-900 md:text-5xl dark:text-neutral-50">
                  Built for Professional <br /> Prompt Engineering
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
                  A professional workspace purpose-built for AI power users who
                  need structure and scale.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    icon: 'lucide:layout-template',
                    term: 'Dynamic Prompt Templates',
                    desc: 'Build reusable prompt templates with named variables. Fill in values instantly to generate customized prompts.',
                  },
                  {
                    icon: 'lucide:library',
                    term: 'Organized Prompt Library',
                    desc: 'Tag, filter, and search your entire prompt collection. Never lose a great prompt again.',
                  },
                  {
                    icon: 'lucide:share-2',
                    term: 'One-Click Public Sharing',
                    desc: 'Share any prompt via a public URL. Anyone can view and use your prompt template without needing an account.',
                  },
                  {
                    icon: 'lucide:zap',
                    term: 'Works with Any LLM',
                    desc: 'Use your prompts with ChatGPT, Claude, Gemini, or any other AI model — model-agnostic by design.',
                  },
                  {
                    icon: 'lucide:shield-check',
                    term: 'Private by Default',
                    desc: 'Your prompts are private by default. Choose exactly which prompts to share publicly.',
                  },
                  {
                    icon: 'lucide:trending-up',
                    term: 'Prompt Statistics',
                    desc: 'Track your library growth. See total prompts, templates, and public shares over time.',
                  },
                ].map(({ icon, term, desc }) => (
                  <TextureCard key={term}>
                    <div className="p-6">
                      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200 bg-white/50 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
                        <Icon icon={icon} className="h-6 w-6" />
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        {term}
                      </h3>
                      <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                        {desc}
                      </p>
                    </div>
                  </TextureCard>
                ))}
              </div>
            </div>
          </section>

          {/* Solutions Section */}
          <section className="px-4 py-24 md:py-32">
            <div className="mx-auto max-w-6xl">
              <div className="mb-16 text-center">
                <p className="mb-2 text-xs font-bold tracking-[0.2em] text-neutral-600 uppercase dark:text-neutral-400">
                  Solutions
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-balance text-neutral-900 md:text-5xl dark:text-neutral-50">
                  Built for Every Professional AI Workflow
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
                  Specialized tools for the world&apos;s most demanding AI power
                  users.
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                {[
                  {
                    title: 'Content Writing',
                    icon: 'lucide:pen-tool',
                    desc: 'Scale your blog production and maintain brand voice with structured storytelling templates.',
                    href: '/solutions/content-writing',
                    label: 'Explore Writing Solutions',
                  },
                  {
                    title: 'Software Development',
                    icon: 'lucide:code-2',
                    desc: 'Manage complex system prompts and architectural context for your AI coding agents.',
                    href: '/solutions/software-development',
                    label: 'Explore Dev Solutions',
                  },
                ].map((solution) => (
                  <TextureCard key={solution.title} className="p-2">
                    <div className="p-6">
                      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-white/50 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
                        <Icon icon={solution.icon} className="h-8 w-8" />
                      </div>
                      <h3 className="mb-4 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                        {solution.title}
                      </h3>
                      <p className="mb-8 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                        {solution.desc}
                      </p>
                      <Button
                        variant="link"
                        className="group/link h-auto p-0 px-0 text-base font-bold text-neutral-900 dark:text-neutral-100"
                        asChild
                      >
                        <Link href={solution.href}>
                          {solution.label}
                          <Icon
                            icon="lucide:arrow-right"
                            className="ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-1"
                          />
                        </Link>
                      </Button>
                    </div>
                  </TextureCard>
                ))}
              </div>
              <div className="mt-16 text-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 rounded-2xl border-neutral-200 px-10 font-bold text-neutral-600 transition-all hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
                  asChild
                >
                  <Link href="/solutions">View All Solutions</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative overflow-hidden px-4 py-32 text-center">
            <div className="relative mx-auto max-w-3xl space-y-8">
              <h2 className="text-4xl font-semibold tracking-tight text-balance text-neutral-900 md:text-5xl dark:text-neutral-50">
                Your Prompt Library Awaits
              </h2>
              <p className="mx-auto max-w-xl text-lg text-neutral-600 dark:text-neutral-400">
                Join AI power users who have already organized their prompt
                workflows with Promptamist. Free to start, no credit card
                required.
              </p>
              <div className="flex justify-center">
                <Link href="/sign-up">
                  <div className="group rounded-[14px] border-[1px] border-black/10 bg-gradient-to-b from-black/70 to-black p-[1px] transition duration-300 ease-in-out dark:border-[2px] dark:border-black dark:from-white dark:to-white/80">
                    <div className="flex h-16 w-full min-w-[240px] items-center justify-center gap-3 rounded-[12px] bg-gradient-to-b from-neutral-800 to-black px-10 text-lg font-semibold text-white/90 transition duration-300 ease-in-out group-hover:from-stone-800 group-hover:to-neutral-800/70 active:bg-gradient-to-b active:from-black active:to-black dark:from-neutral-200 dark:to-neutral-50 dark:text-black/80 dark:hover:from-stone-200 dark:hover:to-neutral-200 dark:active:from-stone-300 dark:active:to-neutral-300">
                      <Icon icon="lucide:sparkles" className="h-5 w-5" />
                      Get Started for Free
                    </div>
                  </div>
                </Link>
              </div>
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
          <Skeleton key={i} className="h-32 w-full rounded-[24px]" />
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
        {
          label: 'Total Prompts',
          value: stats.total,
          icon: 'lucide:file-text',
          color: 'text-neutral-900 dark:text-neutral-50',
          bg: 'bg-neutral-100 dark:bg-neutral-800',
        },
        {
          label: 'Templates',
          value: stats.templates,
          icon: 'lucide:layout-template',
          color: 'text-neutral-900 dark:text-neutral-50',
          bg: 'bg-neutral-100 dark:bg-neutral-800',
        },
        {
          label: 'Public',
          value: stats.public,
          icon: 'lucide:globe',
          color: 'text-neutral-900 dark:text-neutral-50',
          bg: 'bg-neutral-100 dark:bg-neutral-800',
        },
        {
          label: 'New This Week',
          value: stats.newThisWeek,
          icon: 'lucide:calendar-plus',
          color: 'text-neutral-900 dark:text-neutral-50',
          bg: 'bg-neutral-100 dark:bg-neutral-800',
        },
      ].map((stat) => (
        <TextureCard key={stat.label}>
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                {stat.label}
              </span>
              <div className={cn('rounded-lg p-2', stat.bg)}>
                <Icon icon={stat.icon} className={cn('h-4 w-4', stat.color)} />
              </div>
            </div>
            <div className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              {stat.value}
            </div>
          </div>
        </TextureCard>
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
          <Skeleton key={i} className="h-[250px] w-full rounded-[24px]" />
        ))}
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-neutral-200 bg-white/30 py-16 text-center dark:border-neutral-800 dark:bg-stone-900/30">
        <div className="mb-6 rounded-2xl bg-neutral-100 p-5 dark:bg-neutral-800">
          <Icon
            icon="lucide:plus"
            className="h-8 w-8 text-neutral-500 dark:text-neutral-400"
          />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-50">
          No prompts yet
        </h3>
        <p className="mb-8 max-w-sm px-4 text-neutral-600 dark:text-neutral-400">
          Create your first prompt to see it here and start building your
          library.
        </p>
        <Link href="/prompts/create">
          <div className="group rounded-[12px] border-[1px] border-black/10 bg-gradient-to-b from-black/70 to-black p-[1px]">
            <div className="flex h-12 items-center justify-center gap-2 rounded-[10px] bg-gradient-to-b from-neutral-800 to-black px-6 text-sm font-medium text-white/90">
              Create Prompt
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8">
      {prompts.slice(0, 3).map((prompt: Doc<'prompts'>) => (
        <PromptCard key={prompt._id} prompt={prompt} />
      ))}
    </div>
  );
}
