# Technical Design Plan: Prompt "Use" Page Optimization

## 1. Overview and Objective

The goal of this optimization is to eliminate the jarring full-page skeleton loading states when a user navigates between different dynamic prompts on the "Use" page. By restructuring the Next.js layout and leveraging Convex's caching and prefetching capabilities, we will ensure that the sidebar remains persistent, interactive, and visually stable, while the prompt form transitions smoothly.

## 2. Root Cause Analysis

Currently, the `PromptUseLayout` component (which renders the sidebar and mobile switcher) is manually instantiated inside the page component `src/app/(protected)/prompts/[id]/use/page.tsx` as a wrapper around the form content.
When a user navigates to a new prompt, `page.tsx` calls `useQuery(api.authed.prompts.getPromptById)`. Because the new data isn't loaded yet, `prompt === undefined`, triggering an early return:

```tsx
if (prompt === undefined) {
  return <FullPageSkeleton />; // This does NOT include PromptUseLayout!
}
```

This early return causes the entire `PromptUseLayout` (including the sidebar) to completely unmount, replacing the whole screen with a skeleton. Once the query resolves, the layout remounts.

## 3. Architecture & Implementation Steps

### Step 1: Extract Sidebar into a True Next.js Layout

To ensure the sidebar persists across dynamic route navigations, we must utilize Next.js's native layout system.

1. **Create `src/app/(protected)/prompts/[id]/use/layout.tsx`**
   - Create a new layout file that simply wraps its children with `PromptUseLayout`.
   - **Code Example:**

     ```tsx
     import { PromptUseLayout } from '@/components/prompts/use/PromptUseLayout';

     export default function UseTemplateLayout({
       children,
     }: {
       children: React.ReactNode;
     }) {
       return <PromptUseLayout>{children}</PromptUseLayout>;
     }
     ```

2. **Refactor `PromptUseLayout` to use `useParams`**
   - Update `src/components/prompts/use/PromptUseLayout.tsx` to read the `activeId` directly from the URL using Next.js client hooks, rather than relying on a prop passed from a Server Component. This guarantees the active state highlights instantaneously upon navigation.
   - **Code Changes:**

     ```tsx
     import { useParams } from 'next/navigation';

     // Remove activeId from Props
     interface PromptUseLayoutProps {
       children: React.ReactNode;
     }

     export function PromptUseLayout({ children }: PromptUseLayoutProps) {
       const params = useParams();
       const activeId = params.id as string;
       // ... existing code ...
     }
     ```

### Step 2: Implement Localized Loading State in the Page Component

Now that the layout wraps the page, `page.tsx` should only be responsible for its own localized loading state.

1. **Update `src/app/(protected)/prompts/[id]/use/page.tsx`**
   - Remove the `<PromptUseLayout>` wrapper from the final `return` statement.
   - Update the `if (prompt === undefined)` loading block to only render the skeleton for the form and preview areas, structured to fit within the `main` container provided by the layout.
   - **Code Changes:**
     ```tsx
     if (prompt === undefined) {
       return (
         <div className="flex h-full flex-col">
           {/* Localized Breadcrumb Skeleton */}
           <div className="border-b px-4 py-3 lg:px-6">
             <Skeleton className="h-6 w-48" />
           </div>
           {/* Localized Form/Preview Skeletons */}
           <div className="hidden flex-1 grid-cols-1 gap-0 lg:grid lg:grid-cols-2">
             <div className="border-r p-6">
               <Skeleton className="h-[400px] w-full" />
             </div>
             <div className="p-6">
               <Skeleton className="h-[400px] w-full" />
             </div>
           </div>
           {/* Mobile skeleton fallback */}
           <div className="flex-1 p-4 lg:hidden">
             <Skeleton className="h-[400px] w-full" />
           </div>
         </div>
       );
     }
     ```

### Step 3: Implement Convex Prefetching on Hover

To satisfy the requirement of near-instantaneous loading when clicking a prompt, we will prefetch the prompt data when the user hovers over the sidebar links.

1. **Update `src/components/prompts/use/PromptUseSidebar.tsx` and `PromptUseMobileSwitcher.tsx`**
   - Import `useConvex` from `convex/react`.
   - Access the Convex client: `const convex = useConvex();`
   - Add `onMouseEnter` (and `onFocus` for accessibility) handlers to the `<Link>` elements.
   - **Code Changes:**

     ```tsx
     import { useConvex } from 'convex/react';
     import { api } from '../../../../convex/_generated/api';
     import { Id } from '../../../../convex/_generated/dataModel';

     export function PromptUseSidebar({ prompts, activeId }: PromptUseSidebarProps) {
       const convex = useConvex();
       // ...

       const prefetchPrompt = (id: string) => {
         convex.query(api.authed.prompts.getPromptById, { id: id as Id<'prompts'> });
       };

       // Inside the map function:
       <Link
         key={p._id}
         href={`/prompts/${p._id}/use`}
         onMouseEnter={() => prefetchPrompt(p._id)}
         onFocus={() => prefetchPrompt(p._id)}
         className={...}
       >
     ```

   - This populates the Convex client-side cache. When the route transitions and the new `page.tsx` mounts, `useQuery` will immediately return the cached data instead of `undefined`, completely bypassing the localized skeleton in most scenarios.

## 4. Edge Cases and Error Handling

- **Slow Network:** The localized skeleton defined in Step 2 ensures that if prefetching hasn't finished, the user sees a non-disruptive loading state while the sidebar remains fully usable.
- **Deleted Prompts:** If a user clicks a prefetched prompt that was deleted before the navigation completes, the query will return `null`. The existing `if (prompt === null)` block in `page.tsx` correctly handles this by displaying a "Prompt not found" state inside the layout.
- **Mobile Compatibility:** The `PromptUseMobileSwitcher` will undergo the same `useParams` and prefetch updates to ensure mobile users receive the exact same UX optimizations.

## 5. Acceptance Criteria Checklist

- [ ] Clicking a prompt in the sidebar maintains the sidebar UI (no full-page skeleton).
- [ ] Active state in the sidebar updates instantly upon click.
- [ ] Data for the next prompt is prefetched on hover.
- [ ] Loading state (if triggered) is contained entirely within the right-side form/preview area.
- [ ] Next.js routing patterns (Layouts) and Convex caching mechanics are correctly utilized.
