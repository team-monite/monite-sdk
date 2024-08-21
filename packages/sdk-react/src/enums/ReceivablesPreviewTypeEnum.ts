import { components } from '@/api';

const schema: {
  [key in components['schemas']['ReceivablesPreviewTypeEnum']]: key;
} = {
  receivable: 'receivable',
  discount_reminder: 'discount_reminder',
  final_reminder: 'final_reminder',
};

export const ReceivablesPreviewTypeEnum = Object.values(schema);
