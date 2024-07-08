import { components } from '@/api';

const schema: {
  [key in components['schemas']['EInvoicingProviderEnum']]: key;
} = {
  avalara: 'avalara',
};

export const EInvoicingProviderEnum = Object.values(schema);
