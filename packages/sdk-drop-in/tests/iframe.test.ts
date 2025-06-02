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
  'template-settings': '/template-settings',
};

test.beforeEach(async ({ page }) => {
  // Set a custom header to identify Playwright tests
  await page.setExtraHTTPHeaders({
    'X-Test-Environment': 'playwright',
  });

  // Determine if we should use real API or mocks
  const shouldUseMocks = !process.env.CI && !process.env.MONITE_E2E_APP_ADMIN_CONFIG_JSON;

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
          app_hostname: 'localhost',
          entity_user_id: 'mocked_entity_id',
          client_id: 'mocked_client_id',
          client_secret: 'mocked_client_secret',
        }),
      });
    }
  });

  // Only mock API calls when using mocked credentials
  if (shouldUseMocks) {
    console.log('🔒 Using API mocks for local development');
    
    // Mock the API calls that EntityIdLoader makes
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
  } else {
    console.log('🌐 Using real API calls - no mocks applied');
  }
});

test('test the Tags button under Settings', async ({ page }) => {
  // Listen for all console messages to debug the flow
  page.on('console', (msg) => {
    if (msg.text().includes('MoniteIframe: Building iframe URL') || 
        msg.text().includes('testParam') || 
        msg.text().includes('finalUrl') ||
        msg.text().includes('MockDefaultLayout') ||
        msg.text().includes('Settings') ||
        msg.text().includes('Tags')) {
      console.log(`!!! TAGS TEST DEBUG: ${msg.text()}`);
    } else {
      console.log(`Console ${msg.type()}: ${msg.text()}`);
    }
  });

  console.log('Starting tags test - navigating to receivables');
  await page.goto(`${consumerPage}${routingPaths.receivables}?test=playwright`);
  await page.waitForLoadState('networkidle');

  console.log('Looking for Settings button on receivables page');
  
  // Check what buttons are available
  const allButtons = await page.locator('button').all();
  console.log(`Found ${allButtons.length} buttons on receivables page`);
  
  for (let i = 0; i < allButtons.length; i++) {
    const button = allButtons[i];
    const text = await button.textContent();
    console.log(`Button ${i}: "${text}"`);
  }

  await expect(page.getByRole('button', { name: 'Settings' })).toBeVisible({
    timeout: 60000,
  });

  console.log('Clicking Settings button');
  await page
    .getByRole('button', { name: 'Settings' })
    .click({ timeout: 60000 });

  console.log('Waiting for Settings page to load and looking for Tags button');
  await page.waitForTimeout(2000); // Wait for navigation

  // Check what buttons are available after clicking Settings
  const settingsButtons = await page.locator('button').all();
  console.log(`Found ${settingsButtons.length} buttons on settings page`);
  
  for (let i = 0; i < settingsButtons.length; i++) {
    const button = settingsButtons[i];
    const text = await button.textContent();
    console.log(`Settings Button ${i}: "${text}"`);
  }

  await expect(page.getByRole('button', { name: 'Tags' })).toBeVisible({
    timeout: 30000,
  });

  console.log('Clicking Tags button');
  await page.getByRole('button', { name: 'Tags' }).click({ timeout: 30000 });

  console.log('Waiting for iframe to load tags content');
  await page.waitForTimeout(5000);

  // Debug iframe content
  const iframeElement = page.locator('iframe');
  const iframeExists = await iframeElement.count();
  console.log(`Number of iframes found: ${iframeExists}`);

  if (iframeExists > 0) {
    const iframeSrc = await iframeElement.getAttribute('src');
    console.log(`Iframe src: ${iframeSrc}`);

    const iframe = page.frameLocator('iframe');
    const iframeBody = iframe.locator('body');
    const bodyExists = await iframeBody.count();
    console.log(`Iframe body exists: ${bodyExists > 0}`);

    if (bodyExists > 0) {
      const bodyText = await iframeBody.textContent();
      console.log(`Iframe body text: "${bodyText}"`);
      
      // Check for any headings in the iframe
      const headings = iframe.locator('h1, h2, h3, h4, h5, h6');
      const headingCount = await headings.count();
      console.log(`Number of headings in iframe: ${headingCount}`);
      
      for (let i = 0; i < headingCount; i++) {
        const headingText = await headings.nth(i).textContent();
        console.log(`Heading ${i}: "${headingText}"`);
      }
    }
  }

  const iframe = page.frameLocator('iframe');
  await expect(iframe.getByRole('heading', { name: 'Tags' })).toBeVisible({
    timeout: 30000,
  });
});

