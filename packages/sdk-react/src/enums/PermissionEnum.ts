import { components } from '@/api';

const schema: {
  [key in components['schemas']['PermissionEnum']]: key;
} = {
  allowed: 'allowed',
  allowed_for_own: 'allowed_for_own',
  not_allowed: 'not_allowed',
};

export const PermissionEnum = Object.values(schema);
