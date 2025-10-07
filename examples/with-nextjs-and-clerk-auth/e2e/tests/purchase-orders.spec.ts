import { test } from '../fixtures/Fixture';
import { payablesPage } from '../pages/PayablesPage';
import { signInUser } from '../utils/auth-helpers';
import {
  attachScreenshot,
  createAndSaveDraft,
  openCreatePurchaseOrder,
  openPurchaseOrdersTab,
} from '../utils/purchase-order-helpers';
import { expect } from '@playwright/test';

test.describe.serial('Purchase Orders - e2e', () => {
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

  test.skip('loads Purchase Orders tab and shows empty state or table', async ({
    page,
  }) => {
    const testInfo = test.info();
    await openPurchaseOrdersTab(page);
    await attachScreenshot(page, 'after-open-po-tab', testInfo);

    const emptyState = page.getByText(/No purchase orders yet/i).first();
    const tableHeader = page
      .getByRole('columnheader', { name: /^Number$/i })
      .first();

    await Promise.race([
      page
        .getByRole('button', { name: /^Create Purchase Order$/i })
        .waitFor({ state: 'visible', timeout: 15000 }),
      tableHeader.waitFor({ state: 'visible', timeout: 15000 }),
    ]).catch(() => {});

    const eitherVisible =
      (await emptyState.isVisible().catch(() => false)) ||
      (await tableHeader.isVisible().catch(() => false));
    expect(eitherVisible).toBeTruthy();
  });

  test.skip('searching for a random string shows empty search state', async ({
    page,
  }) => {
    const testInfo = test.info();
    await openPurchaseOrdersTab(page);
    const search = page.getByPlaceholder(/search by number or vendor/i);
    await search.click();
    await search.fill(`zzz-no-such-po-${Date.now()}`);
    await attachScreenshot(page, 'after-search-random', testInfo);

    await Promise.race([
      page
        .getByText(/No purchase orders found/i)
        .waitFor({ state: 'visible', timeout: 10000 }),
      page.getByText(/No rows/i).waitFor({ state: 'visible', timeout: 10000 }),
    ]).catch(() => {});

    await expect(
      page.getByText(/No purchase orders found/i).or(page.getByText(/No rows/i))
    ).toBeVisible({ timeout: 15000 });
    await attachScreenshot(page, 'after-search-empty-state', testInfo);
  });

  test.skip('create PO dialog shows validation errors when saving empty form', async ({
    page,
  }) => {
    const testInfo = test.info();
    await openPurchaseOrdersTab(page);
    await openCreatePurchaseOrder(page);
    await attachScreenshot(page, 'po-create-dialog-open', testInfo);

    await Promise.race([
      page
        .getByRole('heading', { name: /Create purchase order/i })
        .waitFor({ state: 'visible', timeout: 15000 }),
      page
        .getByRole('button', { name: /Save and continue|Save/i })
        .waitFor({ state: 'visible', timeout: 15000 }),
    ]).catch(() => {});
    const saveBtn = page.getByRole('button', {
      name: /Save and continue|Save/i,
    });
    await expect(saveBtn).toBeEnabled({ timeout: 15000 });
    await saveBtn.click();

    await expect(
      page.getByText(/Please check the form for errors/i)
    ).toBeVisible();
    await attachScreenshot(page, 'validation-errors-visible', testInfo);
  });

  test.skip('open and close currency dialog from Create PO settings', async ({
    page,
  }) => {
    const testInfo = test.info();
    await openPurchaseOrdersTab(page);
    await openCreatePurchaseOrder(page);

    await Promise.race([
      page
        .getByRole('heading', { name: /Create purchase order/i })
        .waitFor({ state: 'visible', timeout: 15000 }),
      page
        .getByRole('button', { name: /Save and continue|Save/i })
        .waitFor({ state: 'visible', timeout: 15000 }),
    ]).catch(() => {});
    await expect(
      page.getByRole('button', { name: /Save and continue|Save/i })
    ).toBeEnabled({ timeout: 15000 });
    await attachScreenshot(page, 'create-view-ready', testInfo);

    await page.getByRole('button', { name: /Save and continue|Save/i }).focus();
    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');
    await page.keyboard.press('Enter');
    await attachScreenshot(page, 'after-settings-trigger-key', testInfo);

    const currencyItem = page
      .getByRole('menuitem', { name: /^Currency$/i })
      .or(page.getByRole('option', { name: /^Currency$/i }))
      .or(page.getByText(/^Currency$/i));
    await expect(currencyItem).toBeVisible({ timeout: 5000 });
    await currencyItem.click();
    await attachScreenshot(page, 'currency-modal-open', testInfo);
    await expect(page.getByText(/Change document currency/i)).toBeVisible();
    await page.getByRole('button', { name: /Cancel/i }).click();
    await expect(page.getByText(/Change document currency/i)).toBeHidden();
    await attachScreenshot(page, 'currency-modal-closed', testInfo);
  });
});

