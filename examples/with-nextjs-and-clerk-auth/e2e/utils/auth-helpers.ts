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
    await page.goto('/sign-in', { waitUntil: 'domcontentloaded' });

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

    // Wait a bit for clerk to process
    await page.waitForTimeout(2000);

    // Wait for sign-in to complete and redirect away from sign-in page
    try {
      await page.waitForURL(/^(?!.*sign-in).*/, { timeout: 15000 });
    } catch {
      // If we're still on sign-in page after timeout, force navigation
      console.log('Still on sign-in page, forcing navigation to home');
    }

    // Always navigate to home page to ensure we're in the right place
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait for the page to actually be loaded and not redirect back to sign-in
    try {
      await page.waitForURL('/', { timeout: 10000 });
    } catch {
      // If we're not exactly on "/", that's okay as long as we're not on sign-in
      if (!page.url().includes('sign-in')) {
        console.log('Authentication successful, redirected to:', page.url());
      } else {
        throw new Error('Still on sign-in page after authentication attempt');
      }
    }

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
