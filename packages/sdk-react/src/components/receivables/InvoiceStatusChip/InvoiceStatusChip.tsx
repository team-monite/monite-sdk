import { forwardRef } from 'react';

import {
  INVOICE_STATUS_TO_MUI_ICON_MAP,
  ROW_TO_TAG_STATUS_MUI_MAP,
} from '@/components/receivables/consts';
import { getCommonStatusLabel } from '@/components/receivables/getCommonStatusLabel';
import { useLingui } from '@lingui/react';
import { ReceivablesStatusEnum } from '@monite/sdk-api';
import { Chip, ChipProps } from '@mui/material';
import { styled, useThemeProps } from '@mui/material/styles';

interface InvoiceStatusChipRootProps {
  /** The status of the invoice. */
  status: ReceivablesStatusEnum;
  /** The variant of the Chip. */
  variant?: ChipProps['variant'];
}

export interface InvoiceStatusChipProps extends InvoiceStatusChipRootProps {
  /** Display status icon? */
  icon?: boolean;
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
  InvoiceStatusChipProps
>((inProps, ref) => {
  const props = useThemeProps({
    props: inProps,
    // eslint-disable-next-line lingui/no-unlocalized-strings
    name: 'MoniteInvoiceStatusChip',
  });

  const { i18n } = useLingui();

  const Icon = INVOICE_STATUS_TO_MUI_ICON_MAP[props.status];

  return (
    <StyledChip
      ref={ref}
      color={ROW_TO_TAG_STATUS_MUI_MAP[props.status]}
      icon={props.icon && Icon ? <Icon fontSize="small" /> : undefined}
      label={getCommonStatusLabel(props.status, i18n)}
      status={props.status}
      variant={props.variant ?? 'filled'}
    />
  );
});

const StyledChip = styled(
  forwardRef<HTMLDivElement, ChipProps & InvoiceStatusChipRootProps>(
    ({ ...rest }, ref) => <Chip ref={ref} {...rest} />
  ),
  {
    // eslint-disable-next-line lingui/no-unlocalized-strings
    name: 'MoniteInvoiceStatusChip',
    slot: 'root',
    shouldForwardProp: (prop) => {
      switch (prop) {
        case 'variant':
        case 'label':
        case 'color':
        case 'icon':
          return true;
        default:
          return false;
      }
    },
  }
)({});
