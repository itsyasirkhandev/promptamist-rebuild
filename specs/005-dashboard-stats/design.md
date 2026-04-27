# Technical Design: Dashboard Statistics

## 1. Objective

Implement an expanded dashboard statistics section on the authenticated home screen. The goal is to provide users with a quick overview of their prompt repository, including total prompts, template counts, public prompts, recent activity counts (new this week), and a human-readable timestamp of their most recent activity.

## 2. Tech Stack & Libraries

- **Frontend:** React (Next.js App Router), TailwindCSS, Shadcn UI
- **Backend:** Convex (Serverless Database & Functions)
- **Utilities:** Built-in JavaScript `Intl.RelativeTimeFormat` (for relative time formatting), `@iconify/react` (for icons)
- **Package Manager:** `pnpm`

## 3. Architecture & Data Flow

1. **User lands on Home Page:** `HomeClient` loads, wrapped in `<Authenticated>`.
2. **Data Fetching:** The `DashboardStats` component uses Convex `useQuery(api.authed.prompts.getPromptStats)`.
3. **Backend Processing:** Convex query fetches up to 1000 prompts for the user, iterates through them, calculating:
   - `total`, `templates`, `public`
   - `newThisWeek` (by checking if `_creationTime` >= 7 days ago)
   - `lastActivityAt` (by finding the max `_creationTime`)
4. **Rendering:** Frontend renders the metrics in responsive Shadcn `Card` components, formatting `lastActivityAt` using a custom utility based on `Intl.RelativeTimeFormat`. Icons are rendered via `@iconify/react`.

## 4. Backend Design (`convex/authed/prompts.ts`)

The existing `getPromptStats` query will be updated to calculate the new metrics.

```typescript
export const getPromptStats = authedQuery({
  args: {},
  handler: async (ctx) => {
    return await runEffect(
      Effect.gen(function* () {
        const userId = yield* getUserId(ctx, ctx.identity.subject);

        // Fetch up to 1000 user prompts
        const prompts = yield* Effect.promise(() =>
          ctx.db
            .query('prompts')
            .withIndex('by_userId', (q) => q.eq('userId', userId))
            .take(1000),
        );

        let total = 0;
        let templates = 0;
        let publicCount = 0;
        let newThisWeek = 0;
        let lastActivityAt: number | null = null;

        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

        for (const prompt of prompts) {
          total++;
          if (prompt.isTemplate) templates++;
          if (prompt.isPublic) publicCount++;

          if (prompt._creationTime >= oneWeekAgo) {
            newThisWeek++;
          }

          if (!lastActivityAt || prompt._creationTime > lastActivityAt) {
            lastActivityAt = prompt._creationTime;
          }
        }

        return {
          total,
          templates,
          public: publicCount,
          newThisWeek,
          lastActivityAt,
        };
      }),
    );
  },
});
```

## 5. Frontend Design

### 5.1. Install dependencies

Need to add `@iconify/react` for icons. (No library needed for dates, using built-in JS).

```bash
pnpm add @iconify/react
```

### 5.2. Date Formatting Utility (`src/lib/utils.ts`)

Add a helper function to format dates relative to now using `Intl.RelativeTimeFormat`.

```typescript
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
```

### 5.3. UI Component Update (`src/components/HomeClient.tsx`)

The `DashboardStats` component will be updated to display the additional statistics using `@iconify/react`.

```tsx
import { Icon } from '@iconify/react';
import { formatRelativeTime } from '@/lib/utils'; // adjust import path as needed

// ... inside HomeClient.tsx, update DashboardStats ...
function DashboardStats() {
  const stats = useQuery(api.authed.prompts.getPromptStats);

  if (stats === undefined) {
    return (
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-[120px] w-full rounded-xl" />
        <Skeleton className="h-[120px] w-full rounded-xl" />
        <Skeleton className="h-[120px] w-full rounded-xl" />
        <Skeleton className="h-[120px] w-full rounded-xl" />
        <Skeleton className="col-span-1 h-[60px] w-full rounded-xl md:col-span-2 lg:col-span-4" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="py-4 text-center text-red-500">
        Failed to load statistics.
      </div>
    );
  }

  const hasNoActivity = stats.total === 0;

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
            <Icon
              icon="lucide:file-text"
              className="text-muted-foreground h-4 w-4"
            />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Template Prompts
            </CardTitle>
            <Icon
              icon="lucide:layout-template"
              className="text-muted-foreground h-4 w-4"
            />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.templates}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Public Prompts
            </CardTitle>
            <Icon
              icon="lucide:globe"
              className="text-muted-foreground h-4 w-4"
            />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.public}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Week</CardTitle>
            <Icon
              icon="lucide:calendar-plus"
              className="text-muted-foreground h-4 w-4"
            />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.newThisWeek}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="flex items-center gap-2 py-4">
          <Icon icon="lucide:clock" className="text-muted-foreground h-5 w-5" />
          <span className="text-muted-foreground text-sm font-medium">
            {hasNoActivity || !stats.lastActivityAt
              ? 'No activity yet.'
              : `Last prompt created ${formatRelativeTime(stats.lastActivityAt)}.`}
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
```

## 6. Edge Cases & Constraints

- **0 Prompts:** Handled via `hasNoActivity` check. Resulting display will show "No activity yet" instead of an incorrect timestamp.
- **Performance:** Processing 1000 records sequentially on the backend is fast enough. The `O(n)` logic prevents multiple queries for different stats, minimizing read costs.
- **Styling constraints:** Ensure classes use standard Tailwind tokens (e.g. `bg-muted/50`, `text-muted-foreground`) to adhere to dark mode capabilities supported by shadcn/ui.

## 7. Execution Plan

1. **Dependencies:** Install `@iconify/react` via `pnpm add @iconify/react`.
2. **Backend Update:** In `convex/authed/prompts.ts`, update `getPromptStats` returning `newThisWeek` and `lastActivityAt`.
3. **Frontend Update (Utils):** In `src/lib/utils.ts`, add the `formatRelativeTime` utility function.
4. **Frontend Update (UI):** In `src/components/HomeClient.tsx`, import `<Icon />` from `@iconify/react` and `formatRelativeTime` from `@/lib/utils`, replacing the `lucide-react` icons with `Icon` components.
5. **Validation:** Run `pnpm lint`, `pnpm typecheck`, `pnpm format` ensuring there are no errors.
