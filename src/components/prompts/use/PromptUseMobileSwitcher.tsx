'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Doc } from '../../../../convex/_generated/dataModel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PromptUseMobileSwitcherProps {
  prompts: Doc<'prompts'>[];
  activeId: string;
}

export function PromptUseMobileSwitcher({
  prompts,
  activeId,
}: PromptUseMobileSwitcherProps) {
  const router = useRouter();

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
            <SelectItem key={p._id} value={p._id}>
              {p.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
