'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { toast } from 'sonner';
import Link from 'next/link';

import { PromptForm, PromptFormValues } from '@/components/prompts/PromptForm';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { handleError } from '@/lib/error-handler';
import { UpgradeModal } from '@/components/subscription/UpgradeModal';

export default function CreatePromptPage() {
  const router = useRouter();
  const createPrompt = useMutation(api.authed.prompts.createPrompt);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);

  const onSubmit = async (data: PromptFormValues) => {
    setIsSubmitting(true);
    try {
      await createPrompt(data);
      toast.success('Prompt created successfully');
      router.push('/prompts');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('Prompt limit reached')) {
        setShowUpgradeModal(true);
      } else {
        handleError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 pt-8">
      <div className="px-4 lg:px-8">
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
      </div>
      <PromptForm
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        title="Create New Prompt"
        description="Author static prompts or dynamic templates."
        submitLabel="Save Prompt"
      />
      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
    </div>
  );
}
