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
  'user-roles': '/user-roles',
  'document-templates': '/document-templates',
};

test.beforeEach(async ({ page }) => {
  await page.route('/config.json', async (route) => {
    if (process.env.CI) {
      await route.fulfill({
        contentType: 'application/json',
        body: process.env.MONITE_E2E_APP_ADMIN_CONFIG_JSON,
      });
    } else {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          stand: 'dev',
          api_url: 'https://api.dev.monite.com',
          app_basename: 'monite-iframe-app',
          app_hostname: 'localhost',
          entity_user_id: 'mocked_entity_id',
          client_id: 'mocked_client_id',
          client_secret: 'mocked_client_secret',
        }),
      });
    }
  });

  if (!process.env.CI) {
    await page.route('**/auth/token', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mocked_access_token_for_e2e_tests',
          token_type: 'Bearer',
          expires_in: 3600,
        }),
      });
    });

    await page.route('**/entity_users/my_entity', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'mocked_entity_id',
          name: 'Mocked Entity for E2E Tests',
          type: 'organization',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        }),
      });
    });
  }
});

test('test the Tags button under Settings', async ({ page }) => {
  await page.goto(`${consumerPage}${routingPaths.receivables}?test=playwright`);

  await page.getByRole('button', { name: 'Settings' }).click();
  await expect(page.getByRole('button', { name: 'Tags' })).toBeVisible();
  await page.getByRole('button', { name: 'Tags' }).click();

  await expect(
    page.getByRole('heading', { name: 'Tags', exact: true })
  ).toBeVisible();
});

const widgetTests = [
  { path: routingPaths.payables, name: 'Payables' },
  { path: routingPaths.counterparts, name: 'Counterparts' },
  { path: routingPaths.products, name: 'Products' },
] as const;

widgetTests.forEach(({ path, name }) => {
  test(`should see the ${name.toLowerCase()} tab`, async ({ page }) => {
    await page.goto(`${consumerPage}${path}?test=playwright`);
    await page.getByRole('button', { name }).click();
    await expect(
      page.getByRole('heading', { name, exact: true })
    ).toBeVisible();
  });
});
