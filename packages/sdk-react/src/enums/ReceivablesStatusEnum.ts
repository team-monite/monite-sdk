import { components } from '@/api';

const schema: {
  [key in components['schemas']['ReceivablesStatusEnum']]: key;
} = {
  draft: 'draft',
  issued: 'issued',
  accepted: 'accepted',
  expired: 'expired',
  declined: 'declined',
  recurring: 'recurring',
  partially_paid: 'partially_paid',
  paid: 'paid',
  overdue: 'overdue',
  uncollectible: 'uncollectible',
  canceled: 'canceled',
  deleted: 'deleted',
};

export const ReceivablesStatusEnum = Object.values(schema);