const widgetTests = [
  { path: routingPaths.payables, name: 'Payables' },
  { path: routingPaths.counterparts, name: 'Counterparts' },
  { path: routingPaths.products, name: 'Products' },
] as const;

widgetTests.forEach(({ path, name }) => {
  test(`should see the ${name.toLowerCase()} tab`, async ({ page }) => {
    console.log(`Starting test for ${name} tab...`);

    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`Console error: ${msg.text()}`);
      }
    });

    // Listen for page errors
    page.on('pageerror', (error) => {
      console.log(`Page error: ${error.message}`);
    });

    // Listen for failed requests
    page.on('requestfailed', (request) => {
      console.log(`Failed request: ${request.url()} - ${request.failure()?.errorText}`);
    });

    // Listen for response errors
    page.on('response', (response) => {
      if (!response.ok()) {
        console.log(`Failed response: ${response.url()} - ${response.status()}`);
      }
    });

    // Listen for all console messages, not just errors
    page.on('console', (msg) => {
      // Filter for specific logs we care about
      if (msg.text().includes('MoniteIframe: Building iframe URL') || 
          msg.text().includes('testParam') || 
          msg.text().includes('finalUrl')) {
        console.log(`!!! IFRAME URL CONSTRUCTION: ${msg.text()}`);
      } else {
        console.log(`Console ${msg.type()}: ${msg.text()}`);
      }
    });

    // Add test parameter to URL to identify Playwright tests
    await page.goto(`${consumerPage}${path}?test=playwright`);
    console.log(`Navigated to ${consumerPage}${path}?test=playwright`);

    await page.waitForLoadState('networkidle');
    console.log('Network idle reached');

    // Add extra wait to match debug test timing
    await page.waitForTimeout(2000);
    console.log('Extra wait completed');

    // Check if buttons exist first
    const allButtons = await page.locator('button').all();
    console.log(`Found ${allButtons.length} buttons on page`);

    for (let i = 0; i < allButtons.length; i++) {
      const button = allButtons[i];
      const text = await button.textContent();
      console.log(`Button ${i}: "${text}"`);
    }

    await expect(page.getByRole('button', { name })).toBeVisible({
      timeout: 60000,
    });

    await page.getByRole('button', { name }).click({ timeout: 60000 });

    // Debug: Check the useMockComponents logic
    const debugInfo = await page.evaluate(() => {
      const isPlaywrightTest = typeof navigator !== 'undefined' &&
        (navigator.userAgent.includes('Playwright') || navigator.userAgent.includes('HeadlessChrome'));

      return {
        NODE_ENV: process.env.NODE_ENV,
        CI: process.env.CI,
        userAgent: navigator.userAgent,
        isPlaywrightTest,
        useMockComponents: process.env.NODE_ENV === 'development' &&
          true && // isMocked would be true
          !process.env.CI &&
          !isPlaywrightTest,
      };
    });

    console.log('Debug info from browser:', JSON.stringify(debugInfo, null, 2));

    // Debug: Check if iframe exists and what its src is
    const iframeElement = page.locator('iframe');
    const iframeExists = await iframeElement.count();
    console.log(`Number of iframes found: ${iframeExists}`);

    // Check what's actually rendered in the page
    const pageContent = await page.locator('body').textContent();
    console.log(`Page body content: ${pageContent?.substring(0, 500)}...`);

    if (iframeExists > 0) {
      const iframeSrc = await iframeElement.getAttribute('src');
      console.log(`Iframe src: ${iframeSrc}`);

      // Debug: Check if test parameter is being passed
      const iframeSrcWithoutProtocol = iframeSrc?.replace(/^\/\//, 'http://');
      console.log(`Full iframe URL: ${iframeSrcWithoutProtocol}`);
      const hasTestParam = iframeSrc?.includes('test=playwright') || false;
      console.log(`Iframe has test parameter: ${hasTestParam}`);

      // Listen for console errors in the iframe
      const iframe = page.frameLocator('iframe');
      const iframeContext = iframe.locator('body');
      
      // Wait for iframe to load
      await page.waitForTimeout(5000);
      
      // Check what's inside the iframe
      const iframeBody = iframe.locator('body');
      const bodyExists = await iframeBody.count();
      console.log(`Iframe body exists: ${bodyExists > 0}`);

      if (bodyExists > 0) {
        const bodyText = await iframeBody.textContent();
        console.log(`Iframe body text (full): "${bodyText}"`);
        
        // Wait longer for content to potentially load
        console.log('Waiting additional 10 seconds for iframe content...');
        await page.waitForTimeout(10000);
        
        // Check again after waiting
        const bodyTextAfterWait = await iframeBody.textContent();
        console.log(`Iframe body text after wait: "${bodyTextAfterWait}"`);
        
        // Check for any headings in the iframe
        const headings = iframe.locator('h1, h2, h3, h4, h5, h6');
        const headingCount = await headings.count();
        console.log(`Number of headings in iframe: ${headingCount}`);
        
        for (let i = 0; i < headingCount; i++) {
          const headingText = await headings.nth(i).textContent();
          console.log(`Heading ${i}: "${headingText}"`);
        }
        
        // Check for any elements with role="heading"
        const roleHeadings = iframe.locator('[role="heading"]');
        const roleHeadingCount = await roleHeadings.count();
        console.log(`Number of role="heading" elements in iframe: ${roleHeadingCount}`);
        
        for (let i = 0; i < roleHeadingCount; i++) {
          const roleHeadingText = await roleHeadings.nth(i).textContent();
          console.log(`Role heading ${i}: "${roleHeadingText}"`);
        }
        
        // Check for any text containing "Products"
        const productsText = iframe.locator('text=Products');
        const productsCount = await productsText.count();
        console.log(`Number of elements containing "Products" in iframe: ${productsCount}`);
        
        // Check the HTML structure
        const bodyHTML = await iframeBody.innerHTML();
        console.log(`Iframe body HTML (first 500 chars): ${bodyHTML.substring(0, 500)}...`);
      }
    }

    const iframe = page.frameLocator('iframe');
    await expect(iframe.getByRole('heading', { name })).toBeVisible({
      timeout: 30000,
    });
  });
});

