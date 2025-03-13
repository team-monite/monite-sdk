import { components } from '@/api';

type InvoiceStatus = components['schemas']['InvoiceResponsePayload']['status'];
type SendAllowanceSchema = Partial<Record<InvoiceStatus, boolean>>;

/**
 * Based on DEFAULT_ACTION_LIST from useInvoiceRowActionMenuCell,
 * these are the statuses where the 'send' action is available
 * therefore the invoice is considered issued
 */
const SEND_ALLOWED: SendAllowanceSchema = {
  ['issued']: true,
  ['partially_paid']: true,
  ['overdue']: true,
};

/**
 * Determines if an invoice is already issued based on its status
 * Returns true for 'issued', 'partially_paid', 'overdue' statuses
 * For all other statuses, returns false
 *
 * This matches the business logic in useInvoiceRowActionMenuCell where both
 * 'issued', 'partially_paid', 'overdue' statuses have the 'send' action but not 'issue'
 *
 * @param status - The status of the invoice
 * @returns boolean indicating if the invoice is considered issued
 */
export const isInvoiceIssued = (status?: InvoiceStatus): boolean => {
  return Boolean(status && SEND_ALLOWED[status]);
};
