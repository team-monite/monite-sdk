import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Typography, List, ListItem } from '@mui/material';

export const FinanceHowItWorks = () => {
  const { i18n } = useLingui();
  const { componentSettings } = useMoniteContext();

  const steps = [
    {
      id: 1,
      title: t(i18n)`Create an invoice:`,
      description: t(
        i18n
      )`If you applied for accounts receivable financing, issue an invoice and deliver it to your customer via email or any other channel.`,
      description2: t(
        i18n
      )`Or if you applied for accounts payable financing, upload/select the uploaded invoice you've received from your vendor.`,
      list: {
        listTitle: t(i18n)`Invoices cannot be financed if:`,
        listItems: [
          { id: 'listItem-1', text: t(i18n)`- they are due within 7 days.` },
          { id: 'listItem-2', text: t(i18n)`- they are already overdue.` },
          {
            id: 'listItem-3',
            text: t(i18n)`- the loan sum exceeds your remaining limit.`,
          },
        ],
      },
    },
    {
      id: 2,
      title: t(i18n)`Select 'Get Paid Now':`,
      description: t(
        i18n
      )`Access funding through the invoice list, within the invoice details, or the 'My Financing' tab. If approved, you will receive the invoice amount instantly, minus the fee associated with the payment offer chosen.`,
    },
    {
      id: 3,
      title: t(i18n)`Pay out the financed sum:`,
      description: t(
        i18n
      )`The full sum will be withdrawn from your bank account automatically on the date specified in the selected offer. You can also pay out the sum earlier via the 'Pay out' button.`,
    },
  ];

  const financeSteps = componentSettings?.financing?.financeSteps ?? steps;

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
        {financeSteps.map((step) => (
          <ListItem
            key={step.id}
            component="li"
            sx={{
              p: 0,
              display: 'list-item',
              listStyleType: 'disc',
              maxWidth: 472,
              mx: 'auto',
            }}
          >
            <Typography
              variant="body1"
              fontWeight={400}
              mb={step.list || step.description2 ? 3 : 0}
            >
              <Typography component="span" variant="body1" fontWeight={600}>
                {step.title}{' '}
              </Typography>
              {step.description}
            </Typography>

            {step.description2 && (
              <Typography
                variant="body1"
                fontWeight={400}
                mb={step.list ? 3 : 0}
              >
                {step.description2}
              </Typography>
            )}

            {step.list && (
              <Typography variant="body1" fontWeight={600}>
                {step.list.listTitle}

                {step.list.listItems.map((listItem) => (
                  <Typography
                    key={listItem.id}
                    variant="body1"
                    component="span"
                    display="block"
                    fontWeight={400}
                  >
                    {listItem.text}
                  </Typography>
                ))}
              </Typography>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
