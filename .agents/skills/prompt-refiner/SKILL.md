---
name: prompt-refiner
description: Refines basic, generic prompts into highly detailed, context-rich prompts. Use when the user asks to improve, enhance, or expand a prompt for another AI task, or provides a short prompt meant to be refined.
---

# Prompt Refiner

## Goal
Transform short, generic, context-free user requests into comprehensive, well-structured prompts ready to be fed into another AI coding agent. The generated prompt must include the full context, tech stack, dependencies, and existing patterns *before* giving the task instructions, without assuming a persona.

## Process

1. **Analyze the Input Prompt**: Read the user's raw prompt and identify the core objective.
2. **Gather System Context & Codebase Browsing**: Evaluate the current workspace/codebase before creating the final prompt. You must:
   - Browse the whole codebase based on the requested feature or task.
   - Read all important files, patterns, and everything necessary to ensure the final prompt has all important context and documentation.
   - Identify the exact tech stack and versions (e.g., Next.js, React, Convex, Tailwind).
   - Identify currently installed packages and dependencies.
   - Identify existing architectural patterns and conventions (e.g., auth routing, database schemas).
3. **Identify Missing Context**: If crucial details for the specific task are missing, ask the user up to 3 specific, numbered questions. 
4. **Draft the Refined Prompt**: Create a detailed, to-the-point prompt structured into clear sections. **DO NOT include a Role or Persona (e.g., "You are an expert...")** as the target AI already has its own system prompt.
   - **Context & Environment**: Detailed breakdown of the tech stack, existing patterns, and relevant dependencies. This must be the first thing in the prompt.
   - **Objective**: Clear, concise statement of the goal.
   - **Task Details**: Direct, step-by-step breakdown of what needs to be accomplished.
   - **Constraints & Rules**: Non-functional requirements, styling rules, or strict guidelines.
5. **Present the Output**: Provide the refined prompt inside a markdown code block so the user can easily copy and paste it into a new agent context.

## Output Format

Present your final output clearly to the user:

```text
Here is your refined prompt:

` ` `markdown
# Context & Environment
- **Tech Stack**: [e.g., Next.js 14 (App Router), React, Tailwind CSS]
- **Dependencies**: [e.g., Clerk for auth, Convex for backend]
- **Existing Patterns**: [e.g., Backend logic resides in `convex/`, use `pnpm`]

# Objective
[Clear, concise statement of the goal]

# Instructions
1. [Step one]
2. [Step two]

# Constraints & Guidelines
- [Rule 1]
- [Rule 2]
` ` `
```
