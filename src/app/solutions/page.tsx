import { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { TextureCard } from '@/components/ui/TextureCard';

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';

export const metadata: Metadata = {
  title: 'Prompt Management Solutions — AI Workflows for Every Industry',
  description:
    'Explore how different industries use Promptamist to scale their AI operations. From content creation to software engineering, find the right solution for your prompt library.',
  alternates: {
    canonical: `${BASE_URL}/solutions`,
  },
};

export default function SolutionsLandingPage() {
  const solutions = [
    {
      title: 'Content Creation',
      description:
        'Scale your content production with blog templates, tone consistency tools, and prompt organization.',
      icon: 'lucide:pen-tool',
      href: '/solutions/content-writing',
      tags: ['Blogging', 'SEO', 'Creative Writing'],
    },
    {
      title: 'Software Development',
      description:
        'Manage complex system prompts, debugging scripts, and architectural context for AI coding agents.',
      icon: 'lucide:code-2',
      href: '/solutions/software-development',
      tags: ['Programming', 'DevOps', 'Architecture'],
    },
    {
      title: 'Marketing & Ad Copy',
      description:
        'Optimize your ad spend with structured prompts for social media, email campaigns, and product descriptions.',
      icon: 'lucide:megaphone',
      href: '/solutions/content-writing',
      tags: ['Advertising', 'Email Marketing', 'Social Media'],
    },
    {
      title: 'Data Analysis',
      description:
        'Clean, transform, and analyze data with repeatable AI prompts for Python, SQL, and Excel workflows.',
      icon: 'lucide:bar-chart-4',
      href: '/solutions/software-development',
      tags: ['Big Data', 'SQL', 'Automation'],
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 transition-colors duration-500 dark:bg-stone-950">
      <main className="px-4 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-20 text-center">
            <p className="mb-4 text-xs font-bold tracking-[0.3em] text-neutral-500 uppercase dark:text-neutral-500">
              Solutions
            </p>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance text-neutral-900 md:text-6xl dark:text-neutral-50">
              AI Frameworks for <br className="hidden md:block" /> Professional
              Teams
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-neutral-600 md:text-xl dark:text-neutral-400">
              Choose your industry and discover how Promptamist transforms AI
              productivity with structured workflows.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {solutions.map((solution) => (
              <TextureCard
                key={solution.title}
                className="group/solution transition-all duration-500 hover:-translate-y-1"
              >
                <div className="flex h-full flex-col p-8 md:p-10">
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-200 bg-white/80 text-neutral-900 shadow-sm transition-transform duration-500 group-hover/solution:scale-110 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
                    <Icon icon={solution.icon} className="h-8 w-8" />
                  </div>
                  <h2 className="mb-4 text-3xl font-bold text-neutral-900 dark:text-neutral-50">
                    {solution.title}
                  </h2>
                  <p className="mb-8 flex-grow text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {solution.description}
                  </p>

                  <div className="mt-auto flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                    <Link
                      href={solution.href}
                      className="group/link inline-flex items-center text-lg font-bold text-neutral-900 decoration-2 underline-offset-4 transition-all hover:underline dark:text-neutral-50"
                    >
                      Explore Solution
                      <Icon
                        icon="lucide:arrow-right"
                        className="ml-2 h-5 w-5 transition-transform group-hover/link:translate-x-1"
                      />
                    </Link>
                    <div className="flex flex-wrap gap-2">
                      {solution.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-neutral-200 bg-white/50 px-2 py-0.5 text-[10px] font-bold tracking-widest text-neutral-500 uppercase dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </TextureCard>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-32">
            <div className="rounded-[32px] border border-white/60 bg-gradient-to-b from-neutral-100 to-white/70 shadow-2xl shadow-neutral-200/50 transition-all duration-300 dark:border-stone-950/60 dark:from-neutral-800 dark:to-neutral-900 dark:shadow-black/50">
              <div className="rounded-[31px] border border-black/10 dark:border-neutral-900/80">
                <div className="rounded-[30px] border border-white/50 dark:border-neutral-950">
                  <div className="rounded-[29px] border border-neutral-950/20 dark:border-neutral-900/70">
                    <div className="flex w-full flex-col items-center justify-center rounded-[28px] border border-white/50 bg-white/40 p-12 text-center backdrop-blur-xl md:p-20 dark:border-neutral-700/50 dark:bg-black/40">
                      <h2 className="mb-6 text-4xl font-bold text-neutral-900 dark:text-neutral-50">
                        Custom Industry Needs?
                      </h2>
                      <p className="mx-auto mb-12 max-w-xl text-xl text-neutral-600 dark:text-neutral-400">
                        Promptamist is highly flexible and works for any niche
                        where AI prompts are part of the daily workflow.
                      </p>
                      <Link href="/sign-up">
                        <div className="group mx-auto max-w-xs rounded-[16px] border-[1px] border-black/10 bg-gradient-to-b from-black/70 to-black p-[1px] shadow-xl transition duration-300 ease-in-out dark:border-[2px] dark:border-black dark:from-white dark:to-white/80">
                          <div className="flex h-16 w-full items-center justify-center gap-3 rounded-[14px] bg-gradient-to-b from-neutral-800 to-black px-8 text-lg font-bold text-white/90 transition duration-300 ease-in-out group-hover:from-stone-800 group-hover:to-neutral-800/70 dark:from-neutral-200 dark:to-neutral-50 dark:text-black/80">
                            Build Your Library
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
