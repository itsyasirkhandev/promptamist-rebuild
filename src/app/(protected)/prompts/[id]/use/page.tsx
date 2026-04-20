'use client';

import * as React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PageProps {
  params: Promise<{ id: string }>;
}

type PromptVariable = {
  id: string;
  name: string;
  type: 'text' | 'number' | 'textarea' | 'choices' | 'list';
  options?: string[];
};

export default function UseTemplatePage({ params }: PageProps) {
  const router = useRouter();
  const [unwrappedParams, setUnwrappedParams] = React.useState<{
    id: string;
  } | null>(null);

  React.useEffect(() => {
    params.then(setUnwrappedParams);
  }, [params]);

  const prompt = useQuery(
    api.authed.prompts.getPromptById,
    unwrappedParams ? { id: unwrappedParams.id as Id<'prompts'> } : 'skip',
  );

  const { register, watch, setValue } = useForm<Record<string, string>>();
  const formValues = watch();

  const interpolatedContent = React.useMemo(() => {
    if (!prompt) return '';
    let content = prompt.content;
    (prompt.variables as PromptVariable[]).forEach((v) => {
      const val = formValues[v.name] || `{{${v.name}}}`;
      const regex = new RegExp(`{{${v.name}}}`, 'g');
      content = content.replace(regex, val);
    });
    return content;
  }, [prompt, formValues]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(interpolatedContent);
    toast.success('Copied final prompt to clipboard');
  };

  if (!unwrappedParams || prompt === undefined) {
    return (
      <div className="container mx-auto space-y-8 py-10">
        <Skeleton className="h-10 w-[300px]" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Skeleton className="h-[500px]" />
          <Skeleton className="h-[500px]" />
        </div>
      </div>
    );
  }

  if (prompt === null) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold">Prompt not found</h1>
        <Button onClick={() => router.push('/prompts')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden">
      <div className="grid h-full grid-cols-1 md:grid-cols-2">
        {/* Left Side: Inputs */}
        <div className="bg-background flex h-full flex-col border-r">
          <header className="space-y-1 border-b p-6">
            <div className="mb-2 flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="h-8 w-8"
              >
                <Icon icon="lucide:arrow-left" width={18} />
              </Button>
              <h1 className="truncate text-xl font-bold">{prompt.title}</h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Fill in the variables below to generate your prompt.
            </p>
          </header>

          <ScrollArea className="flex-grow">
            <div className="space-y-6 p-6">
              {prompt.variables.length === 0 ? (
                <div className="bg-secondary/20 rounded-lg border border-dashed py-10 text-center">
                  <p className="text-muted-foreground text-sm">
                    This prompt has no dynamic variables.
                  </p>
                </div>
              ) : (
                (prompt.variables as PromptVariable[]).map((v) => (
                  <div key={v.id} className="space-y-2">
                    <Label className="text-sm font-semibold">{v.name}</Label>

                    {v.type === 'text' && (
                      <Input
                        {...register(v.name)}
                        placeholder={`Enter ${v.name.toLowerCase()}...`}
                      />
                    )}

                    {v.type === 'number' && (
                      <Input
                        type="number"
                        {...register(v.name)}
                        placeholder="0"
                      />
                    )}

                    {v.type === 'textarea' && (
                      <Textarea
                        {...register(v.name)}
                        placeholder={`Enter ${v.name.toLowerCase()}...`}
                        className="min-h-[100px]"
                      />
                    )}

                    {v.type === 'choices' && (
                      <Select onValueChange={(val) => setValue(v.name, val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option..." />
                        </SelectTrigger>
                        <SelectContent>
                          {v.options?.map((opt: string) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {v.type === 'list' && (
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-[10px] italic">
                          Comma separated values
                        </p>
                        <Input
                          {...register(v.name)}
                          placeholder="item1, item2, item3"
                        />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Side: Live Preview */}
        <div className="bg-secondary/10 flex h-full flex-col">
          <header className="bg-background/50 flex items-center justify-between border-b p-6 backdrop-blur-sm">
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

          <ScrollArea className="flex-grow">
            <div className="mx-auto max-w-2xl p-8">
              <div className="bg-background selection:bg-primary/20 min-h-[400px] rounded-xl border p-8 font-serif text-lg leading-relaxed break-words whitespace-pre-wrap shadow-sm">
                {interpolatedContent
                  .split(/({{[^}]+}})/g)
                  .map((part: string, i: number) => {
                    if (part.startsWith('{{') && part.endsWith('}}')) {
                      return (
                        <span
                          key={i}
                          className="text-primary bg-primary/5 animate-pulse rounded px-1 font-mono"
                        >
                          {part}
                        </span>
                      );
                    }
                    return <span key={i}>{part}</span>;
                  })}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
