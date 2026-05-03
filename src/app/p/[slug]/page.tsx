import * as React from 'react';
import { Metadata } from 'next';
import { PublicPromptClient } from '@/components/prompts/PublicPromptClient';

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';

interface PublicPromptPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PublicPromptPageProps): Promise<Metadata> {
  const { slug } = await params;

  // Derive a human-readable title from the slug (e.g. "my-cool-prompt" -> "My Cool Prompt")
  const humanTitle = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const title = `${humanTitle} \u2014 AI Prompt`;
  const description = `Use "${humanTitle}" \u2014 a free AI prompt shared on Promptamist. Fill in the template variables and copy the generated prompt for ChatGPT, Claude, Gemini, or any LLM.`;
  const url = `${BASE_URL}/p/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: 'Promptamist',
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: `${humanTitle} \u2014 AI Prompt on Promptamist`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/opengraph-image'],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
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
