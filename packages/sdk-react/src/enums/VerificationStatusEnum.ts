import { components } from '@/api';

const schema: {
  [key in components['schemas']['VerificationStatusEnum']]: key;
} = {
  enabled: 'enabled',
  disabled: 'disabled',
  pending: 'pending',
};

export const VerificationStatusEnum = Object.values(schema);
