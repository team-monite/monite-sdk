import { ExtendedPayableStateEnum } from '@/components/payables/PayablesTable/Filters/SummaryCardsFilters';
import { FieldValueTypes } from '@/components/payables/PayablesTable/types';

export const FILTER_TYPE_SEARCH = 'search';
export const FILTER_TYPE_STATUS = 'status';
export const FILTER_TYPE_DUE_DATE = 'due_date';
export const FILTER_TYPE_CREATED_AT = 'created_at';
export const FILTER_TYPE_CUSTOM_MONITE = 'summary_card_filter';

export const DEFAULT_FIELD_ORDER: FieldValueTypes[] = [
  'document_id',
  'counterpart_id',
  'created_at',
  'issued_at',
  'due_date',
  'status',
  'amount',
  'pay',
];

export const DEFAULT_CARDS_ORDER: ExtendedPayableStateEnum[] = [
  'all',
  'draft',
  'new',
  'approve_in_progress',
  'rejected',
  'waiting_to_be_paid',
  'partially_paid',
  'paid',
  'canceled',
];
