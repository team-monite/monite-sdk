import { memo } from 'react';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { Skeleton } from '@mui/material';

export const MeasureUnit = memo(({ unitId }: { unitId: string }) => {
  const { api } = useMoniteContext();
  const { data: unit, isLoading } = api.measureUnits.getMeasureUnitsId.useQuery(
    {
      path: { unit_id: unitId },
    }
  );

  if (isLoading) {
    return (
      <Skeleton variant="text" height="1rem" width={100} animation="wave" />
    );
  }

  if (!unit) {
    return null;
  }

  return <span>{unit.name}</span>;
});
