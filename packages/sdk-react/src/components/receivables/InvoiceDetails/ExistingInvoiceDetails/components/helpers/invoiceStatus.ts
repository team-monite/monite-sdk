import { components } from '@/api';

type InvoiceStatus = components['schemas']['InvoiceResponsePayload']['status'];

/**
 * Determines if an invoice is already issued based on its status
 *
 * @param status - The status of the invoice
 * @returns boolean indicating if the invoice is considered issued
 */
export const isInvoiceIssued = (status?: InvoiceStatus): boolean => {
  return (
    status === 'issued' ||
    status === 'partially_paid' ||
    status === 'paid' ||
    status === 'overdue'
  );
};
