import { payablesPage } from '../pages/PayablesPage';
import {
  expect,
  type Locator,
  type Page,
  type TestInfo,
} from '@playwright/test';
import type { Route } from 'playwright-core';

export async function attachScreenshot(
  page: Page,
  name: string,
  testInfo: TestInfo
): Promise<void> {
  try {
    await page
      .waitForLoadState('domcontentloaded', { timeout: 2000 })
      .catch(() => {});
    await page
      .waitForSelector('body', { state: 'attached', timeout: 2000 })
      .catch(() => {});

    const fontRegex = /\.(woff2?|ttf|otf)(\?.*)?$/i;
    const fontHandler = async (route: Route) => {
      await route.abort().catch(() => {});
    };

    await page.route(fontRegex, fontHandler).catch(() => {});
    try {
      const shot = await page.screenshot({ timeout: 3000, fullPage: false });
      await testInfo.attach(name, {
        body: shot,
        contentType: 'image/png',
      });
    } finally {
      await page.unroute(fontRegex, fontHandler).catch(() => {});
    }
  } catch {
    // ignore
  }
}

export async function openPurchaseOrdersTab(page: Page): Promise<void> {
  const poTab = page.getByRole('tab', { name: /^Purchase orders$/i }).first();
  try {
    await expect(poTab).toBeVisible({ timeout: 15000 });
    await poTab.click({ timeout: 10000 });
  } catch {
    const billsTab = page.getByRole('tab', { name: /^Bills$/i }).first();
    if (await billsTab.isVisible().catch(() => false)) {
      await billsTab.focus();
      for (let i = 0; i < 3; i += 1) {
        await page.keyboard.press('ArrowRight');
        if (await poTab.isVisible().catch(() => false)) {
          await poTab.click({ timeout: 8000 }).catch(() => {});
          break;
        }
      }
    } else {
      const text = page.getByText(/^Purchase orders$/i).first();
      if (await text.isVisible().catch(() => false)) {
        await text.click({ timeout: 8000 }).catch(() => {});
      }
    }
  }

  await expect(poTab).toBeVisible();
  await Promise.race([
    page.getByRole('columnheader', { name: /^Number$/i }).waitFor({
      state: 'visible',
      timeout: 15000,
    }),
    page.getByRole('button', { name: /^Create Purchase Order$/i }).waitFor({
      state: 'visible',
      timeout: 15000,
    }),
  ]).catch(() => {});
}

