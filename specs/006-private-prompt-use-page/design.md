# Technical Design: Private Prompt Use Page Enhancements

This document outlines the technical implementation plan for adding a prompt switching mechanism (sidebar on desktop, switcher on mobile) to the private prompt "use" page.

## 1. Objective

Enable users to switch between their private template prompts seamlessly while using the dynamic form, improving workflow efficiency without requiring navigation back to the main dashboard.

## 2. Component Architecture

We will introduce a new set of components in `src/components/prompts/use/` to handle the prompt selection UI.

### New Components

1.  **`PromptUseLayout` (`src/components/prompts/use/PromptUseLayout.tsx`)**
    - **Purpose**: A wrapper component for the "use" page that provides the responsive layout structure.
    - **Features**:
      - Handles the desktop grid layout (Sidebar + Main Content).
      - Provides a mobile-specific header or trigger for the switcher.
      - Accepts `activeId` and `children` (the main form).
      - Fetches the list of prompts to pass down to Sidebar and Switcher.

2.  **`PromptUseSidebar` (`src/components/prompts/use/PromptUseSidebar.tsx`)**
    - **Purpose**: A vertical list of template prompts for desktop view.
    - **Features**:
      - Displays titles of all user's template prompts.
      - Highlights the currently active prompt.
      - Search input for filtering prompts if the list is long.
      - Uses `ScrollArea` for overflow handling.
      - Uses `Link` for navigation to ensure smooth transitions.

3.  **`PromptUseMobileSwitcher` (`src/components/prompts/use/PromptUseMobileSwitcher.tsx`)**
    - **Purpose**: A mobile-optimized selection tool.
    - **Features**:
      - Implemented as a `Select` component or a `Sheet` with a list.
      - Displays the current prompt title as the trigger label.
      - Visible only on small screens (below `lg` breakpoint).

### Modifications to Existing Files

1.  **`src/app/(protected)/prompts/[id]/use/page.tsx`**
    - Wrap the existing page content with `PromptUseLayout`.
    - Move some of the header logic into the layout or components for consistency.

## 3. Directory Structure

```text
src/
└── components/
    └── prompts/
        └── use/
            ├── PromptUseLayout.tsx
            ├── PromptUseSidebar.tsx
            └── PromptUseMobileSwitcher.tsx
```

## 4. Component Details & Code Snippets

### A. PromptUseSidebar.tsx

```tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Doc } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PromptUseSidebarProps {
  prompts: Doc<'prompts'>[];
  activeId: string;
}

export function PromptUseSidebar({ prompts, activeId }: PromptUseSidebarProps) {
  const [search, setSearch] = React.useState('');

  const filteredPrompts = prompts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-card flex hidden h-full w-64 flex-col border-r lg:flex">
      <div className="border-b p-4">
        <h2 className="mb-2 px-2 font-semibold">Your Templates</h2>
        <div className="relative">
          <Icon
            icon="lucide:search"
            className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4"
          />
          <Input
            placeholder="Search..."
            className="h-9 pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {filteredPrompts.map((p) => (
            <Link
              key={p._id}
              href={`/prompts/${p._id}/use`}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                p._id === activeId
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'hover:bg-accent text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon icon="lucide:file-text" className="h-4 w-4 shrink-0" />
              <span className="truncate">{p.title}</span>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
```

### B. PromptUseMobileSwitcher.tsx

```tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Doc } from '@/convex/_generated/dataModel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PromptUseMobileSwitcherProps {
  prompts: Doc<'prompts'>[];
  activeId: string;
}

export function PromptUseMobileSwitcher({
  prompts,
  activeId,
}: PromptUseMobileSwitcherProps) {
  const router = useRouter();

  return (
    <div className="bg-background sticky top-0 z-10 w-full border-b px-4 py-2 lg:hidden">
      <Select
        value={activeId}
        onValueChange={(id) => router.push(`/prompts/${id}/use`)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a prompt" />
        </SelectTrigger>
        <SelectContent>
          {prompts.map((p) => (
            <SelectItem key={p._id} value={p._id}>
              {p.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
```

