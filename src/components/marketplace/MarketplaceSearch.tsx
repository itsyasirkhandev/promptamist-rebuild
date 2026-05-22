'use client';

import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useDebounce } from '@/hooks/use-debounce';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import {
  MarketplacePromptCard,
  PublicPromptDTO,
} from './MarketplacePromptCard';

export function MarketplaceSearch() {
  const [inputValue, setInputValue] = useState('');
  const debouncedQuery = useDebounce(inputValue, 300);

  const prompts = useQuery(api.publicPrompts.listPublicPrompts, {
    searchQuery: debouncedQuery || undefined,
  });

  const isLoading = prompts === undefined;

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="relative mx-auto w-full max-w-2xl">
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

      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading prompts...
            </p>
          </div>
        ) : prompts.length === 0 ? (
          <div className="bg-muted/30 mt-4 rounded-lg border border-dashed py-20 text-center">
            <Search className="text-muted-foreground mx-auto mb-4 h-10 w-10 opacity-50" />
            <h3 className="text-foreground text-lg font-medium">
              No prompts found
            </h3>
            <p className="text-muted-foreground mt-1">
              Try adjusting your search terms or keywords.
            </p>
          </div>
        ) : (
          <div className="@container w-full">
            <div className="grid grid-cols-1 gap-6 @2xl:grid-cols-2 @4xl:grid-cols-3 @6xl:grid-cols-4">
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
