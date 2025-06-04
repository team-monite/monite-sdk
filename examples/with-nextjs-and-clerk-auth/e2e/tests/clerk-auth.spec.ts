import { test, expect } from '@playwright/test';

import { signInUser } from '../utils/auth-helpers';

test('user can sign in', async ({ page }) => {
  // Sign in
  await signInUser(page);

  // Navigate to a protected page
  await page.goto('/receivables');
  await expect(page).toHaveURL('/receivables');

  // Access another protected page
  await page.goto('/payables');
  await expect(page).not.toHaveURL(/^\/|.*sign-in.*/);
});

test('unauthenticated user is redirected to sign-in and authenticated user is redirected to main path', async ({
  page,
}) => {
  // Try to access a protected page without authentication
  await page.goto('/receivables');

  // Verify redirect to sign-in page
  await expect(page).toHaveURL(/.*sign-in.*/);

  await signInUser(page);

  // Verify redirect to main path after authentication
  // It should redirect back to the original requested URL (/receivables)
  await expect(page).toHaveURL('/');
});

// This test is now in home.spec.ts so we can remove it from here