### C. PromptUseLayout.tsx

```tsx
'use client';

import * as React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { PromptUseSidebar } from './PromptUseSidebar';
import { PromptUseMobileSwitcher } from './PromptUseMobileSwitcher';
import { Skeleton } from '@/components/ui/skeleton';

interface PromptUseLayoutProps {
  activeId: string;
  children: React.ReactNode;
}

export function PromptUseLayout({ activeId, children }: PromptUseLayoutProps) {
  const prompts = useQuery(api.authed.prompts.getPrompts);

  const templatePrompts = prompts?.filter((p) => p.isTemplate) ?? [];

  if (prompts === undefined) {
    return (
      <div className="flex h-full">
        <Skeleton className="hidden h-full w-64 lg:block" />
        <div className="flex-1 p-4">
          <Skeleton className="mb-4 h-10 w-full lg:hidden" />
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <PromptUseSidebar prompts={templatePrompts} activeId={activeId} />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <PromptUseMobileSwitcher
          prompts={templatePrompts}
          activeId={activeId}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
```

## 5. Data Fetching & State Management

- **Prompt List**: Use `useQuery(api.authed.prompts.getPrompts)` in `PromptUseLayout`.
- **Filtering**: The list should be filtered on the client to show only prompts where `isTemplate === true`.
- **Active Prompt**: Derived from the URL `id` parameter.
- **Navigation**: Standard Next.js `Link` navigation to `/prompts/[id]/use`.

## 4. Responsive Design Strategy

- **Desktop (`lg` and up)**:
  - Three-column structure:
    1.  App Sidebar (Existing).
    2.  `PromptUseSidebar` (New, width ~280px).
    3.  Main Content (Variables Form | Live Preview).
- **Mobile (< `lg`)**:
  - The `PromptUseSidebar` is hidden.
  - A compact header is added above the Variables/Preview tabs containing the `PromptUseMobileSwitcher`.
  - Main Content remains in the mobile tabbed view.

## 5. UI/UX Details

### Sidebar Item

```tsx
<Link
  href={`/prompts/${p._id}/use`}
  className={cn(
    'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
    isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary',
  )}
>
  <Icon icon="lucide:file-text" width={16} />
  <span className="truncate">{p.title}</span>
</Link>
```

### Mobile Switcher Trigger

```tsx
<Select
  value={activeId}
  onValueChange={(id) => router.push(`/prompts/${id}/use`)}
>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Switch Prompt..." />
  </SelectTrigger>
  <SelectContent>
    {templatePrompts.map((p) => (
      <SelectItem key={p._id} value={p._id}>
        {p.title}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

## 6. Detailed Implementation Steps

### Step 1: Create the PromptUseSidebar component

Implement the desktop sidebar with search functionality.

### Step 2: Create the PromptUseMobileSwitcher component

Implement the mobile dropdown selection.

### Step 3: Create the PromptUseLayout component

Combine the sidebar and main content into a responsive layout.

### Step 4: Update the Use page

Integrate `PromptUseLayout` into `src/app/(protected)/prompts/[id]/use/page.tsx`.

### Step 5: Refine Styles

Ensure the transition between prompts is smooth and the layout handles long titles gracefully.

## 7. Performance Considerations

- The prompt list is small (capped at 100 in the query), so client-side filtering and rendering will be very fast.
- Convex will cache the prompt list query, so switching prompts will not trigger redundant database fetches for the list itself.

## 8. Safety & Edge Cases

- **No other templates**: If the user has only one template, the sidebar/switcher still shows it (indicated as active).
- **Deleted prompt**: If a user navigates to an ID that was just deleted, the existing error handling in `UseTemplatePage` (returning "Prompt not found") will trigger.
