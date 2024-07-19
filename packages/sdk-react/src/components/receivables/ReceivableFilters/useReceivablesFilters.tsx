import { useState } from 'react';

import { ReceivableFilterType } from '@/components/receivables/ReceivablesTable/types';

export const useReceivablesFilters = () => {
  const [filters, setFilters] = useState<ReceivableFilterType>({});

  const onChangeFilter: ReceivablesFilterHandler = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  return { filters, onChangeFilter };
};

export type ReceivablesFilterHandler = <
  Filter extends keyof ReceivableFilterType
>(
  filter: Filter,
  value: ReceivableFilterType[Filter]
) => void;
