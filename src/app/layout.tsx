import type { Metadata } from 'next';
import { Geist, Geist_Mono, Figtree } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { shadcn } from '@clerk/themes';
import ConvexClientProvider from '@/components/ConvexClientProvider';
import { AppLayout } from '@/components/layout/AppLayout';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ThemeProvider';
import { clerkAppearance } from '@/lib/clerk-appearance';
import { PromoBanner } from '@/components/promotional/PromoBanner';

const geistHeading = Geist({ subsets: ['latin'], variable: '--font-heading' });

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' });

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://repromptamist.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Promptamist — Organize, Test & Share AI Prompts',
    template: '%s | Promptamist',
  },
  description:
    'Promptamist is the intelligent prompt management platform for AI power users. Organize your ChatGPT, Claude, and Gemini prompts, build reusable templates with dynamic variables, and share prompts publicly — all in one workspace.',
  keywords: [
    'AI prompt manager',
    'prompt engineering tool',
    'prompt management platform',
    'ChatGPT prompt organizer',
    'Claude prompt templates',
    'Gemini prompt library',
    'AI workflow automation',
    'prompt template builder',
    'prompt optimization',
    'dynamic prompt variables',
    'prompt sharing',
    'AI productivity tool',
    'prompt library',
    'LLM prompt manager',
    'Promptamist',
  ],
  authors: [{ name: 'Promptamist Team', url: BASE_URL }],
  creator: 'Promptamist',
  publisher: 'Promptamist',
  category: 'Technology',
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Promptamist',
    title: 'Promptamist — Organize, Test & Share AI Prompts',
    description:
      'Promptamist is the intelligent prompt management platform for AI power users. Organize your ChatGPT, Claude, and Gemini prompts, build reusable templates with dynamic variables, and share prompts publicly.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Promptamist — AI Prompt Management Platform',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@promptamist',
    creator: '@promptamist',
    title: 'Promptamist — Organize, Test & Share AI Prompts',
    description:
      'The intelligent prompt management platform for AI power users. Organize, template, and share your ChatGPT, Claude & Gemini prompts.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        'h-full',
        'antialiased',
        figtree.variable,
        geistHeading.variable,
        geistMono.variable,
        'font-sans',
      )}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PromoBanner />
          <ClerkProvider
            appearance={{
              ...clerkAppearance,
              baseTheme: shadcn,
            }}
          >
            <ConvexClientProvider>
              <TooltipProvider>
                <AppLayout>{children}</AppLayout>
                <Toaster />
              </TooltipProvider>
            </ConvexClientProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
