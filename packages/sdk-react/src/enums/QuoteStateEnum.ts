import { components } from '@/api';

const schema: {
  [key in components['schemas']['QuoteStateEnum']]: key;
} = {
  draft: 'draft',
  issued: 'issued',
  accepted: 'accepted',
  expired: 'expired',
  declined: 'declined',
  deleted: 'deleted',
};

export const QuoteStateEnum = Object.values(schema);
