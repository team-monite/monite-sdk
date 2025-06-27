import { ElementType, forwardRef } from 'react';

import { components } from '@/api';
import type { MoniteInvoiceRecurrenceIterationStatusChipProps } from '@/core/theme/types';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  CancelOutlined,
  CheckCircleOutline,
  ErrorOutline,
  AccessTimeOutlined,
} from '@mui/icons-material';
import { Chip, ChipProps } from '@mui/material';
import { styled, useThemeProps } from '@mui/material/styles';

export type { MoniteInvoiceRecurrenceIterationStatusChipProps };

/**
 * Displays the status of an Invoice Recurrence Iteration.
 */
export const InvoiceRecurrenceIterationStatusChip = forwardRef<
  HTMLDivElement,
  MoniteInvoiceRecurrenceIterationStatusChipProps
>((inProps, ref) => {
  const { status, variant, icon, size } = useThemeProps({
    props: inProps,
    name: 'MoniteInvoiceRecurrenceIterationStatusChip',
  });

  const { i18n } = useLingui();

  const Icon = ITERATION_STATUS_TO_MUI_ICON_MAP[status];

  return (
    <StyledChip
      ref={ref}
      color={ITERATION_STATUS_TO_MUI_COLOR_MAP[status]}
      icon={icon && Icon ? <Icon fontSize="small" /> : undefined}
      label={getIterationStatusLabel(i18n, status)}
      status={status}
      size={size}
      variant={variant ?? 'filled'}
    />
  );
});

const StyledChip = styled(
  forwardRef<
    HTMLDivElement,
    ChipProps & Omit<MoniteInvoiceRecurrenceIterationStatusChipProps, 'icon'>
  >((props, ref) => <Chip ref={ref} {...props} />),
  {
    name: 'MoniteInvoiceRecurrenceIterationStatusChip',
    slot: 'root',
    shouldForwardProp: () => true,
  }
)({});

const ITERATION_STATUS_TO_MUI_ICON_MAP: Record<
  components['schemas']['IterationStatus'],
  ElementType<any>
> = {
  pending: AccessTimeOutlined,
  completed: CheckCircleOutline,
  canceled: CancelOutlined,
  issue_failed: ErrorOutline,
  send_failed: ErrorOutline,
};

const ITERATION_STATUS_TO_MUI_COLOR_MAP: Record<
  components['schemas']['IterationStatus'],
  ChipProps['color']
> = {
  pending: 'default',
  completed: 'info',
  canceled: 'error',
  issue_failed: 'error',
  send_failed: 'error',
};

const getIterationStatusLabel = (
  i18n: I18n,
  status: components['schemas']['IterationStatus']
) => {
  switch (status) {
    case 'pending':
      return t(i18n)`Scheduled`;
    case 'completed':
      return t(i18n)`Completed`;
    case 'canceled':
      return t(i18n)`Canceled`;
    case 'issue_failed':
      return t(i18n)`Issue failed`;
    case 'send_failed':
      return t(i18n)`Send failed`;
    default:
      return t(i18n)`Unknown`;
  }
};
