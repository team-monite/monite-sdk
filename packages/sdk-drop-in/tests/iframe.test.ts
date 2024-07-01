import { test, expect } from '@playwright/test';

import * as process from 'node:process';

import { WidgetType } from '../src/apps/MoniteApp';

const consumerPage = '/monite-iframe-app-consumer';

const routingPaths: Record<WidgetType, string> = {
  payables: '/payables',
  receivables: '/receivables',
  counterparts: '/counterparts',
  products: '/products',
  tags: '/tags',
  'approval-policies': '/approval-policies',
  onboarding: '/onboarding',
};

test.describe('Monite Iframe Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('/config.json', async (route) => {
      if (process.env.CI) {
        await route.fulfill({
          contentType: 'application/json',
          body: process.env.MONITE_E2E_APP_ADMIN_CONFIG_JSON,
        });
      } else {
        await route.continue();
      }
    });

    await page.goto(`${consumerPage}${routingPaths.receivables}`);
  });

  test('test the theme switcher', async ({ page }) => {
    await page.getByRole('button', { name: 'Material UI' }).click();
    await page.getByText('Theme').click();
    await page.getByRole('button', { name: 'Material UI' }).click();
    await page.getByRole('menuitem', { name: 'Monite' }).click();
    await page.getByRole('button', { name: 'Monite' }).click();
    await page.getByLabel('Dark Mode').check();
    await page.locator('.MuiBackdrop-root').click();

    const iframe = page.frameLocator('iframe');
    await iframe.locator('body').waitFor({ state: 'visible' });

    const themeElement = iframe.locator('body');
    const bgColor = await themeElement.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );

    expect(bgColor).toBe('rgb(18, 18, 18)');
  });

  test('test the Roles button under Settings', async ({ page }) => {
    await page.getByRole('button', { name: 'Settings' }).click();
    await expect(page.getByRole('button', { name: 'Roles' })).toBeVisible();
    await page.getByRole('button', { name: 'Roles' }).click();
  });

  test('test the Tags button under Settings', async ({ page }) => {
    await page.getByRole('button', { name: 'Settings' }).click();
    await expect(page.getByRole('button', { name: 'Tags' })).toBeVisible();
    await page.getByRole('button', { name: 'Tags' }).click();
  });

  test('test the Settings button under Settings', async ({ page }) => {
    await page.getByRole('button', { name: 'Settings' }).click();
    await expect(page.getByRole('button', { name: 'Settings' })).toBeVisible();
    await page.getByRole('button', { name: 'Settings' }).click();
  });

  const widgetTests = [
    { path: routingPaths.payables, name: 'Payables' },
    { path: routingPaths.counterparts, name: 'Counterparts' },
    { path: routingPaths.products, name: 'Products' },
  ] as const;

  widgetTests.forEach(({ path, name }) => {
    test(`should see the ${name.toLowerCase()} tab`, async ({ page }) => {
      await page.goto(`${consumerPage}${path}`);
      await page.getByRole('button', { name }).click();
      const iframe = page.frameLocator('iframe');
      await iframe.locator('body').waitFor({ state: 'visible' });
      await expect(iframe.getByRole('heading', { name })).toBeVisible();
    });
  });
});
