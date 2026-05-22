'use client';

import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useDebounce } from '@/hooks/use-debounce';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { MarketplacePromptCard, PublicPromptDTO } from './MarketplacePromptCard';

export function MarketplaceSearch() {
  const [inputValue, setInputValue] = useState('');
  const debouncedQuery = useDebounce(inputValue, 300);

  const prompts = useQuery(api.publicPrompts.listPublicPrompts, {
    searchQuery: debouncedQuery || undefined,
  });

  const isLoading = prompts === undefined;

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="relative max-w-2xl mx-auto w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search prompts by title, description, or tags..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="pl-10 h-12 text-lg rounded-full bg-background border-2 focus-visible:border-primary shadow-sm"
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />
        )}
      </div>

      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading prompts...
            </p>
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed mt-4">
            <Search className="w-10 h-10 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground">No prompts found</h3>
            <p className="text-muted-foreground mt-1">
              Try adjusting your search terms or keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {prompts.map((prompt: PublicPromptDTO) => (
              <MarketplacePromptCard 
                key={prompt._id} 
                prompt={prompt} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
