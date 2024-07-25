import { components } from '@/api';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { Box, Grid, Typography } from '@mui/material';
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

const ReminderInfo = ({ details, iconColor, textColor }: ReminderInfoProps) => (
  <Grid container spacing={1} alignItems="center">
    <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
      <Box display="flex" alignItems="center" gap={1}>
        <CalendarTodayIcon sx={{ fontSize: 20 }} />
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '20px',
            textAlign: 'left',
          }}
        >
          {details.name}
        </Typography>
      </Box>
    </Grid>
    <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Box display="flex" alignItems="center" gap={1}>
        <NotificationsActiveIcon sx={{ fontSize: 20, color: iconColor }} />
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '20px',
            textAlign: 'left',
            color: textColor,
          }}
        >
          {details.created_at}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

export const ReminderDetails = ({ details }: ReminderDetailsProps) => {
  const theme = useTheme();

  if (!details) return null;

  const iconColor = theme.palette.mode === 'dark' ? '#FFFFFF' : '#0000008F';
  const textColor = theme.palette.mode === 'dark' ? '#FFFFFF' : '#0000008F';

  return (
    <Box sx={{ backgroundColor: '#00000005', padding: 2, borderRadius: 3 }}>
      {(isPaymentReminderResponse(details) ||
        isOverdueReminderResponse(details)) && (
        <ReminderInfo
          details={details}
          iconColor={iconColor}
          textColor={textColor}
        />
      )}
    </Box>
  );
};
