import Link from 'next/link';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';

export function CTASection({
  className,
  description = 'Join AI power users who have already organized their prompt workflows with Promptamist. Free to start, no credit card required.',
}: {
  className?: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden px-4 py-32 text-center">
      <div className={cn('relative mx-auto max-w-3xl space-y-8', className)}>
        <h2 className="text-4xl font-semibold tracking-tight text-balance text-neutral-900 md:text-5xl dark:text-neutral-50">
          Your Prompt Library Awaits
        </h2>
        <p className="mx-auto max-w-xl text-lg text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
        <div className="flex justify-center">
          <Link href="/sign-up">
            <div className="group rounded-[14px] border-[1px] border-black/10 bg-gradient-to-b from-black/70 to-black p-[1px] transition duration-300 ease-in-out dark:border-[2px] dark:border-black dark:from-white dark:to-white/80">
              <div className="flex h-16 w-full min-w-[240px] items-center justify-center gap-3 rounded-[12px] bg-gradient-to-b from-neutral-800 to-black px-10 text-lg font-semibold text-white/90 transition duration-300 ease-in-out group-hover:from-stone-800 group-hover:to-neutral-800/70 active:bg-gradient-to-b active:from-black active:to-black dark:from-neutral-200 dark:to-neutral-50 dark:text-black/80 dark:hover:from-stone-200 dark:hover:to-neutral-200 dark:active:from-stone-300 dark:active:to-neutral-300">
                <Icon icon="lucide:sparkles" className="h-5 w-5" />
                Get Started for Free
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
