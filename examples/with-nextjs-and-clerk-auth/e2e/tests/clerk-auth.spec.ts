import { test } from '../fixtures/Fixture';
import { payablesPage } from '../pages/PayablesPage';
import { receivablesPage } from '../pages/ReceivablesPage';
import { checkURL, checkURLNot } from '../utils/URLChecker';
import { signInUser } from '../utils/auth-helpers';

test('user can sign in', async ({ page }) => {
  await signInUser(page);
  await receivablesPage.open();
  await checkURL(page, '/receivables');
  await payablesPage.open();
  await checkURLNot(page, /^\/|.*sign-in.*/);
});

test('unauthenticated user is redirected to sign-in and authenticated user is redirected to main path', async ({
  page,
}) => {
  await receivablesPage.open();
  await checkURL(page, /.*sign-in.*/);
  await signInUser(page);
  await checkURL(page, '/');
});
