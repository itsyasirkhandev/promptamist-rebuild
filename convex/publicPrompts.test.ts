/// <reference types="vite/client" />
import { convexTest } from 'convex-test';
import { expect, test } from 'vitest';
import { api } from './_generated/api';
import schema from './schema';

const modules = import.meta.glob('./**/*.ts');

test('getPromptBySlug and listPublicPrompts integration tests', async () => {
  const t = convexTest(schema, modules);

  // 1. Create a user via internal mutation
  await t.mutation(api.users.upsertFromClerk, {
    clerkId: 'user_123',
    email: 'jane@example.com',
    name: 'Jane Doe',
    imageUrl: 'https://example.com/jane.jpg',
  });

  // 2. Create public and private prompts using mocked auth identity
  const authedT = t.withIdentity({
    subject: 'user_123',
    email: 'jane@example.com',
  });

  await authedT.mutation(api.authed.prompts.createPrompt, {
    title: 'Public Prompt Title',
    content: 'This is public content.',
    tags: ['react', 'nextjs'],
    isTemplate: false,
    isPublic: true,
    category: 'development',
    variables: [],
  });

  await authedT.mutation(api.authed.prompts.createPrompt, {
    title: 'Private Prompt Title',
    content: 'This is private content.',
    tags: ['secret'],
    isTemplate: true,
    isPublic: false,
    category: 'secrets',
    variables: [],
  });

  // Fetch prompts list for user to retrieve the generated public slug
  const userPrompts = await authedT.query(api.authed.prompts.getPrompts);
  expect(userPrompts).toHaveLength(2);

  const publicPrompt = userPrompts.find((p) => p.isPublic);
  expect(publicPrompt).toBeDefined();
  expect(publicPrompt?.publicSlug).toBeDefined();

  const slug = publicPrompt!.publicSlug!;

  // 3. Query public prompts by slug (unauthenticated client view)
  const result = await t.query(api.publicPrompts.getPromptBySlug, { slug });
  expect(result).not.toBeNull();
  expect(result?.title).toBe('Public Prompt Title');
  expect(result?.authorName).toBe('Jane Doe');
  expect(result?.authorImageUrl).toBe('https://example.com/jane.jpg');
  expect(result?.content).toBe('This is public content.');
  expect((result as any).userId).toBeUndefined(); // Should be stripped by DTO

  // Query private slug (should return null)
  const privateResult = await t.query(api.publicPrompts.getPromptBySlug, {
    slug: 'some-private-slug-here',
  });
  expect(privateResult).toBeNull();

  // 4. Query list of public prompts
  const publicList = await t.query(api.publicPrompts.listPublicPrompts, {});
  expect(publicList).toHaveLength(1);
  expect(publicList[0].title).toBe('Public Prompt Title');
  expect(publicList[0].authorName).toBe('Jane Doe');
}, 30000);
