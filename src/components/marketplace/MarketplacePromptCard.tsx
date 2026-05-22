import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';
import { TextureCard } from '@/components/ui/TextureCard';

export interface PublicPromptDTO {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  isTemplate: boolean;
  publicSlug?: string;
  _creationTime: number;
  authorName?: string;
  authorImageUrl?: string;
}

interface MarketplacePromptCardProps {
  prompt: PublicPromptDTO;
}

export function MarketplacePromptCard({ prompt }: MarketplacePromptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      toast.success('Prompt copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy prompt');
    }
  };

  const handleUse = () => {
    if (prompt.publicSlug) {
      window.open(`/p/${prompt.publicSlug}`, '_blank');
    }
  };

  return (
    <div className="group @container h-full w-full max-w-md mx-auto">
      <TextureCard className="h-full transition-all duration-300 hover:shadow-xl hover:shadow-neutral-200/50 dark:hover:shadow-black/50">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="mb-3 flex items-start justify-between gap-4">
            <h3 className="line-clamp-2 text-lg leading-tight font-bold text-neutral-900 dark:text-neutral-50">
              {prompt.title}
            </h3>
            <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
              {prompt.isTemplate ? (
                <span className="rounded-full border border-neutral-900 bg-neutral-900 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900">
                  Template
                </span>
              ) : (
                <span className="rounded-full border border-neutral-200 px-2 py-0.5 text-[10px] font-bold tracking-wider text-neutral-500 uppercase dark:border-neutral-800 dark:text-neutral-400">
                  Static
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 text-xs text-neutral-500 @xs:flex-row @xs:items-center @xs:justify-between dark:text-neutral-400">
            <div className="flex items-center gap-2">
              {prompt.authorImageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={prompt.authorImageUrl}
                  alt={prompt.authorName || 'Author'}
                  className="h-5 w-5 rounded-full border border-neutral-200 object-cover dark:border-neutral-800"
                />
              ) : (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                  <Icon
                    icon="lucide:user"
                    className="h-3 w-3 text-neutral-500 dark:text-neutral-400"
                  />
                </div>
              )}
              <span className="max-w-[120px] truncate font-medium text-neutral-700 dark:text-neutral-300">
                {prompt.authorName || 'Anonymous'}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Icon icon="lucide:clock" className="h-3.5 w-3.5" />
              <span>{new Date(prompt._creationTime).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 pb-4">
          <p className="line-clamp-4 text-sm leading-relaxed whitespace-pre-wrap text-neutral-600 dark:text-neutral-400">
            {prompt.content}
          </p>
          {prompt.tags && prompt.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {prompt.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-md border border-neutral-200 bg-white/50 px-2 py-0.5 text-[10px] font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto flex flex-col gap-2 border-t border-neutral-200/60 p-4 pt-4 @xs:flex-row @xs:items-center dark:border-neutral-800/80">
          <button
            onClick={handleCopy}
            className="group/btn w-full rounded-[10px] border-[1px] border-black/10 bg-gradient-to-b from-neutral-200 to-neutral-50 p-[1px] shadow-sm transition duration-300 ease-in-out @xs:flex-1 dark:border-[2px] dark:border-neutral-950 dark:from-neutral-700 dark:to-neutral-800"
          >
            <div className="flex h-10 w-full items-center justify-center gap-2 rounded-[8px] bg-gradient-to-b from-white to-neutral-50/50 px-4 text-xs font-semibold text-neutral-700 transition duration-300 ease-in-out group-hover/btn:from-neutral-50 group-hover/btn:to-neutral-100/60 dark:from-neutral-800 dark:to-neutral-900 dark:text-neutral-200 dark:group-hover/btn:from-neutral-700 dark:group-hover/btn:to-neutral-800">
              <Icon
                icon={copied ? 'lucide:check' : 'lucide:copy'}
                className="h-3.5 w-3.5"
              />
              {copied ? 'Copied' : 'Copy'}
            </div>
          </button>

          {prompt.isTemplate && prompt.publicSlug && (
            <button
              onClick={handleUse}
              className="group/btn w-full rounded-[10px] border-[1px] border-black/10 bg-gradient-to-b from-black/70 to-black p-[1px] transition duration-300 ease-in-out @xs:flex-1 dark:border-[2px] dark:border-black dark:from-white dark:to-white/80"
            >
              <div className="flex h-10 w-full items-center justify-center gap-2 rounded-[8px] bg-gradient-to-b from-neutral-800 to-black px-4 text-xs font-semibold text-white/90 transition duration-300 ease-in-out group-hover/btn:from-stone-800 group-hover/btn:to-neutral-800/70 dark:from-neutral-200 dark:to-neutral-50 dark:text-black/80 dark:active:from-stone-300 dark:active:to-neutral-300">
                <Icon icon="lucide:external-link" className="h-3.5 w-3.5" />
                Use
              </div>
            </button>
          )}
        </div>
      </TextureCard>
    </div>
  );
}
