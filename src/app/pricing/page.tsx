import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';

export const metadata: Metadata = {
  title: 'Pricing — Affordable Prompt Management for AI Power Users',
  description: 'Choose the plan that fits your AI workflow. From our generous free tier to professional tools for power users, Promptamist is the most cost-effective way to manage your prompts.',
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
      features: [
        'Up to 10 Private Prompts',
        '3 Dynamic Templates',
        'Unlimited Public Shares',
        'Basic Search & Tags',
        'Community Support',
      ],
      cta: 'Start for Free',
      href: '/sign-up',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$9',
      interval: '/mo',
      description: 'For power users and professional prompt engineers.',
      features: [
        'Unlimited Private Prompts',
        'Unlimited Dynamic Templates',
        'Advanced Filtering',
        'Version History (Coming Soon)',
        'Priority Support',
        'No Prompt Limits',
      ],
      cta: 'Get Pro Access',
      href: '/sign-up',
      popular: true,
    },
    {
      name: 'Team',
      price: '$29',
      interval: '/mo',
      description: 'Collaborate with your team on shared AI workflows.',
      features: [
        'Everything in Pro',
        'Shared Team Workspace',
        'Collaborative Editing',
        'Role-based Access',
        'Admin Dashboard',
        'SAML/SSO (Custom)',
      ],
      cta: 'Contact Sales',
      href: '/sign-up',
      popular: false,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground">
              Invest in your productivity, not in subscription bloat.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.name} className={`flex flex-col relative ${plan.popular ? 'border-primary shadow-lg scale-105 z-10' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.interval && <span className="text-muted-foreground">{plan.interval}</span>}
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Icon icon="lucide:check" className="text-primary h-4 w-4 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={plan.popular ? 'default' : 'outline'} asChild>
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-24 text-center">
            <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="max-w-2xl mx-auto grid gap-6 text-left">
              <div>
                <h3 className="font-semibold mb-2">Can I switch plans later?</h3>
                <p className="text-muted-foreground text-sm">Yes, you can upgrade or downgrade your plan at any time from your settings page.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Do you offer a student discount?</h3>
                <p className="text-muted-foreground text-sm">We offer free Pro access for students. Contact our support team with your student email to apply.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Is there a limit on public sharing?</h3>
                <p className="text-muted-foreground text-sm">No! We believe in sharing knowledge. You can share as many prompts publicly as you like, even on the Free plan.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
