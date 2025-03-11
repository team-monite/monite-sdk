import { isInvoiceIssued } from '../invoiceStatus';

describe('invoiceStatus helpers', () => {
  describe('isInvoiceIssued', () => {
    test('returns true for issued status', () => {
      expect(isInvoiceIssued('issued')).toBe(true);
    });

    test('returns true for partially_paid status', () => {
      expect(isInvoiceIssued('partially_paid')).toBe(true);
    });

    test('returns true for paid status', () => {
      expect(isInvoiceIssued('paid')).toBe(true);
    });

    test('returns true for overdue status', () => {
      expect(isInvoiceIssued('overdue')).toBe(true);
    });

    test('returns false for draft status', () => {
      expect(isInvoiceIssued('draft')).toBe(false);
    });

    test('returns false for other statuses', () => {
      expect(isInvoiceIssued('canceled')).toBe(false);
      expect(isInvoiceIssued('declined')).toBe(false);
      expect(isInvoiceIssued('expired')).toBe(false);
    });

    test('returns false for undefined status', () => {
      expect(isInvoiceIssued(undefined)).toBe(false);
    });
  });
});
