'use client';

import * as React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Doc } from '../../../../convex/_generated/dataModel';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PromptUseSidebarProps {
  prompts: Doc<'prompts'>[];
  activeId: string;
}

export function PromptUseSidebar({ prompts, activeId }: PromptUseSidebarProps) {
  const [search, setSearch] = React.useState('');

  const filteredPrompts = prompts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-card flex hidden h-full w-64 flex-col border-r lg:flex">
      <div className="border-b p-4">
        <h2 className="mb-2 px-2 font-semibold">Your Templates</h2>
        <div className="relative">
          <Icon
            icon="lucide:search"
            className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4"
          />
          <Input
            placeholder="Search..."
            className="h-9 pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {filteredPrompts.map((p) => (
            <Link
              key={p._id}
              href={`/prompts/${p._id}/use`}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                p._id === activeId
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'hover:bg-accent text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon icon="lucide:file-text" className="h-4 w-4 shrink-0" />
              <span className="truncate">{p.title}</span>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
