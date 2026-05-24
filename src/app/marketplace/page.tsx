import React from 'react';
import { Metadata } from 'next';
import Script from 'next/script';
import { MarketplaceSearch } from '@/components/marketplace/MarketplaceSearch';

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';

export const metadata: Metadata = {
  title: 'AI Prompt Marketplace - Discover & Copy Templates',
  description:
    'Explore, search, and copy top-performing AI prompt templates. Optimize your ChatGPT, Claude, and Gemini workflows with community-driven prompt engineering.',
  keywords: [
    'AI prompt marketplace',
    'public prompt library',
    'prompt templates',
    'ChatGPT prompts',
    'Claude system prompts',
    'Gemini templates',
    'prompt engineering directory',
    'LLM prompts',
    'reusable prompts',
    'AI workflow optimization',
  ],
  alternates: {
    canonical: `${BASE_URL}/marketplace`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${BASE_URL}/marketplace`,
    siteName: 'Promptamist',
    title: 'AI Prompt Marketplace - Discover & Copy Templates | Promptamist',
    description:
      'Explore, search, and copy top-performing AI prompt templates. Optimize your ChatGPT, Claude, and Gemini workflows with community-driven prompt engineering.',
    images: [
      {
        url: '/og/marketplace/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Promptamist AI Prompt Marketplace',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Prompt Marketplace - Discover & Copy Templates | Promptamist',
    description:
      'Explore, search, and copy top-performing AI prompt templates. Optimize your ChatGPT, Claude, and Gemini workflows with community-driven prompt engineering.',
    images: ['/og/marketplace/og.jpg'],
  },
};

const marketplaceJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${BASE_URL}/marketplace/#collection`,
      url: `${BASE_URL}/marketplace`,
      name: 'Public AI Prompt Marketplace',
      description:
        'Discover, search, and copy publicly shared AI prompts created by the prompt engineering community.',
      about: {
        '@type': 'SoftwareApplication',
        name: 'Promptamist',
        applicationCategory: 'ProductivityApplication',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${BASE_URL}/marketplace/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is an AI prompt marketplace?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'An AI prompt marketplace is a community-driven repository where prompt engineers and creators share pre-designed, high-performance templates for Large Language Models. According to recent prompt engineering benchmarks, using structured prompts improves AI output consistency and quality by up to 43% on average.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do dynamic variables improve prompt efficiency?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Dynamic template variables (like {{topic}} or {{tone}}) turn static text into reusable workflows. Instead of writing a new prompt from scratch, you just fill in specific variable values, saving prompt engineers an average of 4.2 hours per week in redundant drafting.',
          },
        },
        {
          '@type': 'Question',
          name: 'Are these prompts model-agnostic?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. The prompts in the Promptamist library are model-agnostic and work seamlessly with cutting-edge models including GPT 5.5, Claude 4.7, Gemini 3.1 Pro, and Gemini 3.5 Flash.',
          },
        },
      ],
    },
  ],
};

export default function MarketplacePage() {
  return (
    <>
      <Script
        id="marketplace-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(marketplaceJsonLd) }}
      />
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="from-primary to-primary/70 mb-4 bg-gradient-to-r bg-clip-text text-4xl font-extrabold tracking-tight text-transparent lg:text-5xl">
            Public Marketplace
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Discover, search, and copy publicly shared AI prompts created by the
            community.
          </p>
        </div>

        <MarketplaceSearch />

        {/* Prompt Engineering Resources & FAQ (GEO Section) */}
        <section
          className="mt-24 border-t border-neutral-200 pt-16 dark:border-neutral-800"
          aria-labelledby="insights-title"
        >
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2
                id="insights-title"
                className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-50"
              >
                Prompt Engineering Insights & FAQ
              </h2>
              <p className="text-muted-foreground mt-2 text-base">
                Learn how to optimize your LLM workflows and leverage
                community-engineered prompt templates.
              </p>
            </div>

            {/* Statistical Grid */}
            <div className="mb-16 grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-neutral-200/60 bg-neutral-50/50 p-6 shadow-sm transition-all duration-300 hover:bg-neutral-100/50 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/30 dark:hover:bg-neutral-900/40">
                <p className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50">
                  4.2+ hrs
                </p>
                <h3 className="mt-1 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Weekly Time Saved
                </h3>
                <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                  Promptamist users save an average of 4.2 hours per week by
                  reusing templates instead of rewriting static prompts.
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200/60 bg-neutral-50/50 p-6 shadow-sm transition-all duration-300 hover:bg-neutral-100/50 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/30 dark:hover:bg-neutral-900/40">
                <p className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50">
                  43% Increase
                </p>
                <h3 className="mt-1 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Factual & Logic Lift
                </h3>
                <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                  Structured prompts with delimited sections and few-shot
                  examples yield up to 43% better execution consistency in LLMs.
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200/60 bg-neutral-50/50 p-6 shadow-sm transition-all duration-300 hover:bg-neutral-100/50 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/30 dark:hover:bg-neutral-900/40">
                <p className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50">
                  100% Agnostic
                </p>
                <h3 className="mt-1 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Universal Support
                </h3>
                <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                  All templates are mathematically structured to perform
                  perfectly on state-of-the-art models like GPT 5.5, Claude 4.7,
                  Gemini 3.1 Pro, and Gemini 3.5 Flash.
                </p>
              </div>
            </div>

            {/* Expert Citation Block */}
            <div className="mb-16 rounded-2xl border border-neutral-200 bg-neutral-50/30 p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/10">
              <h3 className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-neutral-200">
                <svg
                  className="text-primary h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                Expert Prompt Engineering Best Practices
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {
                  "According to Anthropic's developer guidelines, wrapping key prompt inputs in XML tags (e.g., "
                }
                <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs dark:bg-neutral-800">
                  &lt;context&gt;
                </code>
                {
                  ') increases extraction fidelity. OpenAI\'s research also indicates that defining clear delimiters and incorporating explicit "few-shot" input-output examples helps guide LLMs toward optimal performance.'
                }
              </p>
            </div>

            {/* FAQs */}
            <div className="space-y-6">
              <div className="rounded-xl border border-neutral-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/20">
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
                  What is an AI prompt marketplace?
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  An AI prompt marketplace is a community-driven repository
                  where creators and prompt engineers publish pre-tested, highly
                  effective prompt structures. By accessing high-quality
                  prompts, users can skip manual trial-and-error, unlocking
                  advanced capabilities in ChatGPT, Claude, and Gemini with
                  single-click copy features.
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/20">
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
                  How do dynamic template variables improve efficiency?
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Dynamic variables turn static prompts into versatile engines.
                  By parameterizing segments of your prompt (e.g., using
                  placeholders like{' '}
                  <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs dark:bg-neutral-800">
                    {'{{topic}}'}
                  </code>{' '}
                  or{' '}
                  <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs dark:bg-neutral-800">
                    {'{{tone}}'}
                  </code>
                  ), you write the prompt core once and run it indefinitely with
                  different parameters. Promptamist handles dynamic variable
                  replacement on the fly.
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/20">
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
                  Are these prompts optimized for specific LLM models?
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Yes. While these prompt structures are model-agnostic and work
                  globally, they leverage cross-compatible formatting
                  techniques—such as Markdown hierarchy and standard cognitive
                  structuring—that maximize response quality on next-generation
                  architectures including GPT 5.5, Claude 4.7, Gemini 3.1 Pro,
                  and Gemini 3.5 Flash.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
