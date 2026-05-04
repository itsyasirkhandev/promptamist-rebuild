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
    <div className="bg-neutral-50 dark:bg-stone-950 min-h-screen transition-colors duration-500">
      <main className="px-4 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-20 text-center">
            <p className="mb-4 text-neutral-500 text-xs font-bold uppercase tracking-[0.3em] dark:text-neutral-500">
              Solutions
            </p>
            <h1 className="text-balance font-bold text-4xl text-neutral-900 tracking-tight md:text-6xl dark:text-neutral-50 mb-6">
              AI Frameworks for <br className="hidden md:block" /> Professional Teams
            </h1>
            <p className="mx-auto max-w-2xl text-neutral-600 dark:text-neutral-400 text-lg md:text-xl leading-relaxed">
              Choose your industry and discover how Promptamist transforms 
              AI productivity with structured workflows.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {solutions.map((solution) => (
              <TextureCard
                key={solution.title}
                className="group/solution transition-all duration-500 hover:-translate-y-1"
              >
                <div className="p-8 md:p-10 flex flex-col h-full">
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-200 bg-white/80 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100 shadow-sm group-hover/solution:scale-110 transition-transform duration-500">
                    <Icon
                      icon={solution.icon}
                      className="h-8 w-8"
                    />
                  </div>
                  <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">{solution.title}</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed mb-8 flex-grow">
                    {solution.description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-auto">
                    <Link 
                      href={solution.href} 
                      className="inline-flex items-center text-neutral-900 dark:text-neutral-50 font-bold group/link text-lg hover:underline decoration-2 underline-offset-4 transition-all"
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
                          className="px-2 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-800/50 text-[10px] font-bold tracking-widest uppercase text-neutral-500 dark:text-neutral-400"
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
          <div className="mt-32 relative group overflow-hidden rounded-[32px] border border-neutral-200 dark:border-neutral-800 p-12 md:p-20 text-center bg-white/50 dark:bg-stone-900/50 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-50/50 to-transparent dark:from-neutral-900/50 -z-10" />
            <h2 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-6">
              Custom Industry Needs?
            </h2>
            <p className="mx-auto mb-12 max-w-xl text-neutral-600 dark:text-neutral-400 text-xl">
              Promptamist is highly flexible and works for any niche where AI
              prompts are part of the daily workflow.
            </p>
            <Link href="/sign-up">
              <div className="mx-auto max-w-xs border-[1px] border-black/10 bg-gradient-to-b from-black/70 to-black p-[1px] transition duration-300 ease-in-out dark:border-[2px] dark:border-black dark:from-white dark:to-white/80 rounded-[16px] group shadow-xl">
                <div className="flex h-16 w-full items-center justify-center gap-3 bg-gradient-to-b from-neutral-800 to-black text-white/90 transition duration-300 ease-in-out group-hover:from-stone-800 group-hover:to-neutral-800/70 dark:from-neutral-200 dark:to-neutral-50 dark:text-black/80 rounded-[14px] px-8 text-lg font-bold">
                  Build Your Library
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
