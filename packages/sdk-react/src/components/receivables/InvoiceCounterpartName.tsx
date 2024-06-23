'use client';

import { getCounterpartName } from '@/components/counterparts/helpers';
import { useCounterpartById } from '@/core/queries';
import { Skeleton, Typography } from '@mui/material';

interface InvoiceCounterpartNameProps {
  counterpartId: string | undefined;
}

export const InvoiceCounterpartName = ({
  counterpartId,
}: InvoiceCounterpartNameProps) => {
  const {
    data: counterpart,
    isLoading,
    error,
  } = useCounterpartById(counterpartId);

  if (isLoading) {
    return <Skeleton variant="text" height="50%" width="70%" />;
  }

  if (error) {
    return <Typography>—</Typography>;
  }

  return <Typography>{getCounterpartName(counterpart)}</Typography>;
};
