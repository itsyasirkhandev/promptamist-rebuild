import { Metadata } from 'next';
import { HomeClient } from '@/components/HomeClient';
import Script from 'next/script';

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';

export const metadata: Metadata = {
  title: 'Promptamist \u2014 AI Prompt Manager for ChatGPT, Claude & Gemini',
  description:
    'Stop losing your best AI prompts in chat logs. Promptamist lets you organize, build reusable templates with dynamic variables, and share prompts publicly. The #1 prompt management tool for AI power users.',
  keywords: [
    'AI prompt manager',
    'prompt engineering tool',
    'ChatGPT prompts',
    'Claude AI prompts',
    'Gemini prompt library',
    'prompt template builder',
    'reusable AI prompts',
    'prompt organization',
    'AI productivity',
    'LLM prompt library',
  ],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: 'Promptamist \u2014 AI Prompt Manager for ChatGPT, Claude & Gemini',
    description:
      'Stop losing your best AI prompts. Organize, build reusable templates with dynamic variables, and share prompts publicly \u2014 all in one intelligent workspace.',
    url: BASE_URL,
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Promptamist \u2014 AI Prompt Management Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Promptamist \u2014 AI Prompt Manager for ChatGPT, Claude & Gemini',
    description:
      'Organize, template, and share your AI prompts. Dynamic variables, public sharing, full prompt library \u2014 built for AI power users.',
    images: ['/opengraph-image'],
  },
};

const webAppJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'Promptamist',
      description:
        'The intelligent prompt management platform for AI power users. Organize, template, and share your ChatGPT, Claude, and Gemini prompts.',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${BASE_URL}/prompts?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${BASE_URL}/#app`,
      name: 'Promptamist',
      url: BASE_URL,
      applicationCategory: 'ProductivityApplication',
      operatingSystem: 'Web',
      description:
        'Promptamist is the intelligent prompt management platform for AI power users. Organize your ChatGPT, Claude, and Gemini prompts, build reusable templates with dynamic variables, and share prompts publicly.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free tier available. Premium plans for power users.',
      },
      featureList: [
        'AI Prompt Organization',
        'Dynamic Template Variables',
        'Public Prompt Sharing',
        'Multi-model Support (ChatGPT, Claude, Gemini)',
        'Prompt Search and Filtering',
        'Prompt Tagging System',
      ],
      screenshot: `${BASE_URL}/opengraph-image`,
    },
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'Promptamist',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/icon.svg`,
        width: 512,
        height: 512,
      },
      sameAs: ['https://github.com/itsyasirkhandev/promptamist-rebuild'],
    },
    {
      '@type': 'FAQPage',
      '@id': `${BASE_URL}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Promptamist?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Promptamist is an AI prompt management platform that lets you organize, build reusable templates with dynamic variables, and share your AI prompts publicly. It supports ChatGPT, Claude, Gemini, and all major LLMs.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I use Promptamist for free?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Promptamist offers a free tier that lets you create and manage AI prompts. Premium plans are available for users who need higher prompt limits and advanced features.',
          },
        },
        {
          '@type': 'Question',
          name: 'What are prompt templates with dynamic variables?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Prompt templates let you define reusable prompts with placeholder variables. When you use a template, you simply fill in the variable values to instantly generate a customized prompt. This saves time and ensures consistency across your AI workflows.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I share my prompts publicly?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Promptamist lets you make any prompt public and share it via a unique URL (e.g., repromptamist.vercel.app/p/your-prompt-slug). Anyone with the link can view and use your prompt without needing an account.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which AI models does Promptamist support?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Promptamist is model-agnostic and works with all major AI models including OpenAI ChatGPT (GPT-4o, GPT-4), Anthropic Claude, Google Gemini, Mistral, Llama, and any other LLM you use.',
          },
        },
      ],
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <Script
        id="homepage-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <HomeClient />
    </>
  );
}
