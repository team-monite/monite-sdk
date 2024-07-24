import React, { ReactNode } from 'react';

import { components } from '@/api';
import { getCounterpartName } from '@/components/counterparts/helpers';
import {
  createOverdueReminderCardTerms,
  createPaymentReminderCardTerms,
} from '@/components/receivables/InvoiceDetails/ExistingInvoiceDetails/components/reminderCardTermsHelpers';
import { InvoiceStatusChip } from '@/components/receivables/InvoiceStatusChip';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks';
import { useCounterpartById, useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { MoniteCard } from '@/ui/Card/Card';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { CancelScheduleSend } from '@mui/icons-material';
import {
  Alert,
  Box,
  BoxProps,
  Card,
  Grid,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';

export const OverviewTabPanel = ({
  invoice,
  ...restProps
}: {
  invoice: components['schemas']['InvoiceResponsePayload'];
} & Pick<BoxProps, 'id' | 'role' | 'aria-labelledby'>) => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();

  const { formatCurrencyToDisplay } = useCurrencies();
  const {
    data: counterpart,
    isLoading: isCounterpartLoading,
    error: counterpartError,
  } = useCounterpartById(invoice.counterpart_id);

  const entityUserId = useEntityUserByAuthToken().data?.id;

  const { data: paymentReminderActionAllowed } = useIsActionAllowed({
    action: 'read',
    method: 'payment_reminder',
    entityUserId,
  });

  const paymentReminderQuery =
    api.paymentReminders.getPaymentRemindersId.useQuery(
      { path: { payment_reminder_id: invoice.payment_reminder_id ?? '' } },
      {
        enabled:
          Boolean(invoice.payment_reminder_id) && paymentReminderActionAllowed,
      }
    );

  const { data: overdueReminderActionAllowed } = useIsActionAllowed({
    action: 'read',
    method: 'overdue_reminder',
    entityUserId,
  });

  const overdueReminderQuery =
    api.overdueReminders.getOverdueRemindersId.useQuery(
      { path: { overdue_reminder_id: invoice.overdue_reminder_id ?? '' } },
      {
        enabled:
          Boolean(invoice.overdue_reminder_id) && overdueReminderActionAllowed,
      }
    );

  return (
    <Box
      sx={{
        '& > * + *': {
          mt: 5,
        },
      }}
      {...restProps}
    >
      <MoniteCard
        items={[
          {
            label: t(i18n)`Customer`,
            value: isCounterpartLoading ? (
              <Skeleton variant="text" width="50%" />
            ) : counterpartError || !counterpart ? (
              '—'
            ) : (
              <Typography fontWeight={500}>
                {getCounterpartName(counterpart)}
              </Typography>
            ),
          },
          {
            label: t(i18n)`Current status`,
            value: (
              <Box component="span" fontWeight={500} fontSize="0.9rem">
                <InvoiceStatusChip status={invoice.status} icon={false} />
              </Box>
            ),
          },
          {
            label: t(i18n)`Invoice total`,
            value: (
              <Typography fontWeight={500}>
                {formatCurrencyToDisplay(
                  invoice.total_amount_with_credit_notes,
                  invoice.currency
                )}
              </Typography>
            ),
          },
        ]}
      />

      {Boolean(
        paymentReminderQuery.data ||
          overdueReminderQuery.data?.terms?.length ||
          paymentReminderQuery.isLoading ||
          overdueReminderQuery.isLoading ||
          paymentReminderQuery.isError ||
          overdueReminderQuery.isError
      ) && (
        <Box
          sx={{
            '& > * + *': {
              mt: 2,
            },
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 2 }}>{t(
            i18n
          )`Reminder emails`}</Typography>
          {paymentReminderQuery.isLoading && <Skeleton variant="text" />}
          {!!paymentReminderQuery.data && (
            <RemindersCard
              cardTitle={paymentReminderQuery.data.name}
              reminderTerms={createPaymentReminderCardTerms(
                i18n,
                paymentReminderQuery.data
              )}
              status={paymentReminderQuery.data.status}
            />
          )}
          {paymentReminderQuery.isError && (
            <Alert severity="error">
              {getAPIErrorMessage(i18n, paymentReminderQuery.error)}
            </Alert>
          )}

          {overdueReminderQuery.isLoading && <Skeleton variant="text" />}
          {!!overdueReminderQuery.data?.terms?.length && (
            <RemindersCard
              cardTitle={overdueReminderQuery.data.name}
              reminderTerms={createOverdueReminderCardTerms(
                i18n,
                overdueReminderQuery.data
              )}
              // overdue reminders are always active
              status={'active'}
            />
          )}
          {overdueReminderQuery.isError && (
            <Alert severity="error">
              {getAPIErrorMessage(i18n, overdueReminderQuery.error)}
            </Alert>
          )}
        </Box>
      )}
    </Box>
  );
};

const RemindersCard = ({
  cardTitle,
  reminderTerms,
  status,
  sx,
}: {
  status: 'active' | 'deleted' | undefined;
  cardTitle: ReactNode;
  reminderTerms: Array<{
    termPeriodName: ReactNode;
    termPeriods: ReactNode[];
  }>;
  sx?: BoxProps;
}) => {
  const { i18n } = useLingui();
  return (
    <Card sx={{ borderRadius: 3, ...sx }} variant="outlined">
      <Grid container direction="row" gap={1} sx={{ p: 1.5, pb: 0 }}>
        <Typography
          variant="body1"
          fontWeight="bold"
          component="h4"
          color={status === 'deleted' ? 'text.secondary' : undefined}
        >
          {cardTitle}
        </Typography>
        {status === 'deleted' && (
          <Tooltip title={t(i18n)`Reminder has been deleted`}>
            <CancelScheduleSend
              fontSize="small"
              color="warning"
              sx={{ cursor: 'help', alignSelf: 'center' }}
            />
          </Tooltip>
        )}
      </Grid>
      {reminderTerms.map((item, index) => (
        <Grid
          key={index}
          container
          direction="column"
          gap={0.2}
          sx={{
            mx: 1.5,
            py: 1.5,
            ...(index
              ? { borderTop: '1px solid', borderTopColor: 'divider' }
              : {}),
          }}
        >
          <Grid item>
            <Typography variant="body1">{item.termPeriodName}</Typography>
          </Grid>
          <Grid item container gap={0.5} direction="column">
            {item.termPeriods.map((presetPeriod, index) => (
              <Grid
                item
                component={Typography}
                variant="body2"
                color="text.secondary"
                key={index}
              >
                {presetPeriod}
              </Grid>
            ))}
          </Grid>
        </Grid>
      ))}
    </Card>
  );
};
