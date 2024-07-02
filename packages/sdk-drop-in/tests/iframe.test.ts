import { test, expect } from '@playwright/test';

import * as process from 'node:process';

import { WidgetType } from '../src/apps/MoniteApp';

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

  await page.goto(`${consumerPage}${routingPaths.receivables}`);
});

test('test the theme switcher', async ({ page }) => {
  page.on('response', (response) => {
    console.log('Response:', response.url(), response.status());
  });

  const iframe = page.frameLocator('iframe');
  await iframe.locator('body').waitFor({ state: 'visible', timeout: 40000 });

  console.log(
    'Iframe body state:',
    await iframe.locator('body').evaluate((node) => node.innerHTML)
  ); // Log iframe content

  await page.getByRole('button', { name: 'Material UI' }).click();
  await page.getByText('Theme').click();
  await page.getByRole('button', { name: 'Material UI' }).click();
  await page.getByRole('menuitem', { name: 'Monite' }).click();
  await page.getByRole('button', { name: 'Monite' }).click();
  await page.getByLabel('Dark Mode').check();
  await page.locator('.MuiBackdrop-root').click();

  const themeElement = iframe.locator('body');
  await themeElement.waitFor({ state: 'visible', timeout: 40000 });

  const bgColor = await themeElement.evaluate(
    (el) => getComputedStyle(el).backgroundColor
  );
  console.log('Background color:', bgColor);

  await page.waitForTimeout(5000);
  expect(bgColor).toBe('rgb(18, 18, 18)');
});

test('test the Roles button under Settings', async ({ page }) => {
  page.on('response', (response) => {
    console.log('Response:', response.url(), response.status());
  });
  await page.getByRole('button', { name: 'Settings' }).click();
  await expect(page.getByRole('button', { name: 'Roles' })).toBeVisible();
  await page.getByRole('button', { name: 'Roles' }).click();

  const iframe = page.frameLocator('iframe');
  await iframe.locator('body').waitFor({ state: 'visible', timeout: 40000 });

  console.log(
    'Iframe body state:',
    await iframe.locator('body').evaluate((node) => node.innerHTML)
  ); // Log iframe content

  await expect(iframe.getByRole('heading', { name: 'Roles' })).toBeVisible();
});

test('test the Tags button under Settings', async ({ page }) => {
  await page.getByRole('button', { name: 'Settings' }).click();
  await expect(page.getByRole('button', { name: 'Tags' })).toBeVisible();
  await page.getByRole('button', { name: 'Tags' }).click();

  const iframe = page.frameLocator('iframe');
  await iframe.locator('body').waitFor({ state: 'visible', timeout: 40000 });

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
    await iframe.locator('body').waitFor({ state: 'visible' });
    await expect(iframe.getByRole('heading', { name })).toBeVisible();
  });
});
