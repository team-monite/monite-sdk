import { components } from '@monite/sdk-api/src/api';

const schema: {
  [key in components['schemas']['OnboardingVerificationStatusEnum']]: key;
} = {
  enabled: 'enabled',
  disabled: 'disabled',
  pending: 'pending',
};

export const OnboardingVerificationStatusEnum = Object.values(schema);
