import { Element } from '../utils/Element';
import { sessionStorage } from '../utils/SessionStorage';
import { AbstractPage } from './AbstractPage';

class InvoicingPage extends AbstractPage {
  createInvoiceButton = new Element('//button[text()="Create Invoice"]');

  public async open() {
    await sessionStorage
      .get()
      .goto('/invoicing', { waitUntil: 'domcontentloaded', timeout: 30000 });
  }
}

export const invoicingPage = new InvoicingPage();
