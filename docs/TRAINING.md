# Team Training: Auth

## Overview

This document contains an agenda for the 30-minute team training session regarding the newly implemented authentication flow using Clerk & Convex.

## Agenda

1. **Introduction to Clerk (5 mins)**
   - Why we chose Clerk vs standard JWT or NextAuth
   - User sessions, cookies, and tokens
2. **Demo (10 mins)**
   - Show the Sign-Up flow
   - Show the Sign-In flow
   - Demonstrate what happens when accessing a protected route without auth (`/prompts`)
3. **Code Walkthrough (10 mins)**
   - `src/proxy.ts` (Next.js middleware)
   - `src/components/ConvexClientProvider.tsx` (Wiring up Convex + Clerk)
   - Webhook syncing in `src/app/api/webhooks/clerk/route.ts`
   - Reading `ctx.auth.getUserIdentity()` in Convex functions
4. **Q&A (5 mins)**
   - How to add new OAuth providers? (Answer: Just enable in Clerk dashboard)
   - How to handle local development? (Answer: Use your Clerk development instance keys)
