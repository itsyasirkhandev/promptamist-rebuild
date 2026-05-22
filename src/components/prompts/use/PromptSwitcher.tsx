'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useConvex } from 'convex/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { PromptDTO } from '../../../../convex/dto';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface PromptSwitcherProps {
  prompts: PromptDTO[];
  activeId?: string;
}

export function PromptSwitcher({ prompts, activeId }: PromptSwitcherProps) {
  const router = useRouter();
  const convex = useConvex();
  const [open, setOpen] = React.useState(false);

  // Extract all unique tags
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    prompts.forEach((p) => {
      if (p.tags) {
        p.tags.forEach((t) => tags.add(t));
      }
    });
    return Array.from(tags).sort();
  }, [prompts]);

  const [selectedTags, setSelectedTags] = React.useState<Set<string>>(
    new Set(),
  );

  const toggleTag = (tag: string) => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    setSelectedTags(newTags);
  };

  const filteredPrompts = React.useMemo(() => {
    if (selectedTags.size === 0) return prompts;
    return prompts.filter((p) => {
      if (!p.tags) return false;
      return Array.from(selectedTags).every((t) => p.tags!.includes(t));
    });
  }, [prompts, selectedTags]);

  const activePrompt = prompts.find((p) => p._id === activeId);

  const handlePrefetch = (id: Id<'prompts'>) => {
    try {
      convex.query(api.authed.prompts.getPromptById, { id });
    } catch {
      // Ignore prefetch errors
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[300px] justify-between"
          >
            {activePrompt ? activePrompt.title : 'Select a prompt...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search prompts..." />
            {allTags.length > 0 && (
              <div className="border-border border-b">
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex w-max space-x-1 p-2">
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.has(tag) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" className="h-2" />
                </ScrollArea>
              </div>
            )}
            <CommandList>
              <CommandEmpty>No prompt found.</CommandEmpty>
              <CommandGroup>
                {filteredPrompts.map((prompt) => (
                  <CommandItem
                    key={prompt._id}
                    value={prompt.title}
                    onSelect={() => {
                      router.push(`/prompts/${prompt._id}/use`);
                      setOpen(false);
                    }}
                    onMouseEnter={() => handlePrefetch(prompt._id)}
                    onFocus={() => handlePrefetch(prompt._id)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        activeId === prompt._id ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {prompt.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
