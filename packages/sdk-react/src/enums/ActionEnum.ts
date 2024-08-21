import { components } from '@/api';

const schema: {
  [key in components['schemas']['ActionEnum']]: key;
} = {
  create: 'create',
  read: 'read',
  update: 'update',
  delete: 'delete',
};

export const ActionEnum = Object.values(schema);
