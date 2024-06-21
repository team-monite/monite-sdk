import { test } from '@playwright/test';

import * as fs from 'node:fs';

const getMockConfig = () => {
  const config = JSON.parse(fs.readFileSync('./public/config.json', 'utf8'));
  return {
    client_id: config.client_id,
    client_secret: config.client_secret,
    entity_user_id: config.entity_user_id,
    grant_type: config.grant_type,
  };
};

const consumerPage = '/monite-iframe-app-consumer/receivables';
const authTokenPath = '/v1/auth/token';

test.describe('Monite Iframe Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(consumerPage);
  });

  test('should fetch token and render iframe', async ({ page }) => {
    const [] = await Promise.all([
      page.waitForRequest((request) => request.url().includes(authTokenPath)),
      page.waitForSelector('iframe.monite-iframe-app'),
    ]);

    const tokenResponse = getMockConfig();

    await page.route(`https://api.dev.monite.com/${authTokenPath}`, (route) => {
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(tokenResponse),
      });
    });
  });

  test('should see the sales and navigate inside the iframe', async ({
    page,
  }) => {
    const iframe = page.frameLocator('#monite-iframe');

    await iframe.getByRole('heading', { name: 'Sales' }).click();
    await iframe.getByRole('tab', { name: 'Invoices' }).click();
    await iframe.getByRole('tab', { name: 'Quotes' }).click();
    await iframe.getByRole('tab', { name: 'Credit notes' }).click();
    await iframe.getByRole('button', { name: 'Create Invoice' }).click();
  });
});
