import { SignUp } from '@clerk/nextjs';
import { clerkAppearance } from '@/lib/clerk-appearance';
import { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';

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
    index: false,
    follow: false,
  },
};

export default function SignUpPage() {
  return (
    <div className="bg-background relative flex h-screen w-full flex-col items-center justify-center overflow-hidden px-4">
      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-20">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="border-border bg-card hover:bg-accent gap-2 rounded-xl shadow-sm transition-all"
        >
          <Link href="/">
            <Icon icon="lucide:arrow-left" width={16} />
            Back to Home
          </Link>
        </Button>
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Main Container */}
      <div className="animate-in fade-in zoom-in-95 relative z-10 flex h-full w-full items-center justify-center py-12">
        <div className="bg-muted/30 w-full max-w-[500px] rounded-[40px] p-2 shadow-2xl sm:p-4">
          <div className="bg-card border-border relative flex min-h-[600px] w-full flex-col items-center rounded-[32px] border px-6 py-12 sm:px-12">
            {/* Logo */}
            <div className="mb-12 flex flex-col items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-3 transition-transform hover:scale-105"
              >
                <Logo className="text-primary h-14 w-14" />
                <span className="text-foreground text-4xl font-bold tracking-tight">
                  Promptamist
                </span>
              </Link>
            </div>

            {/* Auth Form */}
            <div className="w-full flex-1">
              <SignUp
                appearance={clerkAppearance}
                path="/sign-up"
                routing="path"
                signInUrl="/sign-in"
                forceRedirectUrl="/prompts"
              />
            </div>

            {/* Footer Text */}
            <div className="text-muted-foreground/50 mt-12 text-center text-xs leading-relaxed">
              By continuing, you agree to our <br />
              <Link
                href="/terms"
                className="hover:text-primary underline transition-colors"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy"
                className="hover:text-primary underline transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-primary/5 absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>
    </div>
  );
}
