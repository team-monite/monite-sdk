import { components } from '@/api';

const schema: {
  [key in components['schemas']['MailboxObjectTypeEnum']]: key;
} = {
  payable: 'payable',
};

export const MailboxObjectTypeEnum = Object.values(schema);
