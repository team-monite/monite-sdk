import { clerk, setupClerkTestingToken } from '@clerk/testing/playwright';
import { Page } from '@playwright/test';

/**
 * Helper function to sign in a user using Clerk
 *
 * @param page Playwright Page object
 * @returns Object containing authentication status and any error message
 */
export async function signInUser(
  page: Page
): Promise<{ success: boolean; error?: string }> {
  // Get credentials from environment variables
  const username = process.env.E2E_CLERK_USER_USERNAME || '';
  const password = process.env.E2E_CLERK_USER_PASSWORD || '';

  // Check if credentials are available
  if (!username || !password) {
    return {
      success: false,
      error:
        'Missing credentials: E2E_CLERK_USER_USERNAME and E2E_CLERK_USER_PASSWORD environment variables are required',
    };
  }

  try {
    await page.goto('/sign-in');

    await setupClerkTestingToken({ page });

    // Use Clerk's signIn utility
    await clerk.signIn({
      page,
      signInParams: {
        strategy: 'password',
        identifier: username,
        password: password,
      },
    });

    await page.goto('/');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: `Authentication failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

/**
 * Helper function to sign out a user
 *
 * @param page Playwright Page object
 */
export async function signOutUser(page: Page): Promise<void> {
  await clerk.signOut({ page });
}
