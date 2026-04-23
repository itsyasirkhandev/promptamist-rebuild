**1. Problem Statement**

Users currently create and manage prompts (both static and dynamic) but lack the ability to share these prompts with others.

This makes it difficult for users to:

- Share their useful prompts with a wider audience or team members
- Allow others to utilize dynamic prompts without needing an account or access to the creator's workspace
- Maintain a single source of truth for a prompt that updates everywhere when the original author modifies it

Solution: This feature introduces public prompt sharing, allowing users to make any prompt publicly accessible via a unique, readable link.

**2. Functional Requirements**

The system should:

- Add a "Make Public" checkbox to the prompt creation and editing forms
- Generate a unique, human-readable URL (slug) for public prompts
- Allow unauthenticated or unauthorized users to access the shared link
- For static prompts: display the prompt text and provide a one-click "Copy" functionality
- For dynamic prompts: display an interactive "Use" page where visitors can fill in the variable fields to generate and copy the customized prompt
- Automatically reflect any changes made by the original author (e.g., adding/removing variables, changing text) on the public shared page in real-time
- Provide an easy way for the owner to copy the public link from their dashboard

**3. Inputs and Outputs: Public Prompt Access**

USER ACTION (INPUT)
When a visitor accesses a public prompt link

EXPECTED SYSTEM BEHAVIOR

- Load the shared prompt page
- Check if the prompt is static or dynamic
- If static, render the text with a "Copy to Clipboard" button
- If dynamic, render form fields for all variables defined by the author, along with a "Generate & Copy" button
- Display the author's latest version of the prompt (including any real-time changes)

**4. Constraints**

- The generated URL must be unique and ideally include a readable slug based on the prompt's title
- The public page must load efficiently without requiring user authentication
- Modifying the prompt should instantly (or upon refresh) update the public view without changing the URL
- The public page must be responsive and accessible on mobile and desktop devices

**5. Edge Cases and Error Handling**

Prompt is made private after being public

- Show message: "This prompt is no longer available or has been made private."

Visitor accesses an invalid or non-existent URL

- Show a 404 page with a message: "Prompt not found."

Author removes a variable while a visitor is filling out the dynamic form

- Changes apply upon the next generation or page refresh; gracefully handle missing variables if submitted.

Very long prompt text or too many variables

- Ensure the UI remains scrollable and the "Use" page form layout adapts properly.

Duplicate readable slugs

- Append a unique identifier or hash to the end of the URL slug to guarantee uniqueness.

**6. Acceptance Criteria**

This feature is considered complete if:

- Users can toggle a "Make Public" setting on their prompts
- A unique, shareable link is generated for public prompts
- Anyone with the link can view the prompt page without logging in
- Visitors can copy static prompts directly
- Visitors can fill out fields for dynamic prompts and copy the resulting customized text
- Any edits made by the prompt owner (text or variables) are immediately visible to visitors using the public link
- Proper error states are shown for invalid or revoked links
