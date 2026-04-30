'use client';

import * as React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Doc } from '../../../convex/_generated/dataModel';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    <div className="@container h-full">
      <Card className="hover:border-primary/50 flex h-full flex-col transition-colors @md:shadow-md">
        <CardHeader className="pb-3 @md:pb-4">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-2 text-base @md:text-2xl">
              {prompt.title}
            </CardTitle>
            <div className="flex shrink-0 flex-wrap justify-end gap-1">
              {prompt.isPublic ? (
                <Badge
                  variant="secondary"
                  className="bg-green-500/10 text-green-600 hover:bg-green-500/20 @max-md:px-1 @max-md:text-[10px]"
                >
                  Public
                </Badge>
              ) : null}
              {prompt.isTemplate ? (
                <Badge
                  variant="default"
                  className="bg-blue-500 hover:bg-blue-600 @max-md:px-1 @max-md:text-[10px]"
                >
                  Template
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="@max-md:px-1 @max-md:text-[10px]"
                >
                  Static
                </Badge>
              )}
            </div>
          </div>
          <CardDescription className="flex items-center gap-2 text-sm @md:text-sm">
            <Icon icon="lucide:clock" width={14} />
            {new Date(prompt._creationTime).toLocaleDateString()}
          </CardDescription>
        </CardHeader>

        <CardContent className="grow pb-3 @md:pb-4">
          <p className="text-muted-foreground line-clamp-3 text-sm whitespace-pre-wrap @md:line-clamp-4">
            {prompt.content}
          </p>
          <div className="mt-4 flex flex-wrap gap-1">
            {prompt.tags.map((tag: string) => (
              <Badge
                key={tag}
                variant="secondary"
                className="px-2 py-0 text-[10px] @md:text-sm"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap gap-2 border-t pt-3 @md:pt-4">
          {prompt.isTemplate ? (
            <Button asChild className="h-10 grow gap-2 @md:h-11">
              <Link href={`/prompts/${prompt._id}/use?mode=focused`}>
                <Icon icon="lucide:play" width={16} />
                <span className="hidden @xs:inline">Use Template</span>
                <span className="@xs:hidden">Use</span>
              </Link>
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={copyToClipboard}
              className="h-10 grow gap-2 @md:h-11"
            >
              <Icon icon="lucide:copy" width={16} />
              <span className="hidden @xs:inline">Copy Prompt</span>
              <span className="@xs:hidden">Copy</span>
            </Button>
          )}

          <div className="flex gap-2">
            {prompt.isPublic ? (
              prompt.publicSlug ? (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const url = `${window.location.origin}/p/${prompt.publicSlug}`;
                    navigator.clipboard.writeText(url);
                    toast.success('Share link copied to clipboard');
                  }}
                  title="Copy Share Link"
                  className="h-10 w-10 @md:h-11 @md:w-11"
                >
                  <Icon icon="lucide:link" width={18} />
                </Button>
              ) : null
            ) : null}
            <Button
              variant="outline"
              size="icon"
              asChild
              title="Edit"
              className="h-10 w-10 @md:h-11 @md:w-11"
            >
              <Link href={`/prompts/${prompt._id}/edit`}>
                <Icon icon="lucide:edit" width={18} />
              </Link>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:text-destructive h-10 w-10 @md:h-11 @md:w-11"
                  title="Delete"
                >
                  <Icon icon="lucide:trash-2" width={18} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the prompt &quot;{prompt.title}
                    &quot;.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
});
