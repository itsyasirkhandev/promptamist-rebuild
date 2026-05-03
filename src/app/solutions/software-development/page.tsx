import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';

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
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="px-4 py-24 bg-zinc-950 text-zinc-50 border-b border-zinc-800">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold tracking-tight mb-6">
              The Dev Environment for 
              <span className="text-orange-500 block">AI Prompt Engineering</span>
            </h1>
            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              Manage your coding agents, system instructions, and complex architectural prompts with a version-controlled, searchable library.
            </p>
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white" asChild>
              <Link href="/sign-up">Deploy Your Library</Link>
            </Button>
          </div>
        </section>

        <section className="px-4 py-20 border-b">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 shadow-2xl font-mono text-sm overflow-hidden">
              <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-zinc-500 ml-2">system-prompt.md</span>
              </div>
              <div className="text-zinc-300 space-y-4">
                <p># System Role: {'{{role}}'}</p>
                <p>You are an expert {'{{language}}'} developer focusing on {'{{framework}}'}.</p>
                <p># Context:</p>
                <p>Current architecture uses {'{{db_type}}'} and requires strict adherence to SOLID principles.</p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">System Prompt Management</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Stop hardcoding your best system instructions into script files or losing them in Slack threads. Promptamist provides a central source of truth for your AI-driven development.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-foreground/80">
                  <Icon icon="lucide:terminal" className="text-orange-500 mt-1 shrink-0" />
                  <span>Version your system prompts for different agent roles.</span>
                </li>
                <li className="flex items-start gap-3 text-foreground/80">
                  <Icon icon="lucide:code-2" className="text-orange-500 mt-1 shrink-0" />
                  <span>Use dynamic variables for language, framework, and constraints.</span>
                </li>
                <li className="flex items-start gap-3 text-foreground/80">
                  <Icon icon="lucide:database" className="text-orange-500 mt-1 shrink-0" />
                  <span>Keep your architectural context consistent across LLM models.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="px-4 py-20 bg-muted/20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Built for Modern AI Workflows</h2>
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="space-y-3">
                <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-lg">
                  <Icon icon="lucide:git-compare" className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-bold">Prompt Versioning</h3>
                <p className="text-sm text-muted-foreground">Keep track of which version of your prompt produced the best code output for specific edge cases.</p>
              </div>
              <div className="space-y-3">
                <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-lg">
                  <Icon icon="lucide:cpu" className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-bold">Model Comparison</h3>
                <p className="text-sm text-muted-foreground">Easily test how the same prompt performs across GPT-4o, Claude 3.5 Sonnet, and Gemini Pro 1.5.</p>
              </div>
              <div className="space-y-3">
                <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-lg">
                  <Icon icon="lucide:share" className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-bold">Dev Community Sharing</h3>
                <p className="text-sm text-muted-foreground">Share your best debugging scripts or refactoring prompts with your team via public URLs.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
