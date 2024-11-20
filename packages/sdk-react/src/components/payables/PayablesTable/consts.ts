import { ExtendedPayableStateEnum } from '@/components/payables/PayablesTable/Filters/SummaryCardsFilters';
import { FieldValueTypes } from '@/components/payables/PayablesTable/types';

export const FILTER_TYPE_SEARCH = 'search';
export const FILTER_TYPE_STATUS = 'status';
export const FILTER_TYPE_DUE_DATE = 'due_date';
export const FILTER_TYPE_CREATED_AT = 'created_at';
export const FILTER_TYPE_SUMMARY_CARD = 'summary_card_filter';

export const DEFAULT_FIELD_ORDER: FieldValueTypes[] = [
  'counterpart_id',
  'document_id',
  'amount',
  'due_date',
  'was_created_by_user_id',
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
