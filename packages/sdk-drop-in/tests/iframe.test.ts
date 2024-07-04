import { WidgetType } from '@/apps/MoniteApp';
import { test, expect } from '@playwright/test';

import { writeFileSync } from 'fs';
import * as process from 'node:process';
import * as path from 'path';
import { fileURLToPath } from 'url';

const mockedConfigData = {
  stand: 'dev',
  api_url: 'https://api.dev.monite.com',
  app_basename: 'monite-iframe-app',
  app_hostname: '127.0.0.1',
  entity_user_id: 'mocked_entity_id',
  client_id: 'mocked_client_id',
  client_secret: 'mocked_client_secret',
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.CI) {
  const configFilePath = path.join(__dirname, '../public', 'config.json');
  writeFileSync(configFilePath, JSON.stringify(mockedConfigData, null, 2));
}

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

  await page.goto(`${consumerPage}${routingPaths.receivables}`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });

  const iframeElement = await page.locator('iframe').elementHandle();

  if (!iframeElement) {
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  const frame = await iframeElement?.contentFrame();

  if (!frame) {
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  await frame?.waitForURL(new RegExp('.*/receivables.*', 'i'), {
    timeout: 60000,
  });
});

test('test the theme switcher', async ({ page }) => {
  const iframe = page.frameLocator('iframe');
  await iframe.locator('body').waitFor({ state: 'visible', timeout: 10_000 });

  await page.getByRole('button', { name: 'Material UI' }).click();
  await page.getByText('Theme').click();
  await page.getByRole('button', { name: 'Material UI' }).click();
  await page.getByRole('menuitem', { name: 'Monite' }).click();
  await page.getByRole('button', { name: 'Monite' }).click();
  await page.getByLabel('Dark Mode').check();
  await page.locator('.MuiBackdrop-root').click();

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

  const iframe = page.frameLocator('iframe');
  await expect(iframe.getByRole('heading', { name: 'Roles' })).toBeVisible();
});

test('test the Tags button under Settings', async ({ page }) => {
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
