import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';

export const metadata: Metadata = {
  title: 'Prompt Management Solutions — AI Workflows for Every Industry',
  description: 'Explore how different industries use Promptamist to scale their AI operations. From content creation to software engineering, find the right solution for your prompt library.',
  alternates: {
    canonical: `${BASE_URL}/solutions`,
  },
};

export default function SolutionsLandingPage() {
  const solutions = [
    {
      title: 'Content Creation',
      description: 'Scale your content production with blog templates, tone consistency tools, and prompt organization.',
      icon: 'lucide:pen-tool',
      href: '/solutions/content-writing',
      tags: ['Blogging', 'SEO', 'Creative Writing'],
    },
    {
      title: 'Software Development',
      description: 'Manage complex system prompts, debugging scripts, and architectural context for AI coding agents.',
      icon: 'lucide:code-2',
      href: '/solutions/software-development',
      tags: ['Programming', 'DevOps', 'Architecture'],
    },
    {
      title: 'Marketing & Ad Copy',
      description: 'Optimize your ad spend with structured prompts for social media, email campaigns, and product descriptions.',
      icon: 'lucide:megaphone',
      href: '/solutions/content-writing', // Reuse content writing or create new
      tags: ['Advertising', 'Email Marketing', 'Social Media'],
    },
    {
      title: 'Data Analysis',
      description: 'Clean, transform, and analyze data with repeatable AI prompts for Python, SQL, and Excel workflows.',
      icon: 'lucide:bar-chart-4',
      href: '/solutions/software-development', // Reuse dev or create new
      tags: ['Big Data', 'SQL', 'Automation'],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl mb-4">
              AI Solutions for Professional Teams
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose your industry and see how Promptamist can transform your AI productivity.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {solutions.map((solution) => (
              <Card key={solution.title} className="hover:border-primary/50 transition-colors group">
                <CardHeader>
                  <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-lg mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon icon={solution.icon} className="text-primary h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">{solution.title}</CardTitle>
                  <CardDescription className="text-base">{solution.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild className="mr-auto">
                    <Link href={solution.href}>Learn More &rarr;</Link>
                  </Button>
                  <div className="flex gap-2">
                    {solution.tags.map(tag => (
                      <span key={tag} className="text-[10px] uppercase font-bold text-muted-foreground px-2 py-1 bg-muted rounded-md tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-20 p-12 bg-primary rounded-3xl text-primary-foreground text-center">
            <h2 className="text-3xl font-bold mb-4">Don&apos;t see your industry?</h2>
            <p className="mb-8 opacity-90 max-w-xl mx-auto">
              Promptamist is highly flexible and works for any niche where AI prompts are part of the daily workflow.
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
