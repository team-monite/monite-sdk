import { useState } from 'react';

import {
  FilterTypes,
  FilterValue,
} from '@/components/receivables/ReceivablesTable/types';

export const useReceivablesFilters = () => {
  const [currentFilters, setCurrentFilters] = useState<FilterTypes>({});

  const onChangeFilter = (field: keyof FilterTypes, value: FilterValue) => {
    setCurrentFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value === 'all' ? null : value,
    }));
  };

  return { currentFilters, onChangeFilter };
};
