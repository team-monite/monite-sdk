import { useFinancing } from '@/core/queries/useFinancing';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { CircularProgress, Stack, Typography } from '@mui/material';

import { FinancedInvoicesTable } from './FinancedInvoicesTable';
import { FinanceWidget } from './FinanceWidget/FinanceWidget';

export const FinanceTab = () => {
  const { i18n } = useLingui();

  const { isLoading, isEnabled } = useFinancing();

  if (isLoading) {
    return <CircularProgress color="inherit" size={20} />;
  }

  if (!isEnabled) {
    return (
      <Typography mt={4} variant="subtitle1">{t(
        i18n
      )`Currently only supported for US entities`}</Typography>
    );
  }

  return (
    <Stack mt={4} gap={4}>
      <FinanceWidget />
      <FinancedInvoicesTable />
    </Stack>
  );
};
