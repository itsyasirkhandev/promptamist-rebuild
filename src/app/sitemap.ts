import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';
  const lastModified = new Date();

  // Publicly accessible routes
  const routes = ['', '/sign-in', '/sign-up'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Note: We don't include authenticated pages like /prompts, /prompts/create, etc.
  // as per instructions and best practices.

  return [...routes];
}
