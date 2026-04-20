import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/prompts', // Protected routes
        '/api', // API routes
        '/prompts/*', // All nested protected routes
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
