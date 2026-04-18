'use client';

import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function Home() {
  const tasks = useQuery(api.tasks.get);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 p-8 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-1 flex-col items-center gap-8 rounded-3xl bg-white px-16 py-32 shadow-xl transition-all hover:shadow-2xl sm:items-start dark:bg-zinc-900">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Convex + Next.js
        </h1>

        <div className="w-full space-y-4">
          <h2 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">
            Tasks
          </h2>
          {tasks === undefined ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800"></div>
              <div className="h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800"></div>
            </div>
          ) : tasks.length === 0 ? (
            <p className="text-zinc-500 italic">
              No tasks found. Run `npx convex dev` and add some data!
            </p>
          ) : (
            <ul className="divide-y divide-zinc-200 overflow-hidden rounded-xl border dark:divide-zinc-800">
              {(tasks as { _id: string; text: string }[]).map((task) => (
                <li
                  key={task._id}
                  className="bg-white p-4 transition-colors hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  {task.text}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <div className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white">
            Step 1: Run `npx convex dev`
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-2 font-medium text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
            Step 2: Add data in Convex dashboard
          </div>
        </div>
      </main>
    </div>
  );
}
