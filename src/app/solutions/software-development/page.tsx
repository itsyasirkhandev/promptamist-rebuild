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
  title: 'AI Prompts for Software Developers — Streamline Your Coding Workflow',
  description:
    'How developers use Promptamist to manage complex system architecture prompts, debugging templates, and code review instructions across GPT-4, Claude 3.5, and Gemini Pro.',
  alternates: {
    canonical: `${BASE_URL}/solutions/software-development`,
  },
};

export default function SoftwareDevelopmentSolution() {
  return (
    <div className="bg-background relative min-h-screen overflow-hidden">
      {/* Premium Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-orange-500/5 blur-[120px]" />
        <div className="bg-primary/5 absolute top-[20%] -right-[5%] h-[30%] w-[30%] rounded-full blur-[100px]" />
        <div className="bg-chart-2/5 absolute bottom-[10%] left-[20%] h-[25%] w-[25%] rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <main className="relative z-10 flex-1">
        <section className="relative overflow-hidden px-4 py-24 text-center md:py-32">
          <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-4xl space-y-8 duration-700">
            <Badge
              variant="outline"
              className="rounded-full border-orange-500/20 bg-orange-500/5 px-4 py-1 text-orange-600 dark:text-orange-400"
            >
              For Software Engineers
            </Badge>
            <h1
              className="font-heading font-extrabold tracking-tight text-balance"
              style={{ fontSize: 'var(--text-4xl)', lineHeight: '1.1' }}
            >
              The Dev Environment for
              <span className="mt-2 block bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                AI Prompt Engineering
              </span>
            </h1>
            <p
              className="text-muted-foreground mx-auto max-w-2xl leading-relaxed"
              style={{ fontSize: 'var(--text-base)' }}
            >
              Manage your coding agents, system instructions, and complex
              architectural prompts with a version-controlled, searchable
              library.
            </p>
            <div className="pt-6">
              <Button
                size="lg"
                className="h-16 rounded-2xl bg-orange-600 px-12 text-lg font-bold text-white shadow-2xl shadow-orange-500/20 transition-all hover:scale-110 hover:bg-orange-700 active:scale-95"
                asChild
              >
                <Link href="/sign-up">Deploy Your Library</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-border/40 relative border-y px-4 py-24">
          <div className="absolute inset-0 bg-orange-500/5 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
            <Card className="group animate-in fade-in slide-in-from-left-8 overflow-hidden border-zinc-800 bg-zinc-950 p-0 font-mono text-sm shadow-2xl duration-1000">
              <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <span className="ml-4 text-xs text-zinc-500">
                  system-prompt.md
                </span>
                <Icon
                  icon="lucide:copy"
                  className="ml-auto h-3.5 w-3.5 cursor-pointer text-zinc-600 transition-colors group-hover:text-zinc-400"
                />
              </div>
              <div className="space-y-4 p-6 text-zinc-300">
                <p className="text-zinc-500">
                  # System Role:{' '}
                  <span className="text-orange-400">{`{{role}}`}</span>
                </p>
                <p>
                  You are an expert{' '}
                  <span className="text-blue-400">{`{{language}}`}</span>{' '}
                  developer focusing on{' '}
                  <span className="text-green-400">{`{{framework}}`}</span>.
                </p>
                <p className="text-zinc-500"># Context:</p>
                <p>
                  Current architecture uses{' '}
                  <span className="text-purple-400">{`{{db_type}}`}</span> and
                  requires strict adherence to SOLID principles.
                </p>
              </div>
            </Card>

            <div className="animate-in fade-in slide-in-from-right-8 space-y-8 duration-1000">
              <h2 className="text-3xl font-bold tracking-tight">
                System Prompt Management
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Stop hardcoding your best system instructions into script files
                or losing them in Slack threads. Promptamist provides a central
                source of truth for your AI-driven development.
              </p>
              <ul className="space-y-6">
                {[
                  {
                    icon: 'lucide:terminal',
                    text: 'Version your system prompts for different agent roles.',
                  },
                  {
                    icon: 'lucide:code-2',
                    text: 'Use dynamic variables for language, framework, and constraints.',
                  },
                  {
                    icon: 'lucide:database',
                    text: 'Keep your architectural context consistent across LLM models.',
                  },
                ].map((item) => (
                  <li key={item.text} className="group flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 transition-transform group-hover:scale-110">
                      <Icon icon={item.icon} className="h-5 w-5" />
                    </div>
                    <span className="text-muted-foreground group-hover:text-foreground pt-2 transition-colors">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="px-4 py-24 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="mb-20 space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Built for Modern AI Workflows
              </h2>
              <p className="text-muted-foreground text-lg">
                Infrastructure for the elite AI engineer.
              </p>
              <div className="mx-auto h-1.5 w-16 rounded-full bg-orange-500/40" />
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
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
                <Card
                  key={f.title}
                  className="group border-border/40 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl hover:shadow-orange-500/5"
                >
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 transition-transform group-hover:scale-110">
                      <Icon icon={f.icon} className="h-6 w-6 text-orange-500" />
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
          <div className="absolute inset-0 bg-orange-500/5 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div className="relative mx-auto max-w-2xl space-y-8">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Ready to streamline your dev workflow?
            </h2>
            <Button
              size="lg"
              className="h-16 rounded-2xl bg-orange-600 px-12 text-lg font-bold text-white shadow-2xl shadow-orange-500/20 transition-all hover:scale-110 hover:bg-orange-700 active:scale-95"
              asChild
            >
              <Link href="/sign-up">
                Start Prompt Engineering{' '}
                <Icon icon="lucide:arrow-right" className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
