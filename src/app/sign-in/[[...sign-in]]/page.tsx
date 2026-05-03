import { SignIn } from '@clerk/nextjs';
import { clerkAppearance } from '@/lib/clerk-appearance';
import { Metadata } from 'next';

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
    // Auth pages should not be indexed
    index: false,
    follow: false,
  },
};

export default function SignInPage() {
  return (
    <div
      role="main"
      aria-label="Sign in form"
      className="bg-background flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="w-full max-w-md" aria-describedby="signin-description">
        <div className="mb-8 text-center">
          <h1
            id="signin-title"
            tabIndex={-1}
            className="text-foreground text-4xl font-semibold tracking-tight"
          >
            Welcome back
          </h1>
          <p
            id="signin-description"
            className="text-muted-foreground mt-2 text-sm"
          >
            Sign in to your Promptamist account to continue
          </p>
        </div>

        <div className="flex justify-center">
          <SignIn
            appearance={clerkAppearance}
            path="/sign-in"
            routing="path"
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </div>
  );
}
