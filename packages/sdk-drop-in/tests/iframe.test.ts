import { test } from '@playwright/test';

import * as fs from 'node:fs';
import * as process from 'node:process';

import { WidgetType } from '../src/apps/MoniteApp';

interface Config {
  client_id: string;
  client_secret: string;
  entity_user_id: string;
  grant_type: string;
}

const getMockConfig = (): Config => {
  const config: Config = JSON.parse(
    fs.readFileSync('./public/config.json', 'utf8')
  );
  return { ...config };
};

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

const getAuthTokenConfig = (): Config =>
  process.env.MONITE_E2E_APP_ADMIN_CONFIG_JSON
    ? JSON.parse(process.env.MONITE_E2E_APP_ADMIN_CONFIG_JSON)
    : getMockConfig();

console.log('ToDo: check where we store the token', getAuthTokenConfig());

test.describe('Monite Iframe Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${consumerPage}${routingPaths.receivables}`);
  });

  test('should see the sales and navigate inside the iframe', async ({
    page,
  }) => {
    const iframe = page.frameLocator('iframe');

    await iframe.getByRole('heading', { name: 'Sales' }).click();
    await iframe.getByRole('tab', { name: 'Invoices' }).click();
    await iframe.getByRole('tab', { name: 'Quotes' }).click();
    await iframe.getByRole('tab', { name: 'Credit notes' }).click();
    await iframe.getByRole('button', { name: 'Create Invoice' }).click();
    await iframe.getByLabel('close').click();
  });

  test('test the theme switcher and tabs', async ({ page }) => {
    await page.getByRole('button', { name: 'Material UI' }).click();
    await page.getByText('Theme').click();
    await page.getByRole('button', { name: 'Material UI' }).click();
    await page.getByRole('menuitem', { name: 'Monite' }).click();
    await page.getByRole('button', { name: 'Monite' }).click();
    await page.getByLabel('Dark Mode').check();
    await page.locator('.MuiBackdrop-root').click();
    await page.getByRole('button', { name: 'Settings' }).click();
    await page.getByRole('button', { name: 'Roles' }).click();
    await page.getByRole('button', { name: 'Tags' }).click();

    const iframe = page.frameLocator('iframe');
    await iframe.getByRole('button', { name: 'Create new tag' }).click();
    await iframe.getByRole('button', { name: 'Cancel' }).click();
  });

  const widgetTests = [
    { path: routingPaths.payables, name: 'Payables' },
    { path: routingPaths.counterparts, name: 'Counterparts' },
    { path: routingPaths.products, name: 'Products' },
  ];

  widgetTests.forEach(({ path, name }) => {
    test(`should see the ${name.toLowerCase()} tab`, async ({ page }) => {
      await page.goto(`${consumerPage}${path}`);
      const iframe = page.frameLocator('iframe');
      await iframe.getByRole('heading', { name }).click();
    });
  });
});
