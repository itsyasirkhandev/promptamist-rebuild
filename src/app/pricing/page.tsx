import { Metadata } from 'next';
import Link from 'next/link';
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
  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started with prompt engineering.',
      features: ['Up to 50 Prompts', 'Unlimited Public Shares'],
      cta: 'Start for Free',
      href: '/sign-up',
      popular: false,
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
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-stone-950 transition-colors duration-500">
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          {/* Header Section */}
          <div className="mb-12 text-center md:mb-16">
            <p className="mb-2 text-neutral-600 text-xs font-bold uppercase tracking-[0.2em] dark:text-neutral-400">
              Pricing
            </p>
            <h1 className="text-balance font-semibold text-3xl text-neutral-900 tracking-tight md:text-5xl dark:text-neutral-50">
              Simple, <span className="text-neutral-500">Transparent</span> Pricing
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-neutral-600 dark:text-neutral-400">
              Invest in your productivity, not in subscription bloat. Scale your
              AI workflow without breaking the bank.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:max-w-4xl lg:mx-auto md:items-stretch md:gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  'rounded-[24px] border border-white/60 dark:border-stone-950/60 bg-gradient-to-b md:h-full md:min-h-0 transition-all duration-300',
                  plan.popular
                    ? 'from-neutral-50 to-white/90 ring-1 ring-black/5 md:-mt-1 md:mb-1 dark:from-neutral-800 dark:to-neutral-950 dark:ring-white/10 shadow-2xl shadow-neutral-200/50 dark:shadow-black/50'
                    : 'from-neutral-100 to-white/70 dark:from-neutral-800 dark:to-neutral-900'
                )}
              >
                <div className="rounded-[23px] border border-black/10 dark:border-neutral-900/80 flex flex-col h-full">
                  <div className="rounded-[22px] border border-white/50 dark:border-neutral-950 flex flex-col h-full">
                    <div className="rounded-[21px] border border-neutral-950/20 dark:border-neutral-900/70 flex flex-col h-full">
                      <div className="w-full rounded-[20px] border border-white/50 text-neutral-500 dark:border-neutral-700/50 flex flex-col h-full">
                        {/* Card Header */}
                        <div className="first:pt-6 last:pb-6 flex shrink-0 flex-col gap-1 p-6 pb-4">
                          <div className="mb-1 flex items-center justify-between gap-2">
                            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-lg">
                              {plan.name}
                            </h3>
                            {plan.popular && (
                              <span className="font-medium text-neutral-600 text-xs dark:text-neutral-400 px-2 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-800">
                                Popular
                              </span>
                            )}
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="font-semibold text-3xl text-neutral-900 tabular-nums dark:text-neutral-50">
                              {plan.price}
                            </span>
                            {plan.interval && (
                              <span className="text-neutral-600 text-sm dark:text-neutral-400">
                                {plan.interval}
                              </span>
                            )}
                          </div>
                          <p className="text-neutral-600 text-sm leading-snug dark:text-neutral-400 mt-1">
                            {plan.description}
                          </p>
                        </div>

                        {/* Divider */}
                        <div className="shrink-0">
                          <div className="border border-t-neutral-50 border-r-transparent border-b-neutral-300/50 border-l-transparent dark:border-t-neutral-950 dark:border-b-neutral-700/50"></div>
                        </div>

                        {/* Card Content (Features) */}
                        <div className="flex min-h-0 flex-1 flex-col px-6 py-5">
                          <ul className="flex flex-col gap-3">
                            {plan.features.map((feature) => (
                              <li
                                key={feature}
                                className="flex items-start gap-2 text-neutral-700 text-sm dark:text-neutral-300"
                              >
                                <Icon
                                  icon="lucide:check"
                                  className="mt-0.5 h-4 w-4 shrink-0 stroke-neutral-900 dark:stroke-neutral-100"
                                />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Card Footer (CTA) */}
                        <div className="flex items-center justify-between py-4 shrink-0 flex-col gap-2 border-neutral-200/60 border-t px-6 pt-2 dark:border-neutral-800/80">
                          <Link
                            href={plan.href}
                            className="w-full"
                          >
                            {plan.popular ? (
                              <div className="border-[1px] border-black/10 bg-gradient-to-b from-black/70 to-black p-[1px] transition duration-300 ease-in-out dark:border-[2px] dark:border-black dark:from-white dark:to-white/80 rounded-[12px] w-full group">
                                <div className="flex h-full w-full items-center justify-center gap-2 bg-gradient-to-b from-neutral-800 to-black text-white/90 transition duration-300 ease-in-out group-hover:from-stone-800 group-hover:to-neutral-800/70 active:bg-gradient-to-b active:from-black active:to-black dark:from-neutral-200 dark:to-neutral-50 dark:text-black/80 dark:active:from-stone-300 dark:active:to-neutral-300 dark:hover:from-stone-200 dark:hover:to-neutral-200 rounded-[10px] px-4 py-2.5 text-sm font-medium">
                                  {plan.cta}
                                  <Icon icon="lucide:arrow-right" className="w-4 h-4" />
                                </div>
                              </div>
                            ) : (
                              <div className="group/texture-button border-[1px] border-black/20 bg-white/50 p-[1px] hover:bg-gradient-to-t hover:from-neutral-100 active:bg-neutral-200 dark:border-[2px] dark:border-neutral-950 dark:bg-neutral-600/80 dark:active:bg-neutral-800 dark:hover:from-neutral-600/50 dark:hover:to-neutral-600/70 rounded-[12px] w-full">
                                <div className="flex h-full w-full items-center justify-center text-neutral-700 dark:text-neutral-200 bg-gradient-to-b from-white to-neutral-50/50 transition duration-300 ease-in-out group-hover/texture-button:bg-gradient-to-b group-hover/texture-button:from-neutral-50/50 group-hover/texture-button:to-neutral-100/60 group-active/texture-button:bg-gradient-to-b group-active/texture-button:from-neutral-100/60 group-active/texture-button:to-neutral-100/90 dark:from-neutral-800 dark:to-neutral-700/50 dark:group-active/texture-button:from-neutral-800 dark:group-active/texture-button:to-neutral-700 dark:group-hover/texture-button:from-neutral-700 dark:group-hover/texture-button:to-neutral-700/60 rounded-[10px] px-4 py-2.5 text-sm font-medium">
                                  {plan.cta}
                                </div>
                              </div>
                            )}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-40 max-w-4xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-neutral-600 dark:text-neutral-400">
                Everything you need to know about our plans and billing.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
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
                  className="group relative rounded-[24px] border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-stone-900/50 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <h3 className="flex items-start gap-3 text-base font-bold text-neutral-900 dark:text-neutral-100">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] text-neutral-500">
                      ?
                    </span>
                    {faq.q}
                  </h3>
                  <p className="mt-3 pl-9 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
