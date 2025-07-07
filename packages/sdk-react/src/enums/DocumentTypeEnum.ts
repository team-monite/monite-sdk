import { components } from '@/api';

const schema: {
  [key in components['schemas']['DocumentTypeEnum']]: key;
} = {
  receivable: 'receivable',
  delivery_note: 'delivery_note',
  purchase_order: 'purchase_order',
  payable: 'payable',
};

export const DocumentTypeEnum = Object.values(schema);
