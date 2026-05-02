'use client';

import * as React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Doc } from '../../../../convex/_generated/dataModel';
import Link from 'next/link';
import { Icon } from '@iconify/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PromptCard } from '@/components/prompts/PromptCard';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PromptsPage() {
  const user = useQuery(api.users.getCurrentUser);
  const prompts = useQuery(api.authed.prompts.getPrompts);
  const [search, setSearch] = React.useState('');
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<
    'all' | 'templates' | 'static'
  >('all');

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
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'templates' && p.isTemplate) ||
        (activeTab === 'static' && !p.isTemplate);
      return matchesSearch && matchesTag && matchesTab;
    });
  }, [prompts, search, selectedTag, activeTab]);

  return (
    <div className="space-y-8 px-4 py-8 lg:px-8">
      <div className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Prompts</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">
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
          </div>
        </header>
      </div>

      {user === undefined || prompts === undefined ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-[250px] w-full rounded-lg" />
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
          <div className="flex flex-col gap-4">
            <Tabs
              value={activeTab}
              onValueChange={(v) =>
                setActiveTab(v as 'all' | 'templates' | 'static')
              }
              className="w-full"
            >
              <TabsList className="grid w-full max-w-[400px] grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="static">Static</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
              <div className="relative w-full flex-grow md:w-auto">
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
                {allTags.length > 0 ? (
                  <>
                    <Badge
                      variant={selectedTag === null ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setSelectedTag(null)}
                    >
                      All Tags
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
                ) : null}
              </div>
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
                <h3 className="text-base font-semibold">No prompts found</h3>
                <p className="text-muted-foreground mx-auto max-w-xs">
                  {search || selectedTag || activeTab !== 'all'
                    ? 'No prompts match your current filters. Try adjusting them.'
                    : "You haven't created any prompts yet. Start building your library!"}
                </p>
              </div>
              {!search && !selectedTag && activeTab === 'all' ? (
                <Button asChild>
                  <Link href="/prompts/create">Create New Prompt</Link>
                </Button>
              ) : null}
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
              {filteredPrompts.map((prompt) => (
                <PromptCard key={prompt._id} prompt={prompt} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
