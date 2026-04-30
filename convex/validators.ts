import { v } from 'convex/values';

export const promptVariableValidator = v.object({
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
});

export const promptVariablesValidator = v.array(promptVariableValidator);

export const promptArgsValidator = {
  title: v.string(),
  content: v.string(),
  tags: v.array(v.string()),
  isTemplate: v.boolean(),
  isPublic: v.optional(v.boolean()),
  variables: promptVariablesValidator,
};
