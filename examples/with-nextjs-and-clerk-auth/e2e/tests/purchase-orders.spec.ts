import { test } from '../fixtures/Fixture';
import { payablesPage } from '../pages/PayablesPage';
import { signInUser } from '../utils/auth-helpers';
import { expect, test as base } from '@playwright/test';

test.describe('Purchase Orders - e2e', () => {
  test.beforeEach(async ({ page }) => {
    const auth = await signInUser(page);
    if (!auth.success) {
      test.info().annotations.push({
        type: 'auth',
        description: auth.error || 'missing creds',
      });
    }
    await payablesPage.open();
  });

  test('loads Purchase Orders tab and shows empty state or table', async ({
    page,
  }) => {
    await page.getByRole('tab', { name: /Purchase orders/i }).click();
    const emptyState = page.getByText(/No purchase orders/i);
    const tableHeader = page.getByRole('columnheader', { name: /Number/i });
    await expect(emptyState.or(tableHeader)).toBeVisible();
  });

  test('searching for a random string shows empty search state', async ({
    page,
  }) => {
    await page.getByRole('tab', { name: /Purchase orders/i }).click();
    const search = page.getByPlaceholder(/search by number or vendor/i);
    await search.click();
    await search.fill(`zzz-no-such-po-${Date.now()}`);

    await expect(
      page.getByText(/No purchase orders found/i).or(page.getByText(/No rows/i))
    ).toBeVisible();
  });

  test('create PO dialog shows validation errors when saving empty form', async ({
    page,
  }) => {
    await page.getByRole('tab', { name: /Purchase orders/i }).click();
    await page.getByRole('button', { name: /Create/i }).click();
    await page
      .getByRole('menuitem', { name: /Create Purchase Order/i })
      .click();

    const saveBtn = page.getByRole('button', {
      name: /Save and continue|Save/i,
    });
    await saveBtn.click();

    await expect(
      page.getByText(/Please check the form for errors/i)
    ).toBeVisible();
  });

  test('open and close currency dialog from Create PO settings', async ({
    page,
  }) => {
    await page.getByRole('tab', { name: /Purchase orders/i }).click();
    await page.getByRole('button', { name: /Create/i }).click();
    await page
      .getByRole('menuitem', { name: /Create Purchase Order/i })
      .click();

    const settingsBtn = page
      .locator('button')
      .filter({ has: page.locator('svg') })
      .nth(0);
    await settingsBtn.click();

    await page.getByRole('menuitem', { name: /Currency/i }).click();
    await expect(page.getByText(/Change document currency/i)).toBeVisible();
    await page.getByRole('button', { name: /Cancel/i }).click();
    await expect(page.getByText(/Change document currency/i)).toBeHidden();
  });
});

base.describe.skip('Purchase Orders - full flow', () => {
  base('create draft and open compose email', async ({ page }) => {
    const auth = await signInUser(page);
    if (!auth.success) base.skip(true, auth.error);

    await payablesPage.open();
    await page.getByRole('tab', { name: /Purchase orders/i }).click();

    await page.getByRole('button', { name: /Create/i }).click();
    await page
      .getByRole('menuitem', { name: /Create Purchase Order/i })
      .click();

    await page.getByLabel(/Vendor/i).click();

    const vendorOption = page.locator('li[role="option"]').first();
    if (await vendorOption.isVisible()) {
      await vendorOption.click();
    }

    await page
      .getByRole('button', { name: /Add row/i })
      .click()
      .catch(() => {});

    const itemName = page.getByPlaceholder(/Enter item name/i);
    if (await itemName.isVisible()) {
      await itemName.fill('Test item');
    }

    await page.getByRole('button', { name: /Save and continue|Save/i }).click();
    await expect(page.getByText(/Purchase order/i)).toBeVisible();

    const composeBtn = page.getByRole('button', { name: /Compose email/i });
    if (await composeBtn.isVisible()) {
      await composeBtn.click();
      await expect(page.getByText(/Send email/i)).toBeVisible();
    }
  });

  base(
    'create draft and preview email fills subject/body',
    async ({ page }) => {
      const auth = await signInUser(page);
      if (!auth.success) base.skip(true, auth.error);

      await payablesPage.open();
      await page.getByRole('tab', { name: /Purchase orders/i }).click();

      await page.getByRole('button', { name: /Create/i }).click();
      await page
        .getByRole('menuitem', { name: /Create Purchase Order/i })
        .click();

      await page.getByLabel(/Vendor/i).click();
      const vendorOption = page.locator('li[role="option"]').first();
      if (await vendorOption.isVisible()) {
        await vendorOption.click();
      }

      await page
        .getByRole('button', { name: /Add row/i })
        .click()
        .catch(() => {});
      const itemName = page.getByPlaceholder(/Enter item name/i);
      if (await itemName.isVisible()) {
        await itemName.fill('E2E Item');
      }

      await page
        .getByRole('button', { name: /Save and continue|Save/i })
        .click();

      await expect(page.getByText(/Purchase order/i)).toBeVisible();
      await page.getByRole('button', { name: /Compose email/i }).click();
      await expect(
        page.getByText(/Issue and Send Purchase Order|Send Purchase Order/i)
      ).toBeVisible();

      const previewBtn = page.getByRole('button', { name: /Preview/i });
      if (await previewBtn.isVisible()) {
        await previewBtn.click();
        const subject = page.getByLabel(/Subject/i);
        const body = page.getByLabel(/Message/i);
        await expect(subject).toHaveValue(/Purchase Order/i);
        await expect(body).not.toHaveValue('');
      }
    }
  );

  base(
    'create draft and open delete dialog from More menu if available',
    async ({ page }) => {
      const auth = await signInUser(page);
      if (!auth.success) base.skip(true, auth.error);

      await payablesPage.open();
      await page.getByRole('tab', { name: /Purchase orders/i }).click();

      await page.getByRole('button', { name: /Create/i }).click();
      await page
        .getByRole('menuitem', { name: /Create Purchase Order/i })
        .click();

      await page
        .getByRole('button', { name: /Save and continue|Save/i })
        .click();
      await expect(page.getByText(/Purchase order/i)).toBeVisible();

      const moreBtn = page.getByRole('button', { name: /More/i });
      if (await moreBtn.isVisible()) {
        await moreBtn.click();
        const deleteItem = page.getByRole('menuitem', { name: /Delete/i });
        if (await deleteItem.isVisible()) {
          await deleteItem.click();
          await expect(page.getByText(/Delete/i)).toBeVisible();

          const closeBtn = page
            .getByRole('button', { name: /Close|Cancel/i })
            .first();
          if (await closeBtn.isVisible()) {
            await closeBtn.click();
          }
        }
      }
    }
  );
});
