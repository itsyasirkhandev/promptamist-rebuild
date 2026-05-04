import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';

export const metadata: Metadata = {
  title: 'Prompt Management Solutions — AI Workflows for Every Industry',
  description:
    'Explore how different industries use Promptamist to scale their AI operations. From content creation to software engineering, find the right solution for your prompt library.',
  alternates: {
    canonical: `${BASE_URL}/solutions`,
  },
};

export default function SolutionsLandingPage() {
  const solutions = [
    {
      title: 'Content Creation',
      description:
        'Scale your content production with blog templates, tone consistency tools, and prompt organization.',
      icon: 'lucide:pen-tool',
      href: '/solutions/content-writing',
      tags: ['Blogging', 'SEO', 'Creative Writing'],
    },
    {
      title: 'Software Development',
      description:
        'Manage complex system prompts, debugging scripts, and architectural context for AI coding agents.',
      icon: 'lucide:code-2',
      href: '/solutions/software-development',
      tags: ['Programming', 'DevOps', 'Architecture'],
    },
    {
      title: 'Marketing & Ad Copy',
      description:
        'Optimize your ad spend with structured prompts for social media, email campaigns, and product descriptions.',
      icon: 'lucide:megaphone',
      href: '/solutions/content-writing', // Reuse content writing or create new
      tags: ['Advertising', 'Email Marketing', 'Social Media'],
    },
    {
      title: 'Data Analysis',
      description:
        'Clean, transform, and analyze data with repeatable AI prompts for Python, SQL, and Excel workflows.',
      icon: 'lucide:bar-chart-4',
      href: '/solutions/software-development', // Reuse dev or create new
      tags: ['Big Data', 'SQL', 'Automation'],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              AI Solutions for Professional Teams
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
              Choose your industry and see how Promptamist can transform your AI
              productivity.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {solutions.map((solution) => (
              <Card
                key={solution.title}
                className="hover:border-primary/50 group transition-colors"
              >
                <CardHeader>
                  <div className="bg-primary/10 group-hover:bg-primary/20 mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-colors">
                    <Icon
                      icon={solution.icon}
                      className="text-primary h-6 w-6"
                    />
                  </div>
                  <CardTitle className="text-2xl">{solution.title}</CardTitle>
                  <CardDescription className="text-base">
                    {solution.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="mr-auto"
                  >
                    <Link href={solution.href}>Learn More &rarr;</Link>
                  </Button>
                  <div className="flex gap-2">
                    {solution.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-muted-foreground bg-muted rounded-md px-2 py-1 text-[10px] font-bold tracking-wider uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="bg-primary text-primary-foreground mt-20 rounded-3xl p-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Don&apos;t see your industry?
            </h2>
            <p className="mx-auto mb-8 max-w-xl opacity-90">
              Promptamist is highly flexible and works for any niche where AI
              prompts are part of the daily workflow.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/sign-up">Build Your Own Library</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
