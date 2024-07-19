import { components } from '@/api';

const schema: {
  [key in components['schemas']['ProductServiceTypeEnum']]: key;
} = {
  product: 'product',
  service: 'service',
};

export const ProductServiceTypeEnum = Object.values(schema);
