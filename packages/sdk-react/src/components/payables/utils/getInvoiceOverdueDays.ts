import { components } from '@/api';

const statuses: components['schemas']['PayableStateEnum'][] = [
  'draft',
  'new',
  'waiting_to_be_paid',
  'approve_in_progress',
];

const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

export const getInvoiceOverdueDays = (
  invoice:
    | components['schemas']['PayableResponseSchema']
    | components['schemas']['ReceivableResponse']
): number => {
  if (!invoice.due_date) return 0;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Normalize today to UTC midnight

  const dueDate = new Date(invoice.due_date);
  dueDate.setUTCHours(0, 0, 0, 0); // Normalize dueDate to UTC midnight

  if (dueDate.getTime() === today.getTime()) return 0;

  const isStatusOverdue = statuses.includes(
    invoice.status as components['schemas']['PayableStateEnum']
  );
  const isDateOverdue = dueDate.getTime() < today.getTime();

  if (!isStatusOverdue || !isDateOverdue)) {
    return 0;
  }

  return Math.floor(
    (today.getTime() - dueDate.getTime()) / MILLISECONDS_IN_A_DAY
  );
};
