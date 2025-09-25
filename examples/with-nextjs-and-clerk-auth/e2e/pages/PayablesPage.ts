import { sessionStorage } from '../utils/SessionStorage';
import { AbstractPage } from './AbstractPage';

class PayablesPage extends AbstractPage {
  public async open() {
    await sessionStorage
      .get()
      .goto('/payables', { waitUntil: 'domcontentloaded', timeout: 30000 });
  }
}

export const payablesPage = new PayablesPage();
