import { components } from '@/api';

export const isInvoiceOverdue = (
  invoice: components['schemas']['PayableResponseSchema']
) => {
  if (!invoice.due_date) return false;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Ensure today is midnight UTC

  const statuses: components['schemas']['PayableStateEnum'][] = [
    'draft',
    'new',
    'waiting_to_be_paid',
    'approve_in_progress',
  ];

  const dueDate = new Date(invoice.due_date);
  dueDate.setUTCHours(0, 0, 0, 0); // Normalize dueDate to midnight UTC

  return (
    statuses.includes(invoice.status) &&
    invoice.due_date &&
    dueDate.getTime() < today.getTime() + 24 * 60 * 60 * 1000
  );
};
