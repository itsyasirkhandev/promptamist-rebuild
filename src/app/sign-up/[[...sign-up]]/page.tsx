import { SignUp } from '@clerk/nextjs';
import { clerkAppearance } from '@/lib/clerk-appearance';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
  description:
    'Create a Promptamist account and start organizing your AI prompts today.',
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
