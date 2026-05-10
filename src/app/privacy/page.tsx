import { Metadata } from 'next';
import {
  LegalPageLayout,
  LegalSection,
} from '@/components/layout/LegalPageLayout';

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
    <LegalPageLayout
      labelIcon="lucide:shield-check"
      label="Security & Privacy"
      title="Privacy Policy"
      lastUpdated="May 3, 2026"
      documentIcon="lucide:shield"
      documentTitle="Data Protection Commitment"
      footerMessage="Need more details about your data?"
      footerLinkHref="mailto:privacy@promptamist.com"
      footerLinkText="Visit Privacy Center"
    >
      <LegalSection number="01" title="Introduction">
        <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          At Promptamist, we take your privacy seriously. This policy explains
          how we collect, use, and protect your information when you use our
          prompt management platform.
        </p>
      </LegalSection>

      <LegalSection number="02" title="Data Collection">
        <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          We collect information that you provide directly to us, including:
        </p>
        <ul className="space-y-4 text-lg text-neutral-600 dark:text-neutral-400">
          <li>
            <strong className="font-bold text-neutral-900 dark:text-neutral-100">
              Account Information:
            </strong>{' '}
            Name, email address, and authentication data provided via Clerk.
          </li>
          <li>
            <strong className="font-bold text-neutral-900 dark:text-neutral-100">
              Content:
            </strong>{' '}
            The AI prompts, templates, and tags you create and store in our
            platform.
          </li>
          <li>
            <strong className="font-bold text-neutral-900 dark:text-neutral-100">
              Usage Data:
            </strong>{' '}
            Information about how you interact with our service.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="03" title="How We Use Your Data">
        <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          Your data is used to provide, maintain, and improve our services. We
          do{' '}
          <strong className="font-bold text-neutral-900 dark:text-neutral-100">
            not
          </strong>{' '}
          sell your prompts to third parties or use them to train our own models
          without your explicit permission.
        </p>
      </LegalSection>

      <LegalSection number="04" title="Public Sharing">
        <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          If you choose to make a prompt &quot;Public&quot;, it will be
          accessible via a unique URL to anyone on the internet. You can revoke
          public access at any time by changing the prompt settings back to
          &quot;Private&quot;.
        </p>
      </LegalSection>

      <LegalSection number="05" title="Third-Party Services">
        <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          We use trusted third-party providers for critical functions:
        </p>
        <ul className="space-y-4 text-lg text-neutral-600 dark:text-neutral-400">
          <li>
            <strong className="font-bold text-neutral-900 dark:text-neutral-100">
              Clerk:
            </strong>{' '}
            For secure authentication.
          </li>
          <li>
            <strong className="font-bold text-neutral-900 dark:text-neutral-100">
              Convex:
            </strong>{' '}
            For real-time data storage and backend logic.
          </li>
          <li>
            <strong className="font-bold text-neutral-900 dark:text-neutral-100">
              Vercel:
            </strong>{' '}
            For hosting and infrastructure.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="06" title="Your Rights">
        <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          You have the right to access, correct, or delete your personal data.
          You can export your prompts or delete your account at any time through
          the dashboard settings.
        </p>
      </LegalSection>

      <LegalSection
        number="07"
        title="Contact Us"
        className="border-t border-neutral-200 pt-16 dark:border-neutral-800"
      >
        <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          If you have questions about this policy, please contact us at{' '}
          <a
            href="mailto:privacy@promptamist.com"
            className="font-bold text-neutral-900 decoration-2 underline-offset-4 hover:underline dark:text-neutral-50"
          >
            privacy@promptamist.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
