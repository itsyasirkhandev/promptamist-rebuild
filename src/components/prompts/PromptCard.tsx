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
    <div className="@container h-full group">
      <div className="rounded-[24px] border border-white/60 dark:border-stone-950/60 bg-gradient-to-b from-neutral-100 to-white/70 dark:from-neutral-800 dark:to-neutral-900 h-full transition-all duration-300 hover:shadow-xl hover:shadow-neutral-200/50 dark:hover:shadow-black/50">
        <div className="rounded-[23px] border border-black/10 dark:border-neutral-900/80 flex flex-col h-full">
          <div className="rounded-[22px] border border-white/50 dark:border-neutral-950 flex flex-col h-full">
            <div className="rounded-[21px] border border-neutral-950/20 dark:border-neutral-900/70 flex flex-col h-full">
              <div className="w-full rounded-[20px] border border-white/50 text-neutral-500 dark:border-neutral-700/50 flex flex-col h-full">
                
                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="line-clamp-2 text-lg font-bold text-neutral-900 dark:text-neutral-50 leading-tight">
                      {prompt.title}
                    </h3>
                    <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                      {prompt.isPublic && (
                        <span className="px-2 py-0.5 rounded-full border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-950/30 text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
                          Public
                        </span>
                      )}
                      {prompt.isTemplate ? (
                        <span className="px-2 py-0.5 rounded-full border border-neutral-900 dark:border-neutral-100 bg-neutral-900 dark:bg-neutral-100 text-[10px] font-bold uppercase tracking-wider text-white dark:text-neutral-900">
                          Template
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-800 text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                          Static
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <Icon icon="lucide:clock" className="w-3.5 h-3.5" />
                    {new Date(prompt._creationTime).toLocaleDateString()}
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-4 flex-1">
                  <p className="text-neutral-600 dark:text-neutral-400 line-clamp-4 text-sm leading-relaxed whitespace-pre-wrap">
                    {prompt.content}
                  </p>
                  {prompt.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {prompt.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-800/50 text-[10px] font-medium text-neutral-600 dark:text-neutral-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-auto border-t border-neutral-200/60 dark:border-neutral-800/80 p-4 pt-4 flex items-center gap-2">
                  {prompt.isTemplate ? (
                    <Link
                      href={`/prompts/${prompt._id}/use?mode=focused`}
                      className="flex-1"
                    >
                      <div className="border-[1px] border-black/10 bg-gradient-to-b from-black/70 to-black p-[1px] transition duration-300 ease-in-out dark:border-[2px] dark:border-black dark:from-white dark:to-white/80 rounded-[10px] group/btn">
                        <div className="flex h-10 w-full items-center justify-center gap-2 bg-gradient-to-b from-neutral-800 to-black text-white/90 transition duration-300 ease-in-out group-hover/btn:from-stone-800 group-hover/btn:to-neutral-800/70 dark:from-neutral-200 dark:to-neutral-50 dark:text-black/80 dark:active:from-stone-300 dark:active:to-neutral-300 rounded-[8px] px-4 text-xs font-semibold">
                          <Icon icon="lucide:play" className="w-3.5 h-3.5" />
                          Use
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <button
                      onClick={copyToClipboard}
                      className="flex-1 group/btn border-[1px] border-black/20 bg-white/50 p-[1px] hover:bg-gradient-to-t hover:from-neutral-100 active:bg-neutral-200 dark:border-[2px] dark:border-neutral-950 dark:bg-neutral-600/80 dark:active:bg-neutral-800 dark:hover:from-neutral-600/50 dark:hover:to-neutral-600/70 rounded-[10px]"
                    >
                      <div className="flex h-10 w-full items-center justify-center gap-2 text-neutral-700 dark:text-neutral-200 bg-gradient-to-b from-white to-neutral-50/50 transition duration-300 ease-in-out group-hover/btn:bg-gradient-to-b group-hover/btn:from-neutral-50/50 group-hover/btn:to-neutral-100/60 rounded-[8px] px-4 text-xs font-semibold">
                        <Icon icon="lucide:copy" className="w-3.5 h-3.5" />
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
                        className="h-10 w-10 flex items-center justify-center rounded-[10px] border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                        title="Copy Share Link"
                      >
                        <Icon icon="lucide:link" className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                      </button>
                    )}
                    <Link
                      href={`/prompts/${prompt._id}/edit`}
                      className="h-10 w-10 flex items-center justify-center rounded-[10px] border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                      title="Edit"
                    >
                      <Icon icon="lucide:edit" className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    </Link>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="h-10 w-10 flex items-center justify-center rounded-[10px] border border-neutral-200 dark:border-neutral-800 hover:bg-red-50 dark:hover:bg-red-950/30 group/del transition-colors"
                          title="Delete"
                        >
                          <Icon icon="lucide:trash-2" className="w-4 h-4 text-neutral-600 dark:text-neutral-400 group-hover/del:text-red-500" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-[24px] border-neutral-200 dark:border-neutral-800">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-neutral-900 dark:text-neutral-50">Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription className="text-neutral-600 dark:text-neutral-400">
                            This will permanently delete the prompt &quot;{prompt.title}
                            &quot;.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-[12px] border-neutral-200 dark:border-neutral-800">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-[12px]"
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
