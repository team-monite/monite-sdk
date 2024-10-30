import { components } from '@monite/sdk-api/src/api';

const schema: {
  [key in components['schemas']['MailboxObjectTypeEnum']]: key;
} = {
  payable: 'payable',
};

export const MailboxObjectTypeEnum = Object.values(schema);
