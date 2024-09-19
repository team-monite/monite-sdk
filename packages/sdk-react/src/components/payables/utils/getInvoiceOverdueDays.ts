import { components } from '@/api';

export const getInvoiceOverdueDays = (
  invoice: components['schemas']['PayableResponseSchema']
): false | number => {
  if (!invoice.due_date) return false;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Normalize today to UTC midnight

  const dueDate = new Date(invoice.due_date);
  dueDate.setUTCHours(0, 0, 0, 0); // Normalize dueDate to UTC midnight

  if (dueDate.getTime() === today.getTime()) return false; // Not overdue if due today

  const statuses: components['schemas']['PayableStateEnum'][] = [
    'draft',
    'new',
    'waiting_to_be_paid',
    'approve_in_progress',
  ];

  const isStatusOverdue = statuses.includes(invoice.status);
  const isDateOverdue = dueDate.getTime() < today.getTime();

  if (isStatusOverdue && isDateOverdue) {
    return Math.floor(
      (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  return false;
};
