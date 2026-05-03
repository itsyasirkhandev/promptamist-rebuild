import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';

export const metadata: Metadata = {
  title: 'About Promptamist — The Story Behind the AI Prompt Manager',
  description: 'Learn why we built Promptamist and how we are helping AI power users organize, optimize, and share their prompt libraries across ChatGPT, Claude, and Gemini.',
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="px-4 py-20 bg-muted/30 border-b">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl mb-6">
              Empowering the Next Generation of 
              <span className="text-primary block">Prompt Engineers</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We built Promptamist because we were tired of losing our best ideas in the bottomless pit of AI chat histories.
            </p>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Promptamist is on a mission to make AI interaction structured, repeatable, and collaborative. As LLMs like GPT-4, Claude 3.5, and Gemini become core to our professional lives, the ability to manage the "instructions" we give them becomes the most valuable skill in the modern economy.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Why Promptamist?</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="p-6 border rounded-xl bg-card shadow-sm">
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <Icon icon="lucide:search-check" className="text-primary" />
                    No More Lost Prompts
                  </h3>
                  <p className="text-muted-foreground">Stop scrolling through months of ChatGPT logs to find that one prompt that worked perfectly.</p>
                </div>
                <div className="p-6 border rounded-xl bg-card shadow-sm">
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <Icon icon="lucide:layers" className="text-primary" />
                    Structured Workflow
                  </h3>
                  <p className="text-muted-foreground">Turn static prompts into dynamic templates with variables. Scale your AI usage across any task.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Open & Model Agnostic</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe you shouldn&apos;t be locked into a single AI provider. Promptamist works seamlessly with every major Large Language Model. Whether you are building complex coding agents or writing marketing copy, your prompt library is your intellectual property.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 py-20 bg-primary/5 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to organize your AI workflow?</h2>
          <Button size="lg" className="px-10" asChild>
            <Link href="/sign-up">Get Started for Free</Link>
          </Button>
        </section>
      </main>
    </div>
  );
}
