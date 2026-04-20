import { SignIn } from '@clerk/nextjs';
import { clerkAppearance } from '@/lib/clerk-appearance';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Promptamist account to manage your AI prompts.',
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
            className="text-foreground text-3xl font-bold tracking-tight"
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
