import { useFinancing } from '@/core/queries/useFinancing';
import { CircularProgress, Stack } from '@mui/material';

import { FinancedInvoicesTable } from './FinancedInvoicesTable';
import { FinanceWidget } from './FinanceWidget/FinanceWidget';

export const FinanceTab = ({
  onRowClick,
}: {
  onRowClick?: (invoice_id: string) => void;
}) => {
  const { isLoading, isEnabled } = useFinancing();

  if (isLoading) {
    return <CircularProgress color="inherit" size={20} />;
  }

  if (!isEnabled) {
    return null;
  }

  return (
    <Stack mt={4} gap={4}>
      <FinanceWidget />
      <FinancedInvoicesTable onRowClick={onRowClick} />
    </Stack>
  );
};
