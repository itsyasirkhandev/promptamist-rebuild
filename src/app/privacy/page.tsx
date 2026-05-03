import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@iconify/react';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';

export const metadata: Metadata = {
  title: 'Privacy Policy | Promptamist',
  description: 'Learn how Promptamist handles your data and ensures your AI prompts remain secure and private.',
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
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-chart-1/5 blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <main className="relative z-10 py-20 md:py-32 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Badge variant="outline" className="px-4 py-1 rounded-full border-primary/20 bg-primary/5 text-primary">
              Security & Privacy
            </Badge>
            <h1 className="font-heading font-extrabold tracking-tight text-balance"
              style={{ fontSize: 'var(--text-4xl)', lineHeight: '1.1' }}>
              Privacy <span className="text-primary">Policy</span>
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
                  <Icon icon="lucide:shield-check" className="w-4 h-4" />
                </div>
                Data Protection Commitment
              </CardTitle>
              <Separator className="mt-4 opacity-50" />
            </CardHeader>

            <CardContent className="p-8 pt-4 prose dark:prose-invert max-w-none space-y-10">
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-muted text-xs font-bold">1</span>
                  <h2 className="text-xl font-bold m-0">Introduction</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  At Promptamist, we take your privacy seriously. This policy explains how we collect, use, and protect your information when you use our prompt management platform.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-muted text-xs font-bold">2</span>
                  <h2 className="text-xl font-bold m-0">Data Collection</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong className="text-foreground">Account Information:</strong> Name, email address, and authentication data provided via Clerk.</li>
                  <li><strong className="text-foreground">Content:</strong> The AI prompts, templates, and tags you create and store in our platform.</li>
                  <li><strong className="text-foreground">Usage Data:</strong> Information about how you interact with our service.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-muted text-xs font-bold">3</span>
                  <h2 className="text-xl font-bold m-0">How We Use Your Data</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Your data is used to provide, maintain, and improve our services. We do <strong className="text-foreground font-bold">not</strong> sell your prompts to third parties or use them to train our own models without your explicit permission.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-muted text-xs font-bold">4</span>
                  <h2 className="text-xl font-bold m-0">Public Sharing</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  If you choose to make a prompt &quot;Public&quot;, it will be accessible via a unique URL to anyone on the internet. You can revoke public access at any time by changing the prompt settings back to &quot;Private&quot;.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-muted text-xs font-bold">5</span>
                  <h2 className="text-xl font-bold m-0">Third-Party Services</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  We use trusted third-party providers for critical functions:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong className="text-foreground">Clerk:</strong> For secure authentication.</li>
                  <li><strong className="text-foreground">Convex:</strong> For real-time data storage and backend logic.</li>
                  <li><strong className="text-foreground">Vercel:</strong> For hosting and infrastructure.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-muted text-xs font-bold">6</span>
                  <h2 className="text-xl font-bold m-0">Your Rights</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  You have the right to access, correct, or delete your personal data. You can export your prompts or delete your account at any time through the dashboard settings.
                </p>
              </section>

              <section className="space-y-4 border-t border-border/40 pt-10">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-muted text-xs font-bold">7</span>
                  <h2 className="text-xl font-bold m-0">Contact Us</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions about this policy, please contact us at <a href="mailto:privacy@promptamist.com" className="text-primary hover:underline">privacy@promptamist.com</a>.
                </p>
              </section>
            </CardContent>
          </Card>

          {/* Footer Assistance */}
          <div className="text-center text-muted-foreground text-sm flex items-center justify-center gap-4">
            <p>Data concerns?</p>
            <Separator orientation="vertical" className="h-4" />
            <a href="mailto:privacy@promptamist.com" className="text-primary hover:underline font-medium">Privacy Center</a>
          </div>
        </div>
      </main>
    </div>
  );
}
