import { components } from '@/api';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Chip } from '@mui/material';

export const InvoiceRecurrenceStatusChip = ({
  status,
}: {
  status: components['schemas']['RecurrenceStatus'];
}) => {
  const { i18n } = useLingui();

  if (status === 'active')
    return <Chip size="small" color="success" label={t(i18n)`Active`} />;

  if (status === 'completed')
    return <Chip size="small" color="success" label={t(i18n)`Completed`} />;

  return <Chip size="small" color="error" label={t(i18n)`Canceled`} />;
};
