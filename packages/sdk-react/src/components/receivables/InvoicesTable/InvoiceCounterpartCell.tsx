import { getCounterpartName } from '@/components/counterparts/helpers';
import { useCounterpartById } from '@/core/queries';
import { Avatar, Box, Chip, Skeleton, Typography } from '@mui/material';

interface InvoiceCounterpartCellProps {
  counterpartId: string;
}

export const InvoiceCounterpartCell = ({
  counterpartId,
}: InvoiceCounterpartCellProps) => {
  const {
    data: counterpart,
    isInitialLoading,
    error,
  } = useCounterpartById(counterpartId);

  if (isInitialLoading) {
    return <Skeleton variant="text" height="50%" width="70%" />;
  }

  if (error) {
    return <Typography>—</Typography>;
  }

  return <Typography>{getCounterpartName(counterpart)}</Typography>;
};
