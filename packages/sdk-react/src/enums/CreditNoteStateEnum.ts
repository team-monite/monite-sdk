import { components } from '@monite/sdk-api/src/api';

const schema: {
  [key in components['schemas']['CreditNoteStateEnum']]: key;
} = {
  draft: 'draft',
  issued: 'issued',
  deleted: 'deleted',
};

export const CreditNoteStateEnum = Object.values(schema);
