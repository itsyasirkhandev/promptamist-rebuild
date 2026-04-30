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

const geistHeading = Geist({ subsets: ['latin'], variable: '--font-heading' });

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' });

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://repromptamist.vercel.app'),
  title: {
    default: 'Organize & Test Your AI Prompts | Promptamist',
    template: '%s | Promptamist',
  },
  description:
    'Stop losing your best AI prompts in endless chat logs. We built Promptamist so you can easily organize, test, and find the exact prompt you need.',
  keywords: [
    'AI prompts',
    'prompt engineering',
    'prompt management',
    'AI workflow',
    'prompt optimization',
    'Promptamist',
  ],
  authors: [{ name: 'Promptamist Team' }],
  creator: 'Promptamist',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://repromptamist.vercel.app',
    siteName: 'Promptamist',
    title: 'Organize & Test Your AI Prompts | Promptamist',
    description:
      'Stop losing your best AI prompts in endless chat logs. We built Promptamist so you can easily organize, test, and find the exact prompt you need.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Organize & Test Your AI Prompts | Promptamist',
    description:
      'Stop losing your best AI prompts in endless chat logs. We built Promptamist so you can easily organize, test, and find the exact prompt you need.',
  },
  robots: {
    index: true,
    follow: true,
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
