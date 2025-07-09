import { ElementType, forwardRef } from 'react';

import { components } from '@/api';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  CancelOutlined,
  CheckCircleOutline,
  Grading,
  PauseOutlined,
} from '@mui/icons-material';
import { Chip, ChipProps } from '@mui/material';
import { styled, useThemeProps } from '@mui/material/styles';

export interface MoniteInvoiceRecurrenceStatusChipProps {
  /** The status of the recurrence. */
  status: components['schemas']['RecurrenceStatus'];
  /** The variant of the Chip. */
  variant?: ChipProps['variant'];
  /** The size of the Chip. */
  size?: ChipProps['size'];
  /** Display status icon? */
  icon?: boolean;
}

/**
 * Displays the status of an Invoice Recurrence.
 */
export const InvoiceRecurrenceStatusChip = forwardRef<
  HTMLDivElement,
  MoniteInvoiceRecurrenceStatusChipProps
>((inProps, ref) => {
  const { status, variant, icon, size } = useThemeProps({
    props: inProps,
    // eslint-disable-next-line lingui/no-unlocalized-strings
    name: 'MoniteInvoiceRecurrenceStatusChip',
  });

  const { i18n } = useLingui();

  const Icon = INVOICE_RECURRENCE_STATUS_TO_MUI_ICON_MAP[status];

  return (
    <StyledChip
      ref={ref}
      color={INVOICE_RECURRENCE_STATUS_TO_MUI_COLOR_MAP[status]}
      icon={icon && Icon ? <Icon /> : undefined}
      label={getInvoiceRecurrenceStatusLabel(i18n, status)}
      size={size}
      status={status}
      variant={variant ?? 'filled'}
    />
  );
});

const StyledChip = styled(
  forwardRef<
    HTMLDivElement,
    ChipProps & Omit<MoniteInvoiceRecurrenceStatusChipProps, 'icon'>
  >((props, ref) => <Chip ref={ref} {...props} />),
  {
    // eslint-disable-next-line lingui/no-unlocalized-strings
    name: 'MoniteInvoiceRecurrenceStatusChip',
    slot: 'root',
    shouldForwardProp: () => true,
  }
)({});

const INVOICE_RECURRENCE_STATUS_TO_MUI_ICON_MAP: Record<
  components['schemas']['RecurrenceStatus'],
  ElementType<any>
> = {
  active: CheckCircleOutline,
  completed: Grading,
  canceled: CancelOutlined,
  paused: PauseOutlined,
};

const INVOICE_RECURRENCE_STATUS_TO_MUI_COLOR_MAP: Record<
  components['schemas']['RecurrenceStatus'],
  ChipProps['color']
> = {
  active: 'info',
  completed: 'success',
  canceled: 'warning',
  paused: 'warning',
};

const getInvoiceRecurrenceStatusLabel = (
  i18n: I18n,
  status: components['schemas']['RecurrenceStatus']
) => {
  switch (status) {
    case 'active':
      return t(i18n)`Active`;
    case 'completed':
      return t(i18n)`Completed`;
    case 'canceled':
      return t(i18n)`Canceled`;
    default:
      return t(i18n)`Unknown`;
  }
};
