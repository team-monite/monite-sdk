import { expect, Page } from '@playwright/test';

export async function checkURL(page: Page, regExp: string | RegExp) {
  await expect(page).toHaveURL(regExp);
}

export async function checkURLNot(page: Page, regExp: string | RegExp) {
  await expect(page).not.toHaveURL(regExp);
}
