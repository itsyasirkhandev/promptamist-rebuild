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
    formButtonPrimary:
      'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all',
    formFieldInput:
      'border-input rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20',
    card: 'shadow-none border-none bg-transparent p-0',
    headerTitle: 'text-foreground font-bold text-xl',
    headerSubtitle: 'text-muted-foreground text-sm',
    socialButtonsBlockButton:
      'border-input rounded-xl hover:bg-accent transition-colors',
    footerActionLink:
      'text-primary hover:text-primary/80 text-sm font-semibold',
    formFieldLabel: 'text-foreground text-sm font-semibold',
    formResendCodeLink: 'text-primary hover:text-primary/80 text-sm',
    alertBox: 'border-destructive bg-destructive/10 text-destructive',
    footer: 'hidden', // Try to hide footer
  },
};
