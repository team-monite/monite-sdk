import { memo } from 'react';

import { getCounterpartName } from '@/components/counterparts/helpers';
import { useCounterpartById } from '@/core/queries';
import { Skeleton } from '@mui/material';

interface InvoiceCounterpartNameProps {
  counterpartId: string | undefined;
}

export const InvoiceCounterpartName = memo(
  ({ counterpartId }: InvoiceCounterpartNameProps) => {
    const {
      data: counterpart,
      isLoading,
      error,
    } = useCounterpartById(counterpartId);

    if (isLoading) {
      return <Skeleton variant="text" height="50%" width="70%" />;
    }

    if (error) {
      return <>—</>;
    }

    return <>{getCounterpartName(counterpart)}</>;
  }
);
