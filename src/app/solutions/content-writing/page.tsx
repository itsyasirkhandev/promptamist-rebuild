import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';

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
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-chart-1/5 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[25%] h-[25%] rounded-full bg-chart-2/5 blur-[80px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <main className="relative z-10 flex-1">
        <section className="px-4 py-24 md:py-32 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Badge variant="outline" className="px-4 py-1 rounded-full border-primary/20 bg-primary/5 text-primary">
              For Content Creators
            </Badge>
            <h1 className="font-heading font-extrabold tracking-tight text-balance"
              style={{ fontSize: 'var(--text-4xl)', lineHeight: '1.1' }}>
              The Professional Workspace for 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-chart-1 block mt-2">AI Content Writers</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              style={{ fontSize: 'var(--text-base)' }}>
              Stop losing your best storytelling prompts. Organize your creative workflow and generate high-quality content 10x faster.
            </p>
            <div className="pt-6">
              <Button size="lg" className="h-16 rounded-2xl px-12 text-lg font-bold shadow-2xl shadow-primary/20 transition-all hover:scale-110 active:scale-95" asChild>
                <Link href="/sign-up">Start Writing with AI</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="px-4 py-24 border-y border-border/40 relative">
          <div className="absolute inset-0 bg-primary/5 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
              <h2 className="text-3xl font-bold tracking-tight">Build Reusable Blog Templates</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Create structured templates for every stage of your writing process — from brainstorming titles to drafting full-length articles and SEO meta descriptions.
              </p>
              <ul className="space-y-6">
                {[
                  'Define tone, style, and persona variables once.',
                  'Ensure brand consistency across all AI outputs.',
                  'Share your best writing templates with your team or audience.'
                ].map((item) => (
                  <li key={item} className="flex items-start gap-4 group">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Icon icon="lucide:check-circle" className="h-4 w-4" />
                    </div>
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="border-border/40 bg-card/60 backdrop-blur-xl p-8 shadow-2xl shadow-primary/5 animate-in fade-in slide-in-from-right-8 duration-1000 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-border/40">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  <span className="text-xs text-muted-foreground ml-2 font-mono">blog-template.prompt</span>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Template Variable</span>
                    <div className="bg-primary/5 border border-primary/20 rounded-lg px-3 py-1.5 font-mono text-sm text-primary w-fit">
                      {`{{topic}}`}
                    </div>
                  </div>
                  <p className="text-muted-foreground font-medium italic leading-relaxed">
                    &quot;Write a compelling 1,500-word blog post about {`{{topic}}`} using a conversational yet authoritative tone...&quot;
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className="px-4 py-24 md:py-32">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Why Top Writers Choose Promptamist</h2>
              <p className="text-muted-foreground text-lg">The tools you need to master the art of AI-assisted writing.</p>
              <div className="h-1.5 w-16 bg-primary/40 mx-auto rounded-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
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
                <Card key={f.title} className="group border-border/40 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl hover:shadow-primary/5">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon icon={f.icon} className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-bold">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="relative px-4 py-32 text-center overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div className="relative max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Ready to transform your content?</h2>
            <Button size="lg" className="h-16 rounded-2xl px-12 text-lg font-bold shadow-2xl shadow-primary/20 transition-all hover:scale-110 active:scale-95" asChild>
              <Link href="/sign-up">
                Start Free Workspace <Icon icon="lucide:arrow-right" className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
