import { components } from '@/api';

export const isInvoiceOverdue = (
  invoice: components['schemas']['InvoiceResponsePayload']
) => {
  const today = new Date();
  return (
    ['new', 'pending', 'waiting to be paid'].includes(invoice.status) &&
    invoice.due_date &&
    new Date(invoice.due_date).getTime() < today.getTime()
  );
};
