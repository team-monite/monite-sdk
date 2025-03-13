import { components } from '@/api';

import { isInvoiceIssued } from '../invoiceStatus';

type InvoiceStatus = components['schemas']['InvoiceResponsePayload']['status'];

describe('invoiceStatus helpers', () => {
  describe('isInvoiceIssued', () => {
    test('returns true for statuses that allow sending', () => {
      expect(isInvoiceIssued('issued')).toBe(true);
      expect(isInvoiceIssued('partially_paid')).toBe(true);
      expect(isInvoiceIssued('overdue')).toBe(true);
    });

    test('returns false for other statuses', () => {
      expect(isInvoiceIssued('paid')).toBe(false);
      expect(isInvoiceIssued('draft')).toBe(false);
      expect(isInvoiceIssued('canceled')).toBe(false);
      expect(isInvoiceIssued('declined')).toBe(false);
      expect(isInvoiceIssued('expired')).toBe(false);
      expect(isInvoiceIssued('uncollectible')).toBe(false);
      expect(isInvoiceIssued('accepted')).toBe(false);
      expect(isInvoiceIssued('recurring')).toBe(false);
      expect(isInvoiceIssued('deleted')).toBe(false);
      expect(isInvoiceIssued('issuing')).toBe(false);
      expect(isInvoiceIssued('failed')).toBe(false);
    });

    test('returns false for undefined status', () => {
      expect(isInvoiceIssued(undefined as unknown as InvoiceStatus)).toBe(
        false
      );
    });
  });
});