export async function ensureLineItemValid(page: Page): Promise<void> {
  await page.evaluate(() =>
    console.log('[ensureLineItemValid] starting line item validation')
  );
  const addRowBtn = page
    .getByRole('button', { name: /Add item|Add row|Row/i })
    .first();
  if (await addRowBtn.isVisible().catch(() => false)) {
    await page.evaluate(() =>
      console.log('[ensureLineItemValid] clicking add row button')
    );
    await addRowBtn.click().catch(() => {});
  }

  const removeRowButtons = page
    .locator('table tbody [data-testid="remove-item"]')
    .or(page.locator('table tbody button', { hasText: /Remove|Delete|Trash/i }));
  const removeCount = await removeRowButtons.count();
  await page.evaluate(
    (count) =>
      console.log('[ensureLineItemValid] remove buttons detected', count),
    removeCount
  );
  for (let i = removeCount - 1; i >= 1; i -= 1) {
    const btn = removeRowButtons.nth(i);
    if (!(await btn.isVisible().catch(() => false))) continue;
    await page.evaluate(
      (idx) =>
        console.log('[ensureLineItemValid] removing extra row index', idx),
      i
    );
    await btn.click().catch(() => {});
  }

  const timestamp = Date.now();

  const rows = page.locator('table tbody tr');
  const rowsCount = await rows.count();
  await page.evaluate(
    (count) => console.log('[ensureLineItemValid] rows detected', count),
    rowsCount
  );

  for (let index = 0; index < rowsCount; index += 1) {
    const row = rows.nth(index);
    const rowHtml = await row.evaluate((el) => el.innerHTML).catch(() => '');
    await page.evaluate(
      ({ idx, html }) =>
        console.log(
          '[ensureLineItemValid] processing row',
          idx,
          'snapshot',
          html.slice(0, 200)
        ),
      { idx: index, html: rowHtml }
    );

    const nameField = await firstVisibleLocator([
      row.locator('input[placeholder="Line item"]'),
      row.locator('textarea[placeholder="Line item"]'),
      page.locator(`input[name="line_items.${index}.name"]`),
      page.locator(`textarea[name="line_items.${index}.name"]`),
    ]);
    if (nameField) {
      await page.evaluate(
        (idx) =>
          console.log('[ensureLineItemValid] ensuring name for row', idx),
        index
      );
      await row
        .click({ position: { x: 20, y: 20 }, timeout: 2000 })
        .catch(() => {});
      const current = await nameField.inputValue().catch(() => '');
      if (!current.trim()) {
        await page.evaluate(
          (idx) =>
            console.log('[ensureLineItemValid] filling name for row', idx),
          index
        );
        await nameField
          .fill(`E2E Item ${timestamp}-${index + 1}`)
          .catch(() => {});
      }
    }

    const quantityField = await firstVisibleLocator([
      row.locator(`input[name="line_items.${index}.quantity"]`),
      row.locator('input[placeholder*="qty" i]'),
      row.locator('input[name*="quantity" i]'),
    ]);
    if (quantityField) {
      const current = await quantityField.inputValue().catch(() => '');
      if (!current.trim()) {
        await page.evaluate(
          (idx) =>
            console.log('[ensureLineItemValid] filling quantity for row', idx),
          index
        );
        await quantityField.fill('1').catch(() => {});
      }
    }

    const priceField = await firstVisibleLocator([
      row.locator('td').nth(2).locator('input[type="text"]'),
      row.locator(`input[name="line_items.${index}.price"]`),
    ]);
    if (priceField) {
      await page.evaluate(
        (idx) =>
          console.log('[ensureLineItemValid] ensuring price for row', idx),
        index
      );
      await priceField.click({ timeout: 2000 }).catch(() => {});
      const current = await priceField.inputValue().catch(() => '');
      if (!current.trim()) {
        await page.evaluate(
          (idx) =>
            console.log('[ensureLineItemValid] filling price for row', idx),
          index
        );
        await priceField.fill('10').catch(() => {});
      }
    }
  }

  await page.evaluate(() =>
    console.log('[ensureLineItemValid] completed line item validation')
  );
}

