'use client';

import { useQuery } from 'convex/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
import { TextureCard } from '@/components/ui/TextureCard';

export function DashboardClient() {
  return (
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
  );
}

function DashboardStats() {
  const stats = useQuery(api.authed.prompts.getPromptStats);

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
  const prompts = useQuery(api.authed.prompts.getRecentPrompts, { limit: 3 });

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
      {prompts.map((prompt) => (
        <PromptCard key={prompt._id} prompt={prompt} />
      ))}
    </div>
  );
}
