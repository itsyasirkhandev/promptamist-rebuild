import { SignUp } from '@clerk/nextjs';
import { clerkAppearance } from '@/lib/clerk-appearance';
import { Metadata } from 'next';
import { AuthWrapper } from '@/components/layout/AuthWrapper';

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';

export const metadata: Metadata = {
  title: 'Create Your Free Account — Promptamist AI Prompt Manager',
  description:
    'Join Promptamist for free and start organizing your AI prompts. Build reusable templates, tag and search your library, and share prompts publicly — all in one intelligent workspace.',
  alternates: {
    canonical: `${BASE_URL}/sign-up`,
  },
  openGraph: {
    title: 'Create Your Free Promptamist Account',
    description:
      'Join thousands of AI power users who organize their ChatGPT, Claude, and Gemini prompts with Promptamist.',
    url: `${BASE_URL}/sign-up`,
    type: 'website',
    siteName: 'Promptamist',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignUpPage() {
  return (
    <AuthWrapper
      title="Sign Up"
      subtitleText="Already have an account?"
      linkText="Log in"
      linkHref="/sign-in"
    >
      <SignUp
        appearance={clerkAppearance}
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        forceRedirectUrl="/prompts"
      />
    </AuthWrapper>
  );
}
