import { ElementType, forwardRef } from 'react';

import { components } from '@/api';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  CancelOutlined,
  CheckCircleOutline,
  Grading,
} from '@mui/icons-material';
import { Chip, ChipProps } from '@mui/material';
import { styled, useThemeProps } from '@mui/material/styles';

export interface InvoiceRecurrenceStatusChipProps {
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
 * Could be customized through MUI theming.
 *
 * @example MUI theming
 * // You can configure the component through MUI theming like this:
 * createTheme(myTheme, {
 *   components: {
 *     MoniteInvoiceRecurrenceStatusChip: {
 *       defaultProps: {
 *         icon: true, // Display status icon?
 *         variant: 'outlined', // The variant of the chip
 *         size: 'small', // The size of the chip
 *       },
 *       variants: [
 *         {
 *           props: { status: 'active' }, // Custom styles for the 'active' status
 *           style: {
 *             border: '2px dashed green',
 *           },
 *         },
 *         {
 *           props: { status: 'completed' }, // Custom styles for the 'completed' status
 *           style: {
 *             border: '2px dashed blue',
 *           },
 *         },
 *         {
 *           props: { status: 'canceled' }, // Custom styles for the 'canceled' status
 *           style: {
 *             border: '2px dashed orange',
 *           },
 *         },
 *       ],
 *     },
 *   },
 * });
 */
export const InvoiceRecurrenceStatusChip = forwardRef<
  HTMLDivElement,
  InvoiceRecurrenceStatusChipProps
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
      status={status}
      size={size ?? 'small'}
      variant={variant ?? 'filled'}
    />
  );
});

const StyledChip = styled(
  forwardRef<
    HTMLDivElement,
    ChipProps & Omit<InvoiceRecurrenceStatusChipProps, 'icon'>
  >((props, ref) => <Chip ref={ref} {...props} />),
  {
    // eslint-disable-next-line lingui/no-unlocalized-strings
    name: 'MoniteInvoiceRecurrenceStatusChip',
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

const INVOICE_RECURRENCE_STATUS_TO_MUI_ICON_MAP: Record<
  components['schemas']['RecurrenceStatus'],
  ElementType<any>
> = {
  active: CheckCircleOutline,
  completed: Grading,
  canceled: CancelOutlined,
};

const INVOICE_RECURRENCE_STATUS_TO_MUI_COLOR_MAP: Record<
  components['schemas']['RecurrenceStatus'],
  ChipProps['color']
> = {
  active: 'success',
  completed: 'info',
  canceled: 'warning',
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
