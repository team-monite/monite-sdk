import { test as base } from '@playwright/test';

import { sessionStorage } from '../utils/SessionStorage';

type MyFixtures = {};

export const test = base.extend<MyFixtures>({
  page: async ({ page }, use) => {
    sessionStorage.set(page);
    await use(page);
    sessionStorage.reset();
  },
});
