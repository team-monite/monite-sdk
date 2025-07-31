import { sessionStorage } from '../utils/SessionStorage';
import { AbstractPage } from './AbstractPage';

class ReceivablesPage extends AbstractPage {
  public async open() {
    await sessionStorage.get().goto('/receivables');
  }
}

export const receivablesPage = new ReceivablesPage();
