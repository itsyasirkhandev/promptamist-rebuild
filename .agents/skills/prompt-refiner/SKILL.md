---
name: prompt-refiner
description: Refines basic, generic prompts into highly detailed, context-rich prompts. Use when the user asks to improve, enhance, or expand a prompt for another AI task, or provides a short prompt meant to be refined.
---

# Prompt Refiner

## Goal

Enhance the current user prompt to make it super context-rich. Transform short, generic, context-free user requests into comprehensive, well-structured prompts ready to be fed into another AI coding agent. The generated prompt must include the full context, tech stack, dependencies, and existing patterns _before_ giving the task instructions, without assuming a persona.

## Process

1. **Analyze the Input Prompt**: Read the user's raw prompt and identify the core objective.
2. **Gather System Context & Codebase Browsing**: Evaluate the current workspace/codebase before creating the final prompt. You must:
   - Browse the whole codebase based on the requested feature or task.
   - Read all important files, patterns, and everything necessary to ensure the final prompt has all the context the coding agent will need to perform the specific task or implement the feature.
   - If the user requests it, use MCP tools to search the official documentation URLs of the relevant library or framework. Include this correct code documentation in the final prompt so the coding agent implements the feature using the correct, up-to-date syntax and avoids any deprecated code or incorrect file naming conventions.
   - Identify the exact tech stack and versions (e.g., Next.js, React, Convex, Tailwind).
   - Read the `package.json` file to identify currently installed packages. You MUST extract and list the exact major, minor, and patch version of each relevant library. Do not assume the version of any library.
   - Identify existing architectural patterns and conventions (e.g., auth routing, database schemas).
   - Evaluate available MCP tools, search tools, and agent skills. Describe and list all relevant tools and skills that the AI coding agent can invoke to enhance its workflow and accomplish the task effectively.
3. **Identify Missing Context**: If crucial details for the specific task are missing, ask the user up to 3 specific, numbered questions.
4. **Draft the Refined Prompt**: Create a detailed, to-the-point prompt structured into clear sections. **DO NOT include a Role or Persona (e.g., "You are an expert...")** as the target AI already has its own system prompt.
   - **Context & Environment**: Detailed breakdown of the tech stack, existing patterns, and relevant dependencies (including their major, minor, and patch versions). This must be the first thing in the prompt.
   - **Objective**: Clear, concise statement of the goal.
   - **Task Details**: Direct, step-by-step breakdown of what needs to be accomplished. Include all required changes in very detailed form.
   - **Constraints & Rules**: Non-functional requirements, styling rules, or strict guidelines.
5. **Present the Output**: Provide the refined prompt inside a markdown code block so the user can easily copy and paste it into a new agent context.

## Output Format

Present your final output clearly to the user:

```text
Here is your refined prompt:

` ` `markdown
# Context & Environment
- **Tech Stack**: [e.g., Next.js 14.1.0 (App Router), React 18.2.0, Tailwind CSS 3.4.1]
- **Dependencies**: [e.g., Clerk for auth (v4.29.3), Convex for backend (v1.8.0)]
- **Existing Patterns**: [e.g., Backend logic resides in `convex/`, use `pnpm`]
- **Relevant Tools & Skills**: [e.g., `mcp_exa_web_search_exa`, `seo-optimizer` skill]

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
