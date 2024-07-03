import { components } from '@/api';

const schema: {
  [key in components['schemas']['SecretStatusEnum']]: key;
} = {
  active: 'active',
  revoked: 'revoked',
  scheduled_to_revoke: 'scheduled_to_revoke',
};

export const SecretStatusEnum = Object.values(schema);
