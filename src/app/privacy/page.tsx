import { Metadata } from 'next';
import { Icon } from '@iconify/react';
import { TextureCard } from '@/components/ui/TextureCard';

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';

export const metadata: Metadata = {
  title: 'Privacy Policy | Promptamist',
  description:
    'Learn how Promptamist handles your data and ensures your AI prompts remain secure and private.',
  alternates: {
    canonical: `${BASE_URL}/privacy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-neutral-50 transition-colors duration-500 dark:bg-stone-950">
      {/* Premium Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[1000px] w-full max-w-7xl -translate-x-1/2">
          <div className="absolute top-[-10%] left-[20%] h-[500px] w-[500px] rounded-full bg-neutral-200/50 blur-[120px] dark:bg-stone-800/20" />
          <div className="absolute top-[10%] right-[20%] h-[400px] w-[400px] rounded-full bg-neutral-300/30 blur-[100px] dark:bg-neutral-900/30" />
        </div>
      </div>

      <main className="relative z-10 px-4 py-24 md:py-36">
        <div className="mx-auto max-w-4xl space-y-20">
          {/* Header Section */}
          <div className="text-center">
            <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/50 px-3 py-1 text-[min(2.8vw,12px)] font-bold tracking-[0.1em] text-neutral-600 uppercase sm:px-4 sm:py-1.5 sm:text-xs sm:tracking-[0.2em] dark:border-neutral-800 dark:bg-stone-900/50 dark:text-neutral-400">
              <Icon
                icon="lucide:shield-check"
                className="h-3.5 w-3.5 shrink-0"
              />
              <span className="whitespace-nowrap">Security & Privacy</span>
            </div>
            <h1 className="mb-8 text-5xl leading-[1.05] font-bold tracking-tight text-balance text-neutral-900 sm:text-7xl dark:text-neutral-50">
              Privacy Policy
            </h1>
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-neutral-500">
              <Icon icon="lucide:calendar" className="h-4 w-4" />
              <span>Last Updated: May 3, 2026</span>
            </div>
          </div>

          {/* Document Content */}
          <TextureCard className="group p-2">
            <div className="space-y-16 p-8 md:p-12 lg:p-16">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-900 shadow-sm transition-transform group-hover:scale-110 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                  <Icon icon="lucide:shield" className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                  Data Protection Commitment
                </h2>
              </div>

              <div className="prose prose-neutral dark:prose-invert max-w-none space-y-16">
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-xs font-bold text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900">
                      01
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">
                      Introduction
                    </h3>
                  </div>
                  <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                    At Promptamist, we take your privacy seriously. This policy
                    explains how we collect, use, and protect your information
                    when you use our prompt management platform.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-xs font-bold text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900">
                      02
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">
                      Data Collection
                    </h3>
                  </div>
                  <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                    We collect information that you provide directly to us,
                    including:
                  </p>
                  <ul className="space-y-4 text-lg text-neutral-600 dark:text-neutral-400">
                    <li>
                      <strong className="font-bold text-neutral-900 dark:text-neutral-100">
                        Account Information:
                      </strong>{' '}
                      Name, email address, and authentication data provided via
                      Clerk.
                    </li>
                    <li>
                      <strong className="font-bold text-neutral-900 dark:text-neutral-100">
                        Content:
                      </strong>{' '}
                      The AI prompts, templates, and tags you create and store
                      in our platform.
                    </li>
                    <li>
                      <strong className="font-bold text-neutral-900 dark:text-neutral-100">
                        Usage Data:
                      </strong>{' '}
                      Information about how you interact with our service.
                    </li>
                  </ul>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-xs font-bold text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900">
                      03
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">
                      How We Use Your Data
                    </h3>
                  </div>
                  <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                    Your data is used to provide, maintain, and improve our
                    services. We do{' '}
                    <strong className="font-bold text-neutral-900 dark:text-neutral-100">
                      not
                    </strong>{' '}
                    sell your prompts to third parties or use them to train our
                    own models without your explicit permission.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-xs font-bold text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900">
                      04
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">
                      Public Sharing
                    </h3>
                  </div>
                  <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                    If you choose to make a prompt &quot;Public&quot;, it will
                    be accessible via a unique URL to anyone on the internet.
                    You can revoke public access at any time by changing the
                    prompt settings back to &quot;Private&quot;.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-xs font-bold text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900">
                      05
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">
                      Third-Party Services
                    </h3>
                  </div>
                  <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                    We use trusted third-party providers for critical functions:
                  </p>
                  <ul className="space-y-4 text-lg text-neutral-600 dark:text-neutral-400">
                    <li>
                      <strong className="font-bold text-neutral-900 dark:text-neutral-100">
                        Clerk:
                      </strong>{' '}
                      For secure authentication.
                    </li>
                    <li>
                      <strong className="font-bold text-neutral-900 dark:text-neutral-100">
                        Convex:
                      </strong>{' '}
                      For real-time data storage and backend logic.
                    </li>
                    <li>
                      <strong className="font-bold text-neutral-900 dark:text-neutral-100">
                        Vercel:
                      </strong>{' '}
                      For hosting and infrastructure.
                    </li>
                  </ul>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-xs font-bold text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900">
                      06
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">
                      Your Rights
                    </h3>
                  </div>
                  <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                    You have the right to access, correct, or delete your
                    personal data. You can export your prompts or delete your
                    account at any time through the dashboard settings.
                  </p>
                </section>

                <section className="space-y-6 border-t border-neutral-200 pt-16 dark:border-neutral-800">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-xs font-bold text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900">
                      07
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">
                      Contact Us
                    </h3>
                  </div>
                  <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                    If you have questions about this policy, please contact us
                    at{' '}
                    <a
                      href="mailto:privacy@promptamist.com"
                      className="font-bold text-neutral-900 decoration-2 underline-offset-4 hover:underline dark:text-neutral-50"
                    >
                      privacy@promptamist.com
                    </a>
                    .
                  </p>
                </section>
              </div>
            </div>
          </TextureCard>

          {/* Footer Assistance */}
          <div className="flex flex-col items-center justify-center gap-6 py-10 text-center text-sm font-medium text-neutral-500 md:flex-row">
            <p>Need more details about your data?</p>
            <div className="hidden h-4 w-px bg-neutral-300 md:block dark:bg-neutral-700" />
            <a
              href="mailto:privacy@promptamist.com"
              className="font-bold text-neutral-900 decoration-2 underline-offset-4 hover:underline dark:text-neutral-50"
            >
              Visit Privacy Center
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
