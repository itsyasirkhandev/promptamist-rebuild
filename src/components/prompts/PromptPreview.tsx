'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { getVariableColorConfig } from '@/lib/variable-styles';
import type { Variable } from '@/lib/variables';
import { tokenizeTemplate } from '@/lib/variable-presentation';

interface PromptPreviewProps {
  content: string;
  variables: Variable[];
}

export const PromptPreview = ({ content, variables }: PromptPreviewProps) => {
  return (
    <>
      {tokenizeTemplate(content, variables).map((token, i) => {
        if (token.kind === 'variable') {
          const colors = getVariableColorConfig(token.variable?.type ?? 'text');
          return (
            <span
              key={i}
              className={cn(
                'animate-pulse rounded px-1 font-mono',
                colors.badge,
              )}
            >
              {`{{${token.name}}}`}
            </span>
          );
        }
        return <span key={i}>{token.content}</span>;
      })}
    </>
  );
};
