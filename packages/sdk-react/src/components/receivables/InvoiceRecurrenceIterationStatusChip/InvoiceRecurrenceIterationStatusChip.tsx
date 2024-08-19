import { ElementType, forwardRef } from 'react';

import { components } from '@/api';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  CancelOutlined,
  CheckCircleOutline,
  ErrorOutline,
  PendingOutlined,
} from '@mui/icons-material';
import { Chip, ChipProps } from '@mui/material';
import { styled, useThemeProps } from '@mui/material/styles';

export interface InvoiceRecurrenceIterationStatusChipProps {
  /** The status of the iteration. */
  status: components['schemas']['IterationStatus'];
  /** The variant of the Chip. */
  variant?: ChipProps['variant'];
  /** The size of the Chip. */
  size?: ChipProps['size'];
  /** Display status icon? */
  icon?: boolean;
}

/**
 * Displays the status of an Invoice Recurrence Iteration.
 * Could be customized through MUI theming.
 *
 * @example MUI theming
 * // You can configure the component through MUI theming like this:
 * createTheme(myTheme, {
 *   components: {
 *     MoniteInvoiceRecurrenceIterationStatusChip: {
 *       defaultProps: {
 *         icon: true, // Display status icon?
 *         variant: 'filled', // The variant of the chip
 *         size: 'small', // The size of the chip
 *       },
 *       variants: [
 *         {
 *           props: { status: 'pending' }, // Custom styles for the 'pending' status
 *           style: {
 *             border: '2px dashed orange',
 *           },
 *         },
 *         // Add more custom styles for other statuses if needed
 *       ],
 *     },
 *   },
 * });
 */
export const InvoiceRecurrenceIterationStatusChip = forwardRef<
  HTMLDivElement,
  InvoiceRecurrenceIterationStatusChipProps
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
      size={size ?? 'small'}
      variant={variant ?? 'filled'}
    />
  );
});

const StyledChip = styled(
  forwardRef<
    HTMLDivElement,
    ChipProps & Omit<InvoiceRecurrenceIterationStatusChipProps, 'icon'>
  >((props, ref) => <Chip ref={ref} {...props} />),
  {
    name: 'MoniteInvoiceRecurrenceIterationStatusChip',
    slot: 'root',
    shouldForwardProp: (prop) => {
      switch (prop) {
        case 'variant':
        case 'label':
        case 'color':
        case 'icon':
        case 'size':
          return true;
        default:
          return false;
      }
    },
  }
)({});

const ITERATION_STATUS_TO_MUI_ICON_MAP: Record<
  components['schemas']['IterationStatus'],
  ElementType<any>
> = {
  pending: PendingOutlined,
  completed: CheckCircleOutline,
  canceled: CancelOutlined,
  issue_failed: ErrorOutline,
  send_failed: ErrorOutline,
};

const ITERATION_STATUS_TO_MUI_COLOR_MAP: Record<
  components['schemas']['IterationStatus'],
  ChipProps['color']
> = {
  pending: 'warning',
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
      return t(i18n)`Pending`;
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
