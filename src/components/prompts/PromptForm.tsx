'use client';

import * as React from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Icon } from '@iconify/react';
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
import { VariableConfigModal } from '@/components/prompts/VariableConfigModal';
import { VariableList } from '@/components/prompts/VariableList';
import { cn } from '@/lib/utils';
import { usePromptVariables } from '@/hooks/usePromptVariables';
import { Variable } from '@/lib/variables';
import { TagsSection } from './form/TagsSection';
import { SettingsSection } from './form/SettingsSection';
import { Loader } from '@/components/ui/Loader';
import {
  PROMPT_TITLE_MAX_LENGTH,
  PROMPT_CONTENT_MAX_LENGTH,
} from '../../../convex/limits';

const promptFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(
      PROMPT_TITLE_MAX_LENGTH,
      `Title must be less than ${PROMPT_TITLE_MAX_LENGTH} characters`,
    ),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(
      PROMPT_CONTENT_MAX_LENGTH,
      `Content must be less than ${PROMPT_CONTENT_MAX_LENGTH} characters`,
    ),
  tags: z.array(z.string()),
  isTemplate: z.boolean(),
  isPublic: z.boolean().optional(),
  category: z.string().optional(),
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
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedText, setSelectedText] = React.useState('');
  const [insertVariableCallback, setInsertVariableCallback] = React.useState<
    ((varName: string) => void) | null
  >(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
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
      category: 'general',
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
        category: initialData.category || 'general',
        variables:
          (initialData.variables as PromptFormValues['variables']) || [],
      });
    }
  }, [initialData, reset]);

  const formTitle = useWatch({ control, name: 'title' });
  const content = useWatch({ control, name: 'content' });
  const isTemplate = useWatch({ control, name: 'isTemplate' });
  const isPublic = useWatch({ control, name: 'isPublic' });
  const category = useWatch({ control, name: 'category' });
  const tags = useWatch({ control, name: 'tags' }) as string[];

  const {
    handleContentChange,
    addVariable,
    removeVariable,
    updateVariable,
    reorderVariable,
  } = usePromptVariables({
    content: content || '',
    variables,
    setValue,
    getValues,
    append,
    remove,
    update,
    move,
    isTemplate: !!isTemplate,
  });

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
                      (formTitle?.length || 0) > PROMPT_TITLE_MAX_LENGTH
                        ? 'text-destructive'
                        : 'text-muted-foreground',
                    )}
                  >
                    {formTitle?.length || 0} / {PROMPT_TITLE_MAX_LENGTH}
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
                  onChange={handleContentChange}
                  variables={variables}
                  isTemplate={!!isTemplate}
                  onRequestNewVariable={(text, insertCb) => {
                    setSelectedText(text);
                    setInsertVariableCallback(() => insertCb);
                    setIsModalOpen(true);
                  }}
                />
                <div className="flex justify-end">
                  <span
                    className={cn(
                      'text-[10px] font-medium tracking-wider uppercase',
                      (content?.length || 0) > PROMPT_CONTENT_MAX_LENGTH
                        ? 'text-destructive'
                        : 'text-muted-foreground',
                    )}
                  >
                    {content?.length || 0} / {PROMPT_CONTENT_MAX_LENGTH}
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
                category={category || 'general'}
                setCategory={(val) => setValue('category', val)}
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
                    onReorder={reorderVariable}
                    onEdit={(index) =>
                      setEditingVariable({ id: variables[index].id, index })
                    }
                    onRemove={removeVariable}
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
              {isSubmitting ? <Loader size={20} /> : submitLabel}
            </Button>
          </div>
        </div>
      </form>

      {editingVariable !== null && (
        <VariableConfigModal
          isOpen={true}
          onClose={() => setEditingVariable(null)}
          onConfirm={(updatedVar) => {
            updateVariable(editingVariable.index, updatedVar);
            setEditingVariable(null);
          }}
          initialData={variables[editingVariable.index]}
          existingVariables={variables.map((v) => v.name)}
        />
      )}

      <VariableConfigModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setInsertVariableCallback(null);
        }}
        onConfirm={(data) => {
          const newVar: Variable = {
            id: crypto.randomUUID(),
            name: data.name,
            type: data.type,
            options: data.options,
            defaultValue: data.defaultValue,
          };
          addVariable(newVar);
          if (insertVariableCallback) {
            insertVariableCallback(newVar.name);
          }
          setIsModalOpen(false);
          setInsertVariableCallback(null);
        }}
        initialValue={selectedText}
        existingVariables={variables.map((v) => v.name)}
      />
    </div>
  );
}
