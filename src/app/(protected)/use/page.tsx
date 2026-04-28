'use client';

import * as React from 'react';
import { useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import { api } from '../../../../convex/_generated/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function WorkspaceEntryPage() {
  const router = useRouter();
  const prompts = useQuery(api.authed.prompts.getPrompts);

  const templates = React.useMemo(() => {
    return prompts?.filter((p) => p.isTemplate) ?? [];
  }, [prompts]);

  React.useEffect(() => {
    if (templates.length > 0) {
      router.replace(`/prompts/${templates[0]._id}/use`);
    }
  }, [templates, router]);

  if (prompts === undefined) {
    return (
      <div className="container mx-auto p-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <div className="bg-primary/10 mb-6 flex h-20 w-20 items-center justify-center rounded-full">
          <Icon icon="lucide:monitor-play" className="text-primary h-10 w-10" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">No templates available</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          The Workspace allows you to quickly switch between your template
          prompts. Create your first template to get started.
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link href="/prompts/create">
            <Icon icon="lucide:plus-circle" width={20} />
            Create Template
          </Link>
        </Button>
      </div>
    );
  }

  // This will show briefly before the useEffect redirect kicks in
  return (
    <div className="container mx-auto p-8">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold">Entering Workspace...</h1>
        <Skeleton className="mx-auto h-4 w-64" />
      </div>
    </div>
  );
}
