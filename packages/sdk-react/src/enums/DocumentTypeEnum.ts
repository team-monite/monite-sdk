import { components } from '@monite/sdk-api/src/api';

const schema: {
  [key in components['schemas']['DocumentTypeEnum']]: key;
} = {
  quote: 'quote',
  invoice: 'invoice',
  credit_note: 'credit_note',
  discount_reminder: 'discount_reminder',
  final_reminder: 'final_reminder',
  payables_purchase_order: 'payables_purchase_order',
  overdue_reminder: 'overdue_reminder',
};

export const DocumentTypeEnum = Object.values(schema);
