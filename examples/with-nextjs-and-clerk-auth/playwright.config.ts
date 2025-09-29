import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the .env.local file and set the environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

// Set the port for the server
const PORT = process.env.PORT || 3000;

// Set webServer.url and use.baseURL with the location of the WebServer
const baseURL = `http://localhost:${PORT}`;

// Determine which command to use based on environment variable
const isProduction = process.env.E2E_MODE === 'production';
const serverCommand = isProduction ? 'yarn build && yarn start' : 'yarn dev';

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: 1,

  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  timeout: 60000, // Increase timeout to 60 seconds
  globalSetup: './e2e/config/global.setup.ts',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: serverCommand,
    url: baseURL,
    timeout: 120_000, // Increase timeout to 120 seconds for CI environments
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
