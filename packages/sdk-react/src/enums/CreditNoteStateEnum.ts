import { components } from '@/api';

const schema: {
  [key in components['schemas']['CreditNoteStateEnum']]: key;
} = {
  draft: 'draft',
  issued: 'issued',
  deleted: 'deleted',
  issuing: 'issuing',
  failed: 'failed',
};

export const CreditNoteStateEnum = Object.values(schema);
