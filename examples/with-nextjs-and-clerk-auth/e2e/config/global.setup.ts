import {
  clerk,
  clerkSetup,
  setupClerkTestingToken,
} from '@clerk/testing/playwright';
import { test as setup } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup must be run serially, necessary if Playwright is configured to run fully parallel
setup.describe.configure({ mode: 'serial' });

setup('global setup', async ({}) => {
  await clerkSetup();
});

const authFile = path.join(__dirname, '../playwright/.clerk/user.json');
setup('authenticate', async ({ page }) => {
  await page.goto('/sign-in');

  await setupClerkTestingToken({ page });

  // Use Clerk's signIn utility
  await clerk.signIn({
    page,
    signInParams: {
      strategy: 'password',
      identifier: process.env.E2E_CLERK_USER_USERNAME!,
      password: process.env.E2E_CLERK_USER_PASSWORD!,
    },
  });

  await page.goto('/');
  await page.context().storageState({ path: authFile });
});
