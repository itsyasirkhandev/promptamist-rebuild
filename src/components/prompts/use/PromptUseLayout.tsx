'use client';

import * as React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { PromptDTO } from '../../../../convex/dto';
import { useParams, useSearchParams } from 'next/navigation';
import { PromptSwitcher } from './PromptSwitcher';
import { Skeleton } from '@/components/ui/skeleton';

interface PromptUseLayoutProps {
  children: React.ReactNode;
}

export function PromptUseLayout({ children }: PromptUseLayoutProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const activeId = params.id as string;
  const isFocusedMode = searchParams.get('mode') === 'focused';

  const prompts = useQuery(api.authed.prompts.getPrompts);

  const templatePrompts = prompts?.filter((p: PromptDTO) => p.isTemplate) ?? [];

  if (prompts === undefined) {
    return (
      <div className="flex h-full">
        <div className="flex-1 p-4">
          {!isFocusedMode && (
            <Skeleton className="mb-4 h-10 w-full lg:hidden" />
          )}
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  if (isFocusedMode) {
    return <div className="h-full overflow-hidden">{children}</div>;
  }

  return (
    <div className="flex h-full overflow-hidden">
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <header className="bg-background flex h-14 shrink-0 items-center justify-center border-b px-4">
          <PromptSwitcher prompts={templatePrompts} activeId={activeId} />
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
