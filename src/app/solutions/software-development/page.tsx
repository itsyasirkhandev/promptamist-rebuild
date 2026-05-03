import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';

export const metadata: Metadata = {
  title: 'AI Prompts for Software Developers — Streamline Your Coding Workflow',
  description: 'How developers use Promptamist to manage complex system architecture prompts, debugging templates, and code review instructions across GPT-4, Claude 3.5, and Gemini Pro.',
  alternates: {
    canonical: `${BASE_URL}/solutions/software-development`,
  },
};

export default function SoftwareDevelopmentSolution() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-orange-500/5 blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[25%] h-[25%] rounded-full bg-chart-2/5 blur-[80px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <main className="relative z-10 flex-1">
        <section className="px-4 py-24 md:py-32 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Badge variant="outline" className="px-4 py-1 rounded-full border-orange-500/20 bg-orange-500/5 text-orange-600 dark:text-orange-400">
              For Software Engineers
            </Badge>
            <h1 className="font-heading font-extrabold tracking-tight text-balance"
              style={{ fontSize: 'var(--text-4xl)', lineHeight: '1.1' }}>
              The Dev Environment for 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-700 block mt-2">AI Prompt Engineering</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              style={{ fontSize: 'var(--text-base)' }}>
              Manage your coding agents, system instructions, and complex architectural prompts with a version-controlled, searchable library.
            </p>
            <div className="pt-6">
              <Button size="lg" className="h-16 rounded-2xl px-12 text-lg font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-2xl shadow-orange-500/20 transition-all hover:scale-110 active:scale-95" asChild>
                <Link href="/sign-up">Deploy Your Library</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="px-4 py-24 border-y border-border/40 relative">
          <div className="absolute inset-0 bg-orange-500/5 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <Card className="border-zinc-800 bg-zinc-950 p-0 shadow-2xl overflow-hidden font-mono text-sm group animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border-b border-zinc-800">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-zinc-500 ml-4 text-xs">system-prompt.md</span>
                <Icon icon="lucide:copy" className="ml-auto h-3.5 w-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors cursor-pointer" />
              </div>
              <div className="p-6 text-zinc-300 space-y-4">
                <p className="text-zinc-500"># System Role: <span className="text-orange-400">{`{{role}}`}</span></p>
                <p>You are an expert <span className="text-blue-400">{`{{language}}`}</span> developer focusing on <span className="text-green-400">{`{{framework}}`}</span>.</p>
                <p className="text-zinc-500"># Context:</p>
                <p>Current architecture uses <span className="text-purple-400">{`{{db_type}}`}</span> and requires strict adherence to SOLID principles.</p>
              </div>
            </Card>

            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000">
              <h2 className="text-3xl font-bold tracking-tight">System Prompt Management</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Stop hardcoding your best system instructions into script files or losing them in Slack threads. Promptamist provides a central source of truth for your AI-driven development.
              </p>
              <ul className="space-y-6">
                {[
                  { icon: 'lucide:terminal', text: 'Version your system prompts for different agent roles.' },
                  { icon: 'lucide:code-2', text: 'Use dynamic variables for language, framework, and constraints.' },
                  { icon: 'lucide:database', text: 'Keep your architectural context consistent across LLM models.' }
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Icon icon={item.icon} className="h-5 w-5" />
                    </div>
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors pt-2">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="px-4 py-24 md:py-32">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Built for Modern AI Workflows</h2>
              <p className="text-muted-foreground text-lg">Infrastructure for the elite AI engineer.</p>
              <div className="h-1.5 w-16 bg-orange-500/40 mx-auto rounded-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
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
                  title: 'Dev Community Sharing',
                  desc: 'Share your best debugging scripts or refactoring prompts with your team via public URLs.',
                  icon: 'lucide:share',
                },
              ].map((f) => (
                <Card key={f.title} className="group border-border/40 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl hover:shadow-orange-500/5">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon icon={f.icon} className="h-6 w-6 text-orange-500" />
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
          <div className="absolute inset-0 bg-orange-500/5 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div className="relative max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Ready to streamline your dev workflow?</h2>
            <Button size="lg" className="h-16 rounded-2xl px-12 text-lg font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-2xl shadow-orange-500/20 transition-all hover:scale-110 active:scale-95" asChild>
              <Link href="/sign-up">
                Start Prompt Engineering <Icon icon="lucide:arrow-right" className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