export async function ensureVendorSelected(page: Page): Promise<void> {
  const vendorCombo = page.getByRole('combobox', { name: /^Vendor$/i });
  if (!(await vendorCombo.isVisible().catch(() => false))) return;

  await page.evaluate(() =>
    console.log('[ensureVendorSelected] opening vendor dropdown')
  );
  await vendorCombo.click().catch(() => {});
  await page.evaluate(() =>
    console.log('[ensureVendorSelected] waiting for vendor options to appear')
  );

  const optionsList = page
    .locator('[id^="Monite-Selector"], [data-radix-popper-content], body')
    .locator('[role="option"]');

  const firstRealOption = optionsList
    .filter({ hasNotText: /Create new/i })
    .first();
  const createNewButton = page
    .getByRole('button', { name: /Create new (vendor|counterpart|customer)/i })
    .or(page.locator('button:has-text("Create counterpart")'))
    .first();
  const loadingSpinner = page.locator(
    '[role="progressbar"], [data-testid="loading"], .MuiCircularProgress-root'
  );

  let optionsReady = true;
  try {
    await expect
      .poll(
        async () => {
          const spinnerVisible = await loadingSpinner
            .isVisible()
            .catch(() => false);
          if (spinnerVisible) {
            await page.evaluate(() =>
              console.log(
                '[ensureVendorSelected] waiting for vendor spinner to disappear'
              )
            );
            return 0;
          }
          const count = await optionsList.count();
          await page.evaluate(
            (value) =>
              console.log('[ensureVendorSelected] option count', value),
            count
          );
          return count;
        },
        { timeout: 20000 }
      )
      .toBeGreaterThan(0);
  } catch {
    optionsReady = false;
    await page.evaluate(() =>
      console.warn(
        '[ensureVendorSelected] options list did not become visible in time'
      )
    );
  }

  if (optionsReady && (await firstRealOption.isVisible().catch(() => false))) {
    await page.evaluate(() =>
      console.log('[ensureVendorSelected] selecting existing vendor')
    );
    await firstRealOption.click().catch(() => {});
    try {
      await expect
        .poll(
          async () => {
            const expanded = await vendorCombo.getAttribute('aria-expanded');
            return expanded === 'false';
          },
          { timeout: 10000 }
        )
        .toBeTruthy();
    } catch {
      await page.evaluate(() =>
        console.warn(
          '[ensureVendorSelected] vendor dropdown remained expanded after selection'
        )
      );
    }

    try {
      await expect
        .poll(
          async () => {
            const text = (
              await vendorCombo.evaluate((el) => el.textContent ?? '')
            ).trim();
            return text && !/select vendor/i.test(text) ? text : null;
          },
          { timeout: 15000 }
        )
        .toBeTruthy();
      const value = (
        await vendorCombo.evaluate((el) => el.textContent ?? '')
      ).trim();
      await page.evaluate(
        (selected) =>
          console.log('[ensureVendorSelected] vendor selected value', selected),
        value
      );
    } catch {
      await page.evaluate(() =>
        console.warn(
          '[ensureVendorSelected] failed to confirm vendor selection value'
        )
      );
    }
    return;
  }

  await page.evaluate(() =>
    console.warn(
      '[ensureVendorSelected] existing vendor not available; creation flow pending implementation'
    )
  );
  // TODO: implement vendor creation flow
  return;
}

export async function openCreatePurchaseOrder(
  page: Page,
  testInfo?: TestInfo
): Promise<void> {
  const emptyStateCta = page.getByRole('button', {
    name: /^Create Purchase Order$/i,
  });
  if (await emptyStateCta.isVisible().catch(() => false)) {
    await emptyStateCta.click();
    if (testInfo) {
      await attachScreenshot(page, 'after-empty-state-cta-click', testInfo);
    }
    return;
  }

  const createNewBtn = page.getByRole('button', { name: /Create new/i });
  if (await createNewBtn.isVisible().catch(() => false)) {
    await createNewBtn.click();
    if (testInfo) {
      await attachScreenshot(page, 'after-create-new-click', testInfo);
    }
  }

  const createMenuItem = page
    .getByRole('menuitem', {
      name: /Create new purchase order|Create Purchase Order/i,
    })
    .or(page.getByText(/^Create Purchase Order$/i));
  if (
    await createMenuItem
      .first()
      .isVisible()
      .catch(() => false)
  ) {
    await createMenuItem.first().click();
    if (testInfo) {
      await attachScreenshot(page, 'after-create-po-menu-click', testInfo);
    }
    return;
  }

  const poTab = page.getByRole('tab', { name: /Purchase order/i });
  if (await poTab.isVisible().catch(() => false)) {
    await poTab.click();
    if (testInfo) {
      await attachScreenshot(page, 'after-purchase-order-tab-click', testInfo);
    }
  }

  const createBtnInPopup = page.getByRole('button', {
    name: /Create new purchase order/i,
  });
  if (await createBtnInPopup.isVisible().catch(() => false)) {
    await createBtnInPopup.click();
    if (testInfo) {
      await attachScreenshot(page, 'after-create-po-button-click', testInfo);
    }
  }
}

