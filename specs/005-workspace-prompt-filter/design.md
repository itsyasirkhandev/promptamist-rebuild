# Workspace Prompt Filter Technical Design

**1. Objective**
Relocate the tag-based filtering functionality from a standalone dropdown menu into the main `PromptSwitcher` combobox popover. The tags will be presented as a horizontally scrollable list of multi-selectable badges immediately below the search input, mirroring the UX found on the `/prompts` dashboard.

**2. Tech Stack**

- Next.js 16.2.6 (App Router)
- React 19.2.6
- Tailwind CSS v4
- TypeScript 5
- `cmdk` 1.1.1 (via shadcn/ui `Command`)
- `radix-ui` 1.4.3 (via shadcn/ui `ScrollArea`, `Popover`)

**3. High-Level Architecture**

- **Frontend (UI Components)**: Modify `src/components/prompts/use/PromptSwitcher.tsx`. The component will drop the external `DropdownMenu` and instead integrate `ScrollArea`, `ScrollBar`, and `Badge` components from `@/components/ui` directly into the `Command` popover.
- **State Management**: The `selectedTags` state (a `Set<string>`) already exists in the component and will be maintained. The text filtering is handled implicitly by `cmdk`'s `CommandInput` and internal logic.
- **Filtering Logic**: The component will continue to derive `filteredPrompts` by filtering the raw `prompts` array against `selectedTags`. The resulting array is rendered as `CommandItem`s, which `cmdk` then filters against the user's text input natively.

**4. Data Model**
No changes to the data model or Convex backend. The component receives `PromptDTO[]` and extracts the unique list of tags on the client.

**5. Core Design Decisions**

- **Integration with `cmdk`**: The tag filter list (using `ScrollArea` and `Badge`) will be placed inside the `Command` component, strictly between `CommandInput` and `CommandList`. This allows the filter UI to remain visible while the list of prompts scrolls independently below it.
- **UI Consistency**: By using the exact same `ScrollArea` and `Badge` patterns as `src/app/(protected)/prompts/page.tsx`, we ensure visual consistency across the app.
- **Popover Layout Stability**: The `ScrollArea` must be configured with `className="w-full whitespace-nowrap"` and the badge container as `className="flex w-max space-x-2 p-2"` to prevent the popover from horizontally overflowing or breaking its defined width (`w-[300px]`).

**6. Core Functional Flows**

_Component Render Flow & Layout Changes in `PromptSwitcher.tsx`:_

1. **Remove External Button**: Delete the `DropdownMenu` code block that currently renders the standalone filter button.
2. **Import Missing Components**: Add imports for `Badge`, `ScrollArea`, and `ScrollBar`.
3. **Inject Filter UI inside Command**:

   ```tsx
   <Command>
     <CommandInput placeholder="Search prompts..." />

     {/* NEW: Injected Tag Filter UI */}
     {allTags.length > 0 && (
       <div className="border-border border-b">
         <ScrollArea className="w-full whitespace-nowrap">
           <div className="flex w-max space-x-1 p-2">
             {allTags.map((tag) => (
               <Badge
                 key={tag}
                 variant={selectedTags.has(tag) ? 'default' : 'outline'}
                 className="cursor-pointer"
                 onClick={() => toggleTag(tag)}
               >
                 {tag}
               </Badge>
             ))}
           </div>
           <ScrollBar orientation="horizontal" className="h-2" />
         </ScrollArea>
       </div>
     )}

     <CommandList>
       {/* ... existing CommandEmpty and CommandGroup logic ... */}
     </CommandList>
   </Command>
   ```

4. **Filtering Intersection**:
   - `filteredPrompts` continues to return prompts that match ALL `selectedTags`.
   - The user types in `CommandInput`, and `cmdk` automatically filters the `CommandItem`s rendered by `filteredPrompts`.
   - If `filteredPrompts` yields results but `cmdk`'s text filter yields none, `CommandEmpty` will correctly display "No prompt found."

**7. Development Plan**

1. **Update Imports**: Modify `PromptSwitcher.tsx` to import `Badge`, `ScrollArea`, and `ScrollBar`.
2. **Relocate UI**: Move the tag rendering logic into the `Command` popover body, styled as horizontally scrollable badges.
3. **Clean Up**: Remove the `DropdownMenu` imports and the JSX for the external filter button.
4. **Test**: Verify that multi-selection works, combining text search with tag selection yields the expected intersection, and the popover layout remains stable (no horizontal stretching or overflow).
