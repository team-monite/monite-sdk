import { components } from '@monite/sdk-api/src/api';

const schema: {
  [key in components['schemas']['PurchaseOrderStatusEnum']]: key;
} = {
  draft: 'draft',
  issued: 'issued',
};

export const PurchaseOrderStatusEnum = Object.values(schema);
