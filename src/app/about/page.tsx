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
  title: 'About Promptamist — The Story Behind the AI Prompt Manager',
  description:
    'Learn why we built Promptamist and how we are helping AI power users organize, optimize, and share their prompt libraries across ChatGPT, Claude, and Gemini.',
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
};

export default function AboutPage() {
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
              Our Story
            </Badge>
            <h1
              className="font-heading font-extrabold tracking-tight text-balance"
              style={{ fontSize: 'var(--text-4xl)', lineHeight: '1.1' }}
            >
              Empowering the Next Generation of
              <span className="from-primary to-chart-1 mt-2 block bg-gradient-to-r bg-clip-text text-transparent">
                Prompt Engineers
              </span>
            </h1>
            <p
              className="text-muted-foreground mx-auto max-w-2xl leading-relaxed"
              style={{ fontSize: 'var(--text-base)' }}
            >
              We built Promptamist because we were tired of losing our best
              ideas in the bottomless pit of AI chat histories.
            </p>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto max-w-3xl space-y-24">
            <div className="animate-in fade-in slide-in-from-bottom-12 space-y-6 duration-1000">
              <h2 className="border-primary border-l-4 pl-6 text-3xl font-bold tracking-tight">
                Our Mission
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Promptamist is on a mission to make AI interaction structured,
                repeatable, and collaborative. As LLMs like GPT-4, Claude 3.5,
                and Gemini become core to our professional lives, the ability to
                manage the &quot;instructions&quot; we give them becomes the
                most valuable skill in the modern economy.
              </p>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-12 space-y-10 duration-1000">
              <h2 className="border-chart-1 border-l-4 pl-6 text-3xl font-bold tracking-tight">
                Why Promptamist?
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-border/40 bg-card/60 hover:shadow-primary/5 backdrop-blur-xl transition-all duration-300 hover:translate-y-[-4px] hover:shadow-2xl">
                  <CardHeader>
                    <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-2xl">
                      <Icon
                        icon="lucide:search-check"
                        className="text-primary h-6 w-6"
                      />
                    </div>
                    <CardTitle className="text-xl font-bold">
                      No More Lost Prompts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Stop scrolling through months of ChatGPT logs to find that
                      one prompt that worked perfectly.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/40 bg-card/60 hover:shadow-primary/5 backdrop-blur-xl transition-all duration-300 hover:translate-y-[-4px] hover:shadow-2xl">
                  <CardHeader>
                    <div className="bg-chart-1/10 mb-4 flex h-12 w-12 items-center justify-center rounded-2xl">
                      <Icon
                        icon="lucide:layers"
                        className="text-chart-1 h-6 w-6"
                      />
                    </div>
                    <CardTitle className="text-xl font-bold">
                      Structured Workflow
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Turn static prompts into dynamic templates with variables.
                      Scale your AI usage across any task.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-12 space-y-6 pb-20 duration-1000">
              <h2 className="border-chart-2 border-l-4 pl-6 text-3xl font-bold tracking-tight">
                Open & Model Agnostic
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We believe you shouldn&apos;t be locked into a single AI
                provider. Promptamist works seamlessly with every major Large
                Language Model. Whether you are building complex coding agents
                or writing marketing copy, your prompt library is your
                intellectual property.
              </p>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-4 py-32 text-center">
          <div className="bg-primary/5 absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div className="relative mx-auto max-w-2xl space-y-8">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Ready to organize your AI workflow?
            </h2>
            <Button
              size="lg"
              className="shadow-primary/20 h-16 rounded-2xl px-12 text-lg font-bold shadow-2xl transition-all hover:scale-110 active:scale-95"
              asChild
            >
              <Link href="/sign-up">
                Get Started for Free{' '}
                <Icon icon="lucide:arrow-right" className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
