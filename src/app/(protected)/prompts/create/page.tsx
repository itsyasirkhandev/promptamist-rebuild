'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { PromptEditor } from '@/components/prompts/PromptEditor';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  VariableConfigModal,
  VariableFormValues,
} from '@/components/prompts/VariableConfigModal';

const promptFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  tags: z.array(z.string()),
  isTemplate: z.boolean(),
  variables: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.enum(['text', 'number', 'textarea', 'choices', 'list']),
      options: z.array(z.string()).optional(),
    }),
  ),
});

type PromptFormValues = z.infer<typeof promptFormSchema>;

export default function CreatePromptPage() {
  const router = useRouter();
  const createPrompt = useMutation(api.authed.prompts.createPrompt);
  const [tagInput, setTagInput] = React.useState('');
  const [editingVariable, setEditingVariable] = React.useState<{
    id: string;
    index: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<PromptFormValues>({
    resolver: zodResolver(promptFormSchema),
    defaultValues: {
      title: '',
      content: '',
      tags: [],
      isTemplate: false,
      variables: [],
    },
  });

  const content = watch('content');
  const variables = watch('variables');
  const isTemplate = watch('isTemplate');
  const tags = watch('tags');

  const onSubmit = async (data: PromptFormValues) => {
    try {
      await createPrompt(data);
      toast.success('Prompt created successfully');
      router.push('/prompts');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create prompt');
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue('tags', [...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      'tags',
      tags.filter((t) => t !== tagToRemove),
    );
  };

  const removeVariable = (varId: string) => {
    const variable = variables.find((v) => v.id === varId);
    if (!variable) return;

    // Remove from variables list
    const updatedVariables = variables.filter((v) => v.id !== varId);
    setValue('variables', updatedVariables);

    // Also remove from content
    const updatedContent = content.replace(
      new RegExp(`{{${variable.name}}}`, 'g'),
      '',
    );
    setValue('content', updatedContent);
  };

  const handleEditVariable = (updatedVar: VariableFormValues) => {
    if (editingVariable === null) return;

    const updatedVariables = [...variables];
    const oldName = updatedVariables[editingVariable.index].name;
    const newName = updatedVar.name;

    updatedVariables[editingVariable.index] = {
      ...updatedVariables[editingVariable.index],
      ...updatedVar,
    };

    // If name changed, update content placeholders
    if (oldName !== newName) {
      const updatedContent = content.replace(
        new RegExp(`{{${oldName}}}`, 'g'),
        `{{${newName}}}`,
      );
      setValue('content', updatedContent);
    }

    setValue('variables', updatedVariables);
    setEditingVariable(null);
  };

  return (
    <div className="container mx-auto max-w-5xl space-y-8 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create New Prompt</h1>
          <p className="text-muted-foreground">
            Author static prompts or dynamic templates.
          </p>
        </div>
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
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
              <CardDescription>
                Write your prompt.{' '}
                {isTemplate &&
                  'Select text to convert it into a dynamic variable.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Prompt Title</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="e.g. Blog Post Generator"
                  className="text-lg font-medium"
                />
                {errors.title && (
                  <p className="text-destructive text-xs">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <PromptEditor
                content={content}
                onChange={(val) => setValue('content', val)}
                variables={variables}
                onVariablesChange={(vars) => setValue('variables', vars)}
                isTemplate={isTemplate}
              />
              {errors.content && (
                <p className="text-destructive text-xs">
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
                  <p className="text-muted-foreground text-xs">
                    Enable dynamic variables
                  </p>
                </div>
                <Switch
                  checked={isTemplate}
                  onCheckedChange={(val) => setValue('isTemplate', val)}
                />
              </div>

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
                  {tags.map((tag) => (
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
                  <div className="space-y-3 p-4">
                    {variables.length === 0 && (
                      <p className="text-muted-foreground py-4 text-center text-xs italic">
                        No variables defined yet.
                      </p>
                    )}
                    {variables.map((v, index) => (
                      <div
                        key={v.id}
                        className="bg-secondary/30 group flex items-start justify-between rounded-md p-2"
                      >
                        <div className="space-y-1">
                          <p className="text-primary font-mono text-sm font-bold">
                            {v.name}
                          </p>
                          <p className="text-muted-foreground text-[10px] tracking-wider uppercase">
                            {v.type}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingVariable({ id: v.id, index })
                            }
                            className="text-muted-foreground hover:text-primary p-1 transition-colors"
                          >
                            <Icon icon="lucide:edit" width={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeVariable(v.id)}
                            className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                          >
                            <Icon icon="lucide:trash-2" width={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          <div className="pt-4">
            <Button
              type="submit"
              className="h-12 w-full text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Icon
                  icon="lucide:loader-2"
                  className="animate-spin"
                  width={20}
                />
              ) : (
                'Save Prompt'
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
