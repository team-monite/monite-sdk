import { components } from '@monite/sdk-api/src/api';

const schema: {
  [key in components['schemas']['PayableActionEnum']]: key;
} = {
  create: 'create',
  read: 'read',
  update: 'update',
  delete: 'delete',
  pay: 'pay',
  approve: 'approve',
  cancel: 'cancel',
  submit: 'submit',
  create_from_mail: 'create_from_mail',
  reopen: 'reopen',
};

export const PayableActionEnum = Object.values(schema);
