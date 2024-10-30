import { components } from '@monite/sdk-api/src/api';

const schema: {
  [key in components['schemas']['LogTypeEnum']]: key;
} = {
  request: 'request',
  response: 'response',
};

export const LogTypeEnum = Object.values(schema);
