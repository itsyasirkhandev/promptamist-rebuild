import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(
  date: Date | number | string,
  locale: string = 'en',
): string {
  const timeMs = new Date(date).getTime();
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);

  const cutoffs = [
    { unit: 'year', amount: 31536000 },
    { unit: 'month', amount: 2592000 },
    { unit: 'week', amount: 604800 },
    { unit: 'day', amount: 86400 },
    { unit: 'hour', amount: 3600 },
    { unit: 'minute', amount: 60 },
    { unit: 'second', amount: 1 },
  ] as const;

  if (Math.abs(deltaSeconds) < 30) {
    return 'just now';
  }

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  for (const cutoff of cutoffs) {
    if (Math.abs(deltaSeconds) >= cutoff.amount || cutoff.unit === 'second') {
      const value = Math.round(deltaSeconds / cutoff.amount);
      return rtf.format(value, cutoff.unit);
    }
  }
  return '';
}
