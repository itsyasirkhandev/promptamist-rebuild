import { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { TextureCard } from '@/components/ui/TextureCard';

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
    <div className="bg-neutral-50 dark:bg-stone-950 relative min-h-screen transition-colors duration-500">
      {/* Premium Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -z-10 h-[1000px] w-full max-w-7xl -translate-x-1/2 pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] h-[500px] w-[500px] rounded-full bg-neutral-200/50 blur-[120px] dark:bg-stone-800/20" />
          <div className="absolute top-[10%] right-[20%] h-[400px] w-[400px] rounded-full bg-neutral-300/30 blur-[100px] dark:bg-neutral-900/30" />
        </div>
      </div>

      <main className="relative z-10 flex-1">
        <section className="relative overflow-hidden px-4 py-24 text-center md:py-36">
          <div className="mx-auto max-w-4xl relative">
            <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-neutral-200/60 bg-white/40 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 backdrop-blur-xl dark:border-neutral-800/40 dark:bg-stone-900/40 dark:text-neutral-400">
              <Icon icon="lucide:sparkles" className="h-3.5 w-3.5 text-neutral-400/80" />
              For Content Creators
            </div>
            
            <h1 className="text-balance font-bold text-5xl tracking-tight text-neutral-900 sm:text-7xl md:text-8xl dark:text-neutral-50 leading-[1.05] mb-8">
              The Workspace for <br className="hidden md:block" />
              <span className="bg-gradient-to-b from-neutral-400 to-neutral-600 bg-clip-text text-transparent dark:from-neutral-500 dark:to-neutral-700">
                AI Content Writers
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-neutral-600 md:text-xl dark:text-neutral-400">
              Stop losing your best storytelling prompts. Organize your creative
              workflow and generate high-quality content 10x faster.
            </p>

            <div className="mt-14 flex justify-center">
              <Link href="/sign-up">
                <div className="border-[1px] border-black/10 bg-gradient-to-b from-black/70 to-black p-[1px] transition duration-300 ease-in-out dark:border-[2px] dark:border-black dark:from-white dark:to-white/80 rounded-[16px] group shadow-xl shadow-neutral-200/40 dark:shadow-black/60">
                  <div className="flex h-16 w-full min-w-[240px] items-center justify-center gap-3 bg-gradient-to-b from-neutral-800 to-black text-white/90 transition duration-300 ease-in-out group-hover:from-stone-800 group-hover:to-neutral-800/70 dark:from-neutral-200 dark:to-neutral-50 dark:text-black/80 rounded-[14px] px-10 text-lg font-bold">
                    Start Writing with AI
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className="relative px-4 py-24 md:py-40 bg-white dark:bg-neutral-900/30">
          <div className="relative mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
            <div className="space-y-10">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                Build Reusable <br /> Blog Templates
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-xl leading-relaxed">
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
                    <div className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 shadow-sm transition-transform group-hover:scale-110">
                      <Icon icon="lucide:check" className="h-4 w-4" />
                    </div>
                    <span className="text-neutral-600 dark:text-neutral-400 text-lg group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            
            <TextureCard className="group p-2">
              <div className="p-8 md:p-10 space-y-8">
                <div className="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-6">
                  <div className="h-3.5 w-3.5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                  <div className="h-3.5 w-3.5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                  <div className="h-3.5 w-3.5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                  <span className="text-neutral-400 ml-3 font-mono text-xs tracking-wider uppercase">
                    blog-template.prompt
                  </span>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-neutral-400 text-[10px] font-bold tracking-[0.2em] uppercase">
                      Template Variable
                    </span>
                    <div className="bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 w-fit rounded-lg border px-4 py-2 font-mono text-sm shadow-sm">
                      {`{{topic}}`}
                    </div>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg font-medium italic">
                    &quot;Write a compelling 1,500-word blog post about{' '}
                    {`{{topic}}`} using a conversational yet authoritative
                    tone...&quot;
                  </p>
                </div>
              </div>
            </TextureCard>
          </div>
        </section>

        <section className="px-4 py-24 md:py-40">
          <div className="mx-auto max-w-6xl">
            <div className="mb-24 text-center">
              <h2 className="text-4xl font-bold tracking-tight md:text-6xl text-neutral-900 dark:text-neutral-50 mb-6">
                Why Top Writers Choose Us
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-xl max-w-2xl mx-auto">
                The tools you need to master the art of AI-assisted writing.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
              {[
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
              ].map((f) => (
                <TextureCard key={f.title} className="group/card hover:-translate-y-1 transition-all duration-500">
                  <div className="p-8">
                    <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-white/80 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100 group-hover/card:scale-110 transition-transform duration-500 shadow-sm">
                      <Icon icon={f.icon} className="h-7 w-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                      {f.title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </TextureCard>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-4 py-32 md:py-48 text-center">
          <div className="mx-auto max-w-3xl space-y-10 relative">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Transform Your Content.
            </h2>
            <div className="flex justify-center pt-8">
              <Link href="/sign-up">
                <div className="border-[1px] border-black/10 bg-gradient-to-b from-black/70 to-black p-[1px] transition duration-300 ease-in-out dark:border-[2px] dark:border-black dark:from-white dark:to-white/80 rounded-[18px] group shadow-2xl">
                  <div className="flex h-16 w-full min-w-[280px] items-center justify-center gap-3 bg-gradient-to-b from-neutral-800 to-black text-white/90 transition duration-300 ease-in-out group-hover:from-stone-800 group-hover:to-neutral-800/70 dark:from-neutral-200 dark:to-neutral-50 dark:text-black/80 rounded-[16px] px-12 text-xl font-bold">
                    Start Free Workspace
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