export async function createAndSaveDraft(
  page: Page,
  testInfo?: TestInfo
): Promise<void> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const attemptLabel = `attempt-${attempt + 1}`;
    try {
      await openCreatePurchaseOrder(page, testInfo);
      try {
        await expect(
          page.getByRole('heading', { name: /Create purchase order/i })
        ).toBeVisible({ timeout: 15000 });
      } catch {
        await expect(
          page.getByRole('button', { name: /Save and continue|Save/i })
        ).toBeEnabled({ timeout: 15000 });
      }

      await ensureVendorSelected(page);
      await ensureLineItemValid(page);

      if (testInfo) {
        await attachLineItemState(
          page,
          testInfo,
          `line-items-before-save-${attemptLabel}`
        );
      }

      const saveBtn = page.getByRole('button', {
        name: /Save and continue|Save/i,
      });
      await expect(saveBtn).toBeEnabled({ timeout: 15000 });
      await page.evaluate(() =>
        console.log('[createAndSaveDraft] about to click save button')
      );
      await saveBtn.click();
      await page.evaluate(() =>
        console.log('[createAndSaveDraft] save button clicked')
      );
      await Promise.race([
        page
          .getByRole('button', { name: /Compose email/i })
          .waitFor({ state: 'visible', timeout: 8000 })
          .then(() =>
            page.evaluate(() =>
              console.log('[createAndSaveDraft] compose button became visible')
            )
          ),
        page
          .getByRole('heading', {
            name: /Purchase Order|Create purchase order/i,
          })
          .waitFor({ state: 'visible', timeout: 8000 })
          .then(() =>
            page.evaluate(() =>
              console.log('[createAndSaveDraft] PO heading became visible')
            )
          ),
      ]).catch(async (error) => {
        await page.evaluate(
          (message) =>
            console.warn('[createAndSaveDraft] race wait failed', message),
          error instanceof Error ? error.message : String(error)
        );
      });
      if (testInfo) {
        await attachLineItemState(
          page,
          testInfo,
          `line-items-after-save-${attemptLabel}`
        );
        await attachScreenshot(page, 'after-save-draft', testInfo);
      }
      return;
    } catch (error) {
      if (
        page.isClosed() ||
        (error instanceof Error && /closed/i.test(error.message))
      ) {
        await payablesPage.open().catch(() => {});
        await openPurchaseOrdersTab(page).catch(() => {});
        continue;
      }
      throw error;
    }
  }
}

async function attachLineItemState(
  page: Page,
  testInfo: TestInfo,
  name: string
): Promise<void> {
  try {
    const itemNameLocator = page.locator(
      'input[placeholder*="item" i], input[name*="item_name" i], input[aria-label*="item" i]'
    );
    const priceLocator = page.locator(
      'input[placeholder*="price" i], input[placeholder*="amount" i], input[name*="price" i], input[aria-label*="price" i]'
    );
    const quantityLocator = page.locator(
      'input[placeholder*="qty" i], input[placeholder*="quantity" i], input[name*="quantity" i], input[aria-label*="quantity" i]'
    );

    const maxCount = Math.max(
      await itemNameLocator.count(),
      await priceLocator.count(),
      await quantityLocator.count()
    );

    const items: Array<{
      index: number;
      name: string;
      price: string;
      quantity: string;
    }> = [];
    for (let i = 0; i < maxCount; i += 1) {
      const nameField = itemNameLocator.nth(i);
      const priceField = priceLocator.nth(i);
      const quantityField = quantityLocator.nth(i);

      const [nameValue, priceValue, quantityValue] = await Promise.all([
        nameField.inputValue().catch(() => ''),
        priceField.inputValue().catch(() => ''),
        quantityField.inputValue().catch(() => ''),
      ]);

      if (nameValue || priceValue || quantityValue) {
        items.push({
          index: i + 1,
          name: nameValue,
          price: priceValue,
          quantity: quantityValue,
        });
      }
    }

    await testInfo.attach(name, {
      body: Buffer.from(JSON.stringify(items, null, 2), 'utf-8'),
      contentType: 'application/json',
    });
  } catch {
    // ignore logging errors
  }
}

async function firstVisibleLocator(
  locators: Locator[]
): Promise<Locator | null> {
  for (const locator of locators) {
    if (await locator.isVisible().catch(() => false)) {
      return locator;
    }
  }
  return null;
}
