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
      'bg-primary text-primary-foreground hover:bg-primary/90 shadow',
    formFieldInput: 'border-input rounded-md px-3 py-2 text-sm',
    card: 'shadow-lg border-border rounded-lg',
    headerTitle: 'text-foreground font-semibold',
    headerSubtitle: 'text-muted-foreground text-sm',
    socialButtonsBlockButton: 'border-input hover:bg-accent',
    footerActionLink:
      'text-primary hover:text-primary/80 text-sm font-semibold',
    formFieldLabel: 'text-foreground text-sm font-semibold',
    formResendCodeLink: 'text-primary hover:text-primary/80 text-sm',
    alertBox: 'border-destructive bg-destructive/10 text-destructive',
  },
};
