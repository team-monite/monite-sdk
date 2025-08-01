import { Element } from '../utils/Element';
import { sessionStorage } from '../utils/SessionStorage';
import { AbstractPage } from './AbstractPage';

class DashboardPage extends AbstractPage {
  mainTextLabel = new Element('text=Welcome, E2E!');

  // side menu items
  sideBarInvoicing = new Element('a[href="/receivables"]');

  public async open() {
    await sessionStorage.get().goto('/');
  }
}

export const dashboardPage = new DashboardPage();
