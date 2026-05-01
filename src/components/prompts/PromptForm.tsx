'use client';

import * as React from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { cn } from '@/lib/utils';
import { TagsSection } from './form/TagsSection';
import { SettingsSection } from './form/SettingsSection';

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

export type PromptFormValues = z.infer<typeof promptFormSchema>;

interface PromptFormProps {
  initialData?: Partial<PromptFormValues>;
  onSubmit: (data: PromptFormValues) => Promise<void>;
  isSubmitting: boolean;
  title: string;
  description: string;
  submitLabel: string;
  publicSlug?: string;
}

export function PromptForm({
  initialData,
  onSubmit,
  isSubmitting,
  title,
  description,
  submitLabel,
  publicSlug,
}: PromptFormProps) {
  const router = useRouter();
  const [editingVariable, setEditingVariable] = React.useState<{
    id: string;
    index: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<PromptFormValues>({
    resolver: zodResolver(promptFormSchema),
    defaultValues: {
      title: '',
      content: '',
      tags: [],
      isTemplate: false,
      isPublic: false,
      variables: [],
      ...initialData,
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

  React.useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || '',
        content: initialData.content || '',
        tags: initialData.tags || [],
        isTemplate: !!initialData.isTemplate,
        isPublic: !!initialData.isPublic,
        variables:
          (initialData.variables as PromptFormValues['variables']) || [],
      });
    }
  }, [initialData, reset]);

  const formTitle = useWatch({ control, name: 'title' });
  const content = useWatch({ control, name: 'content' });
  const isTemplate = useWatch({ control, name: 'isTemplate' });
  const isPublic = useWatch({ control, name: 'isPublic' });
  const tags = useWatch({ control, name: 'tags' }) as string[];

  const removeVariable = (index: number) => {
    const variable = variables[index];
    if (!variable) return;

    const updatedContent = content.replaceAll(`{{${variable.name}}}`, '');
    setValue('content', updatedContent);
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

    if (oldName !== newName) {
      const updatedContent = content.replaceAll(
        `{{${oldName}}}`,
        `{{${newName}}}`,
      );
      setValue('content', updatedContent);
    }

    setEditingVariable(null);
  };

  return (
    <div className="space-y-8 px-4 py-8 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
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
              <CardDescription>
                Write your prompt.{' '}
                {isTemplate &&
                  'Select text to convert it into a dynamic variable.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="title">Prompt Title</Label>
                  <span
                    className={cn(
                      'text-[10px] font-medium tracking-wider uppercase',
                      (formTitle?.length || 0) > 300
                        ? 'text-destructive'
                        : 'text-muted-foreground',
                    )}
                  >
                    {formTitle?.length || 0} / 300
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
                    if (vars.length > variables.length) {
                      const newVar = vars[vars.length - 1];
                      append(newVar);
                      if (!isTemplate) {
                        setValue('isTemplate', true);
                      }
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
              <SettingsSection
                isTemplate={!!isTemplate}
                setIsTemplate={(val) => setValue('isTemplate', val)}
                isPublic={!!isPublic}
                setIsPublic={(val) => setValue('isPublic', val)}
                publicSlug={publicSlug}
              />

              <Separator />

              <TagsSection
                tags={tags || []}
                onChange={(newTags) => setValue('tags', newTags)}
              />
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
                submitLabel
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
