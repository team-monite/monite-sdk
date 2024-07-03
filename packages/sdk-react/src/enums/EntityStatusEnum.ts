import { components } from '@/api';

const schema: {
  [key in components['schemas']['EntityStatusEnum']]: key;
} = {
  active: 'active',
  inactive: 'inactive',
  deleted: 'deleted',
};

export const EntityStatusEnum = Object.values(schema);
