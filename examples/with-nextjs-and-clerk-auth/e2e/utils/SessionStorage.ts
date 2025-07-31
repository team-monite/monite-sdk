import { Page } from '@playwright/test';

class SessionStorage {
  page: Page | null = null;

  public set(page: Page) {
    this.page = page;
  }

  public get(): Page {
    if (!this.page) {
      throw new Error('Page is in use before it was set.');
    }
    return this.page;
  }

  public reset() {
    this.page = null;
  }
}

export const sessionStorage = new SessionStorage();
