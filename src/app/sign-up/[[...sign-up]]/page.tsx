import { SignUp } from '@clerk/nextjs';
import { clerkAppearance } from '@/lib/clerk-appearance';
import { Metadata } from 'next';

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
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Promptamist — Start for Free',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Your Free Promptamist Account',
    description:
      'Organize your ChatGPT, Claude & Gemini prompts. Free to start.',
    images: ['/opengraph-image'],
  },
  robots: {
    // Auth pages should not be indexed
    index: false,
    follow: false,
  },
};

export default function SignUpPage() {
  return (
    <div
      role="main"
      aria-label="Sign up form"
      className="bg-background flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="w-full max-w-md" aria-describedby="signup-description">
        <div className="mb-8 text-center">
          <h1
            id="signup-title"
            tabIndex={-1}
            className="text-foreground text-4xl font-semibold tracking-tight"
          >
            Create an account
          </h1>
          <p
            id="signup-description"
            className="text-muted-foreground mt-2 text-sm"
          >
            Join Promptamist to manage your AI prompts
          </p>
        </div>

        <div className="flex justify-center">
          <SignUp
            appearance={clerkAppearance}
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
            forceRedirectUrl="/prompts"
          />
        </div>
      </div>
    </div>
  );
}
