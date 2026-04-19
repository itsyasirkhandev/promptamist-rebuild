import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test('unauthenticated user is redirected from protected route', async ({
    page,
  }) => {
    // Attempt to visit protected route
    await page.goto('/prompts');

    // Should be redirected to sign-in page
    await expect(page).toHaveURL(/.*\/sign-in/);
  });

  test('public routes are accessible', async ({ page }) => {
    // Home page
    await page.goto('/');
    await expect(
      page.locator('text=AI-Powered Prompt Management'),
    ).toBeVisible();

    // Sign-up page
    await page.goto('/sign-up');
    await expect(page.locator('text=Create an account')).toBeVisible();
  });
});
