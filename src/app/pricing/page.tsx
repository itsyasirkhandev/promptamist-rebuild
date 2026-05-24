import { Metadata } from 'next';
import { PricingClient } from './PricingClient';

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';

export const metadata: Metadata = {
  title: 'Pricing — Affordable Prompt Management for AI Power Users',
  description:
    'Choose the plan that fits your AI workflow. From our generous free tier to professional tools for power users, Promptamist is the most cost-effective way to manage your prompts.',
  alternates: {
    canonical: `${BASE_URL}/pricing`,
  },
};

export default function PricingPage() {
  return <PricingClient />;
}
