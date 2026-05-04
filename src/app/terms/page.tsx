import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@iconify/react';

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';

export const metadata: Metadata = {
  title: 'Terms of Service | Promptamist',
  description: 'The terms and conditions for using the Promptamist platform.',
  alternates: {
    canonical: `${BASE_URL}/terms`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="bg-background relative min-h-screen overflow-hidden">
      {/* Premium Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute -top-[10%] -right-[10%] h-[40%] w-[40%] rounded-full blur-[120px]" />
        <div className="bg-chart-1/5 absolute bottom-[20%] -left-[5%] h-[30%] w-[30%] rounded-full blur-[100px]" />
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
              Legal
            </Badge>
            <h1
              className="font-heading font-extrabold tracking-tight text-balance"
              style={{ fontSize: 'var(--text-4xl)', lineHeight: '1.1' }}
            >
              Terms of <span className="text-primary">Service</span>
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
                  <Icon icon="lucide:scroll-text" className="h-4 w-4" />
                </div>
                Platform Agreement
              </CardTitle>
              <Separator className="mt-4 opacity-50" />
            </CardHeader>

            <CardContent className="prose dark:prose-invert max-w-none space-y-10 p-8 pt-4">
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-muted flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold">
                    1
                  </span>
                  <h2 className="m-0 text-xl font-bold">Acceptance of Terms</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using Promptamist, you agree to be bound by
                  these Terms of Service. If you do not agree to these terms,
                  please do not use our service.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-muted flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold">
                    2
                  </span>
                  <h2 className="m-0 text-xl font-bold">Use of Service</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Promptamist provides tools to manage and organize AI prompts.
                  You are responsible for the content you store and share. You
                  must not use the service for any illegal or unauthorized
                  purpose.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-muted flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold">
                    3
                  </span>
                  <h2 className="m-0 text-xl font-bold">
                    Intellectual Property
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  The prompts you create remain your property. However, by
                  making a prompt &quot;Public&quot;, you grant other users a
                  non-exclusive license to view and copy that prompt for their
                  own use.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-muted flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold">
                    4
                  </span>
                  <h2 className="m-0 text-xl font-bold">
                    Account Responsibility
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  You are responsible for maintaining the security of your
                  account. Promptamist cannot and will not be liable for any
                  loss or damage from your failure to comply with this security
                  obligation.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-muted flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold">
                    5
                  </span>
                  <h2 className="m-0 text-xl font-bold">Termination</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to terminate or suspend your account at
                  our sole discretion, without notice, for conduct that we
                  believe violates these Terms or is harmful to other users of
                  the service.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-muted flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold">
                    6
                  </span>
                  <h2 className="m-0 text-xl font-bold">
                    Limitation of Liability
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Promptamist is provided &quot;as is&quot; without any
                  warranties. In no event shall Promptamist be liable for any
                  damages arising out of the use or inability to use the
                  service.
                </p>
              </section>

              <section className="border-border/40 space-y-4 border-t pt-10">
                <div className="flex items-center gap-3">
                  <span className="bg-muted flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold">
                    7
                  </span>
                  <h2 className="m-0 text-xl font-bold">Changes to Terms</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  We may modify these terms at any time. Your continued use of
                  the service after such modifications constitutes your
                  acceptance of the new terms.
                </p>
              </section>
            </CardContent>
          </Card>

          {/* Footer Assistance */}
          <div className="text-muted-foreground flex items-center justify-center gap-4 text-center text-sm">
            <p>Questions about our terms?</p>
            <Separator orientation="vertical" className="h-4" />
            <a
              href="mailto:support@promptamist.com"
              className="text-primary font-medium hover:underline"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
