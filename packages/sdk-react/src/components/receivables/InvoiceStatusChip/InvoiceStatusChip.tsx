import { forwardRef } from 'react';

import { components } from '@/api';
import {
  INVOICE_STATUS_TO_MUI_ICON_MAP,
  ROW_TO_TAG_STATUS_MUI_MAP,
} from '@/components/receivables/consts';
import { getCommonStatusLabel } from '@/components/receivables/getCommonStatusLabel';
import { useLingui } from '@lingui/react';
import { Chip, ChipProps } from '@mui/material';
import { styled, useThemeProps } from '@mui/material/styles';

export interface MoniteInvoiceStatusChipProps {
  icon?: boolean;
  /** The variant of the Chip. */
  variant?: ChipProps['variant'];
  /** The size of the Chip. */
  size?: ChipProps['size'];
  /** Display status icon? */
  /** The status of the invoice. */
  status: components['schemas']['ReceivablesStatusEnum'];
  /** The variant of the Chip. */
}

/**
 * Displays the status of an Invoice.
 * Could be customized through MUI theming.
 *
 * @example MUI theming
 * // You can configure the component through MUI theming like this:
 * createTheme(myTheme, {
 *   components: {
 *     MoniteInvoiceStatusChip: {
 *       defaultProps: {
 *         icon: true, // Display status icon?
 *         size: 'small', // The size of the chip
 *         variant: 'outlined', // The variant of the chip
 *       },
 *       variants: [
 *         {
 *           props: { status: 'paid' }, // Custom styles for the 'paid' status
 *           style: {
 *             border: '2px dashed lightgreen',
 *           },
 *         },
 *         {
 *           props: { status: 'overdue' }, // Custom styles for the 'overdue' status
 *           style: {
 *             border: '2px dashed red',
 *           },
 *         },
 *       ],
 *     },
 *   },
 * });
 */

export const InvoiceStatusChip = forwardRef<
  HTMLDivElement,
  MoniteInvoiceStatusChipProps
>((inProps, ref) => {
  const { status, variant, icon, size } = useThemeProps({
    props: inProps,
    name: 'MoniteInvoiceStatusChip',
  });

  const { i18n } = useLingui();

  const Icon = INVOICE_STATUS_TO_MUI_ICON_MAP[status];

  return (
    <StyledChip
      ref={ref}
      color={ROW_TO_TAG_STATUS_MUI_MAP[status]}
      icon={icon && Icon ? <Icon fontSize="small" /> : undefined}
      label={getCommonStatusLabel(i18n, status)}
      size={size}
      variant={variant ?? 'filled'}
    />
  );
});

const StyledChip = styled(
  forwardRef<HTMLDivElement, ChipProps>((props, ref) => (
    <Chip ref={ref} {...props} />
  )),
  {
    name: 'MoniteInvoiceStatusChip',
    slot: 'root',
    shouldForwardProp: () => true,
  }
)({});
