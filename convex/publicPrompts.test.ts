import { convexTest } from 'convex-test';
import { expect, test } from 'vitest';
import { api, internal } from './_generated/api';

declare global {
  interface ImportMeta {
    glob(pattern: string): Record<string, () => Promise<unknown>>;
  }
}
import schema from './schema';

const modules = import.meta.glob('./**/*.ts');

test('getPromptBySlug and listPublicPrompts integration tests', async () => {
  const t = convexTest(schema, modules);

  // 1. Create a user via internal mutation
  await t.mutation(internal.users.upsertFromClerk, {
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
  expect((result as Record<string, unknown>).userId).toBeUndefined(); // Should be stripped by DTO

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

test('user prompt stats maintenance integration tests', async () => {
  const t = convexTest(schema, modules);

  // 1. Create a user via internal mutation
  await t.mutation(internal.users.upsertFromClerk, {
    clerkId: 'user_stats_123',
    email: 'stats@example.com',
    name: 'Stats User',
    imageUrl: 'https://example.com/stats.jpg',
  });

  const authedT = t.withIdentity({
    subject: 'user_stats_123',
    email: 'stats@example.com',
  });

  // 2. Query initial stats (should be all 0)
  let stats = await authedT.query(api.authed.prompts.getPromptStats, {});
  expect(stats.total).toBe(0);
  expect(stats.templates).toBe(0);
  expect(stats.public).toBe(0);

  // 3. Create a private regular prompt
  await authedT.mutation(api.authed.prompts.createPrompt, {
    title: 'Private Prompt',
    content: 'Regular private content',
    tags: ['react'],
    isTemplate: false,
    isPublic: false,
    variables: [],
  });

  stats = await authedT.query(api.authed.prompts.getPromptStats, {});
  expect(stats.total).toBe(1);
  expect(stats.templates).toBe(0);
  expect(stats.public).toBe(0);

  // 4. Create a public template prompt
  await authedT.mutation(api.authed.prompts.createPrompt, {
    title: 'Public Template',
    content: 'Public template content',
    tags: ['nextjs'],
    isTemplate: true,
    isPublic: true,
    variables: [],
  });

  stats = await authedT.query(api.authed.prompts.getPromptStats, {});
  expect(stats.total).toBe(2);
  expect(stats.templates).toBe(1);
  expect(stats.public).toBe(1);

  // Get prompts list to retrieve generated IDs for updates/deletes
  const userPrompts = await authedT.query(api.authed.prompts.getPrompts);
  expect(userPrompts).toHaveLength(2);

  const regularPrompt = userPrompts.find((p) => p.title === 'Private Prompt');
  expect(regularPrompt).toBeDefined();

  // 5. Update: Turn the regular prompt into a template and make it public
  await authedT.mutation(api.authed.prompts.updatePrompt, {
    id: regularPrompt!._id,
    title: regularPrompt!.title,
    content: regularPrompt!.content,
    tags: regularPrompt!.tags,
    variables: regularPrompt!.variables,
    category: regularPrompt!.category,
    isTemplate: true,
    isPublic: true,
  });

  stats = await authedT.query(api.authed.prompts.getPromptStats, {});
  expect(stats.total).toBe(2);
  expect(stats.templates).toBe(2);
  expect(stats.public).toBe(2);

  // 6. Delete: Delete one of the template prompts
  await authedT.mutation(api.authed.prompts.deletePrompt, {
    id: regularPrompt!._id,
  });

  stats = await authedT.query(api.authed.prompts.getPromptStats, {});
  expect(stats.total).toBe(1);
  expect(stats.templates).toBe(1);
  expect(stats.public).toBe(1);
}, 30000);
