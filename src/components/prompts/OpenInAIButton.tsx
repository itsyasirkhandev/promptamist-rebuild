import * as React from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface OpenInAIButtonProps {
  content: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

type AITarget = 'chatgpt' | 'claude' | 'gemini' | 'zai';

export function OpenInAIButton({
  content,
  size = 'default',
  className,
}: OpenInAIButtonProps) {
  const handleOpen = async (target: AITarget) => {
    if (!content) {
      toast.error('No prompt content to copy.');
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      toast.success('Prompt copied to clipboard!');

      const encodedContent = encodeURIComponent(content);
      let url = '';

      switch (target) {
        case 'chatgpt':
          url = `https://chatgpt.com/?q=${encodedContent}`;
          break;
        case 'claude':
          url = `https://claude.ai/new?q=${encodedContent}`;
          break;
        case 'gemini':
          url = `https://gemini.google.com/app`;
          break;
        case 'zai':
          url = `https://chat.z.ai/?q=${encodedContent}`;
          break;
      }

      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      toast.error('Failed to copy prompt to clipboard.');
      console.error(err);
    }
  };

  return (
    <div className={cn('flex items-center rounded-md shadow-lg', className)}>
      <Button
        onClick={() => handleOpen('chatgpt')}
        size={size}
        className="gap-2 rounded-r-none shadow-none"
      >
        <Icon icon="simple-icons:openai" width={16} />
        <span className="hidden sm:inline">Open in AI</span>
        <span className="sm:hidden">Open</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
            className="data-[state=open]:bg-primary/90 rounded-l-none border-l border-white/20 px-2 shadow-none"
          >
            <Icon icon="lucide:chevron-down" width={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleOpen('chatgpt')}>
            <Icon icon="simple-icons:openai" width={16} className="mr-2" />
            ChatGPT
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOpen('claude')}>
            <Icon icon="simple-icons:anthropic" width={16} className="mr-2" />
            Claude
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOpen('gemini')}>
            <Icon icon="simple-icons:google" width={16} className="mr-2" />
            Gemini
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOpen('zai')}>
            <Icon icon="lucide:bot" width={16} className="mr-2" />
            Z.ai
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
