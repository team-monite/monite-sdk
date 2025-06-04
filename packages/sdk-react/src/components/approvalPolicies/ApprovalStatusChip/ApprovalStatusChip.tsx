import { forwardRef } from 'react';

import {
  APPROVAL_STATUS_TO_MUI_ICON_MAP,
  getRowToStatusTextMap,
  ROW_TO_STATUS_MUI_MAP,
} from '@/components/approvalPolicies/consts';
import { MoniteApprovalStatusChipProps } from '@/core/theme/types';
import { useLingui } from '@lingui/react';
import { Circle } from '@mui/icons-material';
import { Chip, ChipProps } from '@mui/material';
import { styled, useThemeProps } from '@mui/material/styles';

export type { MoniteApprovalStatusChipProps };

/**
 * Displays the status of a Payable.
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
      icon={
        icon && Icon ? (
          <Icon fontSize="small" />
        ) : (
          <Circle sx={{ fontSize: '10px' }} />
        )
      }
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
