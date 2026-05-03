import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';

export const metadata: Metadata = {
  title: 'AI Prompts for Content Writers — Maximize Your Creative Output',
  description: 'Discover how content writers use Promptamist to organize their creative prompts, build reusable blog post templates, and scale their content production across ChatGPT and Claude.',
  alternates: {
    canonical: `${BASE_URL}/solutions/content-writing`,
  },
};

export default function ContentWritingSolution() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="px-4 py-24 bg-gradient-to-b from-primary/10 to-background text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold tracking-tight mb-6">
              The Professional Workspace for 
              <span className="text-primary block">AI Content Writers</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Stop losing your best storytelling prompts. Organize your creative workflow and generate high-quality content 10x faster.
            </p>
            <Button size="lg" asChild>
              <Link href="/sign-up">Start Writing with AI</Link>
            </Button>
          </div>
        </section>

        <section className="px-4 py-20 border-y">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-foreground">Build Reusable Blog Templates</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Create structured templates for every stage of your writing process — from brainstorming titles to drafting full-length articles and SEO meta descriptions.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Icon icon="lucide:check-circle" className="text-primary mt-1 shrink-0" />
                  <span>Define tone, style, and persona variables once.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon icon="lucide:check-circle" className="text-primary mt-1 shrink-0" />
                  <span>Ensure brand consistency across all AI outputs.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon icon="lucide:check-circle" className="text-primary mt-1 shrink-0" />
                  <span>Share your best writing templates with your team or audience.</span>
                </li>
              </ul>
            </div>
            <div className="bg-muted rounded-2xl p-8 border shadow-inner">
              <div className="bg-background p-4 rounded-lg border shadow-sm space-y-2">
                <div className="text-xs font-mono text-primary">Template Variable: {'{{topic}}'}</div>
                <div className="text-sm font-medium">"Write a compelling 1,500-word blog post about {'{{topic}}'} using a conversational yet authoritative tone..."</div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="max-w-5xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Top Writers Choose Promptamist</h2>
            <p className="text-muted-foreground">The tools you need to master the art of AI-assisted writing.</p>
          </div>
          <div className="max-w-5xl mx-auto grid gap-6 sm:grid-cols-3">
            {[
              {
                title: 'No More Search Fatigue',
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
              <div key={f.title} className="p-6 border rounded-xl bg-card">
                <Icon icon={f.icon} className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
