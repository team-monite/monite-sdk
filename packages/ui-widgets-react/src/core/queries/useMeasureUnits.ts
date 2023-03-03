import { MeasureUnitsService, UnitListResponse } from '@team-monite/sdk-api';
import { useComponentsContext } from '../context/ComponentsContext';
import { useQuery } from 'react-query';

const MEASURE_UNITS_ID = 'units';

export const useMeasureUnits = (
  ...args: Parameters<MeasureUnitsService['getUnits']>
) => {
  const { monite } = useComponentsContext();

  return useQuery<UnitListResponse, Error>(
    [MEASURE_UNITS_ID, { variables: args }],
    () => monite.api!.measureUnits.getUnits(...args)
  );
};
