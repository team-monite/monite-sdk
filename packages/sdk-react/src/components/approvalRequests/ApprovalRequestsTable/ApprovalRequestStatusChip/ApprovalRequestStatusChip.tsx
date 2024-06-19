import { forwardRef } from 'react';

import { useLingui } from '@lingui/react';
import { ApprovalRequestStatus } from '@monite/sdk-api';
import { Chip, ChipProps } from '@mui/material';
import { styled, useThemeProps } from '@mui/material/styles';

import {
  getRowToStatusTextMap,
  APPROVAL_REQUEST_STATUS_TO_MUI_ICON_MAP,
  ROW_TO_STATUS_MUI_MAP,
} from '../../consts';

interface ApprovalRequestStatusChipRootProps {
  /** The status of the approval request. */
  status: ApprovalRequestStatus;
  /** The variant of the Chip. */
  variant?: ChipProps['variant'];
}

export interface ApprovalRequestStatusChipProps
  extends ApprovalRequestStatusChipRootProps {
  /** Display status icon? */
  icon?: boolean;
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

// TODO create general component for status chips
export const ApprovalRequestStatusChip = forwardRef<
  HTMLDivElement,
  ApprovalRequestStatusChipProps
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
      status={props.status}
      variant={props.variant ?? 'filled'}
    />
  );
});

const StyledChip = styled(
  forwardRef<HTMLDivElement, ChipProps & ApprovalRequestStatusChipRootProps>(
    (props, ref) => <Chip ref={ref} {...props} />
  ),
  {
    // eslint-disable-next-line lingui/no-unlocalized-strings
    name: 'MoniteApprovalRequestStatusChip',
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
