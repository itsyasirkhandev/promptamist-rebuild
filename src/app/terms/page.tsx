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
              <Icon icon="lucide:scroll-text" className="h-3.5 w-3.5 text-neutral-400/80" />
              Legal Framework
            </div>
            <h1 className="text-balance font-bold text-5xl tracking-tight text-neutral-900 sm:text-7xl dark:text-neutral-50 leading-[1.05] mb-8">
              Terms of Service
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
                  <Icon icon="lucide:file-text" className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">Platform Agreement</h2>
              </div>

              <div className="prose prose-neutral dark:prose-invert max-w-none space-y-16">
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 text-xs font-bold">
                      01
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">Acceptance of Terms</h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
                    By accessing or using Promptamist, you agree to be bound by
                    these Terms of Service. If you do not agree to these terms,
                    please do not use our service.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 text-xs font-bold">
                      02
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">Use of Service</h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
                    Promptamist provides tools to manage and organize AI prompts.
                    You are responsible for the content you store and share. You
                    must not use the service for any illegal or unauthorized
                    purpose.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 text-xs font-bold">
                      03
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">Intellectual Property</h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
                    The prompts you create remain your property. However, by
                    making a prompt &quot;Public&quot;, you grant other users a
                    non-exclusive license to view and copy that prompt for their
                    own use.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 text-xs font-bold">
                      04
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">Account Responsibility</h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
                    You are responsible for maintaining the security of your
                    account. Promptamist cannot and will not be liable for any
                    loss or damage from your failure to comply with this security
                    obligation.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 text-xs font-bold">
                      05
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">Termination</h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
                    We reserve the right to terminate or suspend your account at
                    our sole discretion, without notice, for conduct that we
                    believe violates these Terms or is harmful to other users of
                    the service.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 text-xs font-bold">
                      06
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">Limitation of Liability</h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
                    Promptamist is provided &quot;as is&quot; without any
                    warranties. In no event shall Promptamist be liable for any
                    damages arising out of the use or inability to use the
                    service.
                  </p>
                </section>

                <section className="border-t border-neutral-200 dark:border-neutral-800 pt-16 space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 text-xs font-bold">
                      07
                    </span>
                    <h3 className="m-0 text-xl font-bold tracking-tight">Changes to Terms</h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
                    We may modify these terms at any time. Your continued use of
                    the service after such modifications constitutes your
                    acceptance of the new terms.
                  </p>
                </section>
              </div>
            </div>
          </TextureCard>

          {/* Footer Assistance */}
          <div className="text-neutral-500 flex flex-col md:flex-row items-center justify-center gap-6 text-center text-sm font-medium py-10">
            <p>Questions about our terms?</p>
            <div className="hidden md:block h-4 w-px bg-neutral-300 dark:bg-neutral-700" />
            <a
              href="mailto:support@promptamist.com"
              className="text-neutral-900 dark:text-neutral-50 font-bold hover:underline decoration-2 underline-offset-4"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
