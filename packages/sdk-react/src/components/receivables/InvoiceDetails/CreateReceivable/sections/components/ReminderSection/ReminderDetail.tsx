import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { Grid, Typography, Box } from '@mui/material';

interface ReminderDetailsProps {
  details: {
    event: string;
    time: string;
  }[];
}

export const ReminderDetails = ({ details }: ReminderDetailsProps) => (
  <Box sx={{ backgroundColor: '#00000005', padding: 2, borderRadius: 3 }}>
    {details.map((detail, index) => (
      <Grid container spacing={1} key={index} alignItems="center">
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
              {detail.event}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <NotificationsActiveIcon
              sx={{ fontSize: 20, color: '#0000008F' }}
            />
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 500,
                lineHeight: '20px',
                textAlign: 'left',
                color: '#0000008F',
              }}
            >
              {detail.time}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    ))}
  </Box>
);
