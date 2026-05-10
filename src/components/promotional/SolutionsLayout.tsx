import { ReactNode } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { TextureCard } from '@/components/ui/TextureCard';

interface Feature {
  title: string;
  desc: string;
  icon: string;
}

interface SolutionsLayoutProps {
  heroBadgeIcon: string;
  heroBadgeText: string;
  heroTitle: ReactNode;
  heroDescription: ReactNode;
  heroButtonText: string;
  featureDetail: ReactNode;
  featuresTitle: string;
  featuresSubtitle: string;
  featuresList: Feature[];
  ctaTitle: string;
  ctaButtonText: string;
}

export function SolutionsLayout({
  heroBadgeIcon,
  heroBadgeText,
  heroTitle,
  heroDescription,
  heroButtonText,
  featureDetail,
  featuresTitle,
  featuresSubtitle,
  featuresList,
  ctaTitle,
  ctaButtonText,
}: SolutionsLayoutProps) {
  return (
    <div className="relative min-h-screen bg-neutral-50 transition-colors duration-500 dark:bg-stone-950">
      {/* Premium Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[1000px] w-full max-w-7xl -translate-x-1/2">
          <div className="absolute top-[-10%] left-[20%] h-[500px] w-[500px] rounded-full bg-neutral-200/50 blur-[120px] dark:bg-stone-800/20" />
          <div className="absolute top-[10%] right-[20%] h-[400px] w-[400px] rounded-full bg-neutral-300/30 blur-[100px] dark:bg-neutral-900/30" />
        </div>
      </div>

      <main className="relative z-10 flex-1">
        <section className="relative overflow-hidden px-4 py-24 text-center md:py-36">
          <div className="relative mx-auto max-w-4xl">
            <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/50 px-3 py-1 text-[min(2.8vw,12px)] font-bold tracking-[0.1em] text-neutral-600 uppercase sm:px-4 sm:py-1.5 sm:text-xs sm:tracking-[0.2em] dark:border-neutral-800 dark:bg-stone-900/50 dark:text-neutral-400">
              <Icon icon={heroBadgeIcon} className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap">{heroBadgeText}</span>
            </div>

            <h1 className="mb-8 text-5xl leading-[1.05] font-bold tracking-tight text-balance text-neutral-900 sm:text-7xl md:text-8xl dark:text-neutral-50">
              {heroTitle}
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-pretty text-neutral-600 md:text-xl dark:text-neutral-400">
              {heroDescription}
            </p>

            <div className="mt-14 flex justify-center">
              <Link href="/sign-up">
                <div className="group rounded-[18px] border-[1px] border-black/10 bg-gradient-to-b from-black/70 to-black p-[1px] shadow-2xl transition duration-300 ease-in-out dark:border-[2px] dark:border-black dark:from-white dark:to-white/80">
                  <div className="flex h-16 w-full min-w-[280px] items-center justify-center gap-3 rounded-[16px] bg-gradient-to-b from-neutral-800 to-black px-12 text-xl font-bold text-white/90 transition duration-300 ease-in-out group-hover:from-stone-800 group-hover:to-neutral-800/70 dark:from-neutral-200 dark:to-neutral-50 dark:text-black/80">
                    {heroButtonText}
                    <Icon icon="lucide:arrow-right" className="h-6 w-6" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className="relative bg-white px-4 py-24 md:py-40 dark:bg-neutral-900/30">
          <div className="relative mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
            {featureDetail}
          </div>
        </section>

        <section className="px-4 py-24 md:py-40">
          <div className="mx-auto max-w-6xl">
            <div className="mb-24 text-center">
              <h2 className="mb-6 text-4xl font-bold tracking-tight text-neutral-900 md:text-6xl dark:text-neutral-50">
                {featuresTitle}
              </h2>
              <p className="mx-auto max-w-2xl text-xl text-neutral-600 dark:text-neutral-400">
                {featuresSubtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
              {featuresList.map((f) => (
                <TextureCard
                  key={f.title}
                  className="group/card transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="p-8">
                    <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-white/80 text-neutral-900 shadow-sm transition-transform duration-500 group-hover/card:scale-110 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
                      <Icon icon={f.icon} className="h-7 w-7" />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      {f.title}
                    </h3>
                    <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {f.desc}
                    </p>
                  </div>
                </TextureCard>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-4 py-32 text-center md:py-48">
          <div className="relative mx-auto max-w-3xl space-y-10">
            <h2 className="text-4xl font-bold tracking-tight text-neutral-900 md:text-6xl dark:text-neutral-50">
              {ctaTitle}
            </h2>
            <div className="flex justify-center pt-8">
              <Link href="/sign-up">
                <div className="group rounded-[18px] border-[1px] border-black/10 bg-gradient-to-b from-black/70 to-black p-[1px] shadow-2xl transition duration-300 ease-in-out dark:border-[2px] dark:border-black dark:from-white dark:to-white/80">
                  <div className="flex h-16 w-full min-w-[280px] items-center justify-center gap-3 rounded-[16px] bg-gradient-to-b from-neutral-800 to-black px-12 text-xl font-bold text-white/90 transition duration-300 ease-in-out group-hover:from-stone-800 group-hover:to-neutral-800/70 dark:from-neutral-200 dark:to-neutral-50 dark:text-black/80">
                    {ctaButtonText}
                    <Icon icon="lucide:arrow-right" className="h-6 w-6" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
