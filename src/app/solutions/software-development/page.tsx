import { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { TextureCard } from '@/components/ui/TextureCard';

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';

export const metadata: Metadata = {
  title: 'AI Prompts for Software Developers — Streamline Your Coding Workflow',
  description:
    'How developers use Promptamist to manage complex system architecture prompts, debugging templates, and code review instructions across GPT-4, Claude 3.5, and Gemini Pro.',
  alternates: {
    canonical: `${BASE_URL}/solutions/software-development`,
  },
};

export default function SoftwareDevelopmentSolution() {
  return (
    <div className="relative min-h-screen bg-neutral-50 transition-colors duration-500 dark:bg-stone-950">
      {/* Premium Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[1000px] w-full max-w-7xl -translate-x-1/2">
          <div className="absolute top-[-10%] left-[20%] h-[500px] w-[500px] rounded-full bg-neutral-200/50 blur-[120px] dark:bg-stone-800/20" />
          <div className="absolute top-[10%] right-[20%] h-[400px] w-[400px] rounded-full bg-neutral-300/30 blur-[100px] dark:bg-neutral-900/30" />
        </div>
      </div>

      <main className="relative z-10 flex-1">
        <section className="relative overflow-hidden px-4 py-24 text-center md:py-36">
          <div className="relative mx-auto max-w-4xl">
            <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-neutral-200/60 bg-white/40 px-4 py-2 text-[10px] font-bold tracking-[0.2em] text-neutral-500 uppercase backdrop-blur-xl dark:border-neutral-800/40 dark:bg-stone-900/40 dark:text-neutral-400">
              <Icon
                icon="lucide:terminal"
                className="h-3.5 w-3.5 text-neutral-400/80"
              />
              For Software Engineers
            </div>

            <h1 className="mb-8 text-5xl leading-[1.05] font-bold tracking-tight text-balance text-neutral-900 sm:text-7xl md:text-8xl dark:text-neutral-50">
              The Dev Environment for <br className="hidden md:block" />
              <span className="bg-gradient-to-b from-neutral-400 to-neutral-600 bg-clip-text text-transparent dark:from-neutral-500 dark:to-neutral-700">
                AI Prompt Engineering
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-pretty text-neutral-600 md:text-xl dark:text-neutral-400">
              Manage your coding agents, system instructions, and complex
              architectural prompts with a professional, searchable library.
            </p>

            <div className="mt-14 flex justify-center">
              <Link href="/sign-up">
                <div className="group rounded-[16px] border-[1px] border-black/10 bg-gradient-to-b from-black/70 to-black p-[1px] shadow-xl shadow-neutral-200/40 transition duration-300 ease-in-out dark:border-[2px] dark:border-black dark:from-white dark:to-white/80 dark:shadow-black/60">
                  <div className="flex h-16 w-full min-w-[240px] items-center justify-center gap-3 rounded-[14px] bg-gradient-to-b from-neutral-800 to-black px-10 text-lg font-bold text-white/90 transition duration-300 ease-in-out group-hover:from-stone-800 group-hover:to-neutral-800/70 dark:from-neutral-200 dark:to-neutral-50 dark:text-black/80">
                    Deploy Your Library
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className="relative bg-white px-4 py-24 md:py-40 dark:bg-neutral-900/30">
          <div className="relative mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
            <TextureCard className="group overflow-hidden border-neutral-800 bg-neutral-950 p-0">
              <div className="flex items-center gap-3 border-b border-neutral-800 bg-neutral-900 px-6 py-4">
                <div className="flex gap-2">
                  <div className="h-3.5 w-3.5 rounded-full bg-neutral-700" />
                  <div className="h-3.5 w-3.5 rounded-full bg-neutral-700" />
                  <div className="h-3.5 w-3.5 rounded-full bg-neutral-700" />
                </div>
                <span className="ml-4 font-mono text-xs tracking-wider text-neutral-500">
                  system-prompt.md
                </span>
                <Icon
                  icon="lucide:copy"
                  className="ml-auto h-4 w-4 cursor-pointer text-neutral-600 transition-colors hover:text-neutral-300"
                />
              </div>
              <div className="space-y-6 bg-neutral-950 p-8 font-mono text-sm text-neutral-300">
                <p className="text-neutral-500">
                  # System Role:{' '}
                  <span className="text-neutral-100">{`{{role}}`}</span>
                </p>
                <p>
                  You are an expert{' '}
                  <span className="text-neutral-100">{`{{language}}`}</span>{' '}
                  developer focusing on{' '}
                  <span className="text-neutral-100">{`{{framework}}`}</span>.
                </p>
                <p className="text-neutral-500"># Context:</p>
                <p>
                  Current architecture uses{' '}
                  <span className="text-neutral-100">{`{{db_type}}`}</span> and
                  requires strict adherence to SOLID principles.
                </p>
              </div>
            </TextureCard>

            <div className="space-y-10">
              <h2 className="text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl dark:text-neutral-50">
                System Prompt <br /> Management
              </h2>
              <p className="text-xl leading-relaxed text-neutral-600 dark:text-neutral-400">
                Stop hardcoding your best system instructions into script files
                or losing them in Slack threads. Promptamist provides a central
                source of truth for your AI-driven development.
              </p>
              <ul className="space-y-8">
                {[
                  {
                    icon: 'lucide:terminal',
                    text: 'Version your system prompts for different agent roles.',
                  },
                  {
                    icon: 'lucide:code-2',
                    text: 'Use dynamic variables for language and constraints.',
                  },
                  {
                    icon: 'lucide:database',
                    text: 'Keep architectural context consistent across LLM models.',
                  },
                ].map((item) => (
                  <li key={item.text} className="group flex items-start gap-5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-900 shadow-sm transition-transform group-hover:scale-110 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                      <Icon icon={item.icon} className="h-5 w-5" />
                    </div>
                    <span className="pt-0.5 text-lg text-neutral-600 transition-colors group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-100">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="px-4 py-24 md:py-40">
          <div className="mx-auto max-w-6xl">
            <div className="mb-24 text-center">
              <h2 className="mb-6 text-4xl font-bold tracking-tight text-neutral-900 md:text-6xl dark:text-neutral-50">
                Modern AI Infrastructure
              </h2>
              <p className="mx-auto max-w-2xl text-xl text-neutral-600 dark:text-neutral-400">
                Built for the elite AI engineer.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
              {[
                {
                  title: 'Prompt Versioning',
                  desc: 'Keep track of which version of your prompt produced the best code output for specific edge cases.',
                  icon: 'lucide:git-compare',
                },
                {
                  title: 'Model Comparison',
                  desc: 'Easily test how the same prompt performs across GPT-4o, Claude 3.5 Sonnet, and Gemini Pro 1.5.',
                  icon: 'lucide:cpu',
                },
                {
                  title: 'Team Collaboration',
                  desc: 'Share your best debugging scripts or refactoring prompts with your team via secure public URLs.',
                  icon: 'lucide:share',
                },
              ].map((f) => (
                <TextureCard
                  key={f.title}
                  className="group/card transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="p-8">
                    <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-white/80 text-neutral-900 shadow-sm transition-transform duration-500 group-hover/card:scale-110 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
                      <Icon icon={f.icon} className="h-7 w-7" />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      {f.title}
                    </h3>
                    <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {f.desc}
                    </p>
                  </div>
                </TextureCard>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-4 py-32 text-center md:py-48">
          <div className="relative mx-auto max-w-3xl space-y-10">
            <h2 className="text-4xl font-bold tracking-tight text-neutral-900 md:text-6xl dark:text-neutral-50">
              Deploy Your Library.
            </h2>
            <div className="flex justify-center pt-8">
              <Link href="/sign-up">
                <div className="group rounded-[18px] border-[1px] border-black/10 bg-gradient-to-b from-black/70 to-black p-[1px] shadow-2xl transition duration-300 ease-in-out dark:border-[2px] dark:border-black dark:from-white dark:to-white/80">
                  <div className="flex h-16 w-full min-w-[280px] items-center justify-center gap-3 rounded-[16px] bg-gradient-to-b from-neutral-800 to-black px-12 text-xl font-bold text-white/90 transition duration-300 ease-in-out group-hover:from-stone-800 group-hover:to-neutral-800/70 dark:from-neutral-200 dark:to-neutral-50 dark:text-black/80">
                    Start Prompt Engineering
                    <Icon icon="lucide:arrow-right" className="h-6 w-6" />
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
