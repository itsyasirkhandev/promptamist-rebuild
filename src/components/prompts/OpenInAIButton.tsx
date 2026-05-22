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

type AITarget =
  | 'chatgpt'
  | 'claude'
  | 'cursor'
  | 'zed'
  | 't3chat'
  | 'grok'
  | 'perplexity'
  | 'v0';

const targetMap: Record<
  AITarget,
  {
    name: string;
    icon: string;
    getUrl: (content: string) => string;
  }
> = {
  chatgpt: {
    name: 'ChatGPT',
    icon: 'simple-icons:openai',
    getUrl: (c) => `https://chatgpt.com/?q=${c}&hints=search`,
  },
  claude: {
    name: 'Claude',
    icon: 'simple-icons:anthropic',
    getUrl: (c) => `https://claude.ai/new?q=${c}`,
  },
  cursor: {
    name: 'Cursor',
    icon: 'lucide:terminal-square', // fallback if simple-icons:cursor is missing
    getUrl: (c) => `https://cursor.com/link/prompt?text=${c}`,
  },
  zed: {
    name: 'Zed',
    icon: 'lucide:zap', // fallback
    getUrl: (c) => `zed://agent?prompt=${c}`,
  },
  t3chat: {
    name: 'T3 Chat',
    icon: 'lucide:message-circle', // fallback
    getUrl: (c) => `https://t3.chat/new?q=${c}`,
  },
  grok: {
    name: 'Grok',
    icon: 'simple-icons:x',
    getUrl: (c) => `https://x.com/i/grok?text=${c}`,
  },
  perplexity: {
    name: 'Perplexity',
    icon: 'simple-icons:perplexity',
    getUrl: (c) => `https://www.perplexity.ai/?q=${c}`,
  },
  v0: {
    name: 'v0',
    icon: 'simple-icons:v0',
    getUrl: (c) => `https://v0.app/chat?q=${c}`,
  },
};

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
      const url = targetMap[target].getUrl(encodedContent);

      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      toast.error('Failed to copy prompt to clipboard.');
      console.error(err);
    }
  };

  return (
    <div
      className={cn(
        'inline-flex overflow-clip rounded-md bg-white shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800',
        className,
      )}
    >
      <Button
        onClick={() => handleOpen('chatgpt')}
        size={size}
        variant="ghost"
        className="gap-2 rounded-r-none hover:bg-gray-50 focus-visible:ring-0 dark:hover:bg-gray-800"
      >
        <Icon icon="simple-icons:openai" width={16} />
        <span className="hidden sm:inline">Open in ChatGPT</span>
        <span className="sm:hidden">Open in</span>
      </Button>
      <span aria-hidden="true" className="w-px bg-gray-200 dark:bg-gray-800" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
            variant="ghost"
            className="rounded-l-none px-2 hover:bg-gray-50 focus-visible:ring-0 dark:hover:bg-gray-800"
          >
            <Icon icon="lucide:chevron-down" width={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44 p-1">
          {Object.entries(targetMap).map(([key, item]) => {
            const target = key as AITarget;
            return (
              <DropdownMenuItem
                key={target}
                onClick={() => handleOpen(target)}
                className="group flex cursor-pointer items-center gap-2 rounded-sm p-2 text-xs"
              >
                <Icon icon={item.icon} width={16} className="flex-none" />
                <span className="truncate">Open in {item.name}</span>
                <Icon
                  icon="lucide:arrow-up-right"
                  width={12}
                  className="text-muted-foreground ml-auto flex-none opacity-0 transition-opacity group-hover:opacity-100"
                />
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
