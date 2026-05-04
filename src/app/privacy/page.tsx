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
    <div className="bg-neutral-50 dark:bg-stone-950 relative min-h-screen transition-colors duration-500">
      {/* Premium Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -z-10 h-[1000px] w-full max-w-7xl -translate-x-1/2 pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] h-[500px] w-[500px] rounded-full bg-neutral-200/50 blur-[120px] dark:bg-stone-800/20" />
          <div className="absolute top-[10%] right-[20%] h-[400px] w-[400px] rounded-full bg-neutral-300/30 blur-[100px] dark:bg-neutral-900/30" />
        </div>
      </div>

      <main className="relative z-10 px-4 py-24 md:py-36">
        <div className="mx-auto max-w-4xl space-y-20">
          {/* Header Section */}
          <div className="text-center">
            <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-neutral-200/60 bg-white/40 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 backdrop-blur-xl dark:border-neutral-800/40 dark:bg-stone-900/40 dark:text-neutral-400">
              <Icon icon="lucide:shield-check" className="h-3.5 w-3.5 text-neutral-400/80" />
              Security & Privacy
            </div>
            <h1 className="text-balance font-bold text-5xl tracking-tight text-neutral-900 sm:text-7xl dark:text-neutral-50 leading-[1.05] mb-8">
              Privacy Policy
            </h1>
            <div className="text-neutral-500 flex items-center justify-center gap-2 text-sm font-medium">
              <Icon icon="lucide:calendar" className="h-4 w-4" />
              <span>Last Updated: May 3, 2026</span>
            </div>
          </div>

          {/* Document Content */}
          <TextureCard className="group p-2">
            <div className="p-8 md:p-12 lg:p-16 space-y-16">
              <div className="flex items-center gap-4">
                <div className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm transition-transform group-hover:scale-110">
                  <Icon icon="lucide:shield" className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">Data Protection Commitment</h2>
              </div>

              <div className="prose prose-neutral dark:prose-invert max-w-none space-y-16">
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 text-xs font-bold">
                      01
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">Introduction</h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
                    At Promptamist, we take your privacy seriously. This policy
                    explains how we collect, use, and protect your information
                    when you use our prompt management platform.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 text-xs font-bold">
                      02
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">Data Collection</h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
                    We collect information that you provide directly to us,
                    including:
                  </p>
                  <ul className="text-neutral-600 dark:text-neutral-400 space-y-4 text-lg">
                    <li>
                      <strong className="text-neutral-900 dark:text-neutral-100 font-bold">
                        Account Information:
                      </strong>{' '}
                      Name, email address, and authentication data provided via
                      Clerk.
                    </li>
                    <li>
                      <strong className="text-neutral-900 dark:text-neutral-100 font-bold">Content:</strong> The AI
                      prompts, templates, and tags you create and store in our
                      platform.
                    </li>
                    <li>
                      <strong className="text-neutral-900 dark:text-neutral-100 font-bold">Usage Data:</strong>{' '}
                      Information about how you interact with our service.
                    </li>
                  </ul>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 text-xs font-bold">
                      03
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">How We Use Your Data</h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
                    Your data is used to provide, maintain, and improve our
                    services. We do{' '}
                    <strong className="text-neutral-900 dark:text-neutral-100 font-bold">not</strong>{' '}
                    sell your prompts to third parties or use them to train our
                    own models without your explicit permission.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 text-xs font-bold">
                      04
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">Public Sharing</h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
                    If you choose to make a prompt &quot;Public&quot;, it will be
                    accessible via a unique URL to anyone on the internet. You can
                    revoke public access at any time by changing the prompt
                    settings back to &quot;Private&quot;.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 text-xs font-bold">
                      05
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">Third-Party Services</h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
                    We use trusted third-party providers for critical functions:
                  </p>
                  <ul className="text-neutral-600 dark:text-neutral-400 space-y-4 text-lg">
                    <li>
                      <strong className="text-neutral-900 dark:text-neutral-100 font-bold">Clerk:</strong> For
                      secure authentication.
                    </li>
                    <li>
                      <strong className="text-neutral-900 dark:text-neutral-100 font-bold">Convex:</strong> For
                      real-time data storage and backend logic.
                    </li>
                    <li>
                      <strong className="text-neutral-900 dark:text-neutral-100 font-bold">Vercel:</strong> For
                      hosting and infrastructure.
                    </li>
                  </ul>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 text-xs font-bold">
                      06
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">Your Rights</h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
                    You have the right to access, correct, or delete your personal
                    data. You can export your prompts or delete your account at
                    any time through the dashboard settings.
                  </p>
                </section>

                <section className="border-t border-neutral-200 dark:border-neutral-800 pt-16 space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 text-xs font-bold">
                      07
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">Contact Us</h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
                    If you have questions about this policy, please contact us at{' '}
                    <a
                      href="mailto:privacy@promptamist.com"
                      className="text-neutral-900 dark:text-neutral-50 font-bold hover:underline decoration-2 underline-offset-4"
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
          <div className="text-neutral-500 flex flex-col md:flex-row items-center justify-center gap-6 text-center text-sm font-medium py-10">
            <p>Need more details about your data?</p>
            <div className="hidden md:block h-4 w-px bg-neutral-300 dark:bg-neutral-700" />
            <a
              href="mailto:privacy@promptamist.com"
              className="text-neutral-900 dark:text-neutral-50 font-bold hover:underline decoration-2 underline-offset-4"
            >
              Visit Privacy Center
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
