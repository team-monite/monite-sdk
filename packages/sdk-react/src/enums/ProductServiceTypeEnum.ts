import { components } from '@monite/sdk-api/src/api';

const schema: {
  [key in components['schemas']['ProductServiceTypeEnum']]: key;
} = {
  product: 'product',
  service: 'service',
};

export const ProductServiceTypeEnum = Object.values(schema);
