import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';

  return {
    rules: [
      {
        // Standard crawlers: allow public pages, block app internals
        userAgent: '*',
        allow: [
          '/',
          '/sign-in',
          '/sign-up',
          '/p/', // Public shared prompts
        ],
        disallow: [
          '/prompts', // Protected app routes
          '/prompts/',
          '/api/', // API endpoints
          '/_next/', // Next.js internals
          '/actions/', // Server actions
        ],
      },
      // ——— AI Search Engine Bots ———
      // Allow all AI crawlers on public pages for GEO citations
      {
        userAgent: 'GPTBot', // OpenAI / ChatGPT
        allow: ['/', '/p/', '/sign-in', '/sign-up'],
        disallow: ['/prompts', '/api/', '/_next/'],
      },
      {
        userAgent: 'ChatGPT-User', // ChatGPT browsing plugin
        allow: ['/', '/p/', '/sign-in', '/sign-up'],
        disallow: ['/prompts', '/api/', '/_next/'],
      },
      {
        userAgent: 'PerplexityBot', // Perplexity AI
        allow: ['/', '/p/', '/sign-in', '/sign-up'],
        disallow: ['/prompts', '/api/', '/_next/'],
      },
      {
        userAgent: 'ClaudeBot', // Anthropic Claude
        allow: ['/', '/p/', '/sign-in', '/sign-up'],
        disallow: ['/prompts', '/api/', '/_next/'],
      },
      {
        userAgent: 'anthropic-ai', // Anthropic crawler
        allow: ['/', '/p/', '/sign-in', '/sign-up'],
        disallow: ['/prompts', '/api/', '/_next/'],
      },
      {
        userAgent: 'Googlebot', // Google Search + AI Overview
        allow: ['/', '/p/', '/sign-in', '/sign-up'],
        disallow: ['/prompts', '/api/', '/_next/'],
      },
      {
        userAgent: 'Bingbot', // Bing / Microsoft Copilot
        allow: ['/', '/p/', '/sign-in', '/sign-up'],
        disallow: ['/prompts', '/api/', '/_next/'],
      },
      {
        userAgent: 'meta-externalagent', // Meta AI
        allow: ['/', '/p/', '/sign-in', '/sign-up'],
        disallow: ['/prompts', '/api/', '/_next/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
