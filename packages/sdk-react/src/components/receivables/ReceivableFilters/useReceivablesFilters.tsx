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
          return field === 'status'
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
              };
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
  const statusMap: Record<
    components['schemas']['ReceivableType'],
    Array<ReceivablesStatusEnum>
  > = {
    invoice: [
      'recurring',
      'draft',
      'issued',
      'partially_paid',
      'paid',
      'overdue',
      'canceled',
      'uncollectible',
    ],
    quote: ['draft', 'issued', 'accepted', 'expired', 'declined'],
    credit_note: ['draft', 'issued'],
  };

  if (!inStatuses) return statusMap[receivableType];
  return statusMap[receivableType].filter((status) =>
    inStatuses.includes(status)
  );
};

type ReceivablesStatusEnum = components['schemas']['ReceivablesStatusEnum'];