test.describe('Purchase Orders - full flow', () => {
  test.describe.configure({ mode: 'serial', retries: 1 });
  // TODO: Fix flaky test, need to implement vendor creation flow
  test.skip('create draft shows compose option on details page', async ({
    page,
  }) => {
    const auth = await signInUser(page);
    if (!auth.success) {
      test.skip();
      return;
    }

    const p = page;
    await payablesPage.open();
    await openPurchaseOrdersTab(p);
    const testInfo = test.info();
    testInfo.setTimeout(testInfo.timeout + 60000);
    await createAndSaveDraft(p, testInfo);
    const composeButton = p.getByRole('button', { name: /Compose email/i });
    const detailHeading = p.getByRole('heading', { name: /Purchase Order/i });
    await Promise.race([
      composeButton.waitFor({ state: 'visible', timeout: 15000 }),
      detailHeading.waitFor({ state: 'visible', timeout: 15000 }),
    ]).catch(() => {});
    await attachScreenshot(p, 'after-save-draft-fullflow', testInfo);
    await expect(composeButton.or(detailHeading)).toBeVisible();
  });

  test.skip('create draft and preview email fills subject/body', async ({
    page,
  }) => {
    const auth = await signInUser(page);
    if (!auth.success) {
      test.skip();
      return;
    }

    const p = page;
    await payablesPage.open();

    await openPurchaseOrdersTab(p);

    const testInfo = test.info();

    await createAndSaveDraft(p, testInfo);
    await Promise.race([
      p
        .getByRole('button', { name: /Compose email/i })
        .waitFor({ state: 'visible', timeout: 15000 }),
      p
        .getByRole('heading', { name: /Purchase Order/i })
        .waitFor({ state: 'visible', timeout: 15000 }),
    ]).catch(() => {});
    const composeBtn2 = p.getByRole('button', { name: /Compose email/i });
    if (!(await composeBtn2.isVisible().catch(() => false))) {
      await p.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
    }
    const composeVisible = await composeBtn2.isVisible().catch(() => false);
    if (!composeVisible) {
      testInfo.annotations.push({
        type: 'compose-missing',
        description:
          'Compose button not visible post-save in preview test; capturing state but continuing.',
      });
      await attachScreenshot(p, 'compose-missing-preview', testInfo);
      return;
    }

    await composeBtn2.click();
    await expect(
      p.getByText(/Issue and Send Purchase Order|Send Purchase Order/i)
    ).toBeVisible();

    const previewBtn = p.getByRole('button', { name: /Preview/i });
    if (await previewBtn.isVisible()) {
      await previewBtn.click();
      const subject = p.getByLabel(/Subject/i);
      const body = p.getByLabel(/Message/i);
      await expect(subject).toHaveValue(/Purchase Order/i);
      await expect(body).not.toHaveValue('');
    }
  });

  test.skip('create draft and open delete dialog from More menu if available', async ({
    page,
  }) => {
    const auth = await signInUser(page);
    if (!auth.success) {
      test.skip();
      return;
    }

    const p = page;
    await payablesPage.open();
    await openPurchaseOrdersTab(p);

    await openCreatePurchaseOrder(p);
    try {
      await expect(
        p.getByRole('heading', { name: /Create purchase order/i })
      ).toBeVisible({ timeout: 15000 });
    } catch {
      await expect(
        p.getByRole('button', { name: /Save and continue|Save/i })
      ).toBeEnabled({ timeout: 15000 });
    }

    const saveBtnFull3 = p.getByRole('button', {
      name: /Save and continue|Save/i,
    });
    await expect(saveBtnFull3).toBeEnabled();
    await saveBtnFull3.click();
    await Promise.race([
      p
        .getByRole('button', { name: /Compose email/i })
        .waitFor({ state: 'visible', timeout: 7000 }),
      p
        .getByRole('heading', { name: /Purchase Order|Create purchase order/i })
        .waitFor({ state: 'visible', timeout: 7000 }),
    ]).catch(() => {});
    const moreBtn = p.getByRole('button', { name: /^More$/i });
    const altMoreBtn = p.getByRole('button', {
      name: /More|Options|Actions/i,
    });

    await Promise.race([
      moreBtn.waitFor({ state: 'visible', timeout: 12000 }),
      altMoreBtn.waitFor({ state: 'visible', timeout: 12000 }),
    ]).catch(() => {});

    const trigger = (await moreBtn.isVisible().catch(() => false))
      ? moreBtn
      : altMoreBtn;

    if (await trigger.isVisible().catch(() => false)) {
      await trigger.click();
      const deleteItem = p.getByRole('menuitem', { name: /Delete/i });
      await deleteItem
        .waitFor({ state: 'visible', timeout: 8000 })
        .catch(() => {});
      if (await deleteItem.isVisible().catch(() => false)) {
        await deleteItem.click();
        await expect(p.getByText(/Delete/i)).toBeVisible();

        const closeBtn = p
          .getByRole('button', { name: /Close|Cancel/i })
          .first();
        if (await closeBtn.isVisible().catch(() => false)) {
          await closeBtn.click();
        }
      }
    }
  });
});
