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
      'bg-background selection:bg-primary/20 rounded-xl border p-8 font-serif text-base leading-relaxed wrap-break-word whitespace-pre-wrap shadow-sm',
      className,
    )}
  >
    <PromptPreview content={content} variables={variables} />
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
      (prompt.variables as PromptVariable[]).forEach((v) => {
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
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
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
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
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
                variables={prompt.variables as PromptVariable[]}
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
            <Button
              onClick={copyToClipboard}
              size="sm"
              className="gap-2 shadow-lg"
            >
              <Icon icon="lucide:copy" width={16} />
              Copy Final Prompt
            </Button>
          </header>

          <ScrollArea className="flex-1">
            <div className="mx-auto max-w-2xl p-8">
              <LivePreview
                content={interpolatedContent}
                variables={prompt.variables as PromptVariable[]}
                className="min-h-100"
              />
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden lg:hidden">
        <Tabs defaultValue="fill" className="flex h-full flex-col">
          <div className="bg-background shrink-0 border-b px-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="fill">Fill Variables</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent
            value="fill"
            className="m-0 flex-1 flex-col overflow-y-auto p-4 data-[state=active]:flex"
          >
            <VariableList
              variables={prompt.variables as PromptVariable[]}
              formValues={formValues as Record<string, string>}
              onValueChange={setValue}
            />
          </TabsContent>
          <TabsContent
            value="preview"
            className="bg-secondary/10 m-0 flex-1 flex-col overflow-y-auto p-4 data-[state=active]:flex"
          >
            <div className="space-y-4">
              <Button
                onClick={copyToClipboard}
                size="lg"
                className="w-full gap-2 shadow-lg"
              >
                <Icon icon="lucide:copy" width={18} />
                Copy Final Prompt
              </Button>
              <LivePreview
                content={interpolatedContent}
                variables={prompt.variables as PromptVariable[]}
                className="min-h-75 p-6"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
