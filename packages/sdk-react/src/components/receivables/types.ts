import { components, Services } from '@/api';
import { API } from '@/api/client';
import type { GenericCounterpartContact } from '@/core/queries';

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

export type ReceivablesTabFilter = NonNullable<
  API['receivables']['getReceivables']['types']['parameters']['query']
>;

export type EntityBankAccountFields = Omit<
  components['schemas']['CreateEntityBankAccountRequest'],
  'country' | 'currency'
> & {
  country: components['schemas']['AllowedCountries'] | '';
  currency: components['schemas']['CurrencyEnum'] | '';
};

export type CounterpartOrganizationRootResponse =
  components['schemas']['CounterpartOrganizationRootResponse'];

export type Contact = GenericCounterpartContact;
