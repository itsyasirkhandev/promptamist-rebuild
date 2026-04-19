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
});
