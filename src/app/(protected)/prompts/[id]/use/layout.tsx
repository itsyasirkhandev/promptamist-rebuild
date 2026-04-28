import { Suspense } from 'react';
import { PromptUseLayout } from '@/components/prompts/use/PromptUseLayout';

export default function UseTemplateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="h-full w-full" />}>
      <PromptUseLayout>{children}</PromptUseLayout>
    </Suspense>
  );
}
