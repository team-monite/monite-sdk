import { type Page, expect } from '@playwright/test';

export async function createVendorIfNeeded(page: Page): Promise<string | null> {
  try {
    const vendorCombo = page.getByRole('combobox', { name: /^Vendor$/i });

    if (!(await vendorCombo.isVisible().catch(() => false))) {
      console.log('[createVendorIfNeeded] Vendor combo not visible');
      return null;
    }

    await vendorCombo.click();
    await page.waitForTimeout(500);

    const existingOptions = page
      .locator('[role="option"]')
      .filter({ hasNotText: /Create new/i });

    const optionCount = await existingOptions.count();

    if (optionCount > 0) {
      console.log(
        `[createVendorIfNeeded] Found ${optionCount} existing vendors`
      );

      await existingOptions.first().click();
      await expect(vendorCombo).not.toHaveAttribute('aria-expanded', 'true', {
        timeout: 5000,
      });

      const selectedText = await vendorCombo.textContent();
      console.log(`[createVendorIfNeeded] Selected vendor: ${selectedText}`);
      return selectedText || null;
    }

    console.log('[createVendorIfNeeded] No existing vendors, creating new one');

    const createOption = page
      .getByRole('button', { name: /Create new (vendor|counterpart)/i })
      .or(page.getByRole('option', { name: /Create new/i }))
      .first();

    if (await createOption.isVisible()) {
      await createOption.click();
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

      await fillVendorForm(page);

      const saveButton = page
        .getByRole('button', { name: /Save|Create|Submit/i })
        .filter({ hasNotText: /Cancel/i })
        .first();

      await saveButton.click();
      await expect(page.locator('[role="dialog"]')).toBeHidden({
        timeout: 10000,
      });

      const newVendorText = await vendorCombo.textContent();
      console.log(`[createVendorIfNeeded] Created vendor: ${newVendorText}`);
      return newVendorText || null;
    }

    console.log(
      '[createVendorIfNeeded] Create option not found, typing vendor name'
    );
    await vendorCombo.fill('Test Vendor Inc.');
    await page.keyboard.press('Enter');

    return 'Test Vendor Inc.';
  } catch (error) {
    console.error('[createVendorIfNeeded] Error:', error);
    return null;
  }
}

async function fillVendorForm(page: Page): Promise<void> {
  const orgRadio = page.getByRole('radio', { name: /Organization|Company/i });
  if (await orgRadio.isVisible().catch(() => false)) {
    await orgRadio.check();
  }

  const nameField = page
    .getByLabel(/Company name|Organization name|Name/i)
    .or(page.getByPlaceholder(/Company name|Organization name/i))
    .first();

  if (await nameField.isVisible()) {
    await nameField.fill(`Test Vendor ${Date.now()}`);
  }

  const emailField = page
    .getByLabel(/Email/i)
    .or(page.getByPlaceholder(/email/i))
    .first();

  if (await emailField.isVisible()) {
    await emailField.fill(`vendor${Date.now()}@test.com`);
  }

  const phoneField = page
    .getByLabel(/Phone/i)
    .or(page.getByPlaceholder(/phone/i))
    .first();

  if (await phoneField.isVisible()) {
    await phoneField.fill('+1234567890');
  }

  const addressLine1 = page
    .getByLabel(/Address|Street/i)
    .or(page.getByPlaceholder(/Address|Street/i))
    .first();

  if (await addressLine1.isVisible()) {
    await addressLine1.fill('123 Test Street');
  }

  const cityField = page
    .getByLabel(/City/i)
    .or(page.getByPlaceholder(/City/i))
    .first();

  if (await cityField.isVisible()) {
    await cityField.fill('Test City');
  }

  const postalCodeField = page
    .getByLabel(/Postal code|Zip/i)
    .or(page.getByPlaceholder(/Postal code|Zip/i))
    .first();

  if (await postalCodeField.isVisible()) {
    await postalCodeField.fill('12345');
  }

  const countryField = page
    .getByLabel(/Country/i)
    .or(page.getByRole('combobox', { name: /Country/i }))
    .first();

  if (await countryField.isVisible()) {
    await countryField.click();

    const usOption = page.getByRole('option', { name: /United States|USA/i });

    if (await usOption.isVisible().catch(() => false)) {
      await usOption.click();
    } else {
      const firstCountry = page.getByRole('option').first();

      if (await firstCountry.isVisible()) {
        await firstCountry.click();
      }
    }
  }

  console.log('[fillVendorForm] Vendor form filled with test data');
}
