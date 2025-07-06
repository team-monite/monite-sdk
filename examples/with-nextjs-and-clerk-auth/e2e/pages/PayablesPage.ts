import { sessionStorage } from '../utils/SessionStorage';
import { AbstractPage } from './AbstractPage';

class PayablesPage extends AbstractPage {
  public async open() {
    await sessionStorage.get().goto('/payables');
  }
}

export const payablesPage = new PayablesPage();
