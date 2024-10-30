import { components } from '@monite/sdk-api/src/api';

const schema: {
  [key in components['schemas']['StatusEnum']]: key;
} = {
  active: 'active',
  deleted: 'deleted',
};

export const StatusEnum = Object.values(schema);
