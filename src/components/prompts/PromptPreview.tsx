'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { getVariableColorConfig } from '@/lib/variables';
import { PromptVariable } from './VariableInput';

interface PromptPreviewProps {
  content: string;
  variables: PromptVariable[];
}

export const PromptPreview = ({ content, variables }: PromptPreviewProps) => {
  return (
    <>
      {content.split(/({{[^}]+}})/g).map((part: string, i: number) => {
        if (part.startsWith('{{') && part.endsWith('}}')) {
          const varName = part.slice(2, -2);
          const variable = variables.find((v) => v.name === varName);
          const colors = getVariableColorConfig(variable?.type || 'text');

          return (
            <span
              key={i}
              className={cn(
                'animate-pulse rounded px-1 font-mono',
                colors.badge,
              )}
            >
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};
