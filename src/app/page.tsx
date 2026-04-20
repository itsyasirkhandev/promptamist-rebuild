import { Metadata } from 'next';
import { HomeClient } from '@/components/HomeClient';

export const metadata: Metadata = {
  title: 'Promptamist | AI-Powered Prompt Management',
  description:
    'Organize, test, and optimize your AI prompts with our intelligent platform built for power users. Boost your AI productivity today.',
  openGraph: {
    title: 'Promptamist | AI-Powered Prompt Management',
    description:
      'The intelligent platform for AI prompt engineering and management.',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
