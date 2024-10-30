import { components } from '@monite/sdk-api/src/api';

const schema: {
  [key in components['schemas']['ActionEnum']]: key;
} = {
  create: 'create',
  read: 'read',
  update: 'update',
  delete: 'delete',
};

export const ActionEnum = Object.values(schema);
