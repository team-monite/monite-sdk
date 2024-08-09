import { ReactNode } from 'react';

import { components } from '@/api';
import { InvoiceRecurrenceStatusChip } from '@/components/receivables/InvoiceRecurrenceStatusChip';
import { MoniteCardItem } from '@/ui/Card/Card';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box } from '@mui/material';

import { format } from 'date-fns';

export const InvoiceRecurrenceDetails = ({
  viewAll,
  recurrence: {
    status,
    start_year,
    start_month,
    end_year,
    end_month,
    day_of_month,
    current_iteration,
    iterations,
  },
}: {
  recurrence: components['schemas']['Recurrence'];
  viewAll: ReactNode;
}) => {
  const { i18n } = useLingui();

  const currentIteration = iterations[current_iteration - 1];

  return (
    <>
      <MoniteCardItem
        divider
        label={t(i18n)`Status`}
        value={<InvoiceRecurrenceStatusChip status={status} />}
      />

      <MoniteCardItem
        divider
        label={t(i18n)`Start date`}
        value={t(i18n)`${format(
          new Date(start_year, start_month, 1),
          'MMMM yyyy'
        )}`}
      />

      <MoniteCardItem
        divider
        label={t(i18n)`End date`}
        value={t(i18n)`${format(
          new Date(end_year, end_month, 1),
          'MMMM yyyy'
        )}`}
      />

      <MoniteCardItem
        divider
        label={t(i18n)`Frequency`}
        value={
          day_of_month === 'first_day'
            ? t(i18n)`Every first day of the month`
            : t(i18n)`Every last day of the month`
        }
      />

      <Box position="relative">
        <MoniteCardItem
          divider
          label={t(i18n)`Issued documents`}
          value={
            <>
              {t(i18n)`${current_iteration}/${iterations.length} issued`}
              <br />
              {currentIteration &&
                t(i18n)`next on ${format(
                  new Date(currentIteration.issue_at),
                  'MMMM yyyy'
                )}`}
            </>
          }
        />

        <Box position="absolute" top={0} right={0} px={2} py={0.5}>
          {viewAll}
        </Box>
      </Box>
    </>
  );
};
