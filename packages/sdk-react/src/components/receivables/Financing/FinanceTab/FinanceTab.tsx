import { Stack } from '@mui/material';

import { FinancedInvoicesTable } from './FinancedInvoicesTable';
import { FinanceWidget } from './FinanceWidget/FinanceWidget';

export const FinanceTab = ({
  onRowClick,
}: {
  onRowClick?: (invoice_id: string) => void;
}) => {
  return (
    <Stack mt={4} gap={4}>
      <FinanceWidget />
      <FinancedInvoicesTable onRowClick={onRowClick} />
    </Stack>
  );
};
