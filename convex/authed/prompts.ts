import { v } from 'convex/values';
import { authedMutation, authedQuery, getUserId } from './helpers';
import { Effect } from 'effect';
import { NotFound, ValidationError } from '../errors';
import { runEffect } from '../effect';

export const createPrompt = authedMutation({
  args: {
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    isTemplate: v.boolean(),
    isPublic: v.optional(v.boolean()),
    variables: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        type: v.union(
          v.literal('text'),
          v.literal('number'),
          v.literal('textarea'),
          v.literal('choices'),
          v.literal('list'),
        ),
        options: v.optional(v.array(v.string())),
        defaultValue: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    return await runEffect(
      Effect.gen(function* () {
        if (args.title.length > 300) {
          yield* new ValidationError({
            message: 'Title must be less than 300 characters',
          });
        }
        if (args.content.length > 50000) {
          yield* new ValidationError({
            message: 'Content must be less than 50000 characters',
          });
        }

        const userId = yield* getUserId(ctx, ctx.identity.subject);

        let publicSlug: string | undefined = undefined;
        if (args.isPublic) {
          const baseSlug = args.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

          // Try to find a unique slug
          let attempts = 0;
          while (attempts < 5) {
            const randomSuffix = Math.random().toString(36).substring(2, 8);
            const candidate = `${baseSlug}-${randomSuffix}`;
            const existing = yield* Effect.promise(() =>
              ctx.db
                .query('prompts')
                .withIndex('by_publicSlug', (q) =>
                  q.eq('publicSlug', candidate),
                )
                .unique(),
            );
            if (!existing) {
              publicSlug = candidate;
              break;
            }
            attempts++;
          }

          if (!publicSlug) {
            // Fallback if somehow we hit 5 collisions (very unlikely)
            publicSlug = `${baseSlug}-${Date.now().toString(36)}`;
          }
        }

        return yield* Effect.promise(() =>
          ctx.db.insert('prompts', {
            userId,
            ...args,
            publicSlug,
          }),
        );
      }),
    );
  },
});

export const getPrompts = authedQuery({
  args: {},
  handler: async (ctx) => {
    return await runEffect(
      Effect.gen(function* () {
        const userId = yield* getUserId(ctx, ctx.identity.subject);
        return yield* Effect.promise(() =>
          ctx.db
            .query('prompts')
            .withIndex('by_userId', (q) => q.eq('userId', userId))
            .order('desc')
            .take(100),
        );
      }),
    );
  },
});

export const getPromptById = authedQuery({
  args: { id: v.id('prompts') },
  handler: async (ctx, args) => {
    return await runEffect(
      Effect.gen(function* () {
        const userId = yield* getUserId(ctx, ctx.identity.subject);
        const prompt = yield* Effect.promise(() => ctx.db.get(args.id));
        if (!prompt || prompt.userId !== userId) {
          yield* new NotFound({ message: 'Prompt not found' });
        }
        return prompt!;
      }),
    );
  },
});

export const updatePrompt = authedMutation({
  args: {
    id: v.id('prompts'),
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    isTemplate: v.boolean(),
    isPublic: v.optional(v.boolean()),
    variables: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        type: v.union(
          v.literal('text'),
          v.literal('number'),
          v.literal('textarea'),
          v.literal('choices'),
          v.literal('list'),
        ),
        options: v.optional(v.array(v.string())),
        defaultValue: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    return await runEffect(
      Effect.gen(function* () {
        if (args.title.length > 300) {
          yield* new ValidationError({
            message: 'Title must be less than 300 characters',
          });
        }
        if (args.content.length > 50000) {
          yield* new ValidationError({
            message: 'Content must be less than 50000 characters',
          });
        }
        const userId = yield* getUserId(ctx, ctx.identity.subject);
        const prompt = yield* Effect.promise(() => ctx.db.get(args.id));
        if (!prompt || prompt.userId !== userId) {
          yield* new NotFound({ message: 'Prompt not found' });
          return;
        }

        const { id, ...updates } = args;

        let publicSlug = prompt!.publicSlug;
        if (updates.isPublic && !prompt!.isPublic) {
          // Transitioned to public, generate a unique slug if it doesn't have one
          if (!publicSlug) {
            const baseSlug = updates.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');

            let attempts = 0;
            while (attempts < 5) {
              const randomSuffix = Math.random().toString(36).substring(2, 8);
              const candidate = `${baseSlug}-${randomSuffix}`;
              const existing = yield* Effect.promise(() =>
                ctx.db
                  .query('prompts')
                  .withIndex('by_publicSlug', (q) =>
                    q.eq('publicSlug', candidate),
                  )
                  .unique(),
              );
              if (!existing) {
                publicSlug = candidate;
                break;
              }
              attempts++;
            }

            if (!publicSlug) {
              publicSlug = `${baseSlug}-${Date.now().toString(36)}`;
            }
          }
        } else if (!updates.isPublic && prompt!.isPublic) {
          // Transitioned to private, we keep the slug so that if made public again, it has the same URL.
          // You could optionally remove it, but keeping it is usually better for link stability if accidentally toggled.
          // However, the spec says "when unauthenticated user access it... it will throw unauthorized". So just leaving publicSlug is fine.
        }

        yield* Effect.promise(() =>
          ctx.db.patch(id, { ...updates, publicSlug }),
        );
      }),
    );
  },
});

export const deletePrompt = authedMutation({
  args: { id: v.id('prompts') },
  handler: async (ctx, args) => {
    return await runEffect(
      Effect.gen(function* () {
        const userId = yield* getUserId(ctx, ctx.identity.subject);
        const prompt = yield* Effect.promise(() => ctx.db.get(args.id));
        if (!prompt || prompt.userId !== userId) {
          yield* new NotFound({ message: 'Prompt not found' });
        }
        yield* Effect.promise(() => ctx.db.delete(args.id));
      }),
    );
  },
});

export const getPromptStats = authedQuery({
  args: { oneWeekAgo: v.number() },
  handler: async (ctx, args) => {
    return await runEffect(
      Effect.gen(function* () {
        const userId = yield* getUserId(ctx, ctx.identity.subject);

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

        for (const prompt of prompts) {
          total++;
          if (prompt.isTemplate) templates++;
          if (prompt.isPublic) publicCount++;

          if (prompt._creationTime >= args.oneWeekAgo) {
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
