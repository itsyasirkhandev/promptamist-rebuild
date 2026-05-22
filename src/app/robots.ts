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
          '/marketplace',
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
        allow: ['/', '/marketplace', '/p/', '/sign-in', '/sign-up'],
        disallow: ['/prompts', '/api/', '/_next/'],
      },
      {
        userAgent: 'ChatGPT-User', // ChatGPT browsing plugin
        allow: ['/', '/marketplace', '/p/', '/sign-in', '/sign-up'],
        disallow: ['/prompts', '/api/', '/_next/'],
      },
      {
        userAgent: 'PerplexityBot', // Perplexity AI
        allow: ['/', '/marketplace', '/p/', '/sign-in', '/sign-up'],
        disallow: ['/prompts', '/api/', '/_next/'],
      },
      {
        userAgent: 'ClaudeBot', // Anthropic Claude
        allow: ['/', '/marketplace', '/p/', '/sign-in', '/sign-up'],
        disallow: ['/prompts', '/api/', '/_next/'],
      },
      {
        userAgent: 'anthropic-ai', // Anthropic crawler
        allow: ['/', '/marketplace', '/p/', '/sign-in', '/sign-up'],
        disallow: ['/prompts', '/api/', '/_next/'],
      },
      {
        userAgent: 'Googlebot', // Google Search + AI Overview
        allow: ['/', '/marketplace', '/p/', '/sign-in', '/sign-up'],
        disallow: ['/prompts', '/api/', '/_next/'],
      },
      {
        userAgent: 'Bingbot', // Bing / Microsoft Copilot
        allow: ['/', '/marketplace', '/p/', '/sign-in', '/sign-up'],
        disallow: ['/prompts', '/api/', '/_next/'],
      },
      {
        userAgent: 'meta-externalagent', // Meta AI
        allow: ['/', '/marketplace', '/p/', '/sign-in', '/sign-up'],
        disallow: ['/prompts', '/api/', '/_next/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
