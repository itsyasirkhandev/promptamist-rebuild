import { SignUp } from '@clerk/nextjs';
import { clerkAppearance } from '@/lib/clerk-appearance';
import { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';

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
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-background px-4 py-12">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Logo Section */}
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
          <Logo className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold tracking-tight">Promptamist</span>
        </Link>
      </div>

      {/* Auth Card */}
      <div className="flex w-full max-w-sm flex-col items-start gap-y-4 rounded-md border border-muted-foreground/20 bg-card p-5 shadow-sm">
        <div className="flex flex-col items-start gap-y-1">
          <h1 className="text-xl font-semibold text-foreground">Sign Up</h1>
          <div className="text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/sign-in" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </div>
        </div>

        <div className="flex w-full flex-col items-center">
          <SignUp
            appearance={clerkAppearance}
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
            forceRedirectUrl="/prompts"
          />
        </div>
      </div>

      {/* Footer Text */}
      <div className="text-muted-foreground/50 text-center text-xs leading-relaxed max-w-xs">
        By continuing, you agree to our{' '}
        <Link href="/terms" className="hover:text-primary underline transition-colors">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="hover:text-primary underline transition-colors">
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
}
