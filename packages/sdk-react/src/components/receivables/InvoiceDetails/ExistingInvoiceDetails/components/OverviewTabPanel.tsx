import { ReactNode } from 'react';

import { components } from '@/api';
import { getCounterpartName } from '@/components/counterparts/helpers';
import { InvoiceRecurrence } from '@/components/receivables/InvoiceDetails/ExistingInvoiceDetails/components/ReceivableRecurrence';
import { InvoiceRecurrenceBasedOn } from '@/components/receivables/InvoiceDetails/ExistingInvoiceDetails/components/ReceivableRecurrence/InvoiceRecurrenceBasedOn';
import {
  createOverdueReminderCardTerms,
  createPaymentReminderCardTerms,
} from '@/components/receivables/InvoiceDetails/ExistingInvoiceDetails/components/reminderCardTermsHelpers';
import { InvoiceRecurrenceStatusChip } from '@/components/receivables/InvoiceRecurrenceStatusChip';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks';
import {
  useCounterpartById,
  useEntityUserByAuthToken,
  useReceivableById,
  useReceivables,
} from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { MoniteCard } from '@/ui/Card/Card';
import { DateTimeFormatOptions } from '@/utils/DateTimeFormatOptions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { CancelScheduleSend } from '@mui/icons-material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  Alert,
  Box,
  BoxProps,
  Button,
  Card,
  Grid,
  IconButton,
  Link,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';

interface OverviewTabPanelProps
  extends Pick<BoxProps, 'id' | 'role' | 'aria-labelledby'> {
  onSetView: (view: 'recurrence') => void;
  invoice: components['schemas']['InvoiceResponsePayload'];
}

interface TransformCreditNotes {
  description: string;
  title: string | undefined;
  authorTitle: string;
}

export const OverviewTabPanel = ({
  invoice,
  onSetView,
  ...restProps
}: OverviewTabPanelProps) => {
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

  const { data: receivable } = useReceivableById(invoice.id);

  const creditNoteIds =
    receivable?.type === 'invoice'
      ? receivable.related_documents.credit_note_ids
      : undefined;

  const {
    data: creditNoteQuery,
    isLoading: isCreditNoteLoading,
    error: creditNoteError,
  } = useReceivables(
    {
      id__in: creditNoteIds,
      type: 'credit_note',
    },
    Boolean(creditNoteIds?.length)
  );

  const { data: recurrence } = api.recurrences.getRecurrencesId.useQuery(
    { path: { recurrence_id: invoice?.recurrence_id ?? '' } },
    { enabled: Boolean(invoice?.recurrence_id) }
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
          invoice.recurrence_id
            ? {
                label: t(i18n)`Current status`,
                value: recurrence ? (
                  <InvoiceRecurrenceStatusChip status={recurrence?.status} />
                ) : (
                  <Skeleton variant="text" width="50%" />
                ),
              }
            : undefined,
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
        ].filter((item) => !!item)}
      />

      {Boolean(
        creditNoteQuery?.data || isCreditNoteLoading || creditNoteError
      ) && (
        <Box sx={{ '& > * + *': { mt: 2 } }}>
          {creditNoteQuery?.data && creditNoteQuery.data.length > 0 && (
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              {t(i18n)`Linked documents`}
            </Typography>
          )}
          {isCreditNoteLoading && <Skeleton variant="text" />}
          {creditNoteQuery?.data && (
            <LinkedDocumentsCard creditNotes={creditNoteQuery.data} />
          )}
        </Box>
      )}

      {(invoice.status === 'draft' || Boolean(invoice.recurrence_id)) && (
        <Box>
          <InvoiceRecurrence
            invoiceId={invoice.id}
            viewAll={
              <Button
                size="small"
                variant="text"
                onClick={(event) => {
                  event.preventDefault();
                  onSetView('recurrence');
                }}
              >
                {t(i18n)`View all`}
              </Button>
            }
          />
        </Box>
      )}
      {!!invoice.based_on && (
        <Box>
          <InvoiceRecurrenceBasedOn receivableId={invoice.based_on} />
        </Box>
      )}

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
}: {
  status: 'active' | 'deleted' | undefined;
  cardTitle: ReactNode;
  reminderTerms: Array<{
    termPeriodName: ReactNode;
    termPeriods: ReactNode[];
  }>;
}) => {
  const { i18n } = useLingui();
  return (
    <Card variant="outlined">
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

const LinkedDocumentsCard = ({
  creditNotes,
  internalNavigation = false,
}: {
  creditNotes: components['schemas']['ReceivableResponse'][];
  internalNavigation?: boolean;
}) => {
  const { i18n } = useLingui();

  const transformCreditNotes = (
    creditNotes: components['schemas']['ReceivableResponse'][]
  ): TransformCreditNotes[] => {
    if (!creditNotes) return [];

    return creditNotes.map((creditNote) => {
      const issueDate = creditNote.issue_date
        ? new Date(creditNote.issue_date)
        : null;

      const formattedDate = issueDate
        ? i18n.date(issueDate, DateTimeFormatOptions.ShortMonthDateFormat)
        : t(i18n)`Unknown date`;

      const authorName =
        creditNote.entity.type !== 'individual' && creditNote.entity.name
          ? creditNote.entity.name
          : creditNote.entity.type !== 'organization'
          ? `${creditNote.entity.first_name} ${creditNote.entity.last_name}`
          : null;

      return {
        title: creditNote.document_id,
        description: `${t(i18n)`Issued on`} ${formattedDate} ${t(i18n)`by`}`,
        authorTitle: authorName || '',
      };
    });
  };

  const data = transformCreditNotes(creditNotes);

  if (!data || data.length === 0) return null;

  return (
    <Card
      sx={{ borderRadius: 3, bgcolor: 'background.paper', px: 2 }}
      variant="outlined"
    >
      <Grid container direction="column">
        {data?.map((item, index) => (
          <Grid
            key={item.title}
            container
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              py: 1.5,
              ...(index
                ? { borderTop: '1px solid', borderTopColor: 'divider' }
                : {}),
              cursor: internalNavigation ? 'pointer' : 'default',
            }}
          >
            <Grid item container direction="column" xs>
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ textTransform: 'capitalize' }}
              >
                {item.title}
              </Typography>
              <Typography variant="body2">
                {item.description}{' '}
                {item.authorTitle ? (
                  internalNavigation ? (
                    <>
                      <Link
                        href="#" // Todo: Placeholder link, should be replaced when interlinking is available
                        underline="hover"
                        color="primary"
                        variant="body2"
                      >
                        {item.authorTitle}
                      </Link>
                      <Grid item>
                        <IconButton edge="end" size="small">
                          <ArrowForwardIcon fontSize="small" />
                        </IconButton>
                      </Grid>
                    </>
                  ) : (
                    item.authorTitle
                  )
                ) : null}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};
