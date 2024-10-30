import { components } from '@monite/sdk-api/src/api';

const schema: {
  [key in components['schemas']['VerificationStatusEnum']]: key;
} = {
  enabled: 'enabled',
  disabled: 'disabled',
  pending: 'pending',
};

export const VerificationStatusEnum = Object.values(schema);
