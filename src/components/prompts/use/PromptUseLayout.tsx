'use client';

import * as React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Doc } from '../../../../convex/_generated/dataModel';
import { PromptUseSidebar } from './PromptUseSidebar';
import { PromptUseMobileSwitcher } from './PromptUseMobileSwitcher';
import { Skeleton } from '@/components/ui/skeleton';

interface PromptUseLayoutProps {
  activeId: string;
  children: React.ReactNode;
}

export function PromptUseLayout({ activeId, children }: PromptUseLayoutProps) {
  const prompts = useQuery(api.authed.prompts.getPrompts);

  const templatePrompts =
    prompts?.filter((p: Doc<'prompts'>) => p.isTemplate) ?? [];

  if (prompts === undefined) {
    return (
      <div className="flex h-full">
        <Skeleton className="hidden h-full w-64 lg:block" />
        <div className="flex-1 p-4">
          <Skeleton className="mb-4 h-10 w-full lg:hidden" />
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      <PromptUseSidebar prompts={templatePrompts} activeId={activeId} />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <PromptUseMobileSwitcher
          prompts={templatePrompts}
          activeId={activeId}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
