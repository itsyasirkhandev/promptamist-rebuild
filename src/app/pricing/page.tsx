import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@iconify/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
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
  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started with prompt engineering.',
      features: ['Up to 50 Prompts', 'Unlimited Public Shares'],
      cta: 'Start for Free',
      href: '/sign-up',
      popular: false,
      icon: 'lucide:rocket',
      gradient: 'from-muted/50 to-muted/10',
    },
    {
      name: 'Pro',
      price: '$5',
      interval: '/mo',
      description: 'For power users and professional prompt engineers.',
      features: ['Unlimited Private Prompts', 'Unlimited Dynamic Templates'],
      cta: 'Get Pro Access',
      href: '/sign-up',
      popular: true,
      icon: 'lucide:zap',
      gradient: 'from-primary/20 to-primary/5',
    },
  ];

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
        <div className="mx-auto max-w-6xl">
          {/* Hero Section */}
          <div className="mb-24 space-y-6 text-center">
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 text-primary animate-in fade-in slide-in-from-bottom-3 rounded-full px-4 py-1 duration-500"
            >
              Pricing Plans
            </Badge>
            <h1
              className="font-heading animate-in fade-in slide-in-from-bottom-4 font-extrabold tracking-tight text-balance duration-700"
              style={{ fontSize: 'var(--text-5xl)', lineHeight: '1.1' }}
            >
              Simple,{' '}
              <span className="from-primary to-chart-1 bg-gradient-to-r bg-clip-text text-transparent">
                Transparent
              </span>{' '}
              Pricing
            </h1>
            <p
              className="text-muted-foreground animate-in fade-in slide-in-from-bottom-5 mx-auto max-w-2xl duration-1000"
              style={{ fontSize: 'var(--text-lg)' }}
            >
              Invest in your productivity, not in subscription bloat. Scale your
              AI workflow without breaking the bank.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="relative mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={cn(
                  'group animate-in fade-in slide-in-from-bottom-8 relative transition-all duration-500',
                  index === 0 ? 'duration-700' : 'duration-1000',
                )}
              >
                {/* Card Glow Effect */}
                <div
                  className={cn(
                    'absolute -inset-px rounded-[2.5rem] opacity-0 blur-sm transition duration-500 group-hover:opacity-100',
                    plan.popular ? 'bg-primary/30' : 'bg-muted-foreground/20',
                  )}
                />

                <Card
                  className={cn(
                    'border-border/50 bg-card/60 group-hover:shadow-primary/5 relative flex h-full flex-col !overflow-visible backdrop-blur-xl transition-all duration-500 group-hover:translate-y-[-4px] group-hover:shadow-2xl',
                    plan.popular &&
                      'ring-primary/40 border-primary/20 shadow-primary/10 shadow-xl ring-1',
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 z-30 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground shadow-primary/30 rounded-full border-none px-4 py-1 text-[10px] font-bold tracking-wider whitespace-nowrap uppercase shadow-xl">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="p-8">
                    <div
                      className={cn(
                        'ring-border mb-6 inline-flex w-fit rounded-2xl bg-gradient-to-br p-3 shadow-inner ring-1 transition-transform duration-500 group-hover:scale-110',
                        plan.gradient,
                      )}
                    >
                      <Icon
                        icon={plan.icon}
                        className={cn(
                          'h-6 w-6 transition-colors duration-300',
                          plan.popular
                            ? 'text-primary'
                            : 'text-muted-foreground',
                        )}
                      />
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="mt-2 h-12 text-base leading-relaxed">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 p-8 pt-0">
                    <div className="mb-8 flex origin-left items-baseline gap-1 transition-transform duration-500 group-hover:scale-105">
                      <span
                        className="font-black tracking-tighter"
                        style={{ fontSize: 'var(--text-4xl)' }}
                      >
                        {plan.price}
                      </span>
                      {plan.interval && (
                        <span className="text-muted-foreground text-lg font-medium">
                          {plan.interval}
                        </span>
                      )}
                    </div>

                    <div className="space-y-4">
                      <p className="text-muted-foreground/70 text-xs font-semibold tracking-widest uppercase">
                        What&apos;s included:
                      </p>
                      <ul className="space-y-3">
                        {plan.features.map((feature) => (
                          <li
                            key={feature}
                            className="group/item flex items-center gap-3 text-sm"
                          >
                            <div
                              className={cn(
                                'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-300',
                                plan.popular
                                  ? 'bg-primary/10 text-primary'
                                  : 'bg-muted text-muted-foreground',
                              )}
                            >
                              <Icon
                                icon="lucide:check"
                                className="h-3.5 w-3.5"
                              />
                            </div>
                            <span className="text-muted-foreground group-hover/item:text-foreground transition-colors duration-200">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>

                  <CardFooter className="mt-auto p-8 pt-0">
                    <Button
                      asChild
                      size="lg"
                      className={cn(
                        'group/btn h-14 w-full rounded-2xl text-base font-bold shadow-lg transition-all duration-300',
                        plan.popular
                          ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98]'
                          : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground hover:scale-[1.02] active:scale-[0.98]',
                      )}
                    >
                      <Link href={plan.href}>
                        {plan.cta}
                        <Icon
                          icon="lucide:arrow-right"
                          className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                        />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="relative mx-auto mt-40 max-w-4xl">
            <div className="bg-primary/5 absolute inset-0 -z-10 rounded-full blur-[100px]" />

            <div className="mb-16 space-y-4 px-4 text-center">
              <h2
                className="font-bold tracking-tight"
                style={{ fontSize: 'var(--text-3xl)' }}
              >
                Frequently Asked Questions
              </h2>
              <p
                className="text-muted-foreground"
                style={{ fontSize: 'var(--text-base)' }}
              >
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
                <Card
                  key={i}
                  className="border-border/40 bg-card/40 hover:border-primary/30 group backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
                >
                  <CardHeader className="p-6">
                    <CardTitle className="flex items-start gap-3 text-base font-bold">
                      <div className="bg-primary/10 text-primary mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded transition-transform group-hover:scale-110">
                        <span className="text-[10px]">?</span>
                      </div>
                      {faq.q}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
