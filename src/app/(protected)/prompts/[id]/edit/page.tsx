'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PromptEditor } from '@/components/prompts/PromptEditor';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  VariableConfigModal,
  VariableFormValues,
} from '@/components/prompts/VariableConfigModal';
import { VariableList } from '@/components/prompts/VariableList';
import { handleError } from '@/lib/error-handler';
import { cn } from '@/lib/utils';

const promptFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(300, 'Title must be less than 300 characters'),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(50000, 'Content must be less than 50000 characters'),
  tags: z.array(z.string()),
  isTemplate: z.boolean(),
  isPublic: z.boolean().optional(),
  variables: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.enum(['text', 'number', 'textarea', 'choices', 'list']),
      options: z.array(z.string()).optional(),
      defaultValue: z.string().optional(),
    }),
  ),
});

type PromptFormValues = z.infer<typeof promptFormSchema>;

interface EditPromptPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPromptPage({ params }: EditPromptPageProps) {
  const router = useRouter();
  const [unwrappedParams, setUnwrappedParams] = React.useState<{
    id: string;
  } | null>(null);
  const [editingVariable, setEditingVariable] = React.useState<{
    id: string;
    index: number;
  } | null>(null);

  React.useEffect(() => {
    params.then(setUnwrappedParams);
  }, [params]);

  const prompt = useQuery(
    api.authed.prompts.getPromptById,
    unwrappedParams ? { id: unwrappedParams.id as Id<'prompts'> } : 'skip',
  );

