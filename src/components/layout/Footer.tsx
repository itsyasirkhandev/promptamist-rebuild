import Link from 'next/link';
import { Logo } from '@/components/Logo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/#features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Public Prompts', href: '/prompts' },
      ],
    },
    {
      title: 'Solutions',
      links: [
        { label: 'Content Writing', href: '/solutions/content-writing' },
        { label: 'Software Dev', href: '/solutions/software-development' },
        { label: 'Marketing', href: '/solutions' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ],
    },
  ];

  return (
    <footer className="bg-neutral-50 dark:bg-stone-950 border-t border-neutral-200/60 dark:border-neutral-800/80 transition-colors duration-500">
      <div className="container mx-auto px-4 py-16 md:px-6">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="mb-6 flex items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-50"
            >
              <Logo className="h-7 w-7" />
              <span className="text-2xl tracking-tight">Promptamist</span>
            </Link>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-xs text-sm leading-relaxed">
              The intelligent prompt management platform for AI power users.
              Organize, template, and share your AI workflows.
            </p>
          </div>

          {sections.map((section) => (
            <div key={section.title} className="space-y-6">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-900 dark:text-neutral-50">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50 text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-neutral-200/60 dark:border-neutral-800/80 pt-8 md:flex-row">
          <p className="text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            © {currentYear} Promptamist. Built for the AI-first future.
          </p>
          <div className="flex gap-6">
            <a
              href="https://github.com/itsyasirkhandev/promptamist-rebuild"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50 transition-colors"
            >
              <span className="sr-only">GitHub</span>
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
