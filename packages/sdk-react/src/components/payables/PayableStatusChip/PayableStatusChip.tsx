import { forwardRef } from 'react';

import { components } from '@/api';
import {
  getRowToStatusTextMap,
  PAYABLE_STATUS_TO_MUI_ICON_MAP,
  ROW_TO_STATUS_MUI_MAP,
} from '@/components/payables/consts';
import { useLingui } from '@lingui/react';
import { Chip, ChipProps } from '@mui/material';
import { styled, useThemeProps } from '@mui/material/styles';

interface PayableStatusChipRootProps {
  /** The status of the payable. */
  status: components['schemas']['PayableStateEnum'];
  /** The variant of the Chip. */
  variant?: ChipProps['variant'];
}

export interface PayableStatusChipProps extends PayableStatusChipRootProps {
  /** Display status icon? */
  icon?: boolean;
}

/**
 * Displays the status of a Payable.
 * Could be customized through MUI theming.
 *
 * @example MUI theming
 * // You can configure the component through MUI theming like this:
 * createTheme(myTheme, {
 *   components: {
 *     MonitePayableStatusChip: {
 *       defaultProps: {
 *         icon: true, // Display status icon?
 *         variant: 'outlined', // The variant of the chip
 *       },
 *       variants: [
 *         {
 *           props: { status: 'approve_in_progress' }, // Custom styles for the 'Approve In Progress' status
 *           style: {
 *             border: '2px dashed lightgreen',
 *           },
 *         },
 *       ],
 *     },
 *   },
 * });
 */
export const PayableStatusChip = forwardRef<
  HTMLDivElement,
  PayableStatusChipProps
>((inProps, ref) => {
  const props = useThemeProps({
    props: inProps,
    // eslint-disable-next-line lingui/no-unlocalized-strings
    name: 'MonitePayableStatusChip',
  });

  const { i18n } = useLingui();

  const Icon = PAYABLE_STATUS_TO_MUI_ICON_MAP[props.status];

  return (
    <StyledChip
      className="Monite-PayableStatusChip"
      ref={ref}
      color={ROW_TO_STATUS_MUI_MAP[props.status]}
      icon={props.icon && Icon ? <Icon fontSize="small" /> : undefined}
      label={getRowToStatusTextMap(i18n)[props.status]}
      status={props.status}
      variant={props.variant ?? 'filled'}
    />
  );
});

const StyledChip = styled(
  forwardRef<HTMLDivElement, ChipProps & PayableStatusChipRootProps>(
    (props, ref) => <Chip ref={ref} {...props} />
  ),
  {
    // eslint-disable-next-line lingui/no-unlocalized-strings
    name: 'MonitePayableStatusChip',
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
