import { components } from '@monite/sdk-api/src/api';

const schema: {
  [key in components['schemas']['VatRateStatusEnum']]: key;
} = {
  active: 'active',
  inactive: 'inactive',
};

export const VatRateStatusEnum = Object.values(schema);
