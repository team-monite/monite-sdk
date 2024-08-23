import { forwardRef } from 'react';

import { components } from '@/api';
import { useLingui } from '@lingui/react';
import { Chip, ChipProps } from '@mui/material';
import { styled, useThemeProps } from '@mui/material/styles';

import {
  APPROVAL_REQUEST_STATUS_TO_MUI_ICON_MAP,
  ROW_TO_STATUS_MUI_MAP,
} from '../../consts';
import { getRowToStatusTextMap } from '../../helpers';

type ApprovalRequestStatus = components['schemas']['ApprovalRequestStatus'];

export interface MoniteApprovalRequestStatusChipProps {
  /** The status of the approval request. */
  status: ApprovalRequestStatus;
  /** The size of the Chip. */
  icon?: boolean;
  /** Display status icon? */
  variant?: ChipProps['variant'];
  /** The variant of the Chip. */
  size?: ChipProps['size'];
}

/**
 * Displays the status of an Approval Request.
 * Could be customized through MUI theming.
 *
 * @example MUI theming
 * // You can configure the component through MUI theming like this:
 * createTheme(myTheme, {
 *   components: {
 *     MoniteApprovalRequestStatusChip: {
 *       defaultProps: {
 *         icon: true, // Display status icon?
 *         variant: 'outlined', // The variant of the chip
 *       },
 *       variants: [
 *         {
 *           props: { status: 'rejected' }, // Custom styles for the 'Rejected' status
 *           style: {
 *             border: '2px dashed lightgreen',
 *           },
 *         },
 *       ],
 *     },
 *   },
 * });
 */

export const ApprovalRequestStatusChip = forwardRef<
  HTMLDivElement,
  MoniteApprovalRequestStatusChipProps
>((inProps, ref) => {
  const props = useThemeProps({
    props: inProps,
    // eslint-disable-next-line lingui/no-unlocalized-strings
    name: 'MoniteApprovalRequestStatusChip',
  });

  const { i18n } = useLingui();

  const Icon = APPROVAL_REQUEST_STATUS_TO_MUI_ICON_MAP[props.status];

  return (
    <StyledChip
      ref={ref}
      color={ROW_TO_STATUS_MUI_MAP[props.status]}
      icon={props.icon && Icon ? <Icon fontSize="small" /> : undefined}
      label={getRowToStatusTextMap(i18n)[props.status]}
      size={props.size}
      variant={props.variant ?? 'filled'}
    />
  );
});

const StyledChip = styled(
  forwardRef<HTMLDivElement, ChipProps>((props, ref) => (
    <Chip ref={ref} {...props} />
  )),
  {
    // eslint-disable-next-line lingui/no-unlocalized-strings
    name: 'MoniteApprovalRequestStatusChip',
    slot: 'root',
    shouldForwardProp: () => true,
  }
)({});
