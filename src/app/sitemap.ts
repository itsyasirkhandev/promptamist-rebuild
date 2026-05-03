import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';
  const lastModified = new Date();

  // Publicly accessible marketing + auth routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sign-in`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/sign-up`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Note: Public prompt pages (/p/[slug]) are dynamically generated
  // and should be added here via a Convex query in a production setup.
  // Example pattern for dynamic public prompt pages:
  //   const publicPrompts = await fetchPublicPrompts();
  //   const promptRoutes = publicPrompts.map((p) => ({
  //     url: `${baseUrl}/p/${p.slug}`,
  //     lastModified: new Date(p._creationTime),
  //     changeFrequency: 'weekly' as const,
  //     priority: 0.8,
  //   }));
  //   return [...staticRoutes, ...promptRoutes];

  return staticRoutes;
}
