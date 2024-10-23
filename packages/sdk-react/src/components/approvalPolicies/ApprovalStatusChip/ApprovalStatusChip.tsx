import { forwardRef } from 'react';

import { components } from '@/api';
import {
  APPROVAL_STATUS_TO_MUI_ICON_MAP,
  getRowToStatusTextMap,
  ROW_TO_STATUS_MUI_MAP,
} from '@/components/approvalPolicies/consts';
import { useLingui } from '@lingui/react';
import { Chip, ChipProps } from '@mui/material';
import { styled, useThemeProps } from '@mui/material/styles';

export interface MoniteApprovalStatusChipProps {
  /** The status of the payable. */
  status: components['schemas']['ApprovalPolicyStatus'];
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
 *     MoniteApprovalStatusChip: {
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
export const ApprovalStatusChip = forwardRef<
  HTMLDivElement,
  MoniteApprovalStatusChipProps
>((inProps, ref) => {
  const { status, icon, size, variant } = useThemeProps({
    props: inProps,
    name: 'MoniteApprovalStatusChip',
  });

  const { i18n } = useLingui();

  const Icon = APPROVAL_STATUS_TO_MUI_ICON_MAP[status];

  return (
    <StyledChip
      className="Monite-ApprovalStatusChip"
      ref={ref}
      color={ROW_TO_STATUS_MUI_MAP[status]}
      icon={icon && Icon ? <Icon fontSize="small" /> : undefined}
      label={getRowToStatusTextMap(i18n)[status]}
      size={size}
      status={status}
      variant={variant ?? 'filled'}
    />
  );
});

export const StyledChip = styled(
  forwardRef<
    HTMLDivElement,
    ChipProps & Omit<MoniteApprovalStatusChipProps, 'icon'>
  >((props, ref) => <Chip ref={ref} {...props} />),
  {
    name: 'MoniteApprovalStatusChip',
    slot: 'root',
    shouldForwardProp: () => true,
  }
)({});
