'use client';

import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useDebounce } from '@/hooks/use-debounce';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import {
  MarketplacePromptCard,
  PublicPromptDTO,
} from './MarketplacePromptCard';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'lucide:layout-grid' },
  { id: 'general', label: 'General', icon: 'lucide:box' },
  { id: 'productivity', label: 'Productivity', icon: 'lucide:zap' },
  { id: 'development', label: 'Development', icon: 'lucide:code-2' },
  { id: 'marketing', label: 'Marketing', icon: 'lucide:trending-up' },
  { id: 'creative', label: 'Creative', icon: 'lucide:palette' },
  { id: 'education', label: 'Education', icon: 'lucide:graduation-cap' },
];

export function MarketplaceSearch() {
  const [inputValue, setInputValue] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const debouncedQuery = useDebounce(inputValue, 300);

  const prompts = useQuery(api.publicPrompts.listPublicPrompts, {
    searchQuery: debouncedQuery || undefined,
    category: activeCategory,
  });

  const isLoading = prompts === undefined;

  return (
    <div className="flex w-full flex-col gap-6 animate-in fade-in duration-500">
      {/* Search Input */}
      <div className="relative mx-auto w-full max-w-md md:max-w-2xl">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Search prompts by title, description, or tags..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="bg-background focus-visible:border-primary h-12 rounded-full border-2 pl-10 text-lg shadow-sm"
        />
        {isLoading && (
          <Loader2 className="text-muted-foreground absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 animate-spin" />
        )}
      </div>

      {/* Category Tabs */}
      <div className="w-full overflow-x-auto scrollbar-none py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex gap-2.5 px-1 min-w-max md:justify-center">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full border transition-all duration-300 transform active:scale-95 cursor-pointer shadow-sm",
                  isActive
                    ? "bg-neutral-900 border-neutral-900 text-white dark:bg-neutral-100 dark:border-neutral-100 dark:text-neutral-900 font-bold scale-102 shadow-md"
                    : "bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:scale-101 dark:bg-neutral-900/60 dark:hover:bg-neutral-800 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                )}
              >
                <Icon
                  icon={cat.icon}
                  width={16}
                  height={16}
                  className={cn("transition-transform duration-300", isActive && "rotate-3 scale-110")}
                />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Prompts Grid / Loading / Empty States */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading prompts...
            </p>
          </div>
        ) : prompts.length === 0 ? (
          <div className="bg-muted/30 mt-4 rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 py-20 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
              <Icon
                icon={CATEGORIES.find((c) => c.id === activeCategory)?.icon || 'lucide:search'}
                className="text-muted-foreground h-8 w-8 opacity-60"
              />
            </div>
            <h3 className="text-foreground text-lg font-bold">
              {activeCategory === 'all'
                ? 'No prompts found'
                : `No prompts in ${CATEGORIES.find((c) => c.id === activeCategory)?.label} yet`}
            </h3>
            <p className="text-muted-foreground mt-1 max-w-sm mx-auto text-sm px-4">
              {activeCategory === 'all'
                ? 'Try adjusting your search terms or keywords.'
                : 'Be the first to share a prompt in this category and contribute to the community!'}
            </p>
          </div>
        ) : (
          <div className="@container w-full">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-6">
              {prompts.map((prompt: PublicPromptDTO) => (
                <MarketplacePromptCard key={prompt._id} prompt={prompt} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
