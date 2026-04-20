# Tasks: Responsive Design System

## [Phase 1] - Global Layout and Navigation Refactoring
- [ ] [Phase 1] Define `NAVIGATION_ITEMS` and `NavigationConfig` in `src/lib/navigation.ts`.
- [ ] [Phase 1] Create `Sidebar` component for desktop (≥ 1024px) with collapsible state.
- [ ] [Phase 1] Create `MobileBottomNav` component for mobile devices (< 768px).
- [ ] [Phase 1] Implement `AppLayout` component in `src/components/layout/AppLayout.tsx` to manage responsive navigation visibility.
- [ ] [Phase 1] Update `src/app/layout.tsx` and protected route layouts to use the new `AppLayout`.
- [ ] [Phase 1] Configure Tailwind 4 `@theme` in `src/app/globals.css` for fluid typography and OKLCH color variables.

## [Phase 2] - Mobile-First Dashboard and List Components
- [ ] [Phase 2] Refactor `src/app/(protected)/prompts/page.tsx` to use a responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`).
- [ ] [Phase 2] Wrap `PromptCard` in a `@container` and update its internal styles using container queries (`@md:`, `@lg:`).
- [ ] [Phase 2] Ensure `PromptCard` actions (edit, delete) are easily accessible on touch devices.
- [ ] [Phase 2] Implement responsive padding and gap scales for the main content area across all breakpoints.

## [Phase 3] - Responsive Prompt Editor and Variable List
- [ ] [Phase 3] Refactor `PromptEditor.tsx` to move primary actions (Save/Cancel) to a sticky footer/header on mobile viewports.
- [ ] [Phase 3] Set base font size for all `input` and `textarea` elements to `16px` to prevent automatic zoom on iOS devices.
- [ ] [Phase 3] Adapt `VariableList` and `VariableConfigModal` for smaller screens, ensuring full-width modals and clear stacking.
- [ ] [Phase 3] Implement a mobile-optimized floating selection toolbar for "Convert to Variable" functionality.

## [Phase 4] - Touch-Optimized Interactions and Accessibility
- [ ] [Phase 4] Update `dnd-kit` configuration in `VariableList` to include `TouchSensor` with appropriate activation constraints (e.g., long press).
- [ ] [Phase 4] Standardize all interactive elements to meet the `44x44px` minimum touch target requirement.
- [ ] [Phase 4] Add visual "lift" effects (scaling, shadow) and transitions for drag-and-drop operations on touch devices.
- [ ] [Phase 4] Ensure `overscroll-behavior: none` is applied to the editor area to prevent accidental page refreshes or "rubber-banding" during interaction.

## [Phase 5] - Final Cross-Device Testing and Polishing
- [ ] [Phase 5] Audit all pages for layout shifts and horizontal overflow on mobile viewports.
- [ ] [Phase 5] Test navigation transitions and sidebar collapse/expand animations for smoothness.
- [ ] [Phase 5] Validate application usability on iPhone SE (narrow), iPad (tablet), and Large Desktop (ultra-wide) emulators.
- [ ] [Phase 5] Optimize mobile landscape orientation (consider side-rail navigation or reduced header height).
- [ ] [Phase 5] Final check for accessibility (ARIA labels, focus management, color contrast).
