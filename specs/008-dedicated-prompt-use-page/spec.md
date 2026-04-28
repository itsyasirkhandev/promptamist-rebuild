# Specification: Prompt Use Features & Navigation

## 1. Problem Statement
Currently, users need a better flow for utilizing their prompts. They need to be able to access a general workspace to switch between their dynamic prompts, but also need a focused view when selecting a specific prompt from a card. The current layout does not dynamically adapt the visibility of the localized prompt-switching sidebar based on the context of how the user arrived at the use page.

**Solution:** 
1. Implement a dedicated button in the **global application sidebar** that opens the general "Prompt Use" page, which features a localized sidebar for switching between dynamic prompts.
2. When a user clicks "Use Template" on a specific prompt card, they should be taken to a focused view for that prompt where the **global application sidebar remains visible**, but the **localized prompt-switching sidebar is hidden**, allowing them to focus entirely on the selected prompt.

## 2. User Stories
* **As a user**, I want to see a "Prompt Use" link in the global application sidebar so that I can directly access a workspace that lists all my dynamic prompts and lets me switch between them easily.
* **As a user**, I want the global application sidebar to remain visible at all times so I don't lose my main navigation context.
* **As a user**, I want to click a "prompt use template" button on any prompt card so that I can open a focused view for that specific prompt.
* **As a user**, when I open a specific prompt from a card, I want the localized prompt-switching sidebar to be hidden so that I have a clean interface dedicated solely to executing that specific prompt.

## 3. Functional Requirements
* **Global Navigation:** Add a "Prompt Use" (or "Workspace") button/link to the existing global application sidebar.
* **General Prompt Use View:** When navigating via the global sidebar button, display the Prompt Use page containing a **localized sidebar** (or list component) that allows switching between the user's dynamic prompts.
* **Prompt Card Action:** Add a "Use Template" button or action on existing prompt cards that links to the Prompt Use page for that specific prompt.
* **Focused Specific Prompt View:** When navigating via a prompt card's "Use Template" button, the Prompt Use page must **hide** the localized prompt-switching sidebar. The view should only contain the global sidebar and the execution form for the selected prompt.
* **Contextual Sidebar State:** The visibility of the localized prompt-switching sidebar depends on the navigation context (e.g., accessed via global nav vs. accessed via a specific prompt card).

## 4. Non-Functional Requirements
* **Performance:** Switching between prompts on the general Prompt Use page should be fast and seamless without triggering a full page reload if possible (client-side routing).
* **Usability:** The transition between the general view (with local sidebar) and the specific view (without local sidebar) should be intuitive.

## 5. Out-of-Scope
* Creating new prompts entirely from scratch from the use page (users should go to the standard creation flow for this).
* Extensive editing of the prompt's structural variables from the use page.

## 6. Inputs and Outputs
**USER ACTION (INPUT):** User clicks the "Prompt Use" link in the global sidebar.
**EXPECTED SYSTEM BEHAVIOR:**
* Navigates to the general Prompt Use page.
* Shows the global sidebar.
* **Shows** the localized prompt-switching sidebar.

**USER ACTION (INPUT):** User clicks "Use Template" on a specific prompt card.
**EXPECTED SYSTEM BEHAVIOR:**
* Navigates to the Prompt Use page for that specific prompt.
* Shows the global sidebar.
* **Hides** the localized prompt-switching sidebar.
* Loads the selected prompt into the execution area.

## 7. Edge Cases and Error Handling
* **No Prompts Exist:** If the user navigates directly to the general Prompt Use page but has no dynamic prompts, display an empty state message with a call-to-action to create one.
* **Deleted Prompt:** If the user accesses a specific prompt via a bookmark that was deleted, show an error message ("This prompt could not be found") and provide a link to return to the general Prompt Use page.

## 8. Acceptance Criteria
This feature is considered complete if:
* The global application sidebar contains a visible and functioning link to the general Prompt Use page.
* The general Prompt Use page displays both the global sidebar and a localized sidebar for switching dynamic prompts.
* A "Use Template" button on prompt cards successfully routes the user to a specific prompt view.
* The specific prompt view displays the global sidebar but successfully **hides** the localized prompt-switching sidebar.
* The user's navigation context is maintained appropriately without breaking layout.