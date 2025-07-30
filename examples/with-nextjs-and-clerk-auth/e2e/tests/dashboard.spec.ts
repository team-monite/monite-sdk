import { test } from '../fixtures/Fixture';
import { dashboardPage } from '../pages/DashboardPage';
import { invoicingPage } from '../pages/InvoicingPage';
import { checkURL } from '../utils/URLChecker';
import { signInUser } from '../utils/auth-helpers';

test.describe('Dashboard', () => {
  test('should redirect to sign-in when not authenticated', async ({
    page,
  }) => {
    await dashboardPage.open();
    await checkURL(page, /.*sign-in.*/);
  });

  test('authenticated user can access home page', async ({ page }) => {
    await signInUser(page);
    await dashboardPage.open();
    await dashboardPage.mainTextLabel.waitForElementPresent();
  });

  test('navigate to Invoicing via sidebar', async ({ page }) => {
    await signInUser(page);
    await dashboardPage.open();
    await dashboardPage.sideBarInvoicing.click();
    await checkURL(page, '/receivables');
    await invoicingPage.createInvoiceButton.waitForElementPresent();
  });
});
