'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useConvex } from 'convex/react';
import { Check, ChevronsUpDown, Filter } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

      {allTags.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Filter className="h-4 w-4" />
              {selectedTags.size > 0 && (
                <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px]">
                  {selectedTags.size}
                </span>
              )}
              <span className="sr-only">Filter by tags</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Filter Tags</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allTags.map((tag) => (
              <DropdownMenuCheckboxItem
                key={tag}
                checked={selectedTags.has(tag)}
                onCheckedChange={() => toggleTag(tag)}
              >
                {tag}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
