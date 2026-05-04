import { SignIn } from '@clerk/nextjs';
import { clerkAppearance } from '@/lib/clerk-appearance';
import { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Icon } from '@iconify/react';

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
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Side: Hero (Visible on lg+) */}
      <div className="bg-primary relative hidden h-full flex-1 flex-col justify-between p-12 lg:flex">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent_50%)] opacity-50" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />

        <Link
          href="/"
          className="text-primary-foreground relative z-10 flex items-center gap-2 text-2xl font-bold tracking-tight"
        >
          <Logo className="text-primary-foreground h-10 w-10" />
          Promptamist
        </Link>
      </div>

      {/* Right Side: Auth Form */}
      <div className="relative flex flex-1 flex-col items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="absolute top-8 right-8 flex items-center gap-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <div className="mb-4 inline-flex lg:hidden">
              <Link href="/">
                <Logo className="text-primary h-12 w-12" />
              </Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Sign in to your Promptamist account to continue
            </p>
          </div>

          <div className="flex justify-center lg:justify-start">
            <SignIn
              appearance={clerkAppearance}
              path="/sign-in"
              routing="path"
              signUpUrl="/sign-up"
            />
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="text-muted-foreground mt-8 text-center text-xs lg:hidden">
          © {new Date().getFullYear()} Promptamist. All rights reserved.
        </div>
      </div>
    </div>
  );
}
