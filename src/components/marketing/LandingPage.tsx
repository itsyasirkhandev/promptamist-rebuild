'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { TextureCard } from '@/components/ui/TextureCard';
import { CTASection } from '@/components/CTASection';

export function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="px-4 py-24 text-center md:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/50 px-3 py-1 text-[min(2.8vw,12px)] font-bold tracking-[0.1em] text-neutral-600 uppercase sm:px-4 sm:py-1.5 sm:text-xs sm:tracking-[0.2em] dark:border-neutral-800 dark:bg-stone-900/50 dark:text-neutral-400">
            <Icon icon="lucide:sparkles" className="h-3.5 w-3.5 shrink-0" />
            <span className="whitespace-nowrap">
              The AI Prompt Manager Built for Power Users
            </span>
          </div>
          <h1 className="text-4xl leading-[1.1] font-semibold tracking-tight text-balance text-neutral-900 md:text-6xl dark:text-neutral-50">
            Organize, Test &amp; Share <br className="hidden md:block" />
            <span className="text-neutral-500">Your AI Prompts</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-pretty text-neutral-600 md:text-xl dark:text-neutral-400">
            Stop losing your best prompts in endless chat logs. Promptamist
            gives you a structured library for all your{' '}
            <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
              ChatGPT, Claude, and Gemini
            </strong>{' '}
            prompts — with reusable templates, dynamic variables, and one-click
            public sharing.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/sign-up">
              <div className="group rounded-[14px] border-[1px] border-black/10 bg-gradient-to-b from-black/70 to-black p-[1px] transition duration-300 ease-in-out dark:border-[2px] dark:border-black dark:from-white dark:to-white/80">
                <div className="flex h-14 w-full min-w-[200px] items-center justify-center gap-3 rounded-[12px] bg-gradient-to-b from-neutral-800 to-black px-8 text-lg font-semibold text-white/90 transition duration-300 ease-in-out group-hover:from-stone-800 group-hover:to-neutral-800/70 active:bg-gradient-to-b active:from-black active:to-black dark:from-neutral-200 dark:to-neutral-50 dark:text-black/80 dark:hover:from-stone-200 dark:hover:to-neutral-200 dark:active:from-stone-300 dark:active:to-neutral-300">
                  <Icon icon="lucide:rocket" className="h-5 w-5" />
                  Start Free
                </div>
              </div>
            </Link>
            <Link href="/marketplace">
              <div className="group/texture-button rounded-[14px] border-[1px] border-black/20 bg-white/50 p-[1px] hover:bg-gradient-to-t hover:from-neutral-100 active:bg-neutral-200 dark:border-[2px] dark:border-neutral-950 dark:bg-neutral-600/80 dark:hover:from-neutral-600/50 dark:hover:to-neutral-600/70 dark:active:bg-neutral-800">
                <div className="flex h-14 w-full min-w-[200px] items-center justify-center gap-3 rounded-[12px] bg-gradient-to-b from-white to-neutral-50/50 px-8 text-lg font-semibold text-neutral-700 transition duration-300 ease-in-out group-hover/texture-button:bg-gradient-to-b group-hover/texture-button:from-neutral-50/50 group-hover/texture-button:to-neutral-100/60 group-active/texture-button:bg-gradient-to-b group-active/texture-button:from-neutral-100/60 group-active/texture-button:to-neutral-100/90 dark:from-neutral-800 dark:to-neutral-700/50 dark:text-neutral-200 dark:group-hover/texture-button:from-neutral-700 dark:group-hover/texture-button:to-neutral-700/60 dark:group-active/texture-button:from-neutral-800 dark:group-active/texture-button:to-neutral-700">
                  <Icon
                    icon="lucide:compass"
                    className="h-5 w-5 text-neutral-600 dark:text-neutral-300"
                  />
                  Explore Marketplace
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative overflow-hidden px-4 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-2 text-xs font-bold tracking-[0.2em] text-neutral-600 uppercase dark:text-neutral-400">
              Features
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-balance text-neutral-900 md:text-5xl dark:text-neutral-50">
              Built for Professional <br /> Prompt Engineering
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
              A professional workspace purpose-built for AI power users who need
              structure and scale.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: 'lucide:layout-template',
                term: 'Dynamic Prompt Templates',
                desc: 'Build reusable prompt templates with named variables. Fill in values instantly to generate customized prompts.',
              },
              {
                icon: 'lucide:library',
                term: 'Organized Prompt Library',
                desc: 'Tag, filter, and search your entire prompt collection. Never lose a great prompt again.',
              },
              {
                icon: 'lucide:share-2',
                term: 'One-Click Public Sharing',
                desc: 'Share any prompt via a public URL. Anyone can view and use your prompt template without needing an account.',
              },
              {
                icon: 'lucide:zap',
                term: 'Works with Any LLM',
                desc: 'Use your prompts with ChatGPT, Claude, Gemini, or any other AI model — model-agnostic by design.',
              },
              {
                icon: 'lucide:shield-check',
                term: 'Private by Default',
                desc: 'Your prompts are private by default. Choose exactly which prompts to share publicly.',
              },
              {
                icon: 'lucide:trending-up',
                term: 'Prompt Statistics',
                desc: 'Track your library growth. See total prompts, templates, and public shares over time.',
              },
            ].map(({ icon, term, desc }) => (
              <TextureCard key={term}>
                <div className="p-6">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200 bg-white/50 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
                    <Icon icon={icon} className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-neutral-900 dark:text-neutral-100">
                    {term}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {desc}
                  </p>
                </div>
              </TextureCard>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="px-4 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-2 text-xs font-bold tracking-[0.2em] text-neutral-600 uppercase dark:text-neutral-400">
              Solutions
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-balance text-neutral-900 md:text-5xl dark:text-neutral-50">
              Built for Every Professional AI Workflow
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
              Specialized tools for the world&apos;s most demanding AI power
              users.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                title: 'Content Writing',
                icon: 'lucide:pen-tool',
                desc: 'Scale your blog production and maintain brand voice with structured storytelling templates.',
                href: '/solutions/content-writing',
                label: 'Explore Writing Solutions',
              },
              {
                title: 'Software Development',
                icon: 'lucide:code-2',
                desc: 'Manage complex system prompts and architectural context for your AI coding agents.',
                href: '/solutions/software-development',
                label: 'Explore Dev Solutions',
              },
            ].map((solution) => (
              <TextureCard key={solution.title} className="p-2">
                <div className="p-6">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-white/50 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
                    <Icon icon={solution.icon} className="h-8 w-8" />
                  </div>
                  <h3 className="mb-4 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                    {solution.title}
                  </h3>
                  <p className="mb-8 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {solution.desc}
                  </p>
                  <Button
                    variant="link"
                    className="group/link h-auto p-0 px-0 text-base font-bold text-neutral-900 dark:text-neutral-100"
                    asChild
                  >
                    <Link href={solution.href}>
                      {solution.label}
                      <Icon
                        icon="lucide:arrow-right"
                        className="ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-1"
                      />
                    </Link>
                  </Button>
                </div>
              </TextureCard>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Button
              variant="outline"
              size="lg"
              className="h-14 rounded-2xl border-neutral-200 px-10 font-bold text-neutral-600 transition-all hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
              asChild
            >
              <Link href="/solutions">View All Solutions</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </>
  );
}
