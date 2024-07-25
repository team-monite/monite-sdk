import { components } from '@/api';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { alpha, Box, darken, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export type ReminderDetail =
  | components['schemas']['OverdueReminderResponse']
  | components['schemas']['PaymentReminderResponse'];

interface ReminderDetailsProps {
  details: ReminderDetail | undefined;
}

interface ReminderInfoProps {
  details: ReminderDetail;
  iconColor: string;
  textColor: string;
}

const isPaymentReminderResponse = (
  details: ReminderDetail
): details is components['schemas']['PaymentReminderResponse'] => {
  return (
    (details as components['schemas']['PaymentReminderResponse'])
      .term_1_reminder !== undefined
  );
};

const isOverdueReminderResponse = (
  details: ReminderDetail
): details is components['schemas']['OverdueReminderResponse'] => {
  return (
    (details as components['schemas']['OverdueReminderResponse']).terms !==
    undefined
  );
};

interface ReminderInfoProps {
  details: ReminderDetail;
  iconColor: string;
  textColor: string;
}

const ReminderInfo = ({ details, iconColor, textColor }: ReminderInfoProps) => {
  const { i18n } = useLingui();

  let timeInfo: string;

  const getDaysText = (
    days: number | undefined,
    beforeAfter: 'before' | 'after'
  ) =>
    days === 1
      ? t(i18n)`${days} day ${beforeAfter}`
      : t(i18n)`${days} days ${beforeAfter}`;

  if (isPaymentReminderResponse(details)) {
    const daysBefore = details?.term_1_reminder?.days_before;
    timeInfo = getDaysText(daysBefore, 'before');
  } else if (isOverdueReminderResponse(details)) {
    const daysAfter = details?.terms?.[0]?.days_after;
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
            {details.name}
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

export const ReminderDetails = ({ details }: ReminderDetailsProps) => {
  const theme = useTheme();

  if (!details) return null;

  const specialColor =
    theme.palette.mode === 'dark'
      ? theme.palette.primary.main
      : alpha(theme.palette.grey[900], 0.56);

  return (
    <Box sx={{ backgroundColor: '#00000005', padding: 2, borderRadius: 3 }}>
      {(isPaymentReminderResponse(details) ||
        isOverdueReminderResponse(details)) && (
        <ReminderInfo
          details={details}
          iconColor={specialColor}
          textColor={specialColor}
        />
      )}
    </Box>
  );
};
