# Design Plan: Dashboard Statistics on Authenticated Home Page

This document outlines the technical approach to implementing the dashboard statistics on the authenticated home page as described in `spec.md`.

## 1. Architecture & Tech Stack

- **Frontend:** React (Next.js App Router, Client Component), Tailwind CSS, shadcn/ui (`Card` component), Lucide React (icons).
- **Backend:** Convex.
- **State/Data Fetching:** `useQuery` from `convex/react`.

## 2. Data Flow

1. User logs in and visits the home page (`/`).
2. The `HomeClient.tsx` component is rendered inside the `<Authenticated>` block.
3. A Convex query (`api.authed.prompts.getPromptStats`) is called via `useQuery`.
4. While data is loading (`stats === undefined`), skeleton loaders are displayed.
5. Once the query resolves, the data is injected into three statistical cards (Total Prompts, Total Templates, Public Prompts).

## 3. Backend Implementation (Convex)

**File to modify:** `convex/authed/prompts.ts`

According to the Convex AI guidelines, we should avoid `.collect().length` for large-scale counting. However, for the MVP scale and based on the spec, we will fetch the user's prompts in memory up to a reasonable limit and count them, returning an aggregated object.

```typescript
import { authedQuery, getUserId } from './helpers';
import { Effect } from 'effect';
import { runEffect } from '../effect';

export const getPromptStats = authedQuery({
  args: {},
  handler: async (ctx) => {
    return await runEffect(
      Effect.gen(function* () {
        const userId = yield* getUserId(ctx, ctx.identity.subject);

        // For MVP, we fetch up to a safe maximum number of prompts.
        // For production scale with thousands of prompts, a denormalized
        // counters table updated via mutations is recommended by Convex guidelines.
        const prompts = yield* Effect.promise(() =>
          ctx.db
            .query('prompts')
            .withIndex('by_userId', (q) => q.eq('userId', userId))
            .take(1000),
        );

        let total = 0;
        let templates = 0;
        let publicCount = 0;

        for (const prompt of prompts) {
          total++;
          if (prompt.isTemplate) templates++;
          if (prompt.isPublic) publicCount++;
        }

        return { total, templates, public: publicCount };
      }),
    );
  },
});
```

## 4. Frontend Implementation

**File to modify:** `src/components/HomeClient.tsx`

We will update the `<Authenticated>` section to include a dashboard-style grid of stats.
We'll utilize shadcn/ui components (`Card`, `CardHeader`, `CardTitle`, `CardContent`, and `Skeleton`) to style the cards.

```tsx
'use client';

import {
  Authenticated,
  Unauthenticated,
  AuthLoading,
  useQuery,
} from 'convex/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '../../convex/_generated/api';
import { FileText, LayoutTemplate, Globe } from 'lucide-react';

export function HomeClient() {
  return (
    <main>
      <AuthLoading>
        <div className="flex justify-center py-20">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
        </div>
      </AuthLoading>

      <Authenticated>
        <div className="container mx-auto px-4 py-10 md:px-6">
          <section className="mb-10 text-center">
            <h1 className="mb-4 text-4xl font-semibold">
              Welcome back to Promptamist!
            </h1>
            <p className="text-muted-foreground mb-8">
              Here is an overview of your prompt repository.
            </p>
            <Button size="lg" asChild>
              <Link href="/prompts">Go to Prompts →</Link>
            </Button>
          </section>

          <DashboardStats />
        </div>
      </Authenticated>

      <Unauthenticated>
        <section className="py-20 text-center">
          <h1 className="mb-6 text-4xl font-semibold">
            AI-Powered Prompt Management
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-2xl">
            Organize, test, and optimize your AI prompts with our intelligent
            platform built for power users.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/sign-up">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </section>
      </Unauthenticated>
    </main>
  );
}

function DashboardStats() {
  const stats = useQuery(api.authed.prompts.getPromptStats);

  if (stats === undefined) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-[120px] w-full rounded-xl" />
        <Skeleton className="h-[120px] w-full rounded-xl" />
        <Skeleton className="h-[120px] w-full rounded-xl" />
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

  return (
    <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
          <FileText className="text-muted-foreground h-4 w-4" />
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
          <LayoutTemplate className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.templates}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Public Prompts</CardTitle>
          <Globe className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.public}</div>
        </CardContent>
      </Card>
    </div>
  );
}
```

## 5. Error Handling and Edge Cases

- **0 Prompts:** The query will return `{ total: 0, templates: 0, public: 0 }`. The UI will display `0` securely, fulfilling the requirement.
- **Unauthenticated Users:** Due to `authedQuery` throwing when unauthorized, and the UI being wrapped in `<Authenticated>`, unauthenticated users will never execute the query or see the stats.
- **Scalability constraints:** To prevent query timeout, `.take(1000)` limits the data pulled into memory. For true enterprise scale later, a counter mechanism inside `convex/schema.ts` and updated via `createPrompt`/`deletePrompt`/`updatePrompt` actions should be introduced as strongly advised in the Convex AI guidelines.
- **Loading State:** Skeletons mimic the layout grid structure, preventing layout shift once the actual data is injected.