test('debug iframe app directly', async ({ page }) => {
  console.log('Testing iframe app directly...');

  // Listen for all console messages, not just errors
  page.on('console', (msg) => {
    console.log(`Console ${msg.type()}: ${msg.text()}`);
  });

  // Listen for page errors
  page.on('pageerror', (error) => {
    console.log(`Page error: ${error.message}`);
  });

  // Listen for failed requests
  page.on('requestfailed', (request) => {
    console.log(`Failed request: ${request.url()} - ${request.failure()?.errorText}`);
  });

  // Listen for response errors
  page.on('response', (response) => {
    if (!response.ok()) {
      console.log(`Failed response: ${response.url()} - ${response.status()}`);
    }
  });

  // Navigate directly to the iframe URL
  await page.goto(
    'http://localhost:5174/monite-iframe-app/products?test=playwright'
  );
  console.log('Navigated to iframe app directly with test parameter');

  await page.waitForLoadState('networkidle');
  console.log('Network idle reached');

  // Wait for content to load
  await page.waitForTimeout(5000);

  // Check what's rendered
  const bodyText = await page.locator('body').textContent();
  console.log(`Direct iframe body text: "${bodyText}"`);

  const bodyHTML = await page.locator('body').innerHTML();
  console.log(
    `Direct iframe body HTML (first 500 chars): ${bodyHTML.substring(
      0,
      500
    )}...`
  );
});