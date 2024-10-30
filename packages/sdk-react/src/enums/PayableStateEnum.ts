import { components } from '@monite/sdk-api/src/api';

const schema: {
  [key in components['schemas']['PayableStateEnum']]: key;
} = {
  draft: 'draft',
  new: 'new',
  approve_in_progress: 'approve_in_progress',
  waiting_to_be_paid: 'waiting_to_be_paid',
  partially_paid: 'partially_paid',
  paid: 'paid',
  canceled: 'canceled',
  rejected: 'rejected',
};

export const PayableStateEnum = Object.values(schema);
