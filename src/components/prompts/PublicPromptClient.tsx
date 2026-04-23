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
}

interface PublicPromptClientProps {
  slug: string;
}

export function PublicPromptClient({ slug }: PublicPromptClientProps) {
  const prompt = useQuery(api.publicPrompts.getPromptBySlug, { slug });

  const [variableValues, setVariableValues] = React.useState<
    Record<string, string>
  >({});

  const generatedPrompt = React.useMemo(() => {
    if (!prompt) return '';
    let result = prompt.content;
    if (prompt.isTemplate) {
      Object.entries(variableValues).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, value || `{{${key}}}`);
      });
    }
    return result;
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
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (prompt === null) {
    return (
      <div className="mx-auto max-w-xl p-4 pt-20 text-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-destructive">
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
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{prompt.title}</h1>
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {prompt.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
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
            {(prompt.variables as Variable[]).map((variable) => (
              <div key={variable.id} className="space-y-2">
                <Label htmlFor={variable.id} className="font-semibold">
                  {variable.name}
                </Label>
                {variable.type === 'text' && (
                  <Input
                    id={variable.id}
                    value={variableValues[variable.name] || ''}
                    onChange={(e) =>
                      handleVariableChange(variable.name, e.target.value)
                    }
                    placeholder={`Enter ${variable.name}...`}
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
                    className="min-h-[100px]"
                  />
                )}
                {variable.type === 'choices' && variable.options && (
                  <Select
                    value={variableValues[variable.name] || ''}
                    onValueChange={(val) =>
                      handleVariableChange(variable.name, val)
                    }
                  >
                    <SelectTrigger id={variable.id}>
                      <SelectValue placeholder={`Select ${variable.name}...`} />
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
                  />
                )}
              </div>
            ))}
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
          <div className="relative rounded-md bg-muted p-4">
            <pre className="whitespace-pre-wrap text-sm font-medium">
              {generatedPrompt}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
