import {
  createOverdueReminderCardTerms,
  createPaymentReminderCardTerms,
} from '@/components/receivables/InvoiceDetails/ExistingInvoiceDetails/components/reminderCardTermsHelpers';
import { useLingui } from '@lingui/react';
import { components } from '@monite/sdk-api/src/api';
import { CalendarToday, NotificationsActive } from '@mui/icons-material';
import { Box, Grid, Typography } from '@mui/material';

type Reminder =
  | components['schemas']['OverdueReminderResponse']
  | components['schemas']['PaymentReminderResponse'];

const isPaymentReminder = (
  details: Reminder
): details is components['schemas']['PaymentReminderResponse'] => {
  return (
    'term_1_reminder' in details ||
    'term_2_reminder' in details ||
    'term_final_reminder' in details
  );
};

export const ReminderDetails = ({ reminder }: { reminder: Reminder }) => {
  const { i18n } = useLingui();

  const cardTerms = isPaymentReminder(reminder)
    ? createPaymentReminderCardTerms(i18n, reminder)
    : createOverdueReminderCardTerms(i18n, reminder);

  return (
    <Box sx={{ padding: 2, borderRadius: 3 }}>
      <Grid container spacing={2}>
        {cardTerms.map(({ termPeriodName, termPeriods }, index) => (
          <Grid item container spacing={2} xs={12} key={index}>
            <Grid item xs={6} display="flex" gap={1}>
              <CalendarToday fontSize="small" />
              <Typography variant="body2">{termPeriodName}</Typography>
            </Grid>
            <Grid
              item
              container
              xs={6}
              display="flex"
              flexDirection="column"
              spacing={2}
            >
              {termPeriods.map((period, index) => (
                <Grid item display="flex" gap={1} key={index}>
                  <NotificationsActive color="disabled" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    {period}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
