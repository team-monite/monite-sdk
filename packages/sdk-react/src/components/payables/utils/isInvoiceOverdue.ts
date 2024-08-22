import { components } from '@/api';

export const isInvoiceOverdue = (
  invoice: components['schemas']['InvoiceResponsePayload']
) => {
  const today = new Date();
  return (
    ['new', 'pending', 'waiting to be paid'].includes(invoice.status) &&
    invoice.dueDate &&
    new Date(invoice.dueDate) < today
  );
};
