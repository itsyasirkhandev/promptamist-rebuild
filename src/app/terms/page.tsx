import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@iconify/react';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';

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
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[20%] -left-[5%] w-[30%] h-[30%] rounded-full bg-chart-1/5 blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <main className="relative z-10 py-20 md:py-32 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Badge variant="outline" className="px-4 py-1 rounded-full border-primary/20 bg-primary/5 text-primary">
              Legal
            </Badge>
            <h1 className="font-heading font-extrabold tracking-tight text-balance"
              style={{ fontSize: 'var(--text-4xl)', lineHeight: '1.1' }}>
              Terms of <span className="text-primary">Service</span>
            </h1>
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
              <Icon icon="lucide:calendar" className="w-4 h-4" />
              <span>Last Updated: May 3, 2026</span>
            </div>
          </div>

          {/* Document Content */}
          <Card className="border-border/40 bg-card/60 backdrop-blur-xl shadow-2xl shadow-primary/5 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Icon icon="lucide:scroll-text" className="w-4 h-4" />
                </div>
                Platform Agreement
              </CardTitle>
              <Separator className="mt-4 opacity-50" />
            </CardHeader>

            <CardContent className="p-8 pt-4 prose dark:prose-invert max-w-none space-y-10">
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-muted text-xs font-bold">1</span>
                  <h2 className="text-xl font-bold m-0">Acceptance of Terms</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using Promptamist, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-muted text-xs font-bold">2</span>
                  <h2 className="text-xl font-bold m-0">Use of Service</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Promptamist provides tools to manage and organize AI prompts. You are responsible for the content you store and share. You must not use the service for any illegal or unauthorized purpose.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-muted text-xs font-bold">3</span>
                  <h2 className="text-xl font-bold m-0">Intellectual Property</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  The prompts you create remain your property. However, by making a prompt &quot;Public&quot;, you grant other users a non-exclusive license to view and copy that prompt for their own use.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-muted text-xs font-bold">4</span>
                  <h2 className="text-xl font-bold m-0">Account Responsibility</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  You are responsible for maintaining the security of your account. Promptamist cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-muted text-xs font-bold">5</span>
                  <h2 className="text-xl font-bold m-0">Termination</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to terminate or suspend your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of the service.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-muted text-xs font-bold">6</span>
                  <h2 className="text-xl font-bold m-0">Limitation of Liability</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Promptamist is provided &quot;as is&quot; without any warranties. In no event shall Promptamist be liable for any damages arising out of the use or inability to use the service.
                </p>
              </section>

              <section className="space-y-4 border-t border-border/40 pt-10">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-muted text-xs font-bold">7</span>
                  <h2 className="text-xl font-bold m-0">Changes to Terms</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  We may modify these terms at any time. Your continued use of the service after such modifications constitutes your acceptance of the new terms.
                </p>
              </section>
            </CardContent>
          </Card>

          {/* Footer Assistance */}
          <div className="text-center text-muted-foreground text-sm flex items-center justify-center gap-4">
            <p>Questions about our terms?</p>
            <Separator orientation="vertical" className="h-4" />
            <a href="mailto:support@promptamist.com" className="text-primary hover:underline font-medium">Contact Support</a>
          </div>
        </div>
      </main>
    </div>
  );
}
