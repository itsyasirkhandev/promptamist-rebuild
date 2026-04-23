import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    subscriptionTier: v.optional(v.string()),
    preferences: v.optional(
      v.object({
        theme: v.optional(v.string()),
        notificationsEnabled: v.boolean(),
      }),
    ),
  })
    .index('by_clerkId', ['clerkId'])
    .index('by_email', ['email']),

  prompts: defineTable({
    userId: v.id('users'),
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    isTemplate: v.boolean(),
    variables: v.array(
      v.object({
        id: v.string(), // Client-side UUID
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
    isPublic: v.optional(v.boolean()),
    publicSlug: v.optional(v.string()),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_and_title', ['userId', 'title'])
    .index('by_publicSlug', ['publicSlug']),
});
