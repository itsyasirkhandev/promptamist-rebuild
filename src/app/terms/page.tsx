import { Metadata } from 'next';
import { Icon } from '@iconify/react';
import { TextureCard } from '@/components/ui/TextureCard';

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';

export const metadata: Metadata = {
  title: 'Terms of Service | Promptamist',
  description: 'The terms and conditions for using the Promptamist platform.',
  alternates: {
    canonical: `${BASE_URL}/terms`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
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
                icon="lucide:scroll-text"
                className="h-3.5 w-3.5 shrink-0"
              />
              <span className="whitespace-nowrap">Legal Framework</span>
            </div>
            <h1 className="mb-8 text-5xl leading-[1.05] font-bold tracking-tight text-balance text-neutral-900 sm:text-7xl dark:text-neutral-50">
              Terms of Service
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
                  <Icon icon="lucide:file-text" className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                  Platform Agreement
                </h2>
              </div>

              <div className="prose prose-neutral dark:prose-invert max-w-none space-y-16">
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-xs font-bold text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900">
                      01
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">
                      Acceptance of Terms
                    </h3>
                  </div>
                  <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                    By accessing or using Promptamist, you agree to be bound by
                    these Terms of Service. If you do not agree to these terms,
                    please do not use our service.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-xs font-bold text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900">
                      02
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">
                      Use of Service
                    </h3>
                  </div>
                  <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                    Promptamist provides tools to manage and organize AI
                    prompts. You are responsible for the content you store and
                    share. You must not use the service for any illegal or
                    unauthorized purpose.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-xs font-bold text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900">
                      03
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">
                      Intellectual Property
                    </h3>
                  </div>
                  <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                    The prompts you create remain your property. However, by
                    making a prompt &quot;Public&quot;, you grant other users a
                    non-exclusive license to view and copy that prompt for their
                    own use.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-xs font-bold text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900">
                      04
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">
                      Account Responsibility
                    </h3>
                  </div>
                  <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                    You are responsible for maintaining the security of your
                    account. Promptamist cannot and will not be liable for any
                    loss or damage from your failure to comply with this
                    security obligation.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-xs font-bold text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900">
                      05
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">
                      Termination
                    </h3>
                  </div>
                  <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                    We reserve the right to terminate or suspend your account at
                    our sole discretion, without notice, for conduct that we
                    believe violates these Terms or is harmful to other users of
                    the service.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-xs font-bold text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900">
                      06
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">
                      Limitation of Liability
                    </h3>
                  </div>
                  <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                    Promptamist is provided &quot;as is&quot; without any
                    warranties. In no event shall Promptamist be liable for any
                    damages arising out of the use or inability to use the
                    service.
                  </p>
                </section>

                <section className="space-y-6 border-t border-neutral-200 pt-16 dark:border-neutral-800">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-xs font-bold text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900">
                      07
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">
                      Changes to Terms
                    </h3>
                  </div>
                  <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                    We may modify these terms at any time. Your continued use of
                    the service after such modifications constitutes your
                    acceptance of the new terms.
                  </p>
                </section>
              </div>
            </div>
          </TextureCard>

          {/* Footer Assistance */}
          <div className="flex flex-col items-center justify-center gap-6 py-10 text-center text-sm font-medium text-neutral-500 md:flex-row">
            <p>Questions about our terms?</p>
            <div className="hidden h-4 w-px bg-neutral-300 md:block dark:bg-neutral-700" />
            <a
              href="mailto:support@promptamist.com"
              className="font-bold text-neutral-900 decoration-2 underline-offset-4 hover:underline dark:text-neutral-50"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
