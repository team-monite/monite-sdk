import { components } from '@/api';

const schema: {
  [key in components['schemas']['PurchaseOrderStatusEnum']]: key;
} = {
  draft: 'draft',
  issued: 'issued',
};

export const PurchaseOrderStatusEnum = Object.values(schema);
