'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';
import Link from 'next/link';

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
import { VariableList } from '@/components/prompts/VariableList';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { handleError } from '@/lib/error-handler';

const promptFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  tags: z.array(z.string()),
  isTemplate: z.boolean(),
  isPublic: z.boolean().optional(),
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
    control,
    formState: { isSubmitting, errors },
  } = useForm<PromptFormValues>({
    resolver: zodResolver(promptFormSchema),
    defaultValues: {
      title: '',
      content: '',
      tags: [],
      isTemplate: false,
      isPublic: false,
      variables: [],
    },
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

  const content = useWatch({ control, name: 'content' });
  const isTemplate = useWatch({ control, name: 'isTemplate' });
  const isPublic = useWatch({ control, name: 'isPublic' });
  const tags = useWatch({ control, name: 'tags' }) as string[];

  const onSubmit = async (data: PromptFormValues) => {
    try {
      await createPrompt(data);
      toast.success('Prompt created successfully');
      router.push('/prompts');
    } catch (error) {
      handleError(error);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue('tags', [...tags, tagInput.trim()]);
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

  return (
    <div className="space-y-8 px-4 py-8 lg:px-8">
      <div className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/prompts">Prompts</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create New</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-semibold">Create New Prompt</h1>
            <p className="text-muted-foreground">
              Author static prompts or dynamic templates.
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
                  className="text-base font-semibold"
                />
                {errors.title && (
                  <p className="text-destructive text-sm">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <PromptEditor
                content={content}
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
                isTemplate={isTemplate}
              />
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
