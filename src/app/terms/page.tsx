import { Metadata } from 'next';
import {
  LegalPageLayout,
  LegalSection,
} from '@/components/layout/LegalPageLayout';

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
    <LegalPageLayout
      labelIcon="lucide:scroll-text"
      label="Legal Framework"
      title="Terms of Service"
      lastUpdated="May 3, 2026"
      documentIcon="lucide:file-text"
      documentTitle="Platform Agreement"
      footerMessage="Questions about our terms?"
      footerLinkHref="mailto:support@promptamist.com"
      footerLinkText="Contact Support"
    >
      <LegalSection number="01" title="Acceptance of Terms">
        <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          By accessing or using Promptamist, you agree to be bound by these
          Terms of Service. If you do not agree to these terms, please do not
          use our service.
        </p>
      </LegalSection>

      <LegalSection number="02" title="Use of Service">
        <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          Promptamist provides tools to manage and organize AI prompts. You are
          responsible for the content you store and share. You must not use the
          service for any illegal or unauthorized purpose.
        </p>
      </LegalSection>

      <LegalSection number="03" title="Intellectual Property">
        <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          The prompts you create remain your property. However, by making a
          prompt &quot;Public&quot;, you grant other users a non-exclusive
          license to view and copy that prompt for their own use.
        </p>
      </LegalSection>

      <LegalSection number="04" title="Account Responsibility">
        <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          You are responsible for maintaining the security of your account.
          Promptamist cannot and will not be liable for any loss or damage from
          your failure to comply with this security obligation.
        </p>
      </LegalSection>

      <LegalSection number="05" title="Termination">
        <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          We reserve the right to terminate or suspend your account at our sole
          discretion, without notice, for conduct that we believe violates these
          Terms or is harmful to other users of the service.
        </p>
      </LegalSection>

      <LegalSection number="06" title="Limitation of Liability">
        <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          Promptamist is provided &quot;as is&quot; without any warranties. In
          no event shall Promptamist be liable for any damages arising out of
          the use or inability to use the service.
        </p>
      </LegalSection>

      <LegalSection
        number="07"
        title="Changes to Terms"
        className="border-t border-neutral-200 pt-16 dark:border-neutral-800"
      >
        <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          We may modify these terms at any time. Your continued use of the
          service after such modifications constitutes your acceptance of the
          new terms.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
