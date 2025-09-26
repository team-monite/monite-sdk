import { test } from '../fixtures/Fixture';
import { payablesPage } from '../pages/PayablesPage';
import { signInUser } from '../utils/auth-helpers';
import {
  createAndSaveDraft,
  openCreatePurchaseOrder,
} from '../utils/purchase-order-helpers';
import { expect } from '@playwright/test';

test.describe('Purchase Orders - validation', () => {
  test.beforeEach(async ({ page }) => {
    const auth = await signInUser(page);
    if (!auth.success) {
      test.skip();
      return;
    }

    await payablesPage.open();
  });

  test.skip('should prevent saving until required fields are filled', async ({
    page,
  }) => {
    const testInfo = test.info();
    await openCreatePurchaseOrder(page);

    const saveButton = page.getByRole('button', {
      name: /Save and continue|Save/i,
    });
    await expect(saveButton).toBeEnabled();

    await saveButton.click();

    await expect(
      page.getByText(/Please check the form for errors/i)
    ).toBeVisible();

    await createAndSaveDraft(page, testInfo);
  });
});
