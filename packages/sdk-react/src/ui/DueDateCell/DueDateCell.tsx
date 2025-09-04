import { components } from '@/api';
import { getInvoiceOverdueDays } from '@/components/payables/utils/getInvoiceOverdueDays';
import { createDayPluralForm } from '@/core/utils/date';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useTheme } from '@mui/material';

interface DueDateCellProps {
  data:
    | components['schemas']['PayableResponseSchema']
    | components['schemas']['ReceivableResponse'];
}

export const DueDateCell = ({ data }: DueDateCellProps) => {
  const { i18n } = useLingui();
  const { locale } = useMoniteContext();
  const { palette } = useTheme();

  if (!data.due_date) return <span style={{ opacity: 0.4 }}>-</span>;

  const formattedDate = i18n.date(new Date(data.due_date), locale.dateFormat);
  const overdueDays = getInvoiceOverdueDays(data);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        gap: '4px',
      }}
    >
      <span
        style={{
          lineHeight: 1,
          ...(overdueDays > 0 ? { color: palette.error.main } : {}),
        }}
      >
        {formattedDate}
      </span>
      {overdueDays > 0 && (
        <span
          className="Monite-DueDateCell-OverdueDays"
          style={{
            color: palette.error.main,
            fontWeight: 'bold',
            fontSize: '10px',
            lineHeight: 1,
          }}
        >
          {t(i18n)`${overdueDays} ${createDayPluralForm(
            i18n,
            overdueDays
          )} overdue`}
        </span>
      )}
    </div>
  );
};
