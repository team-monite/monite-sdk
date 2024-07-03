import { components } from '@/api';

const schema: {
  [key in components['schemas']['VatRateStatusEnum']]: key;
} = {
  active: 'active',
  inactive: 'inactive',
};

export const VatRateStatusEnum = Object.values(schema);
