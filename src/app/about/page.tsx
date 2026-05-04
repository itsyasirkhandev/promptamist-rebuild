import { Metadata } from 'next';
import Link from 'next/link';
import { TextureCard } from '@/components/ui/TextureCard';
import { Icon } from '@iconify/react';

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';

export const metadata: Metadata = {
  title: 'About Promptamist — The Story Behind the AI Prompt Manager',
  description:
    'Learn why we built Promptamist and how we are helping AI power users organize, optimize, and share their prompt libraries across ChatGPT, Claude, and Gemini.',
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-neutral-50 transition-colors duration-500 dark:bg-stone-950">
      {/* Premium Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute top-0 left-1/2 h-[500px] w-full max-w-6xl -translate-x-1/2 rounded-full opacity-50 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <main className="relative z-10 flex-1">
        <section className="relative px-4 py-24 text-center md:py-32">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/50 px-3 py-1 text-[min(2.8vw,12px)] font-bold tracking-[0.1em] text-neutral-600 uppercase sm:px-4 sm:py-1.5 sm:text-xs sm:tracking-[0.2em] dark:border-neutral-800 dark:bg-stone-900/50 dark:text-neutral-400">
              <Icon icon="lucide:sparkles" className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap">Our Story</span>
            </div>

            <h1 className="text-4xl leading-[1.1] font-semibold tracking-tight text-balance text-neutral-900 md:text-7xl dark:text-neutral-50">
              Empowering the Next <br className="hidden md:block" />
              <span className="text-neutral-500">Generation of Experts</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-pretty text-neutral-600 md:text-xl dark:text-neutral-400">
              We built Promptamist because we were tired of losing our best
              ideas in the bottomless pit of AI chat histories.
            </p>
          </div>
        </section>

        <section className="px-4 py-12 md:py-20">
          <div className="mx-auto max-w-5xl space-y-24">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 border-primary/20 dark:bg-primary/20 flex h-10 w-10 items-center justify-center rounded-xl border">
                    <Icon
                      icon="lucide:target"
                      className="text-primary h-5 w-5"
                    />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                    Our Mission
                  </h2>
                </div>
                <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Promptamist is on a mission to make AI interaction structured,
                  repeatable, and collaborative. As LLMs become core to our
                  professional lives, the ability to manage the
                  &quot;instructions&quot; we give them becomes the most
                  valuable skill in the modern economy.
                </p>
              </div>
              <TextureCard className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
                      System Status
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                    Scaling with you.
                  </p>
                  <div className="h-1 w-full rounded-full bg-neutral-100 dark:bg-neutral-800">
                    <div className="bg-primary h-full w-[85%] rounded-full" />
                  </div>
                  <p className="text-sm text-neutral-500">
                    Trusted by 10,000+ AI power users worldwide.
                  </p>
                </div>
              </TextureCard>
            </div>

            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                  Why Promptamist?
                </h2>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <TextureCard>
                  <div className="p-8">
                    <div className="bg-primary/10 border-primary/20 dark:bg-primary/20 mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border">
                      <Icon
                        icon="lucide:search-check"
                        className="text-primary h-6 w-6"
                      />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-neutral-900 dark:text-neutral-100">
                      No More Lost Prompts
                    </h3>
                    <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">
                      Stop scrolling through months of ChatGPT logs to find that
                      one prompt that worked perfectly. Tag, search, and find
                      anything instantly.
                    </p>
                  </div>
                </TextureCard>

                <TextureCard>
                  <div className="p-8">
                    <div className="bg-primary/10 border-primary/20 dark:bg-primary/20 mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border">
                      <Icon
                        icon="lucide:layers"
                        className="text-primary h-6 w-6"
                      />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-neutral-900 dark:text-neutral-100">
                      Structured Workflow
                    </h3>
                    <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">
                      Turn static prompts into dynamic templates with variables.
                      Scale your AI usage across any task with repeatable,
                      high-quality results.
                    </p>
                  </div>
                </TextureCard>
              </div>
            </div>

            <div className="rounded-[32px] border border-neutral-200 bg-white/30 p-12 text-center backdrop-blur-xl dark:border-neutral-800 dark:bg-stone-900/30">
              <h2 className="mb-6 text-3xl font-bold text-neutral-900 dark:text-neutral-50">
                Open & Model Agnostic
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
                We believe you shouldn&apos;t be locked into a single AI
                provider. Promptamist works seamlessly with every major Large
                Language Model. Your prompt library is your intellectual
                property.
              </p>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-4 py-32 text-center">
          <div className="relative mx-auto max-w-3xl space-y-10">
            <h2 className="text-4xl font-semibold tracking-tight text-balance text-neutral-900 md:text-5xl dark:text-neutral-50">
              Your Prompt Library Awaits
            </h2>
            <p className="mx-auto max-w-xl text-lg text-neutral-600 dark:text-neutral-400">
              Join AI power users who have already organized their prompt
              workflows with Promptamist.
            </p>
            <div className="flex justify-center">
              <Link href="/sign-up">
                <div className="group rounded-[14px] border-[1px] border-black/10 bg-gradient-to-b from-black/70 to-black p-[1px] transition duration-300 ease-in-out dark:border-[2px] dark:border-black dark:from-white dark:to-white/80">
                  <div className="flex h-16 w-full min-w-[240px] items-center justify-center gap-3 rounded-[12px] bg-gradient-to-b from-neutral-800 to-black px-10 text-lg font-semibold text-white/90 transition duration-300 ease-in-out group-hover:from-stone-800 group-hover:to-neutral-800/70 active:bg-gradient-to-b active:from-black active:to-black dark:from-neutral-200 dark:to-neutral-50 dark:text-black/80 dark:hover:from-stone-200 dark:hover:to-neutral-200 dark:active:from-stone-300 dark:active:to-neutral-300">
                    <Icon icon="lucide:sparkles" className="h-5 w-5" />
                    Get Started for Free
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
