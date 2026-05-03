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
        'Up to 50 Prompts',
        'Unlimited Public Shares',
        'Community Templates',
        'Basic Search',
      ],
      cta: 'Start for Free',
      href: '/sign-up',
      popular: false,
      gradient: 'from-muted/40 to-muted/10',
    },
    {
      name: 'Pro',
      price: '$5',
      interval: '/mo',
      description: 'For power users and professional prompt engineers.',
      features: [
        'Unlimited Private Prompts',
        'Unlimited Dynamic Templates',
        'Version History (Coming Soon)',
        'Priority Support',
        'Advanced Analytics',
        'Custom Folders',
      ],
      cta: 'Get Pro Access',
      href: '/sign-up',
      popular: true,
      gradient: 'from-primary/15 to-primary/5',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <main className="flex-1 py-16 md:py-24 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section with Fluid Typography */}
          <div className="text-center mb-20 relative">
            <div className="absolute inset-0 -z-10 blur-3xl opacity-10 bg-primary rounded-full w-96 h-96 mx-auto top-[-100px]" />
            <h1 className="font-extrabold tracking-tight mb-6 text-balance"
                style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', lineHeight: '1.1' }}>
              Simple, <span className="text-primary">Transparent</span> Pricing
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto"
               style={{ fontSize: 'clamp(1.1rem, 2vw, 1.25rem)' }}>
              Invest in your productivity, not in subscription bloat. Scale your AI workflow without breaking the bank.
            </p>
          </div>

          {/* Intrinsic Grid Layout with Container Queries */}
          <div className="@container w-full max-w-4xl mx-auto">
            <div className="grid gap-8 justify-center @[600px]:grid-cols-2">
              {plans.map((plan) => (
                <div key={plan.name} className="group relative @container h-full">
                  {/* Glowing backdrop using theme colors */}
                  <div className={`
                    absolute -inset-0.5 rounded-3xl blur opacity-20 group-hover:opacity-50 transition duration-1000 group-hover:duration-200
                    ${plan.popular ? 'bg-primary' : 'bg-muted-foreground'}
                  `} />
                  
                  <Card className={`
                    relative h-full flex flex-col border-none bg-card/80 backdrop-blur-xl rounded-2xl overflow-hidden
                    transition-all duration-300 hover:translate-y-[-8px]
                    ${plan.popular ? 'ring-2 ring-primary/30' : 'ring-1 ring-border'}
                  `}>
                    {plan.popular && (
                      <div className="absolute top-0 right-0">
                        <div className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest py-1.5 px-4 rounded-bl-lg">
                          Most Popular
                        </div>
                      </div>
                    )}
                    
                    <CardHeader className="pt-8 px-8">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${plan.gradient} mb-4 w-fit ring-1 ring-border/50`}>
                        <Icon 
                          icon={plan.popular ? "lucide:zap" : "lucide:rocket"} 
                          className={`h-6 w-6 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} 
                        />
                      </div>
                      <CardTitle className="text-3xl font-bold">{plan.name}</CardTitle>
                      <CardDescription className="text-base mt-2 leading-relaxed">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 px-8 pt-4 pb-8">
                      <div className="flex items-baseline gap-1 mb-8">
                        <span className="text-5xl font-black tracking-tight"
                              style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
                          {plan.price}
                        </span>
                        {plan.interval && (
                          <span className="text-muted-foreground font-medium text-lg">
                            {plan.interval}
                          </span>
                        )}
                      </div>

                      {/* Intrinsic list layout using container query */}
                      <ul className="space-y-4">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3 text-sm group/item">
                            <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                              <Icon icon="lucide:check" className="h-3 w-3" />
                            </div>
                            <span className="text-muted-foreground group-hover/item:text-foreground transition-colors duration-200">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter className="px-8 pb-8 pt-0 mt-auto">
                      <Button 
                        className={`w-full h-12 text-base font-bold rounded-xl transition-all duration-300 shadow-lg ${
                          plan.popular 
                            ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 hover:shadow-primary/40' 
                            : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                        }`} 
                        asChild
                      >
                        <Link href={plan.href}>
                          {plan.cta}
                          <Icon icon="lucide:arrow-right" className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced FAQ Section using theme colors */}
          <div className="mt-32 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
              <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
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
                <div key={i} className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors duration-300">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <span className="text-primary text-xl">?</span>
                    {faq.q}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


