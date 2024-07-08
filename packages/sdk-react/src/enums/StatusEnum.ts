import { components } from '@/api';

const schema: {
  [key in components['schemas']['StatusEnum']]: key;
} = {
  active: 'active',
  deleted: 'deleted',
};

export const StatusEnum = Object.values(schema);
