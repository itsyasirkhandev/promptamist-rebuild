'use client';

import * as React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { interpolateVariables, getVariableColorConfig } from '@/lib/variables';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Variable {
  id: string;
  name: string;
  type: 'text' | 'number' | 'textarea' | 'choices' | 'list';
  options?: string[];
  defaultValue?: string;
}

interface PublicPromptClientProps {
  slug: string;
}

export function PublicPromptClient({ slug }: PublicPromptClientProps) {
  const prompt = useQuery(api.publicPrompts.getPromptBySlug, { slug });

  const [variableValues, setVariableValues] = React.useState<
    Record<string, string>
  >({});
  const [initializedPromptId, setInitializedPromptId] = React.useState<
    string | null
  >(null);

  if (prompt && prompt._id !== initializedPromptId) {
    setInitializedPromptId(prompt._id);
    const defaults: Record<string, string> = {};
    if (prompt.variables) {
      (prompt.variables as Variable[]).forEach((v) => {
        if (v.defaultValue) {
          defaults[v.name] = v.defaultValue;
        }
      });
    }
    setVariableValues(defaults);
  }

  const generatedPrompt = React.useMemo(() => {
    if (!prompt) return '';
    if (!prompt.isTemplate) return prompt.content;

    return interpolateVariables(prompt.content, variableValues);
  }, [prompt, variableValues]);

  const handleVariableChange = (name: string, value: string) => {
    setVariableValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast.success('Prompt copied to clipboard!');
  };

  if (prompt === undefined) {
    return (
      <div className="mx-auto max-w-3xl space-y-8 p-4 pt-12">
        <Skeleton className="h-10 w-62.5" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-75 w-full" />
      </div>
    );
  }

  if (prompt === null) {
    return (
      <div className="mx-auto max-w-xl p-4 pt-20 text-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive text-2xl">
              Prompt Not Found
            </CardTitle>
            <CardDescription>
              This prompt doesn&apos;t exist or is no longer public.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-4 py-12">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">{prompt.title}</h1>
            <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <Icon icon="lucide:clock" width={14} />
              Last updated:{' '}
              {new Date(prompt._creationTime).toLocaleDateString()}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Share link copied to clipboard!');
            }}
            className="shrink-0 gap-2"
          >
            <Icon icon="lucide:link" width={16} />
            <span className="hidden sm:inline">Copy Link</span>
          </Button>
        </div>
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {prompt.tags.map((tag: string) => (
              <span
                key={tag}
                className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-0.5 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {prompt.isTemplate && prompt.variables && prompt.variables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Fill in the details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            {(prompt.variables as Variable[]).map((variable) => {
              const colors = getVariableColorConfig(variable.type);

              return (
                <div key={variable.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={variable.id} className="font-semibold">
                      {variable.name}
                    </Label>
                    {variable.defaultValue && (
                      <span className="text-muted-foreground text-[10px] italic">
                        (default: {variable.defaultValue})
                      </span>
                    )}
                  </div>
                  {variable.type === 'text' && (
                    <Input
                      id={variable.id}
                      value={variableValues[variable.name] || ''}
                      onChange={(e) =>
                        handleVariableChange(variable.name, e.target.value)
                      }
                      placeholder={`Enter ${variable.name}...`}
                      className={colors.input}
                    />
                  )}
                  {variable.type === 'number' && (
                    <Input
                      id={variable.id}
                      type="number"
                      value={variableValues[variable.name] || ''}
                      onChange={(e) =>
                        handleVariableChange(variable.name, e.target.value)
                      }
                      placeholder={`Enter ${variable.name}...`}
                      className={colors.input}
                    />
                  )}
                  {variable.type === 'textarea' && (
                    <Textarea
                      id={variable.id}
                      value={variableValues[variable.name] || ''}
                      onChange={(e) =>
                        handleVariableChange(variable.name, e.target.value)
                      }
                      placeholder={`Enter ${variable.name}...`}
                      className={`min-h-25 ${colors.input}`}
                    />
                  )}
                  {variable.type === 'choices' && variable.options && (
                    <Select
                      value={variableValues[variable.name] || ''}
                      onValueChange={(val) =>
                        handleVariableChange(variable.name, val)
                      }
                    >
                      <SelectTrigger id={variable.id} className={colors.input}>
                        <SelectValue
                          placeholder={`Select ${variable.name}...`}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {variable.options.map((opt: string) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {variable.type === 'list' && (
                    <Input
                      id={variable.id}
                      value={variableValues[variable.name] || ''}
                      onChange={(e) =>
                        handleVariableChange(variable.name, e.target.value)
                      }
                      placeholder="Comma separated values..."
                      className={colors.input}
                    />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Generated Prompt</CardTitle>
          <Button onClick={handleCopy} className="gap-2">
            <Icon icon="lucide:copy" width={18} />
            Copy
          </Button>
        </CardHeader>
        <CardContent>
          <div className="bg-muted relative rounded-md p-4">
            <div className="text-sm font-medium whitespace-pre-wrap">
              {generatedPrompt
                .split(/({{[^}]+}})/g)
                .map((part: string, i: number) => {
                  if (part.startsWith('{{') && part.endsWith('}}')) {
                    const varName = part.slice(2, -2);
                    const variable = (prompt.variables as Variable[]).find(
                      (v) => v.name === varName,
                    );
                    const colors = getVariableColorConfig(
                      variable?.type || 'text',
                    );

                    return (
                      <span
                        key={i}
                        className={cn(
                          'animate-pulse rounded px-1 font-mono',
                          colors.badge,
                        )}
                      >
                        {part}
                      </span>
                    );
                  }
                  return <span key={i}>{part}</span>;
                })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
