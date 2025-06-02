import { test } from '@playwright/test';

import process from 'node:process';

const consumerPage = '/monite-iframe-app-demo';

test.beforeEach(async ({ page }) => {
  // Capture console logs
  page.on('console', (msg) => {
    console.log(`CONSOLE ${msg.type()}: ${msg.text()}`);
  });

  // Capture network failures
  page.on('requestfailed', (request) => {
    console.log(
      `NETWORK FAILED: ${request.method()} ${request.url()} - ${
        request.failure()?.errorText
      }`
    );
  });

  // Capture responses
  page.on('response', (response) => {
    if (!response.ok()) {
      console.log(`RESPONSE ERROR: ${response.status()} ${response.url()}`);
    }
  });

  // Capture JavaScript errors
  page.on('pageerror', (error) => {
    console.log(`PAGE ERROR: ${error.message}`);
    console.log(`STACK: ${error.stack}`);
  });

  // Log all requests to see what API calls are being made
  page.on('request', (request) => {
    const url = request.url();
    if (
      url.includes('api.dev.monite.com') ||
      url.includes('auth') ||
      url.includes('entity') ||
      url.includes('.tsx') ||
      url.includes('.ts') ||
      url.includes('.js')
    ) {
      console.log(`REQUEST: ${request.method()} ${url}`);
    }
  });

  await page.route('/config.json', async (route) => {
    if (process.env.CI) {
      await route.fulfill({
        contentType: 'application/json',
        body: process.env.MONITE_E2E_APP_ADMIN_CONFIG_JSON,
      });
    } else {
      // Provide mocked credentials that will trigger MSW
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          stand: 'dev',
          api_url: 'https://api.dev.monite.com',
          app_basename: 'monite-iframe-app',
          app_hostname: '127.0.0.1',
          entity_user_id: 'mocked_entity_id',
          client_id: 'mocked_client_id',
          client_secret: 'mocked_client_secret',
        }),
      });
    }
  });

  // Mock the API calls that EntityIdLoader makes
  await page.route('**/auth/token', async (route) => {
    console.log('Intercepting auth token request');
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
    console.log('Intercepting entity users my_entity request');
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
});

test('debug - check what elements are on the page', async ({ page }) => {
  console.log('Starting debug test...');

  await page.goto(`${consumerPage}/payables`);
  console.log('Page loaded, waiting for network idle...');

  await page.waitForLoadState('networkidle');
  console.log('Network idle reached');

  // Check if the page has any content at all
  const bodyContent = await page.locator('body').textContent();
  console.log('Body content length:', bodyContent?.length || 0);
  console.log(
    'Body content preview:',
    bodyContent?.substring(0, 200) || 'No content'
  );

  // Take a screenshot to see what's rendered
  await page.screenshot({
    path: 'playwright-debug-screenshots/debug-page-content.png',
    fullPage: true,
  });

  // Check for any loading indicators
  const loadingElements = await page
    .locator('[role="progressbar"], .loading, .MuiCircularProgress-root')
    .all();
  console.log(`Found ${loadingElements.length} loading elements`);

  // Log all buttons on the page
  const buttons = await page.locator('button').all();
  console.log(`Found ${buttons.length} buttons on the page`);

  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    const text = await button.textContent();
    const isVisible = await button.isVisible();
    console.log(`Button ${i}: "${text}" (visible: ${isVisible})`);
  }

  // Check for any iframes
  const iframes = await page.locator('iframe').all();
  console.log(`Found ${iframes.length} iframes`);

  for (let i = 0; i < iframes.length; i++) {
    const iframe = iframes[i];
    const src = await iframe.getAttribute('src');
    console.log(`Iframe ${i}: src="${src}"`);
  }

  // Log the page title and URL
  console.log('Page title:', await page.title());
  console.log('Page URL:', page.url());

  // Check if there are any error messages
  const errorElements = await page
    .locator('[role="alert"], .error, .MuiAlert-root')
    .all();
  console.log(`Found ${errorElements.length} error elements`);

  for (let i = 0; i < errorElements.length; i++) {
    const error = errorElements[i];
    const text = await error.textContent();
    console.log(`Error ${i}: "${text}"`);
  }

  // Wait a bit to see if anything loads asynchronously
  console.log('Waiting 5 seconds for async content...');
  await page.waitForTimeout(5000);

  // Check again after waiting
  const buttonsAfterWait = await page.locator('button').all();
  console.log(`Found ${buttonsAfterWait.length} buttons after waiting`);

  // Take another screenshot after waiting
  await page.screenshot({
    path: 'playwright-debug-screenshots/debug-page-content-after-wait.png',
    fullPage: true,
  });

  console.log('Debug test completed');
});

test('debug - test getByRole button finding', async ({ page }) => {
  console.log('Starting getByRole debug test...');

  await page.goto(`${consumerPage}/payables`);
  await page.waitForLoadState('networkidle');

  // Try to find buttons using getByRole
  try {
    const payablesButton = page.getByRole('button', { name: 'Payables' });
    const isVisible = await payablesButton.isVisible();
    console.log(`getByRole found Payables button: ${isVisible}`);
    
    if (isVisible) {
      const text = await payablesButton.textContent();
      console.log(`Payables button text: "${text}"`);
    }
  } catch (error) {
    console.log(`Error finding Payables button: ${error}`);
  }

  // Try alternative approaches
  try {
    const allButtons = await page.locator('button').all();
    console.log(`Found ${allButtons.length} buttons with locator`);
    
    for (let i = 0; i < allButtons.length; i++) {
      const button = allButtons[i];
      const text = await button.textContent();
      const role = await button.getAttribute('role');
      const ariaLabel = await button.getAttribute('aria-label');
      console.log(`Button ${i}: text="${text}", role="${role}", aria-label="${ariaLabel}"`);
    }
  } catch (error) {
    console.log(`Error analyzing buttons: ${error}`);
  }

  console.log('getByRole debug test completed');
}); 