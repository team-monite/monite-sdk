import { test, expect } from '@playwright/test';

// Import test setup to ensure auth file exists
import { signInUser } from '../utils/auth-helpers';

test.describe('Dashboard', () => {
  test('should redirect to sign-in when not authenticated', async ({
    page,
  }) => {
    // Navigate to the dashboard
    await page.goto('/');

    // Should redirect to sign-in page
    await expect(page).toHaveURL(/.*sign-in.*/);
  });

  test('authenticated user can access home page', async ({ page }) => {
    // Use the shared authentication helper
    await signInUser(page);

    // Navigate to the dashboard
    await page.goto('/');
    await expect(page).toHaveURL('/');

    // Verify some authenticated content is visible
    await expect(page.locator('text=Total received')).toBeVisible();
  });
});
