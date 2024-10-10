import { WidgetType } from '@/apps/MoniteApp';
import { expect, test } from '@playwright/test';

import process from 'node:process';

const consumerPage = '/monite-iframe-app-demo';

const routingPaths: Record<WidgetType, string> = {
  payables: '/payables',
  receivables: '/receivables',
  counterparts: '/counterparts',
  products: '/products',
  tags: '/tags',
  'approval-policies': '/approval-policies',
  onboarding: '/onboarding',
};

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
});

test('theme switching works', async ({ page }) => {
  await page.goto(`${consumerPage}${routingPaths.receivables}`);

  const iframe = page.frameLocator('iframe');

  await expect(iframe.getByRole('heading', { name: 'Sales' })).toBeVisible();

  await page.getByRole('button', { name: 'Material UI' }).click();
  await page.getByText('Theme').click();
  await page.getByRole('button', { name: 'Material UI' }).click();
  await page.getByRole('menuitem', { name: 'Monite' }).click();
  await page.getByRole('button', { name: 'Monite' }).click();
  await page.getByLabel('Dark Mode').check();
  await page.getByRole('menuitem', { name: 'Monite' }).click();

  const themeElement = iframe.locator('body');
  const bgColor = await themeElement.evaluate(
    (el) => getComputedStyle(el).backgroundColor
  );

  expect(bgColor).toBe('rgb(18, 18, 18)');
});

test('test the Roles & Approvals button under Settings', async ({ page }) => {
  await page.goto(`${consumerPage}${routingPaths.receivables}`);

  await page.getByRole('button', { name: 'Settings' }).click();
  await expect(page.getByRole('button', { name: 'Roles & Approvals' })).toBeVisible();
  await page.getByRole('button', { name: 'Roles & Approvals' }).click();

  const iframe = page.frameLocator('iframe');
  await expect(
    iframe.getByRole('heading', { name: 'Roles & Approvals' })
  ).toBeVisible();
});

test('test the Tags button under Settings', async ({ page }) => {
  await page.goto(`${consumerPage}${routingPaths.receivables}`);

  await page.getByRole('button', { name: 'Settings' }).click();
  await expect(page.getByRole('button', { name: 'Tags' })).toBeVisible();
  await page.getByRole('button', { name: 'Tags' }).click();

  const iframe = page.frameLocator('iframe');
  await expect(iframe.getByRole('heading', { name: 'Tags' })).toBeVisible();
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
    await expect(iframe.getByRole('heading', { name })).toBeVisible();
  });
});
