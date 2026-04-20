'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { NAVIGATION_ITEMS } from '@/lib/navigation';

export function MobileBottomNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'bg-background border-border border-t lg:hidden',
        'pb-safe fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center justify-around px-4',
        className,
      )}
    >
      {NAVIGATION_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex h-full flex-1 flex-col items-center justify-center gap-1 transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            <Icon icon={item.icon} className="h-6 w-6" />
            <span className="text-[10px] font-medium tracking-tight">
              {item.title}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
