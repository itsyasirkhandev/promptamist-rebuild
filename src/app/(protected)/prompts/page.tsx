'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function PromptsPage() {
  const user = useQuery(api.users.getCurrentUser);

  return (
    <div className="bg-background min-h-screen p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Prompts Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button variant="link" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
          <UserButton />
        </div>
      </header>

      {user === undefined ? (
        <div className="space-y-4">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
      ) : user === null ? (
        <Alert variant="destructive">
          <AlertTitle>Profile Not Found</AlertTitle>
          <AlertDescription>
            Your account is still syncing from Clerk, or the webhook didn&apos;t fire.
            Please try signing out and signing back in, or wait a moment and refresh.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Name:</span> {user.name || 'N/A'}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-medium">Clerk ID:</span> {user.clerkId}
              </p>
              <p>
                <span className="font-medium">Member Since:</span>{' '}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Content</CardTitle>
              <CardDescription>
                You haven&apos;t created any prompts yet. Start building your
                library!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button>Create New Prompt</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
