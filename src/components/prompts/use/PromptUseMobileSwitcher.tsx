'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useConvex } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Doc, Id } from '../../../../convex/_generated/dataModel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PromptUseMobileSwitcherProps {
  prompts: Doc<'prompts'>[];
  activeId?: string;
}

export function PromptUseMobileSwitcher({
  prompts,
}: PromptUseMobileSwitcherProps) {
  const router = useRouter();
  const params = useParams();
  const activeId = params.id as string;
  const convex = useConvex();

  const handlePrefetch = (id: Id<'prompts'>) => {
    try {
      convex.query(api.authed.prompts.getPromptById, { id });
    } catch {
      // Ignore prefetch errors
    }
  };

  return (
    <div className="bg-background sticky top-0 z-10 w-full border-b px-4 py-2 lg:hidden">
      <Select
        value={activeId}
        onValueChange={(id) => router.push(`/prompts/${id}/use`)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a prompt" />
        </SelectTrigger>
        <SelectContent>
          {prompts.map((p) => (
            <SelectItem
              key={p._id}
              value={p._id}
              onMouseEnter={() => handlePrefetch(p._id)}
              onFocus={() => handlePrefetch(p._id)}
            >
              {p.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
