import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';

export const metadata: Metadata = {
  title: 'Pricing — Affordable Prompt Management for AI Power Users',
  description:
    'Choose the plan that fits your AI workflow. From our generous free tier to professional tools for power users, Promptamist is the most cost-effective way to manage your prompts.',
  alternates: {
    canonical: `${BASE_URL}/pricing`,
  },
};

export default function PricingPage() {
  return (
    <div className="bg-background relative min-h-screen overflow-hidden">
      {/* Premium Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/10 absolute -top-[10%] -left-[10%] h-[40%] w-[40%] animate-pulse rounded-full blur-[120px]" />
        <div className="bg-chart-1/10 absolute top-[20%] -right-[5%] h-[30%] w-[30%] rounded-full blur-[100px]" />
        <div className="bg-chart-2/5 absolute bottom-[10%] left-[20%] h-[25%] w-[25%] rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:44px_44px]" />
      </div>

      <main className="relative z-10 flex-1 px-4 py-20 md:py-32">
        <section className="mx-auto max-w-6xl">
          <div className="mb-12 text-center md:mb-16">
            <p className="mb-2 text-muted-foreground text-xs font-semibold tracking-widest uppercase">
              Pricing
            </p>
            <h1 className="text-balance font-bold text-3xl tracking-tight text-foreground md:text-5xl">
              Plans that stay in the{' '}
              <span className="from-primary to-chart-1 bg-gradient-to-r bg-clip-text text-transparent">
                texture system
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
              Neutral emphasis on the column that matters—no neon badges, just
              border and gradient shifts on the card.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch md:gap-5">
            {/* Starter Plan */}
            <div className="rounded-[24px] border border-foreground/5 bg-gradient-to-b from-muted to-background/70 dark:border-border/60 dark:from-muted/20 dark:to-background/50 flex flex-col">
              <div className="rounded-[23px] border border-black/5 dark:border-white/5 flex-1 flex flex-col">
                <div className="rounded-[22px] border border-white/50 dark:border-black/20 flex-1 flex flex-col">
                  <div className="rounded-[21px] border border-black/5 dark:border-white/5 flex-1 flex flex-col">
                    <div className="w-full rounded-[20px] border border-white/50 dark:border-white/5 flex-1 flex flex-col text-muted-foreground">
                      <div className="p-6 pb-4">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-foreground text-lg">
                            Starter
                          </h3>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="font-bold text-3xl text-foreground tabular-nums">
                            $0
                          </span>
                          <span className="text-sm font-medium">/mo</span>
                        </div>
                        <p className="mt-2 text-sm leading-snug">
                          For individuals shipping a first version.
                        </p>
                      </div>

                      <div className="border-t border-border/50"></div>

                      <div className="flex-1 px-6 py-5">
                        <ul className="flex flex-col gap-3">
                          <li className="flex items-start gap-2 text-sm">
                            <Icon
                              icon="lucide:check"
                              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                            />
                            <span>2 seats</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <Icon
                              icon="lucide:check"
                              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                            />
                            <span>Basic analytics</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <Icon
                              icon="lucide:check"
                              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                            />
                            <span>Email support</span>
                          </li>
                        </ul>
                      </div>

                      <div className="px-6 py-4 border-t border-border/50">
                        <Button
                          asChild
                          className="w-full rounded-[12px] h-10 shadow-sm"
                          variant="outline"
                        >
                          <Link href="/sign-up">Get started</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="rounded-[24px] border border-primary/20 bg-gradient-to-b from-primary/5 to-background ring-1 ring-primary/10 dark:border-primary/30 dark:from-primary/10 dark:to-background/80 flex flex-col md:-mt-2 md:mb-2 scale-105 z-10">
              <div className="rounded-[23px] border border-black/5 dark:border-white/5 flex-1 flex flex-col">
                <div className="rounded-[22px] border border-white/50 dark:border-black/20 flex-1 flex flex-col">
                  <div className="rounded-[21px] border border-black/5 dark:border-white/5 flex-1 flex flex-col">
                    <div className="w-full rounded-[20px] border border-white/50 dark:border-white/5 flex-1 flex flex-col text-muted-foreground">
                      <div className="p-6 pb-4">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <h3 className="font-bold text-foreground text-lg">
                            Pro
                          </h3>
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary border-none text-[10px] uppercase tracking-wider font-bold"
                          >
                            Popular
                          </Badge>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="font-bold text-3xl text-foreground tabular-nums">
                            $5
                          </span>
                          <span className="text-sm font-medium">/mo</span>
                        </div>
                        <p className="mt-2 text-sm leading-snug text-foreground/80">
                          For teams that need polish without noise.
                        </p>
                      </div>

                      <div className="border-t border-primary/10"></div>

                      <div className="flex-1 px-6 py-5">
                        <ul className="flex flex-col gap-3">
                          <li className="flex items-start gap-2 text-sm text-foreground/90 font-medium">
                            <Icon
                              icon="lucide:check"
                              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                            />
                            <span>10 seats</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-foreground/90 font-medium">
                            <Icon
                              icon="lucide:check"
                              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                            />
                            <span>Advanced analytics</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-foreground/90 font-medium">
                            <Icon
                              icon="lucide:check"
                              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                            />
                            <span>Priority support</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-foreground/90 font-medium">
                            <Icon
                              icon="lucide:check"
                              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                            />
                            <span>SSO-ready exports</span>
                          </li>
                        </ul>
                      </div>

                      <div className="px-6 py-4 border-t border-primary/10">
                        <Button
                          asChild
                          className="w-full rounded-[12px] h-10 shadow-lg shadow-primary/20"
                        >
                          <Link href="/sign-up">Get started</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="rounded-[24px] border border-foreground/5 bg-gradient-to-b from-muted to-background/70 dark:border-border/60 dark:from-muted/20 dark:to-background/50 flex flex-col">
              <div className="rounded-[23px] border border-black/5 dark:border-white/5 flex-1 flex flex-col">
                <div className="rounded-[22px] border border-white/50 dark:border-black/20 flex-1 flex flex-col">
                  <div className="rounded-[21px] border border-black/5 dark:border-white/5 flex-1 flex flex-col">
                    <div className="w-full rounded-[20px] border border-white/50 dark:border-white/5 flex-1 flex flex-col text-muted-foreground">
                      <div className="p-6 pb-4">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-foreground text-lg">
                            Enterprise
                          </h3>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="font-bold text-3xl text-foreground tabular-nums">
                            Custom
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-snug">
                          Volume, security reviews, and bespoke terms.
                        </p>
                      </div>

                      <div className="border-t border-border/50"></div>

                      <div className="flex-1 px-6 py-5">
                        <ul className="flex flex-col gap-3">
                          <li className="flex items-start gap-2 text-sm">
                            <Icon
                              icon="lucide:check"
                              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                            />
                            <span>Unlimited seats</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <Icon
                              icon="lucide:check"
                              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                            />
                            <span>Dedicated success</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <Icon
                              icon="lucide:check"
                              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                            />
                            <span>Audit logs</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <Icon
                              icon="lucide:check"
                              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                            />
                            <span>Custom SLAs</span>
                          </li>
                        </ul>
                      </div>

                      <div className="px-6 py-4 border-t border-border/50">
                        <Button
                          asChild
                          className="w-full rounded-[12px] h-10 shadow-sm"
                          variant="outline"
                        >
                          <Link href="mailto:sales@promptamist.com">
                            Talk to sales
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="relative mx-auto mt-40 max-w-4xl">
            <div className="bg-primary/5 absolute inset-0 -z-10 rounded-full blur-[100px]" />

            <div className="mb-12 space-y-4 px-4 text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Everything you need to know about our plans and billing.
              </p>
              <div className="bg-primary/40 mx-auto h-1.5 w-12 rounded-full" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  q: 'Can I switch plans later?',
                  a: 'Yes, you can upgrade or downgrade your plan at any time. Changes are reflected instantly in your account.',
                },
                {
                  q: 'Do you offer a student discount?',
                  a: 'Absolutely. We offer free Pro access for students. Contact our support team with your .edu email to apply.',
                },
                {
                  q: 'Is there a limit on public sharing?',
                  a: 'No! We believe in open knowledge. Share as many prompts publicly as you like, even on the Free plan.',
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept all major credit cards, Apple Pay, and Google Pay through our secure payment processor.',
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="border-border/40 bg-card/40 hover:border-primary/30 group rounded-2xl border p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
                >
                  <h3 className="flex items-start gap-3 text-base font-bold">
                    <div className="bg-primary/10 text-primary mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded transition-transform group-hover:scale-110">
                      <span className="text-[10px]">?</span>
                    </div>
                    {faq.q}
                  </h3>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed pl-8">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
