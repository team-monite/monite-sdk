import { useMoniteContext } from '@/core/context/MoniteContext';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Alert, Card, Grid, Typography } from '@mui/material';

export const InvoiceRecurrenceBasedOn = ({
  receivableId,
}: {
  receivableId: string;
}) => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();

  const {
    data: invoice,
    isLoading,
    error,
  } = api.receivables.getReceivablesId.useQuery({
    path: { receivable_id: receivableId },
  });

  if (isLoading) {
    return null;
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="subtitle2">{t(i18n)`Based on`}</Typography>
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ p: 2 }} variant="outlined">
          {/* eslint-disable-next-line lingui/no-unlocalized-strings */}
          {invoice?.document_id ?? 'INV-auto'}

          {error && (
            <Alert severity="error">{getAPIErrorMessage(i18n, error)}</Alert>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};
