import type { Appearance } from '@clerk/types';

export const clerkAppearance: Appearance = {
  variables: {
    colorPrimary: 'var(--primary)',
    colorBackground: 'var(--background)',
    colorInputBackground: 'var(--background)',
    colorInputText: 'var(--foreground)',
    colorTextOnPrimaryBackground: 'var(--primary-foreground)',
    fontFamily: 'var(--font-sans), sans-serif',
  },
  elements: {
    rootBox: 'w-full',
    cardBox: 'w-full !shadow-none',
    card: 'shadow-none border-none bg-transparent p-0 w-full !shadow-none !bg-transparent',
    main: 'w-full bg-transparent',
    navbar: 'bg-transparent',
    header: 'bg-transparent',
    footer: 'hidden',
    formButtonPrimary:
      'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all h-11 rounded-xl',
    formFieldInput:
      'border-input rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 h-11',
    headerTitle:
      'text-foreground font-bold text-2xl tracking-tight text-center',
    headerSubtitle: 'text-muted-foreground text-sm text-center',
    socialButtonsBlockButton:
      'border-input rounded-xl hover:bg-accent transition-colors h-11 bg-transparent',
    footerActionLink:
      'text-primary hover:text-primary/80 text-sm font-semibold',
    formFieldLabel: 'text-foreground text-sm font-semibold mb-1',
    formResendCodeLink: 'text-primary hover:text-primary/80 text-sm',
    alertBox: 'border-destructive bg-destructive/10 text-destructive',
  },
};
