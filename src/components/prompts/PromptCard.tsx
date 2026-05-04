'use client';

import * as React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Doc } from '../../../convex/_generated/dataModel';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface PromptCardProps {
  prompt: Doc<'prompts'>;
}

export const PromptCard = React.memo(function PromptCard({
  prompt,
}: PromptCardProps) {
  const deletePrompt = useMutation(api.authed.prompts.deletePrompt);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt.content);
    toast.success('Copied to clipboard');
  };

  const handleDelete = async () => {
    try {
      await deletePrompt({ id: prompt._id });
      toast.success('Prompt deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete prompt');
    }
  };

  return (
    <div className="group @container h-full">
      <div className="h-full rounded-[24px] border border-white/60 bg-gradient-to-b from-neutral-100 to-white/70 transition-all duration-300 hover:shadow-xl hover:shadow-neutral-200/50 dark:border-stone-950/60 dark:from-neutral-800 dark:to-neutral-900 dark:hover:shadow-black/50">
        <div className="flex h-full flex-col rounded-[23px] border border-black/10 dark:border-neutral-900/80">
          <div className="flex h-full flex-col rounded-[22px] border border-white/50 dark:border-neutral-950">
            <div className="flex h-full flex-col rounded-[21px] border border-neutral-950/20 dark:border-neutral-900/70">
              <div className="flex h-full w-full flex-col rounded-[20px] border border-white/50 text-neutral-500 dark:border-neutral-700/50">
                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <h3 className="line-clamp-2 text-lg leading-tight font-bold text-neutral-900 dark:text-neutral-50">
                      {prompt.title}
                    </h3>
                    <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                      {prompt.isPublic && (
                        <span className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-green-600 uppercase dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400">
                          Public
                        </span>
                      )}
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
                  <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <Icon icon="lucide:clock" className="h-3.5 w-3.5" />
                    {new Date(prompt._creationTime).toLocaleDateString()}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 px-6 pb-4">
                  <p className="line-clamp-4 text-sm leading-relaxed whitespace-pre-wrap text-neutral-600 dark:text-neutral-400">
                    {prompt.content}
                  </p>
                  {prompt.tags.length > 0 && (
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
                <div className="mt-auto flex items-center gap-2 border-t border-neutral-200/60 p-4 pt-4 dark:border-neutral-800/80">
                  {prompt.isTemplate ? (
                    <Link
                      href={`/prompts/${prompt._id}/use?mode=focused`}
                      className="flex-1"
                    >
                      <div className="group/btn rounded-[10px] border-[1px] border-black/10 bg-gradient-to-b from-black/70 to-black p-[1px] transition duration-300 ease-in-out dark:border-[2px] dark:border-black dark:from-white dark:to-white/80">
                        <div className="flex h-10 w-full items-center justify-center gap-2 rounded-[8px] bg-gradient-to-b from-neutral-800 to-black px-4 text-xs font-semibold text-white/90 transition duration-300 ease-in-out group-hover/btn:from-stone-800 group-hover/btn:to-neutral-800/70 dark:from-neutral-200 dark:to-neutral-50 dark:text-black/80 dark:active:from-stone-300 dark:active:to-neutral-300">
                          <Icon icon="lucide:play" className="h-3.5 w-3.5" />
                          Use
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <button
                      onClick={copyToClipboard}
                      className="group/btn flex-1 rounded-[10px] border-[1px] border-black/10 bg-gradient-to-b from-neutral-200 to-neutral-50 p-[1px] shadow-sm transition duration-300 ease-in-out dark:border-[2px] dark:border-neutral-950 dark:from-neutral-700 dark:to-neutral-800"
                    >
                      <div className="flex h-10 w-full items-center justify-center gap-2 rounded-[8px] bg-gradient-to-b from-white to-neutral-50/50 px-4 text-xs font-semibold text-neutral-700 transition duration-300 ease-in-out group-hover/btn:from-neutral-50 group-hover/btn:to-neutral-100/60 dark:from-neutral-800 dark:to-neutral-900 dark:text-neutral-200 dark:group-hover/btn:from-neutral-700 dark:group-hover/btn:to-neutral-800">
                        <Icon icon="lucide:copy" className="h-3.5 w-3.5" />
                        Copy
                      </div>
                    </button>
                  )}

                  <div className="flex gap-1.5">
                    {prompt.isPublic && prompt.publicSlug && (
                      <button
                        onClick={() => {
                          const url = `${window.location.origin}/p/${prompt.publicSlug}`;
                          navigator.clipboard.writeText(url);
                          toast.success('Share link copied to clipboard');
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-neutral-200 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800"
                        title="Copy Share Link"
                      >
                        <Icon
                          icon="lucide:link"
                          className="h-4 w-4 text-neutral-600 dark:text-neutral-400"
                        />
                      </button>
                    )}
                    <Link
                      href={`/prompts/${prompt._id}/edit`}
                      className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-neutral-200 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800"
                      title="Edit"
                    >
                      <Icon
                        icon="lucide:edit"
                        className="h-4 w-4 text-neutral-600 dark:text-neutral-400"
                      />
                    </Link>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="group/del flex h-10 w-10 items-center justify-center rounded-[10px] border border-neutral-200 transition-colors hover:bg-red-50 dark:border-neutral-800 dark:hover:bg-red-950/30"
                          title="Delete"
                        >
                          <Icon
                            icon="lucide:trash-2"
                            className="h-4 w-4 text-neutral-600 group-hover/del:text-red-500 dark:text-neutral-400"
                          />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-[24px] border-neutral-200 dark:border-neutral-800">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-neutral-900 dark:text-neutral-50">
                            Are you sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-neutral-600 dark:text-neutral-400">
                            This will permanently delete the prompt &quot;
                            {prompt.title}
                            &quot;.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-[12px] border-neutral-200 dark:border-neutral-800">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="rounded-[12px] bg-red-600 text-white hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
