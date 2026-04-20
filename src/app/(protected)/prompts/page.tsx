'use client';

import * as React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Doc } from '../../../../convex/_generated/dataModel';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Icon } from '@iconify/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PromptCard } from '@/components/prompts/PromptCard';
import { Badge } from '@/components/ui/badge';

export default function PromptsPage() {
  const user = useQuery(api.users.getCurrentUser);
  const prompts = useQuery(api.authed.prompts.getPrompts);
  const [search, setSearch] = React.useState('');
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);

  const allTags = React.useMemo(() => {
    if (!prompts) return [];
    const tags = new Set<string>();
    prompts.forEach((p: Doc<'prompts'>) =>
      p.tags.forEach((t: string) => tags.add(t)),
    );
    return Array.from(tags).sort();
  }, [prompts]);

  const filteredPrompts = React.useMemo(() => {
    if (!prompts) return [];
    return (prompts as Doc<'prompts'>[]).filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.content.toLowerCase().includes(search.toLowerCase());
      const matchesTag = !selectedTag || p.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [prompts, search, selectedTag]);

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto space-y-8 py-8">
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Prompts Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage and organize your prompt library.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild className="gap-2">
              <Link href="/prompts/create">
                <Icon icon="lucide:plus" width={18} />
                New Prompt
              </Link>
            </Button>
            <UserButton />
          </div>
        </header>

        {user === undefined || prompts === undefined ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-[200px] w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : user === null ? (
          <Alert variant="destructive">
            <AlertTitle>Profile Not Found</AlertTitle>
            <AlertDescription>
              Your account is still syncing from Clerk. Please wait a moment and
              refresh.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
              <div className="relative flex-grow">
                <Icon
                  icon="lucide:search"
                  className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
                  width={18}
                />
                <Input
                  placeholder="Search prompts..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.length > 0 && (
                  <>
                    <Badge
                      variant={selectedTag === null ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setSelectedTag(null)}
                    >
                      All
                    </Badge>
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTag === tag ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() =>
                          setSelectedTag(tag === selectedTag ? null : tag)
                        }
                      >
                        {tag}
                      </Badge>
                    ))}
                  </>
                )}
              </div>
            </div>

            {filteredPrompts.length === 0 ? (
              <div className="space-y-4 rounded-xl border-2 border-dashed py-20 text-center">
                <div className="bg-secondary/50 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                  <Icon
                    icon="lucide:file-text"
                    width={32}
                    className="text-muted-foreground"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium">No prompts found</h3>
                  <p className="text-muted-foreground mx-auto max-w-xs">
                    {search || selectedTag
                      ? 'No prompts match your current filters. Try adjusting them.'
                      : "You haven't created any prompts yet. Start building your library!"}
                  </p>
                </div>
                {!search && !selectedTag && (
                  <Button asChild>
                    <Link href="/prompts/create">Create New Prompt</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPrompts.map((prompt) => (
                  <PromptCard key={prompt._id} prompt={prompt} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
