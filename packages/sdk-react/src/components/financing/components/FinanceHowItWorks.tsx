import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Typography, List, ListItem } from '@mui/material';

export const FinanceHowItWorks = () => {
  const { i18n } = useLingui();

  return (
    <Box px={4} py={5}>
      <Box>
        <Typography variant="h3">
          {t(i18n)`How does invoice financing work?`}
        </Typography>
      </Box>
      <List
        sx={{
          mt: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          p: 0,
          pl: 2,
        }}
        component="ul"
      >
        <ListItem
          component="li"
          sx={{
            p: 0,
            display: 'list-item',
            listStyleType: 'disc',
            maxWidth: 472,
            mx: 'auto',
          }}
        >
          <Typography variant="body1" fontWeight={400} mb={3}>
            <Typography component="span" variant="body1" fontWeight={600}>
              {t(i18n)`Create an invoice:`}{' '}
            </Typography>

            {t(
              i18n
            )`If you applied for accounts receivable financing, issue an invoice and deliver it to your customer via email or any other channel.`}
          </Typography>

          <Typography variant="body1" fontWeight={400} mb={3}>
            {t(
              i18n
            )`Or if you applied for accounts payable financing, upload/select the uploaded invoice you've received from your vendor.`}
          </Typography>

          <Typography variant="body1" fontWeight={600}>
            {t(i18n)`Invoices cannot be financed if`}:
            <Typography variant="body1" fontWeight={400}>
              {t(i18n)`- they are due within 7 days.`}
            </Typography>
            <Typography variant="body1" fontWeight={400}>
              {t(i18n)`- they are already overdue.`}
            </Typography>
            <Typography variant="body1" fontWeight={400}>
              {t(i18n)`- the loan sum exceeds your remaining limit.`}
            </Typography>
          </Typography>
        </ListItem>
        <ListItem
          component="li"
          sx={{
            p: 0,
            display: 'list-item',
            listStyleType: 'disc',
            maxWidth: 472,
            mx: 'auto',
          }}
        >
          <Typography variant="body1" fontWeight={400}>
            <Typography component="span" variant="body1" fontWeight={600}>
              {t(i18n)`Select 'Get Paid Now':`}{' '}
            </Typography>

            {t(
              i18n
            )`Access funding through the invoice list, within the invoice details, or the 'My Financing' tab. If approved, you will receive the invoice amount instantly, minus the fee associated with the payment offer chosen.`}
          </Typography>
        </ListItem>
        <ListItem
          component="li"
          sx={{
            p: 0,
            display: 'list-item',
            listStyleType: 'disc',
            maxWidth: 472,
            mx: 'auto',
          }}
        >
          <Typography variant="body1" fontWeight={400}>
            <Typography component="span" variant="body1" fontWeight={600}>
              {t(i18n)`Pay out the financed sum:`}{' '}
            </Typography>

            {t(
              i18n
            )`The full sum will be withdrawn from your bank account automatically on the date specified in the selected offer. You can also pay out the sum earlier via the 'Pay out' button.`}
          </Typography>
        </ListItem>
      </List>
    </Box>
  );
};
