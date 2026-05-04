import type { Appearance } from '@clerk/types';

export const clerkAppearance: Appearance = {
  variables: {
    colorPrimary: 'var(--primary)',
    colorBackground: 'var(--background)',
    colorInputBackground: 'var(--background)',
    colorInputText: 'var(--foreground)',
    colorTextOnPrimaryBackground: 'var(--primary-foreground)',
    fontFamily: 'var(--font-sans), sans-serif',
    borderRadius: '0.375rem',
  },
  elements: {
    rootBox: 'w-full',
    cardBox: 'w-full !shadow-none !border-none !bg-transparent',
    card: 'shadow-none border-none bg-transparent p-0 w-full !shadow-none !bg-transparent',
    main: 'w-full bg-transparent gap-4',
    navbar: 'hidden',
    header: 'hidden',
    footer: 'hidden',
    socialButtonsBlockButton:
      'flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium shadow-xs transition-all hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-9',
    socialButtonsBlockButtonText: 'font-medium',
    socialButtonsBlockButtonArrow: 'hidden',
    dividerRow: 'relative w-full my-2',
    dividerLine: 'absolute inset-0 flex items-center border-t border-muted-foreground/20',
    dividerText:
      'relative flex justify-center text-xs uppercase bg-white dark:bg-card px-2 text-muted-foreground',
    formButtonPrimary:
      'flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium shadow-xs transition-all hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-9',
    formFieldInput:
      'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
    formFieldLabel: 'text-sm font-medium leading-none mb-2 block',
    footerAction: 'hidden',
    identityPreview: 'hidden',
  },
};
