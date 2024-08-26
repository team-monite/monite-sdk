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

export interface MonitePayableStatusChipProps {
  /** The status of the payable. */
  status: components['schemas']['PayableStateEnum'];
  /** Display status icon? */
  icon?: boolean;
  /** The variant of the Chip. */
  variant?: ChipProps['variant'];
  /** The size of the Chip. */
  size?: ChipProps['size'];
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
 *         size: 'small', // The size of the chip
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
  MonitePayableStatusChipProps
>((inProps, ref) => {
  const props = useThemeProps({
    props: inProps,
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
      size={props.size}
      variant={props.variant ?? 'filled'}
    />
  );
});


export const StyledChip = styled(
  forwardRef<HTMLDivElement, ChipProps>((props, ref) => (
    <Chip ref={ref} {...props} />
  )),
  {
    name: 'MonitePayableStatusChip',
    slot: 'root',
    shouldForwardProp: () => true,
  }
)({});
