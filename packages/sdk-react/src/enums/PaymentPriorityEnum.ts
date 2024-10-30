import { components } from '@monite/sdk-api/src/api';

const schema: {
  [key in components['schemas']['PaymentPriorityEnum']]: key;
} = {
  working_capital: 'working_capital',
  balanced: 'balanced',
  bottom_line: 'bottom_line',
};

export const PaymentPriorityEnum = Object.values(schema);
