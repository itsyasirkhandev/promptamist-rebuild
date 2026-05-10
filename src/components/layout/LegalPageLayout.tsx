import { ReactNode } from 'react';
import { Icon } from '@iconify/react';
import { TextureCard } from '@/components/ui/TextureCard';
import { cn } from '@/lib/utils';

export interface LegalPageLayoutProps {
  labelIcon: string;
  label: string;
  title: string;
  lastUpdated: string;
  documentIcon: string;
  documentTitle: string;
  children: ReactNode;
  footerMessage: string;
  footerLinkHref: string;
  footerLinkText: string;
}

export function LegalPageLayout({
  labelIcon,
  label,
  title,
  lastUpdated,
  documentIcon,
  documentTitle,
  children,
  footerMessage,
  footerLinkHref,
  footerLinkText,
}: LegalPageLayoutProps) {
  return (
    <div className="relative min-h-screen bg-neutral-50 transition-colors duration-500 dark:bg-stone-950">
      {/* Premium Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[1000px] w-full max-w-7xl -translate-x-1/2">
          <div className="absolute top-[-10%] left-[20%] h-[500px] w-[500px] rounded-full bg-neutral-200/50 blur-[120px] dark:bg-stone-800/20" />
          <div className="absolute top-[10%] right-[20%] h-[400px] w-[400px] rounded-full bg-neutral-300/30 blur-[100px] dark:bg-neutral-900/30" />
        </div>
      </div>

      <main className="relative z-10 px-4 py-24 md:py-36">
        <div className="mx-auto max-w-4xl space-y-20">
          {/* Header Section */}
          <div className="text-center">
            <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/50 px-3 py-1 text-[min(2.8vw,12px)] font-bold tracking-[0.1em] text-neutral-600 uppercase sm:px-4 sm:py-1.5 sm:text-xs sm:tracking-[0.2em] dark:border-neutral-800 dark:bg-stone-900/50 dark:text-neutral-400">
              <Icon icon={labelIcon} className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap">{label}</span>
            </div>
            <h1 className="mb-8 text-5xl leading-[1.05] font-bold tracking-tight text-balance text-neutral-900 sm:text-7xl dark:text-neutral-50">
              {title}
            </h1>
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-neutral-500">
              <Icon icon="lucide:calendar" className="h-4 w-4" />
              <span>Last Updated: {lastUpdated}</span>
            </div>
          </div>

          {/* Document Content */}
          <TextureCard className="group p-2">
            <div className="space-y-16 p-8 md:p-12 lg:p-16">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-900 shadow-sm transition-transform group-hover:scale-110 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                  <Icon icon={documentIcon} className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                  {documentTitle}
                </h2>
              </div>

              <div className="prose prose-neutral dark:prose-invert max-w-none space-y-16">
                {children}
              </div>
            </div>
          </TextureCard>

          {/* Footer Assistance */}
          <div className="flex flex-col items-center justify-center gap-6 py-10 text-center text-sm font-medium text-neutral-500 md:flex-row">
            <p>{footerMessage}</p>
            <div className="hidden h-4 w-px bg-neutral-300 md:block dark:bg-neutral-700" />
            <a
              href={footerLinkHref}
              className="font-bold text-neutral-900 decoration-2 underline-offset-4 hover:underline dark:text-neutral-50"
            >
              {footerLinkText}
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

interface LegalSectionProps {
  number: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export function LegalSection({
  number,
  title,
  children,
  className,
}: LegalSectionProps) {
  return (
    <section className={cn('space-y-6', className)}>
      <div className="flex items-center gap-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-xs font-bold text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900">
          {number}
        </span>
        <h3 className="m-0 text-xl font-bold tracking-tight">{title}</h3>
      </div>
      {children}
    </section>
  );
}
