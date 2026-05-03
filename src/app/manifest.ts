import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Promptamist \u2014 AI Prompt Manager',
    short_name: 'Promptamist',
    description:
      'Organize, test, and share your AI prompts. Build reusable templates with dynamic variables for ChatGPT, Claude, Gemini, and any LLM.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f0f0f',
    theme_color: '#e1401a',
    orientation: 'portrait',
    categories: ['productivity', 'utilities'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/opengraph-image',
        sizes: '1200x630',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Promptamist \u2014 AI Prompt Management Dashboard',
      },
    ],
  };
}
