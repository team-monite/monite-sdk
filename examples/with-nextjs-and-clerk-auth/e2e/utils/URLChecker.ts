import { expect } from '@playwright/test';

export async function checkURL(page, regExp) {
  await expect(page).toHaveURL(regExp);
}

export async function checkURLNot(page, regExp) {
  await expect(page).not.toHaveURL(regExp);
}
