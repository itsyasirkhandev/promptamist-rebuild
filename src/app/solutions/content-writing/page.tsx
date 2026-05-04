import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';

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
    <div className="bg-background relative min-h-screen overflow-hidden">
      {/* Premium Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full blur-[120px]" />
        <div className="bg-chart-1/5 absolute top-[20%] -right-[5%] h-[30%] w-[30%] rounded-full blur-[100px]" />
        <div className="bg-chart-2/5 absolute bottom-[10%] left-[20%] h-[25%] w-[25%] rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <main className="relative z-10 flex-1">
        <section className="relative overflow-hidden px-4 py-24 text-center md:py-32">
          <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-4xl space-y-8 duration-700">
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 text-primary rounded-full px-4 py-1"
            >
              For Content Creators
            </Badge>
            <h1
              className="font-heading font-extrabold tracking-tight text-balance"
              style={{ fontSize: 'var(--text-4xl)', lineHeight: '1.1' }}
            >
              The Professional Workspace for
              <span className="from-primary to-chart-1 mt-2 block bg-gradient-to-r bg-clip-text text-transparent">
                AI Content Writers
              </span>
            </h1>
            <p
              className="text-muted-foreground mx-auto max-w-2xl leading-relaxed"
              style={{ fontSize: 'var(--text-base)' }}
            >
              Stop losing your best storytelling prompts. Organize your creative
              workflow and generate high-quality content 10x faster.
            </p>
            <div className="pt-6">
              <Button
                size="lg"
                className="shadow-primary/20 h-16 rounded-2xl px-12 text-lg font-bold shadow-2xl transition-all hover:scale-110 active:scale-95"
                asChild
              >
                <Link href="/sign-up">Start Writing with AI</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-border/40 relative border-y px-4 py-24">
          <div className="bg-primary/5 absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
            <div className="animate-in fade-in slide-in-from-left-8 space-y-8 duration-1000">
              <h2 className="text-3xl font-bold tracking-tight">
                Build Reusable Blog Templates
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Create structured templates for every stage of your writing
                process — from brainstorming titles to drafting full-length
                articles and SEO meta descriptions.
              </p>
              <ul className="space-y-6">
                {[
                  'Define tone, style, and persona variables once.',
                  'Ensure brand consistency across all AI outputs.',
                  'Share your best writing templates with your team or audience.',
                ].map((item) => (
                  <li key={item} className="group flex items-start gap-4">
                    <div className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-110">
                      <Icon icon="lucide:check-circle" className="h-4 w-4" />
                    </div>
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="border-border/40 bg-card/60 shadow-primary/5 animate-in fade-in slide-in-from-right-8 group p-8 shadow-2xl backdrop-blur-xl duration-1000">
              <div className="bg-primary/10 absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150" />
              <div className="relative space-y-6">
                <div className="border-border/40 flex items-center gap-2 border-b pb-4">
                  <div className="h-3 w-3 rounded-full bg-red-500/50" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                  <div className="h-3 w-3 rounded-full bg-green-500/50" />
                  <span className="text-muted-foreground ml-2 font-mono text-xs">
                    blog-template.prompt
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-primary text-[10px] font-bold tracking-widest uppercase">
                      Template Variable
                    </span>
                    <div className="bg-primary/5 border-primary/20 text-primary w-fit rounded-lg border px-3 py-1.5 font-mono text-sm">
                      {`{{topic}}`}
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed font-medium italic">
                    &quot;Write a compelling 1,500-word blog post about{' '}
                    {`{{topic}}`} using a conversational yet authoritative
                    tone...&quot;
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className="px-4 py-24 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="mb-20 space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Why Top Writers Choose Promptamist
              </h2>
              <p className="text-muted-foreground text-lg">
                The tools you need to master the art of AI-assisted writing.
              </p>
              <div className="bg-primary/40 mx-auto h-1.5 w-16 rounded-full" />
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
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
                <Card
                  key={f.title}
                  className="group border-border/40 bg-card/40 hover:shadow-primary/5 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl"
                >
                  <CardHeader>
                    <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110">
                      <Icon icon={f.icon} className="text-primary h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-bold">
                      {f.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {f.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-4 py-32 text-center">
          <div className="bg-primary/5 absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div className="relative mx-auto max-w-2xl space-y-8">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Ready to transform your content?
            </h2>
            <Button
              size="lg"
              className="shadow-primary/20 h-16 rounded-2xl px-12 text-lg font-bold shadow-2xl transition-all hover:scale-110 active:scale-95"
              asChild
            >
              <Link href="/sign-up">
                Start Free Workspace{' '}
                <Icon icon="lucide:arrow-right" className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
