import { SignIn } from '@clerk/nextjs';
import { clerkAuthAppearance } from '@/lib/clerk-appearance';
import { Metadata } from 'next';
import { AuthWrapper } from '@/components/layout/AuthWrapper';

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';

export const metadata: Metadata = {
  title: 'Sign In to Promptamist — AI Prompt Manager',
  description:
    'Sign in to your Promptamist account to manage, organize, and share your AI prompts for ChatGPT, Claude, and Gemini.',
  alternates: {
    canonical: `${BASE_URL}/sign-in`,
  },
  openGraph: {
    title: 'Sign In to Promptamist',
    description: 'Access your AI prompt library on Promptamist.',
    url: `${BASE_URL}/sign-in`,
    type: 'website',
    siteName: 'Promptamist',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignInPage() {
  return (
    <AuthWrapper
      title="Log In"
      subtitleText="New to Promptamist?"
      linkText="Sign up"
      linkHref="/sign-up"
    >
      <SignIn
        appearance={clerkAuthAppearance}
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
      />
    </AuthWrapper>
  );
}
