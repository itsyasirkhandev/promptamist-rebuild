import { Metadata } from 'next';

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
    <main className="max-w-4xl mx-auto py-20 px-4 prose dark:prose-invert">
      <h1>Terms of Service</h1>
      <p className="text-muted-foreground italic">Last Updated: May 3, 2026</p>

      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using Promptamist, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
      </section>

      <section>
        <h2>2. Use of Service</h2>
        <p>Promptamist provides tools to manage and organize AI prompts. You are responsible for the content you store and share. You must not use the service for any illegal or unauthorized purpose.</p>
      </section>

      <section>
        <h2>3. Intellectual Property</h2>
        <p>The prompts you create remain your property. However, by making a prompt "Public", you grant other users a non-exclusive license to view and copy that prompt for their own use.</p>
      </section>

      <section>
        <h2>4. Account Responsibility</h2>
        <p>You are responsible for maintaining the security of your account. Promptamist cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.</p>
      </section>

      <section>
        <h2>5. Termination</h2>
        <p>We reserve the right to terminate or suspend your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of the service.</p>
      </section>

      <section>
        <h2>6. Limitation of Liability</h2>
        <p>Promptamist is provided "as is" without any warranties. In no event shall Promptamist be liable for any damages arising out of the use or inability to use the service.</p>
      </section>

      <section>
        <h2>7. Changes to Terms</h2>
        <p>We may modify these terms at any time. Your continued use of the service after such modifications constitutes your acceptance of the new terms.</p>
      </section>
    </main>
  );
}
