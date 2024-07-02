import { defineConfig, devices } from '@playwright/test';

const config = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 20_000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],
  use: {
    actionTimeout: 0,
    baseURL: 'http://localhost:5273',
    trace: 'on-first-retry',
    headless: true,
  },
  webServer: {
    command: 'yarn dev --port 5273',
    port: 5273,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

// eslint-disable-next-line import/no-default-export
export default config;
