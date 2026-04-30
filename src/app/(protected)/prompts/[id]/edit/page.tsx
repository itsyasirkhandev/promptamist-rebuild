'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { toast } from 'sonner';

import { Skeleton } from '@/components/ui/skeleton';
import { PromptForm, PromptFormValues } from '@/components/prompts/PromptForm';
import { handleError } from '@/lib/error-handler';

interface EditPromptPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPromptPage({ params }: EditPromptPageProps) {
  const router = useRouter();
  const { id } = React.use(params);

  const prompt = useQuery(api.authed.prompts.getPromptById, {
    id: id as Id<'prompts'>,
  });

  const updatePrompt = useMutation(api.authed.prompts.updatePrompt);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (data: PromptFormValues) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await updatePrompt({
        id: id as Id<'prompts'>,
        ...data,
      });
      toast.success('Prompt updated successfully');
      router.push('/prompts');
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!id || prompt === undefined) {
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
    <PromptForm
      initialData={prompt as Partial<PromptFormValues>}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      title="Edit Prompt"
      description="Modify your prompt or template settings."
      submitLabel="Save Changes"
      publicSlug={prompt?.publicSlug}
    />
  );
}
