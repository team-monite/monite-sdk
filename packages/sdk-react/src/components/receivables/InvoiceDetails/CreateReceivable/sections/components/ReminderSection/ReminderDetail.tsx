import { components } from '@/api';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { alpha, Box, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

type Reminder =
  | components['schemas']['OverdueReminderResponse']
  | components['schemas']['PaymentReminderResponse'];

interface ReminderDetailsProps {
  reminder: Reminder;
}

interface ReminderInfoProps {
  reminder: Reminder;
  iconColor: string;
  textColor: string;
}

const isPaymentReminder = (
  details: Reminder
): details is components['schemas']['PaymentReminderResponse'] => {
  return (
    'term_1_reminder' in details ||
    'term_2_reminder' in details ||
    'term_final_reminder' in details
  );
};

const isOverdueReminder = (
  details: Reminder
): details is components['schemas']['OverdueReminderResponse'] => {
  return 'terms' in details && Array.isArray(details.terms);
};

interface ReminderInfoProps {
  reminder: Reminder;
  iconColor: string;
  textColor: string;
}

const ReminderInfo = ({
  reminder,
  iconColor,
  textColor,
}: ReminderInfoProps) => {
  const { i18n } = useLingui();

  let timeInfo: string;

  const getDaysText = (
    days: number | undefined,
    beforeAfter: 'before' | 'after'
  ) =>
    days === 1
      ? t(i18n)`${days} day ${beforeAfter}`
      : t(i18n)`${days} days ${beforeAfter}`;

  if (isPaymentReminder(reminder)) {
    const daysBefore = reminder?.term_1_reminder?.days_before;
    timeInfo = getDaysText(daysBefore, 'before');
  } else if (isOverdueReminder(reminder)) {
    const daysAfter = reminder?.terms?.[0]?.days_after;
    timeInfo = getDaysText(daysAfter, 'after');
  } else {
    timeInfo = t(i18n)`no time info`;
  }

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <CalendarTodayIcon sx={{ fontSize: 20 }} />
          <Typography variant="body2" fontWeight="500">
            {reminder.name}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <NotificationsActiveIcon sx={{ fontSize: 20, color: iconColor }} />
          <Typography variant="body2" fontWeight="500" color={textColor}>
            {timeInfo}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export const ReminderDetails = ({ reminder }: ReminderDetailsProps) => {
  const theme = useTheme();

  const specialColor =
    theme.palette.mode === 'dark'
      ? theme.palette.primary.main
      : alpha(theme.palette.grey[900], 0.56);

  return (
    <Box sx={{ padding: 2, borderRadius: 3 }}>
      {(isPaymentReminder(reminder) || isOverdueReminder(reminder)) && (
        <ReminderInfo
          reminder={reminder}
          iconColor={specialColor}
          textColor={specialColor}
        />
      )}
    </Box>
  );
};
