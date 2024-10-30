import { components } from '@monite/sdk-api/src/api';

const schema: {
  [key in components['schemas']['ObjectTypeEnum']]: key;
} = {
  receivable: 'receivable',
  payable: 'payable',
};

export const ObjectTypeEnum = Object.values(schema);
