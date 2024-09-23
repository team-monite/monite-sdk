import { useCallback, useMemo, useState } from 'react';

import { components } from '@/api';
import { ReceivableFilter } from '@/components/receivables/ReceivableFilters/ReceivableFilters';
import {
  ReceivableFilterType,
  ReceivablesTabFilter,
} from '@/components/receivables/ReceivablesTable/types';

export const useReceivablesFilters = <T extends keyof ReceivableFilterType>(
  availableFilters: Array<T>,
  predefinedQuery?: ReceivablesTabFilter
) => {
  const [filtersQuery, setFiltersQuery] = useState<ReceivablesTabFilter>(
    predefinedQuery ?? {}
  );

  const onChangeFilter = useCallback(
    (field: T, value: ReceivableFilterType[T]) => {
      setFiltersQuery((prevFilters) => ({
        ...prevFilters,
        [field]: value,
      }));
    },
    []
  );

  return {
    filtersQuery,
    filters: useMemo(
      () =>
        availableFilters.map((field) => {
          return (
            field === 'status'
              ? {
                  field,
                  value: filtersQuery[field],
                  options: predefinedQuery?.type
                    ? filterStatusesByReceivableType(
                        predefinedQuery.type,
                        predefinedQuery?.status__in
                      )
                    : [],
                }
              : {
                  field,
                  value: filtersQuery[field],
                }
          ) satisfies ReceivableFilter<keyof ReceivableFilterType>;
        }) as ReceivableFilter<T>[],
      [availableFilters, filtersQuery, predefinedQuery]
    ),
    onChangeFilter,
  };
};

const filterStatusesByReceivableType = (
  receivableType: components['schemas']['ReceivableType'],
  inStatuses: Array<ReceivablesStatusEnum> | undefined
) => {
  if (receivableType === 'invoice') {
    const invoiceStatuses = [
      'recurring',
      'draft',
      'issued',
      'partially_paid',
      'paid',
      'overdue',
      'canceled',
      'uncollectible',
    ] satisfies Array<ReceivablesStatusEnum>;

    if (!inStatuses) return invoiceStatuses;

    return invoiceStatuses.filter((status) => inStatuses.includes(status));
  }

  if (receivableType === 'quote') {
    const quoteStatuses = [
      'draft',
      'issued',
      'accepted',
      'expired',
      'declined',
    ] satisfies Array<ReceivablesStatusEnum>;

    if (!inStatuses) return quoteStatuses;

    return quoteStatuses.filter((status) => inStatuses.includes(status));
  }

  if (receivableType === 'credit_note') {
    const creditNoteStatuses = [
      'draft',
      'issued',
    ] satisfies Array<ReceivablesStatusEnum>;

    if (!inStatuses) return creditNoteStatuses;

    return creditNoteStatuses.filter((status) => inStatuses.includes(status));
  }

  throw new Error(`Unknown receivable type: ${receivableType}`);
};

type ReceivablesStatusEnum = components['schemas']['ReceivablesStatusEnum'];
