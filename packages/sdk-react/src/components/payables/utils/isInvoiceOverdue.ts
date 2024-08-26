import { components } from '@/api';

export const isInvoiceOverdue = (
  invoice: components['schemas']['PayableResponseSchema']
) => {
  const today = new Date();
  const statuses: components['schemas']['PayableStateEnum'][] = [
    'draft',
    'new',
    'waiting_to_be_paid',
    'approve_in_progress',
  ];

  return (
    statuses.includes(invoice.status) &&
    invoice.due_date &&
    new Date(invoice.due_date).getTime() < today.getTime()
  );
};
