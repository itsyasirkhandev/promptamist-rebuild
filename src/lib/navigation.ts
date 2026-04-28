export interface NavigationItem {
  title: string;
  href: string;
  icon: string;
  requireAuth?: boolean;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    title: 'Home',
    href: '/',
    icon: 'lucide:home',
  },
  {
    title: 'Dashboard',
    href: '/prompts',
    icon: 'lucide:layout-dashboard',
    requireAuth: true,
  },
  {
    title: 'Workspace',
    href: '/use',
    icon: 'lucide:monitor-play',
    requireAuth: true,
  },
  {
    title: 'Create Prompt',
    href: '/prompts/create',
    icon: 'lucide:plus-circle',
    requireAuth: true,
  },
];
