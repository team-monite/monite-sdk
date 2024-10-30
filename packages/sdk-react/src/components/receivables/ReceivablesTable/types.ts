import { components, Services } from '@monite/sdk-api/src/api';

export type ReceivableFilterType = Pick<
  NonNullable<
    Services['receivables']['getReceivables']['types']['parameters']['query']
  >,
  'document_id__contains' | 'status' | 'counterpart_id' | 'due_date__lte'
>;

export type Sort = {
  sort: components['schemas']['ReceivableCursorFields'];
  order: components['schemas']['OrderEnum'];
};

export type FilterValue =
  | components['schemas']['ReceivablesStatusEnum']
  | string
  | null;
