import { type Services } from '@monite/sdk-api/src/api';

export type ReadableReceivablesStatus = NonNullable<
  NonNullable<
    Services['receivables']['getReceivables']['types']['parameters']['query']
  >['status']
>;

const readableReceivableStatuses: {
  [key in ReadableReceivablesStatus]: key;
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
};

export const ReadableReceivableStatuses = Object.values(
  readableReceivableStatuses
);
