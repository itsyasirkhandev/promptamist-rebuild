import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@iconify/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
        'Up to 50 Prompts',
        'Unlimited Public Shares',
      ],
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
      features: [
        'Unlimited Private Prompts',
        'Unlimited Dynamic Templates',
      ],
      cta: 'Get Pro Access',
      href: '/sign-up',
      popular: true,
      icon: 'lucide:zap',
      gradient: 'from-primary/20 to-primary/5',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-chart-1/10 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[25%] h-[25%] rounded-full bg-chart-2/5 blur-[80px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <main className="relative z-10 flex-1 py-20 md:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-24 space-y-6">
            <Badge variant="outline" className="px-4 py-1 rounded-full border-primary/20 bg-primary/5 text-primary animate-in fade-in slide-in-from-bottom-3 duration-500">
              Pricing Plans
            </Badge>
            <h1 className="font-heading font-extrabold tracking-tight text-balance animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ fontSize: 'var(--text-4xl)', lineHeight: '1.1' }}>
              Simple, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-chart-1">Transparent</span> Pricing
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-1000"
              style={{ fontSize: 'var(--text-base)' }}>
              Invest in your productivity, not in subscription bloat. Scale your AI workflow without breaking the bank.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto relative">
            {plans.map((plan, index) => (
              <div 
                key={plan.name} 
                className={cn(
                  "group relative transition-all duration-500 animate-in fade-in slide-in-from-bottom-8",
                  index === 0 ? "duration-700" : "duration-1000"
                )}
              >
                {/* Card Glow Effect */}
                <div className={cn(
                  "absolute -inset-px rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition duration-500 blur-sm",
                  plan.popular ? "bg-primary/30" : "bg-muted-foreground/20"
                )} />

                <Card className={cn(
                  "relative h-full flex flex-col border-border/50 bg-card/60 backdrop-blur-xl transition-all duration-500 group-hover:translate-y-[-4px] group-hover:shadow-2xl group-hover:shadow-primary/5 !overflow-visible",
                  plan.popular && "ring-1 ring-primary/40 border-primary/20 shadow-xl shadow-primary/10"
                )}>
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1 rounded-full shadow-xl shadow-primary/30 border-none uppercase tracking-wider text-[10px] font-bold whitespace-nowrap">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="p-8">
                    <div className={cn(
                      "inline-flex p-3 rounded-2xl bg-gradient-to-br mb-6 w-fit ring-1 ring-border shadow-inner transition-transform duration-500 group-hover:scale-110",
                      plan.gradient
                    )}>
                      <Icon
                        icon={plan.icon}
                        className={cn(
                          "h-6 w-6 transition-colors duration-300",
                          plan.popular ? 'text-primary' : 'text-muted-foreground'
                        )}
                      />
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight">{plan.name}</CardTitle>
                    <CardDescription className="text-base mt-2 leading-relaxed h-12">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 p-8 pt-0">
                    <div className="flex items-baseline gap-1 mb-8 transition-transform duration-500 group-hover:scale-105 origin-left">
                      <span className="text-5xl font-black tracking-tighter"
                        style={{ fontSize: 'var(--text-4xl)' }}>
                        {plan.price}
                      </span>
                      {plan.interval && (
                        <span className="text-muted-foreground font-medium text-lg">
                          {plan.interval}
                        </span>
                      )}
                    </div>

                    <div className="space-y-4">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">What&apos;s included:</p>
                      <ul className="space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-3 text-sm group/item">
                            <div className={cn(
                              "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-300",
                              plan.popular ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                            )}>
                              <Icon icon="lucide:check" className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-muted-foreground group-hover/item:text-foreground transition-colors duration-200">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>

                  <CardFooter className="p-8 pt-0 mt-auto">
                    <Button
                      asChild
                      size="lg"
                      className={cn(
                        "w-full h-14 text-base font-bold rounded-2xl transition-all duration-300 shadow-lg group/btn",
                        plan.popular
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98]"
                          : "bg-secondary hover:bg-secondary/80 text-secondary-foreground hover:scale-[1.02] active:scale-[0.98]"
                      )}
                    >
                      <Link href={plan.href}>
                        {plan.cta}
                        <Icon icon="lucide:arrow-right" className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-40 max-w-4xl mx-auto relative">
            <div className="absolute inset-0 bg-primary/5 blur-[100px] -z-10 rounded-full" />
            
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Everything you need to know about our plans and billing.</p>
              <div className="h-1.5 w-12 bg-primary/40 mx-auto rounded-full" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  q: "Can I switch plans later?",
                  a: "Yes, you can upgrade or downgrade your plan at any time. Changes are reflected instantly in your account."
                },
                {
                  q: "Do you offer a student discount?",
                  a: "Absolutely. We offer free Pro access for students. Contact our support team with your .edu email to apply."
                },
                {
                  q: "Is there a limit on public sharing?",
                  a: "No! We believe in open knowledge. Share as many prompts publicly as you like, even on the Free plan."
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards, Apple Pay, and Google Pay through our secure payment processor."
                }
              ].map((faq, i) => (
                <Card key={i} className="border-border/40 bg-card/40 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
                  <CardHeader className="p-6">
                    <CardTitle className="text-base font-bold flex items-start gap-3">
                      <div className="mt-1 w-5 h-5 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <span className="text-[10px]">?</span>
                      </div>
                      {faq.q}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
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


