import { useFinancing } from '@/core/queries/useFinancing';
import { DataGridEmptyState } from '@/ui/DataGridEmptyState';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { CircularProgress, Stack, Typography } from '@mui/material';

// import { FinancedInvoicesTable } from './FinancedInvoicesTable';
import { FinanceSummary } from './FinanceSummary';

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
      <FinanceSummary />

      <DataGridEmptyState
        title={t(i18n)`No financed invoices yet`}
        descriptionLine1={t(
          i18n
        )`Select invoices you would like to finance and send them for review.`}
        descriptionLine2={t(i18n)`What invoices can be financed?.`}
        type="no-data"
      />
      {/* <FinancedInvoicesTable /> */}
    </Stack>
  );
};
