import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@iconify/react';

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';

export const metadata: Metadata = {
  title: 'Privacy Policy | Promptamist',
  description:
    'Learn how Promptamist handles your data and ensures your AI prompts remain secure and private.',
  alternates: {
    canonical: `${BASE_URL}/privacy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="bg-background relative min-h-screen overflow-hidden">
      {/* Premium Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full blur-[120px]" />
        <div className="bg-chart-1/5 absolute -right-[5%] bottom-[20%] h-[30%] w-[30%] rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <main className="relative z-10 px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl space-y-12">
          {/* Header Section */}
          <div className="animate-in fade-in slide-in-from-bottom-4 space-y-4 text-center duration-700">
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 text-primary rounded-full px-4 py-1"
            >
              Security & Privacy
            </Badge>
            <h1
              className="font-heading font-extrabold tracking-tight text-balance"
              style={{ fontSize: 'var(--text-4xl)', lineHeight: '1.1' }}
            >
              Privacy <span className="text-primary">Policy</span>
            </h1>
            <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
              <Icon icon="lucide:calendar" className="h-4 w-4" />
              <span>Last Updated: May 3, 2026</span>
            </div>
          </div>

          {/* Document Content */}
          <Card className="border-border/40 bg-card/60 shadow-primary/5 animate-in fade-in slide-in-from-bottom-8 shadow-2xl backdrop-blur-xl duration-1000">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
                  <Icon icon="lucide:shield-check" className="h-4 w-4" />
                </div>
                Data Protection Commitment
              </CardTitle>
              <Separator className="mt-4 opacity-50" />
            </CardHeader>

            <CardContent className="prose dark:prose-invert max-w-none space-y-10 p-8 pt-4">
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-muted flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold">
                    1
                  </span>
                  <h2 className="m-0 text-xl font-bold">Introduction</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  At Promptamist, we take your privacy seriously. This policy
                  explains how we collect, use, and protect your information
                  when you use our prompt management platform.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-muted flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold">
                    2
                  </span>
                  <h2 className="m-0 text-xl font-bold">Data Collection</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  We collect information that you provide directly to us,
                  including:
                </p>
                <ul className="text-muted-foreground space-y-2">
                  <li>
                    <strong className="text-foreground">
                      Account Information:
                    </strong>{' '}
                    Name, email address, and authentication data provided via
                    Clerk.
                  </li>
                  <li>
                    <strong className="text-foreground">Content:</strong> The AI
                    prompts, templates, and tags you create and store in our
                    platform.
                  </li>
                  <li>
                    <strong className="text-foreground">Usage Data:</strong>{' '}
                    Information about how you interact with our service.
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-muted flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold">
                    3
                  </span>
                  <h2 className="m-0 text-xl font-bold">
                    How We Use Your Data
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Your data is used to provide, maintain, and improve our
                  services. We do{' '}
                  <strong className="text-foreground font-bold">not</strong>{' '}
                  sell your prompts to third parties or use them to train our
                  own models without your explicit permission.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-muted flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold">
                    4
                  </span>
                  <h2 className="m-0 text-xl font-bold">Public Sharing</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  If you choose to make a prompt &quot;Public&quot;, it will be
                  accessible via a unique URL to anyone on the internet. You can
                  revoke public access at any time by changing the prompt
                  settings back to &quot;Private&quot;.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-muted flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold">
                    5
                  </span>
                  <h2 className="m-0 text-xl font-bold">
                    Third-Party Services
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  We use trusted third-party providers for critical functions:
                </p>
                <ul className="text-muted-foreground space-y-2">
                  <li>
                    <strong className="text-foreground">Clerk:</strong> For
                    secure authentication.
                  </li>
                  <li>
                    <strong className="text-foreground">Convex:</strong> For
                    real-time data storage and backend logic.
                  </li>
                  <li>
                    <strong className="text-foreground">Vercel:</strong> For
                    hosting and infrastructure.
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-muted flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold">
                    6
                  </span>
                  <h2 className="m-0 text-xl font-bold">Your Rights</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  You have the right to access, correct, or delete your personal
                  data. You can export your prompts or delete your account at
                  any time through the dashboard settings.
                </p>
              </section>

              <section className="border-border/40 space-y-4 border-t pt-10">
                <div className="flex items-center gap-3">
                  <span className="bg-muted flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold">
                    7
                  </span>
                  <h2 className="m-0 text-xl font-bold">Contact Us</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions about this policy, please contact us at{' '}
                  <a
                    href="mailto:privacy@promptamist.com"
                    className="text-primary hover:underline"
                  >
                    privacy@promptamist.com
                  </a>
                  .
                </p>
              </section>
            </CardContent>
          </Card>

          {/* Footer Assistance */}
          <div className="text-muted-foreground flex items-center justify-center gap-4 text-center text-sm">
            <p>Data concerns?</p>
            <Separator orientation="vertical" className="h-4" />
            <a
              href="mailto:privacy@promptamist.com"
              className="text-primary font-medium hover:underline"
            >
              Privacy Center
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
