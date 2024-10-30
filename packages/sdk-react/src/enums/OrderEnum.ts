import { components } from '@monite/sdk-api/src/api';

const schema: {
  [key in components['schemas']['OrderEnum']]: key;
} = {
  asc: 'asc',
  desc: 'desc',
};

export const OrderEnum = Object.values(schema);
