import { components } from '@monite/sdk-api/src/api';

export type Sort = {
  sort: components['schemas']['ApprovalPolicyCursorFields'];
  order: 'asc' | 'desc';
};
