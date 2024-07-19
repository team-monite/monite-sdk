import { components } from '@/api';

export type Sort = {
  sort: components['schemas']['ApprovalPolicyCursorFields'];
  order: 'asc' | 'desc';
};
