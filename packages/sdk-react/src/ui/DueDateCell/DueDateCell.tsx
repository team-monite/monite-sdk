import { components } from '@/api';
import { getInvoiceOverdueDays } from '@/components/payables/utils/getInvoiceOverdueDays';
import { createDayPluralForm } from '@/components/receivables/InvoiceDetails/ExistingInvoiceDetails/components/reminderCardTermsHelpers';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Typography } from '@mui/material';

interface DueDateCellProps {
  data:
    | components['schemas']['PayableResponseSchema']
    | components['schemas']['ReceivableResponse'];
}

export const DueDateCell = ({ data }: DueDateCellProps) => {
  const { i18n } = useLingui();
  const { locale } = useMoniteContext();

  if (!data.due_date) return null;

  const formattedDate = i18n.date(new Date(data.due_date), locale.dateFormat);
  const overdueDays = getInvoiceOverdueDays(data);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="start"
      height="inherit"
      justifyContent="center"
    >
      <Typography
        variant="body2"
        color={overdueDays > 0 ? 'error' : 'text.secondary'}
      >
        {formattedDate}
      </Typography>
      {overdueDays > 0 && (
        <Typography
          className="Monite-DueDateCell-OverdueDays"
          variant="caption"
          color="error"
          fontWeight="bold"
          sx={{ fontSize: '10px' }}
        >
          {t(i18n)`${overdueDays} ${createDayPluralForm(
            i18n,
            overdueDays
          )} overdue`}
        </Typography>
      )}
    </Box>
  );
};
