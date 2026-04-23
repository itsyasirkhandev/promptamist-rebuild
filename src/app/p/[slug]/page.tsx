import * as React from 'react';
import { PublicPromptClient } from '@/components/prompts/PublicPromptClient';

interface PublicPromptPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicPromptPage({
  params,
}: PublicPromptPageProps) {
  const { slug } = await params;

  return (
    <div className="bg-background min-h-screen">
      <PublicPromptClient slug={slug} />
    </div>
  );
}
