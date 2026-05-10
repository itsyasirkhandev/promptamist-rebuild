import { Metadata } from 'next';
import { Icon } from '@iconify/react';
import { TextureCard } from '@/components/ui/TextureCard';
import { SolutionsLayout } from '@/components/promotional/SolutionsLayout';

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
    <SolutionsLayout
      heroBadgeIcon="lucide:terminal"
      heroBadgeText="For Software Engineers"
      heroTitle={
        <>
          The Dev Environment for <br className="hidden md:block" />
          <span className="bg-gradient-to-b from-neutral-400 to-neutral-600 bg-clip-text text-transparent dark:from-neutral-500 dark:to-neutral-700">
            AI Prompt Engineering
          </span>
        </>
      }
      heroDescription="Manage your coding agents, system instructions, and complex architectural prompts with a professional, searchable library."
      heroButtonText="Deploy Your Library"
      featureDetail={
        <>
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
              Stop hardcoding your best system instructions into script files or
              losing them in Slack threads. Promptamist provides a central
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
        </>
      }
      featuresTitle="Modern AI Infrastructure"
      featuresSubtitle="Built for the elite AI engineer."
      featuresList={[
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
      ]}
      ctaTitle="Deploy Your Library."
      ctaButtonText="Start Prompt Engineering"
    />
  );
}
