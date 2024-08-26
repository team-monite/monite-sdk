import { forwardRef } from 'react';

import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Chip, ChipProps } from '@mui/material';
import { styled, useThemeProps } from '@mui/material/styles';

export interface CounterpartStatusChipProps {
  /** The status of the invoice. */
  status: 'customer' | 'vendor';
  /** The variant of the Chip. */
  variant?: ChipProps['variant'];
  /** The size of the Chip. */
  size?: ChipProps['size'];
}

/**
 * Displays the status of a Counterpart.
 * Could be customized through MUI theming.
 *
 * @example MUI theming
 * // You can configure the component through MUI theming like this:
 * createTheme(myTheme, {
 *   components: {
 *     MoniteCounterpartStatusChip: {
 *       defaultProps: {
 *         size: 'small', // The size of the chip
 *         variant: 'outlined', // The variant of the chip
 *       },
 *       variants: [
 *         {
 *           props: { status: 'customer' }, // Custom styles for the 'customer' status
 *           style: {
 *             border: '2px dashed lightgreen',
 *           },
 *         },
 *         {
 *           props: { status: 'vendor' }, // Custom styles for the 'vendor' status
 *           style: {
 *             border: '2px dashed red',
 *           },
 *         },
 *       ],
 *     },
 *   },
 * });
 */

export const CounterpartStatusChip = forwardRef<
  HTMLDivElement,
  CounterpartStatusChipProps
>((inProps, ref) => {
  const { status, variant, size } = useThemeProps({
    props: inProps,
    name: 'MoniteCounterpartStatusChip',
  });

  const { i18n } = useLingui();

  return (
    <StyledChip
      ref={ref}
      className="Monite-CounterpartStatusChip"
      label={getLabel(i18n, status)}
      status={status}
      size={size ?? 'small'}
      variant={variant ?? 'outlined'}
    />
  );
});

const StyledChip = styled(
  forwardRef<HTMLDivElement, ChipProps & CounterpartStatusChipProps>(
    (props, ref) => <Chip ref={ref} {...props} />
  ),
  {
    name: 'MoniteCounterpartStatusChip',
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

const getLabel = (i18n: I18n, status: 'customer' | 'vendor'): string => {
  switch (status) {
    case 'customer':
      return t(i18n)`Customer`;
    case 'vendor':
      return t(i18n)`Vendor`;
    default:
      throw new Error(`Unknown counterpart status: ${status}`);
  }
};
