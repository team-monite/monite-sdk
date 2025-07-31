import { Element } from '../utils/Element';
import { sessionStorage } from '../utils/SessionStorage';
import { AbstractPage } from './AbstractPage';

class AuthPage extends AbstractPage {
  public async open() {
    await sessionStorage.get().goto('/sign-in');
  }
}

export const authPage = new AuthPage();
