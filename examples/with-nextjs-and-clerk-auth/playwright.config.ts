import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig, devices } from '@playwright/test';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the .env.local file and set the environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

// Set the port for the server
const PORT = process.env.PORT || 3000;

// Set webServer.url and use.baseURL with the location of the WebServer
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 60000,
  expect: {
    timeout: 15000,
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'global setup',
      testMatch: /config\/global\.setup\.ts/,
    },
    {
      name: 'chromium',
      testDir: './e2e/tests',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['global setup'],
    },
  ],
  webServer: {
    command: 'yarn dev',
    url: baseURL,
    // reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
