import { Metadata } from 'next';

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
    <main className="max-w-4xl mx-auto py-20 px-4 prose dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p className="text-muted-foreground italic">Last Updated: May 3, 2026</p>
      
      <section>
        <h2>1. Introduction</h2>
        <p>At Promptamist, we take your privacy seriously. This policy explains how we collect, use, and protect your information when you use our prompt management platform.</p>
      </section>

      <section>
        <h2>2. Data Collection</h2>
        <p>We collect information that you provide directly to us, including:</p>
        <ul>
          <li><strong>Account Information:</strong> Name, email address, and authentication data provided via Clerk.</li>
          <li><strong>Content:</strong> The AI prompts, templates, and tags you create and store in our platform.</li>
          <li><strong>Usage Data:</strong> Information about how you interact with our service.</li>
        </ul>
      </section>

      <section>
        <h2>3. How We Use Your Data</h2>
        <p>Your data is used to provide, maintain, and improve our services. We do <strong>not</strong> sell your prompts to third parties or use them to train our own models without your explicit permission.</p>
      </section>

      <section>
        <h2>4. Public Sharing</h2>
        <p>If you choose to make a prompt "Public", it will be accessible via a unique URL to anyone on the internet. You can revoke public access at any time by changing the prompt settings back to "Private".</p>
      </section>

      <section>
        <h2>5. Third-Party Services</h2>
        <p>We use trusted third-party providers for critical functions:</p>
        <ul>
          <li><strong>Clerk:</strong> For secure authentication.</li>
          <li><strong>Convex:</strong> For real-time data storage and backend logic.</li>
          <li><strong>Vercel:</strong> For hosting and infrastructure.</li>
        </ul>
      </section>

      <section>
        <h2>6. Your Rights</h2>
        <p>You have the right to access, correct, or delete your personal data. You can export your prompts or delete your account at any time through the dashboard settings.</p>
      </section>

      <section>
        <h2>7. Contact Us</h2>
        <p>If you have questions about this policy, please contact us at privacy@promptamist.com.</p>
      </section>
    </main>
  );
}