  const updatePrompt = useMutation(api.authed.prompts.updatePrompt);
  const [tagInput, setTagInput] = React.useState('');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { isSubmitting, errors },
  } = useForm<PromptFormValues>({
    resolver: zodResolver(promptFormSchema),
  });

  const {
    fields: variables,
    append,
    remove,
    move,
    update,
  } = useFieldArray({
    control,
    name: 'variables',
  });

  React.useEffect(() => {
    if (prompt) {
      reset({
        title: prompt.title,
        content: prompt.content,
        tags: prompt.tags,
        isTemplate: prompt.isTemplate,
        isPublic: prompt.isPublic ?? false,
        variables: prompt.variables as PromptFormValues['variables'],
      });
    }
  }, [prompt, reset]);

  const content = useWatch({ control, name: 'content' });
  const isTemplate = useWatch({ control, name: 'isTemplate' });
  const isPublic = useWatch({ control, name: 'isPublic' });
  const title = useWatch({ control, name: 'title' });
  const tags = useWatch({ control, name: 'tags' }) as string[];

  const onSubmit = async (data: PromptFormValues) => {
    if (!unwrappedParams) return;
    try {
      await updatePrompt({
        id: unwrappedParams.id as Id<'prompts'>,
        ...data,
      });
      toast.success('Prompt updated successfully');
      router.push('/prompts');
    } catch (error) {
      handleError(error);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags?.includes(tagInput.trim())) {
      setValue('tags', [...(tags || []), tagInput.trim()]);
      toast.success(`Tag "${tagInput.trim()}" added`);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      'tags',
      tags.filter((t) => t !== tagToRemove),
    );
    toast.info(`Tag "${tagToRemove}" removed`);
  };

  const removeVariable = (index: number) => {
    const variable = variables[index];
    if (!variable) return;

    // Remove from content
    const updatedContent = content.replace(
      new RegExp(`{{${variable.name}}}`, 'g'),
      '',
    );
    setValue('content', updatedContent);

    // Remove from variables list
    remove(index);
    toast.info(`Variable {{${variable.name}}} removed`);
  };

  const handleEditVariable = (updatedVar: VariableFormValues) => {
    if (editingVariable === null) return;

    const oldName = variables[editingVariable.index].name;
    const newName = updatedVar.name;

    update(editingVariable.index, {
      ...variables[editingVariable.index],
      ...updatedVar,
    });

    toast.success(`Variable {{${updatedVar.name}}} updated`);

    // If name changed, update content placeholders
    if (oldName !== newName) {
      const updatedContent = content.replace(
        new RegExp(`{{${oldName}}}`, 'g'),
        `{{${newName}}}`,
      );
      setValue('content', updatedContent);
    }

    setEditingVariable(null);
  };

  if (!unwrappedParams || prompt === undefined) {
    return (
      <div className="space-y-8 px-4 py-8 lg:px-8">
        <Skeleton className="h-10 w-[300px]" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            <Skeleton className="h-[500px]" />
          </div>
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 py-8 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold">Edit Prompt</h1>
          <p className="text-muted-foreground">
            Modify your prompt or template settings.
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="hidden gap-2 md:flex"
        >
          <Icon icon="lucide:arrow-left" width={18} />
          Back
        </Button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-8 md:grid-cols-3"
      >
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="title">Prompt Title</Label>
                  <span
                    className={cn(
                      'text-[10px] font-medium tracking-wider uppercase',
                      (title?.length || 0) > 300
                        ? 'text-destructive'
                        : 'text-muted-foreground',
                    )}
                  >
                    {title?.length || 0} / 300
                  </span>
                </div>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="e.g. Blog Post Generator"
                  className="text-base font-semibold"
                />
                {errors.title && (
                  <p className="text-destructive text-sm">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <PromptEditor
                  content={content || ''}
                  onChange={(val) => setValue('content', val)}
                  variables={variables}
                  onVariablesChange={(vars) => {
                    // If we added a new variable, use append
                    if (vars.length > variables.length) {
                      const newVar = vars[vars.length - 1];
                      append(newVar);
                    } else {
                      setValue('variables', vars);
                    }
                  }}
                  isTemplate={isTemplate || false}
                />
                <div className="flex justify-end">
                  <span
                    className={cn(
                      'text-[10px] font-medium tracking-wider uppercase',
                      (content?.length || 0) > 50000
                        ? 'text-destructive'
                        : 'text-muted-foreground',
                    )}
                  >
                    {content?.length || 0} / 50000
                  </span>
                </div>
              </div>
              {errors.content && (
                <p className="text-destructive text-sm">
                  {errors.content.message}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label>Templating Mode</Label>
                  <p className="text-muted-foreground text-sm">
                    Enable dynamic variables
                  </p>
                </div>
                <Switch
                  checked={isTemplate}
                  onCheckedChange={(val) => setValue('isTemplate', val)}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label>Make Public</Label>
                  <p className="text-muted-foreground text-sm">
                    Anyone with the link can access this prompt
                  </p>
                </div>
                <Switch
                  checked={!!isPublic}
                  onCheckedChange={(val) => setValue('isPublic', val)}
                />
              </div>

              {isPublic && prompt?.publicSlug && (
                <div className="bg-muted flex items-center space-x-2 rounded-md p-2">
                  <Input
                    readOnly
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/p/${prompt.publicSlug}`}
                    className="h-8 bg-transparent"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/p/${prompt.publicSlug}`,
                        );
                        toast.success('Link copied to clipboard');
                      }
                    }}
                  >
                    Copy
                  </Button>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    size="icon"
                    variant="outline"
                  >
                    <Icon icon="lucide:plus" width={18} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {tags?.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="gap-1 px-2 py-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-destructive"
                      >
                        <Icon icon="lucide:x" width={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {isTemplate && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Defined Variables</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[250px]">
                  <VariableList
                    variables={variables}
                    onReorder={(oldIndex, newIndex) => move(oldIndex, newIndex)}
                    onEdit={(index) =>
                      setEditingVariable({ id: variables[index].id, index })
                    }
                    onRemove={(index) => removeVariable(index)}
                  />
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          <div className="pt-4">
            <Button
              type="submit"
              className="h-12 w-full text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Icon
                  icon="lucide:loader-2"
                  className="animate-spin"
                  width={20}
                />
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </div>
      </form>

      {editingVariable !== null && (
        <VariableConfigModal
          isOpen={true}
          onClose={() => setEditingVariable(null)}
          onConfirm={handleEditVariable}
          initialData={variables[editingVariable.index]}
          existingVariables={variables.map((v) => v.name)}
        />
      )}
    </div>
  );
}
