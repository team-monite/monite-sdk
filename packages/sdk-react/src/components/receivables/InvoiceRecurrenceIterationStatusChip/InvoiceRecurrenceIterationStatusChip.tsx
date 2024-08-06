import { components } from '@/api';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Chip } from '@mui/material';

// todo::should we make it as a custom MUI component?
export const InvoiceRecurrenceIterationStatusChip = ({
  status,
}: {
  status: components['schemas']['IterationStatus'];
}) => {
  const { i18n } = useLingui();

  if (status === 'pending')
    return <Chip size="small" color="warning" label={t(i18n)`Pending`} />;

  if (status === 'completed')
    return <Chip size="small" color="success" label={t(i18n)`Completed`} />;

  if (status === 'canceled')
    return <Chip size="small" color="error" label={t(i18n)`Canceled`} />;

  if (status === 'issue_failed')
    return <Chip size="small" color="error" label={t(i18n)`Issue failed`} />;

  return <Chip size="small" color="error" label={t(i18n)`Send failed`} />;
};
