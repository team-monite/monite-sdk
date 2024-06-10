import { useState } from 'react';

import {
  FilterTypes,
  FilterValue,
} from '@/components/receivables/ReceivablesTable/types';

export const useReceivablesFilters = () => {
  const [currentFilters, setCurrentFilters] = useState<FilterTypes>({});

  const onChangeFilter: ReceivablesFilterHandler = (field, value) => {
    setCurrentFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  return { currentFilters, onChangeFilter };
};

export type ReceivablesFilterHandler = <Filter extends keyof FilterTypes>(
  filter: Filter,
  value: FilterTypes[Filter]
) => void;
