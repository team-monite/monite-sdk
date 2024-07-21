import { components } from '@/api';

type PaymentReminder = components['schemas']['PaymentReminder'];

export interface CreateBeforeDueDateReminderFormFields extends PaymentReminder {
  is_discount_date_1: boolean;
  is_discount_date_2: boolean;
  is_due_date: boolean;
}
