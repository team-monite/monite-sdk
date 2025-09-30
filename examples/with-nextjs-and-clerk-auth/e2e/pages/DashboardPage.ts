import { Element } from '../utils/Element';
import { sessionStorage } from '../utils/SessionStorage';
import { AbstractPage } from './AbstractPage';

class DashboardPage extends AbstractPage {
  mainTextLabel = new Element('h1:has-text("Welcome")');

  // side menu items
  sideBarInvoicing = new Element('a[href="/receivables"]');

  public async open() {
    await sessionStorage
      .get()
      .goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  }
}

export const dashboardPage = new DashboardPage();
