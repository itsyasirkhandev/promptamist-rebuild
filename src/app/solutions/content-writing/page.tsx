import { Metadata } from 'next';
import { Icon } from '@iconify/react';
import { TextureCard } from '@/components/ui/TextureCard';
import { SolutionsLayout } from '@/components/promotional/SolutionsLayout';

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';

export const metadata: Metadata = {
  title: 'AI Prompts for Content Writers — Maximize Your Creative Output',
  description:
    'Discover how content writers use Promptamist to organize their creative prompts, build reusable blog post templates, and scale their content production across ChatGPT and Claude.',
  alternates: {
    canonical: `${BASE_URL}/solutions/content-writing`,
  },
};

export default function ContentWritingSolution() {
  return (
    <SolutionsLayout
      heroBadgeIcon="lucide:sparkles"
      heroBadgeText="For Content Creators"
      heroTitle={
        <>
          The Workspace for <br className="hidden md:block" />
          <span className="bg-gradient-to-b from-neutral-400 to-neutral-600 bg-clip-text text-transparent dark:from-neutral-500 dark:to-neutral-700">
            AI Content Writers
          </span>
        </>
      }
      heroDescription="Stop losing your best storytelling prompts. Organize your creative workflow and generate high-quality content 10x faster."
      heroButtonText="Start Writing with AI"
      featureDetail={
        <>
          <div className="space-y-10">
            <h2 className="text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl dark:text-neutral-50">
              Build Reusable <br /> Blog Templates
            </h2>
            <p className="text-xl leading-relaxed text-neutral-600 dark:text-neutral-400">
              Create structured templates for every stage of your writing
              process — from brainstorming titles to drafting full-length
              articles and SEO meta descriptions.
            </p>
            <ul className="space-y-8">
              {[
                'Define tone, style, and persona variables once.',
                'Ensure brand consistency across all AI outputs.',
                'Share your best writing templates with your team.',
              ].map((item) => (
                <li key={item} className="group flex items-start gap-5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-neutral-900 shadow-sm transition-transform group-hover:scale-110 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                    <Icon icon="lucide:check" className="h-4 w-4" />
                  </div>
                  <span className="text-lg text-neutral-600 transition-colors group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-100">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <TextureCard className="group p-2">
            <div className="space-y-8 p-8 md:p-10">
              <div className="flex items-center gap-3 border-b border-neutral-200 pb-6 dark:border-neutral-800">
                <div className="h-3.5 w-3.5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-3.5 w-3.5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-3.5 w-3.5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                <span className="ml-3 font-mono text-xs tracking-wider text-neutral-400 uppercase">
                  blog-template.prompt
                </span>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                    Template Variable
                  </span>
                  <div className="w-fit rounded-lg border border-neutral-200 bg-neutral-100 px-4 py-2 font-mono text-sm text-neutral-900 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                    {`{{topic}}`}
                  </div>
                </div>
                <p className="text-lg leading-relaxed font-medium text-neutral-600 italic dark:text-neutral-400">
                  &quot;Write a compelling 1,500-word blog post about{' '}
                  {`{{topic}}`} using a conversational yet authoritative
                  tone...&quot;
                </p>
              </div>
            </div>
          </TextureCard>
        </>
      }
      featuresTitle="Why Top Writers Choose Us"
      featuresSubtitle="The tools you need to master the art of AI-assisted writing."
      featuresList={[
        {
          title: 'No Search Fatigue',
          desc: 'Find the exact prompt for "Twitter Hooks" or "SEO Introductions" in seconds with advanced tagging.',
          icon: 'lucide:search',
        },
        {
          title: 'Model Versatility',
          desc: 'Use Claude for creative writing and GPT-4 for research — all while keeping your prompts in one place.',
          icon: 'lucide:zap',
        },
        {
          title: 'Scalable Production',
          desc: 'Turn one great prompt into a hundred unique articles with dynamic variable interpolation.',
          icon: 'lucide:trending-up',
        },
      ]}
      ctaTitle="Transform Your Content."
      ctaButtonText="Start Free Workspace"
    />
  );
}
