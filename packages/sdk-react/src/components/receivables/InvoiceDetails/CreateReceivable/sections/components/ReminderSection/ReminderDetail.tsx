import {
  OverdueReminder,
  PaymentReminderResponse,
} from '@/mocks/paymentReminders';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { Box, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export type ReminderDetail = OverdueReminder | PaymentReminderResponse;

interface ReminderDetailsProps {
  details: ReminderDetail | undefined;
}

const isPaymentReminderResponse = (
  details: ReminderDetail
): details is PaymentReminderResponse => {
  return (details as PaymentReminderResponse).term_1_reminder !== undefined;
};

const isOverdueReminderResponse = (
  details: ReminderDetail
): details is OverdueReminder => {
  return (details as OverdueReminder).terms !== undefined;
};

export const ReminderDetails = ({ details }: ReminderDetailsProps) => {
  const theme = useTheme();

  if (!details) return null;

  const iconColor = theme.palette.mode === 'dark' ? '#FFFFFF' : '#0000008F';
  const textColor = theme.palette.mode === 'dark' ? '#FFFFFF' : '#0000008F';

  return (
    <Box sx={{ backgroundColor: '#00000005', padding: 2, borderRadius: 3 }}>
      {isPaymentReminderResponse(details) && (
        <Grid container spacing={1} alignItems="center">
          <Grid
            item
            xs={6}
            sx={{ display: 'flex', justifyContent: 'flex-start' }}
          >
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
          <Grid
            item
            xs={6}
            sx={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <NotificationsActiveIcon
                sx={{ fontSize: 20, color: iconColor }}
              />
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
      )}
      {isOverdueReminderResponse(details) && (
        <Grid container spacing={1} alignItems="center">
          <Grid
            item
            xs={6}
            sx={{ display: 'flex', justifyContent: 'flex-start' }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarTodayIcon sx={{ fontSize: 14 }} fontSize="large" />
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
          <Grid
            item
            xs={6}
            sx={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <NotificationsActiveIcon sx={{ fontSize: 14 }} fontSize="large" />
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
      )}
    </Box>
  );
};
