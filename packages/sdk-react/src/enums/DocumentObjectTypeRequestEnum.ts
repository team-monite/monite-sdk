import { components } from '@monite/sdk-api/src/api';

const schema: {
  [key in components['schemas']['DocumentObjectTypeRequestEnum']]: key;
} = {
  receivables_quote: 'receivables_quote',
  receivables_invoice: 'receivables_invoice',
  receivables_credit_note: 'receivables_credit_note',
  receivables_discount_reminder: 'receivables_discount_reminder',
  receivables_final_reminder: 'receivables_final_reminder',
  payables_purchase_order: 'payables_purchase_order',
  payables_notify_approver: 'payables_notify_approver',
  payables_notify_payer: 'payables_notify_payer',
  receivables_paid_invoice: 'receivables_paid_invoice',
};

export const DocumentObjectTypeRequestEnum = Object.values(schema);
