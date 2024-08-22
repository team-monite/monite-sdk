import { ReactNode, useState } from 'react';

import { Dialog } from '@/components';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Alert, Button, Card, Grid, Skeleton, Typography } from '@mui/material';

import { InvoiceRecurrenceDetails } from './InvoiceRecurrenceDetails';
import { InvoiceRecurrenceForm } from './InvoiceRecurrenceForm';
import { useRecurrenceByInvoiceId } from './useInvoiceRecurrence';

export const InvoiceRecurrence = ({
  invoiceId,
  viewAll,
}: {
  invoiceId: string;
  viewAll: ReactNode;
}) => {
  const { i18n } = useLingui();

  const [open, setOpen] = useState<boolean>(false);

  const {
    data: recurrence,
    error,
    isLoading,
  } = useRecurrenceByInvoiceId(invoiceId);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="subtitle2">{t(i18n)`Recurrence`}</Typography>
      </Grid>
      <Grid item xs={12}>
        {error ? (
          <Alert severity="error">{getAPIErrorMessage(i18n, error)}</Alert>
        ) : (
          <Card variant="outlined">
            <Grid container spacing={2} p={2}>
              <Grid item xs={9}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      {isLoading ? (
                        <Skeleton animation="wave" />
                      ) : recurrence ? (
                        t(i18n)`Monthly recurrence`
                      ) : (
                        t(i18n)`Convert this invoice into recurring template`
                      )}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      {isLoading ? (
                        <Skeleton animation="wave" />
                      ) : recurrence?.status === 'active' ? (
                        t(
                          i18n
                        )`All future invoices will be issued based on this invoice`
                      ) : recurrence?.status === 'completed' ? (
                        t(
                          i18n
                        )`Recurrence was completed, all invoices were issued`
                      ) : recurrence?.status === 'canceled' ? (
                        t(
                          i18n
                        )`Recurrence was cancelled, no new invoices will be issued`
                      ) : (
                        t(
                          i18n
                        )`Set a recurrence period to issue invoices automatically`
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              {(recurrence?.status === 'active' || !recurrence) && (
                <Grid item xs={3}>
                  <Grid container justifyContent="flex-end">
                    {isLoading ? (
                      <Skeleton variant="rounded" width="50%" />
                    ) : (
                      (!recurrence || recurrence?.status === 'active') && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setOpen(true)}
                        >
                          {!recurrence && t(i18n)`Convert`}
                          {recurrence && t(i18n)`Edit`}
                        </Button>
                      )
                    )}
                  </Grid>
                </Grid>
              )}
            </Grid>

            {recurrence && (
              <InvoiceRecurrenceDetails
                recurrence={recurrence}
                viewAll={viewAll}
              />
            )}
          </Card>
        )}
      </Grid>

      <Dialog open={open} alignDialog="right" onClose={() => setOpen(false)}>
        <InvoiceRecurrenceForm
          invoiceId={invoiceId}
          onCancel={() => setOpen(false)}
        />
      </Dialog>
    </Grid>
  );
};
