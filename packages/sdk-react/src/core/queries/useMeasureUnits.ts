import {
  MeasureUnitsService,
  UnitListResponse,
  UnitResponse,
} from '@monite/sdk-api';
import { useQuery } from '@tanstack/react-query';

import { useMoniteContext } from '../context/MoniteContext';

const MEASURE_UNITS_ID = 'units';

const measureUnitsQueryKeys = {
  all: () => [MEASURE_UNITS_ID],
  byId: (measureUnitId: string) => [
    ...measureUnitsQueryKeys.all(),
    measureUnitId,
  ],
};

export const useMeasureUnits = (
  ...args: Parameters<MeasureUnitsService['getUnits']>
) => {
  const { monite } = useMoniteContext();

  return useQuery<UnitListResponse, Error>({
    queryKey: [...measureUnitsQueryKeys.all(), { variables: args }],

    queryFn: () => monite.api.measureUnits.getUnits(...args),
  });
};

export const useMeasureUnitById = (unitId: string) => {
  const { monite } = useMoniteContext();

  return useQuery<UnitResponse, Error>({
    queryKey: [...measureUnitsQueryKeys.byId(unitId)],

    queryFn: () => monite.api.measureUnits.getById(unitId),

    enabled: Boolean(unitId),
  });
};
