import { components } from '@/api';

const schema: {
  [key in components['schemas']['ObjectTypeEnum']]: key;
} = {
  receivable: 'receivable',
  payable: 'payable',
};

export const ObjectTypeEnum = Object.values(schema);
