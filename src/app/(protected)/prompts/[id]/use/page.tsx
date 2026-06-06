'use client';

import * as React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { interpolateVariables } from '@/lib/variables';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  VariableInput,
  PromptVariable,
} from '@/components/prompts/VariableInput';
import { PromptPreview } from '@/components/prompts/PromptPreview';
import { OpenInAIButton } from '@/components/prompts/OpenInAIButton';

const VariableList = ({
  variables,
  formValues,
  onValueChange,
}: {
  variables: PromptVariable[];
  formValues: Record<string, string>;
  onValueChange: (name: string, value: string) => void;
}) => {
  if (variables.length === 0) {
    return (
      <div className="bg-secondary/20 rounded-lg border border-dashed py-10 text-center">
        <p className="text-muted-foreground text-sm">
          This prompt has no dynamic variables.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {variables.map((v) => (
        <VariableInput
          key={v.id}
          variable={v}
          value={formValues[v.name] as string}
          onChange={(val) => onValueChange(v.name, val)}
        />
      ))}
    </div>
  );
};

const LivePreview = ({
  content,
  variables,
  className,
}: {
  content: string;
  variables: PromptVariable[];
  className?: string;
}) => (
  <div
    className={cn(
      'bg-background selection:bg-primary/20 rounded-xl border p-8 font-serif text-base leading-relaxed break-words whitespace-pre-wrap shadow-sm',
      className,
    )}
  >
    <PromptPreview content={content} variables={variables} />
  </div>
);

const SkeletonInput = () => (
  <div className="space-y-2">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-10 w-full" />
  </div>
);

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function UseTemplatePage({ params }: PageProps) {
  const router = useRouter();
  const { id } = React.use(params);

  const prompt = useQuery(api.authed.prompts.getPromptById, {
    id: id as Id<'prompts'>,
  });

  const { setValue, control, reset } = useForm<Record<string, string>>();
  const formValues = useWatch({ control });

  React.useEffect(() => {
    if (prompt?.variables) {
      const defaults: Record<string, string> = {};
      prompt.variables.forEach((v) => {
        if (v.defaultValue) {
          defaults[v.name] = v.defaultValue;
        }
      });
      reset(defaults);
    }
  }, [prompt, reset]);

  const interpolatedContent = React.useMemo(() => {
    if (!prompt) return '';
    return interpolateVariables(
      prompt.content,
      formValues as Record<string, string>,
    );
  }, [prompt, formValues]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(interpolatedContent);
    toast.success('Copied final prompt to clipboard');
  };

  if (prompt === undefined) {
    return (
      <div className="flex h-full flex-col">
        <div className="bg-background border-b px-4 py-3 lg:px-6">
          <Skeleton className="mb-4 h-6 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-64" />
          </div>
        </div>
        <div className="hidden flex-1 grid-cols-1 overflow-hidden lg:grid lg:grid-cols-2">
          <div className="bg-background flex h-full flex-col border-r">
            <header className="shrink-0 space-y-2 border-b p-4 lg:p-6">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-48" />
            </header>
            <div className="flex-1 space-y-6 p-4 lg:p-6">
              <SkeletonInput />
              <SkeletonInput />
              <SkeletonInput />
            </div>
          </div>
          <div className="bg-secondary/10 flex h-full flex-col">
            <header className="bg-background/50 flex shrink-0 items-center justify-between border-b p-4 backdrop-blur-sm lg:p-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-9 w-36" />
            </header>
            <div className="flex-1 p-8">
              <Skeleton className="h-100 w-full rounded-xl" />
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-hidden lg:hidden">
          <div className="space-y-6 p-4">
            <SkeletonInput />
            <SkeletonInput />
          </div>
        </div>
      </div>
    );
  }

  if (prompt === null) {
    return (
      <div className="px-4 py-8 text-center lg:px-8">
        <h1 className="text-2xl font-semibold">Prompt not found</h1>
        <Button onClick={() => router.push('/prompts')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="bg-background border-b px-4 py-3 lg:px-6">
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/prompts">Prompts</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Use Template</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8"
          >
            <Icon icon="lucide:arrow-left" width={18} />
          </Button>
          <h1 className="truncate text-2xl font-semibold">{prompt.title}</h1>
        </div>
      </div>

      <div className="hidden flex-1 grid-cols-1 overflow-hidden lg:grid lg:grid-cols-2">
        <div className="bg-background flex h-full flex-col border-r">
          <header className="shrink-0 space-y-1 border-b p-4 lg:p-6">
            <h2 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Variables
            </h2>
            <p className="text-muted-foreground text-sm">
              Fill in the variables below to generate your prompt.
            </p>
          </header>

          <ScrollArea className="flex-1">
            <div className="p-4 lg:p-6">
              <VariableList
                variables={prompt.variables}
                formValues={formValues as Record<string, string>}
                onValueChange={setValue}
              />
            </div>
          </ScrollArea>
        </div>

        <div className="bg-secondary/10 flex h-full flex-col">
          <header className="bg-background/50 flex shrink-0 items-center justify-between border-b p-4 backdrop-blur-sm lg:p-6">
            <h2 className="flex items-center gap-2 font-semibold">
              <Icon icon="lucide:eye" width={18} />
              Live Preview
            </h2>
            <div className="flex items-center gap-2">
              <Button
                onClick={copyToClipboard}
                size="sm"
                variant="outline"
                className="gap-2 shadow-sm"
              >
                <Icon icon="lucide:copy" width={16} />
                Copy
              </Button>
              <OpenInAIButton content={interpolatedContent} size="sm" />
            </div>
          </header>

          <ScrollArea className="flex-1">
            <div className="mx-auto max-w-2xl p-8">
              <LivePreview
                content={interpolatedContent}
                variables={prompt.variables}
                className="min-h-100"
              />
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden lg:hidden">
        <Tabs defaultValue="fill" className="flex h-full flex-col">
          <div className="sticky top-0 z-10 shrink-0 border-b border-neutral-200/40 bg-neutral-50/70 px-4 py-2.5 backdrop-blur-md dark:border-neutral-800/40 dark:bg-neutral-950/70">
            <TabsList className="mx-auto grid h-10 w-full max-w-md grid-cols-2 gap-1 rounded-xl bg-neutral-200/50 p-1 dark:bg-neutral-900/60">
              <TabsTrigger
                value="fill"
                className={cn(
                  'flex items-center justify-center gap-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200',
                  'data-[state=active]:border-neutral-200/30 data-[state=active]:bg-white data-[state=active]:text-neutral-950 data-[state=active]:shadow-[0_2px_8px_rgba(0,0,0,0.06)]',
                  'dark:data-[state=active]:border-neutral-700/50 dark:data-[state=active]:bg-neutral-800 dark:data-[state=active]:text-neutral-50',
                )}
              >
                <Icon
                  icon="lucide:sliders-horizontal"
                  className="h-3.5 w-3.5"
                />
                Fill Variables
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className={cn(
                  'flex items-center justify-center gap-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200',
                  'data-[state=active]:border-neutral-200/30 data-[state=active]:bg-white data-[state=active]:text-neutral-950 data-[state=active]:shadow-[0_2px_8px_rgba(0,0,0,0.06)]',
                  'dark:data-[state=active]:border-neutral-700/50 dark:data-[state=active]:bg-neutral-800 dark:data-[state=active]:text-neutral-50',
                )}
              >
                <Icon icon="lucide:eye" className="h-3.5 w-3.5" />
                Preview
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent
            value="fill"
            className="animate-in fade-in slide-in-from-bottom-2 m-0 flex-1 flex-col overflow-y-auto p-5 duration-300 data-[state=active]:flex"
          >
            <VariableList
              variables={prompt.variables}
              formValues={formValues as Record<string, string>}
              onValueChange={setValue}
            />
          </TabsContent>
          <TabsContent
            value="preview"
            className="bg-secondary/5 animate-in fade-in slide-in-from-bottom-2 m-0 flex-1 flex-col overflow-y-auto p-5 duration-300 data-[state=active]:flex dark:bg-neutral-950/20"
          >
            <div className="mx-auto w-full max-w-md space-y-4">
              <div className="flex gap-2">
                <Button
                  onClick={copyToClipboard}
                  size="default"
                  variant="outline"
                  className="flex-1 gap-2 rounded-xl"
                >
                  <Icon icon="lucide:copy" width={16} />
                  Copy
                </Button>
                <OpenInAIButton
                  content={interpolatedContent}
                  size="default"
                  className="border-input flex-1 rounded-xl border shadow-sm"
                />
              </div>
              <LivePreview
                content={interpolatedContent}
                variables={prompt.variables}
                className="min-h-75 rounded-2xl border border-neutral-200/80 p-5 shadow-sm dark:border-neutral-800/80"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
