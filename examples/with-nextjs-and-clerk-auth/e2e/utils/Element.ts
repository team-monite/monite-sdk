import { sessionStorage } from './SessionStorage';

export class Element {
  locator: string;

  public constructor(locator: string) {
    this.locator = locator;
  }

  public async waitForElementPresent() {
    await sessionStorage
      .get()
      .waitForSelector(this.locator, { state: 'visible', timeout: 30000 });
  }

  public async fill(text: string) {
    await this.el().fill(text);
  }

  public async click() {
    await this.el().click();
  }

  private el() {
    return sessionStorage.get().locator(this.locator);
  }
}
