import { components } from '@/api';
import {
  getRowToStatusTextMap,
  PAYABLE_STATUS_TO_MUI_ICON_MAP,
} from '@/components/payables/consts';
import { useLingui } from '@lingui/react';
import { Circle } from '@mui/icons-material';
import { Chip, ChipProps } from '@mui/material';
import { lighten, styled, useTheme, useThemeProps } from '@mui/material/styles';
import { forwardRef } from 'react';

export interface MonitePayableStatusChipProps {
  /** The status of the payable. */
  status: components['schemas']['PayableStateEnum'];
  /** Display status icon? Set to false for dot, true for full icon, null to hide completely */
  icon?: boolean | null;
  /** The variant of the Chip. */
  variant?: ChipProps['variant'];
  /** The size of the Chip. */
  size?: ChipProps['size'];
}

/**
 * Displays the status of a Payable.
 */
export const PayableStatusChip = forwardRef<
  HTMLDivElement,
  MonitePayableStatusChipProps
>((inProps, ref) => {
  const { status, icon, size } = useThemeProps({
    props: inProps,
    name: 'MonitePayableStatusChip',
  });

  const { i18n } = useLingui();
  const theme = useTheme();

  const Icon = PAYABLE_STATUS_TO_MUI_ICON_MAP[status];
  const statusColor = theme.palette.status[status] ?? theme.palette.grey[300];

  return (
    <StyledChip
      className="Monite-PayableStatusChip"
      ref={ref}
      sx={{
        color: statusColor,
        backgroundColor: lighten(statusColor, 0.9),
        border: 'none',
        '& .MuiChip-icon': {
          color: statusColor,
        },
      }}
      icon={
        icon === null ? undefined : icon && Icon ? (
          <Icon fontSize="small" />
        ) : (
          <Circle sx={{ fontSize: '10px !important' }} />
        )
      }
      label={getRowToStatusTextMap(i18n)[status]}
      size={size}
      status={status}
      variant="outlined"
    />
  );
});

export const StyledChip = styled(
  forwardRef<
    HTMLDivElement,
    ChipProps & Omit<MonitePayableStatusChipProps, 'icon'>
  >((props, ref) => <Chip ref={ref} {...props} />),
  {
    name: 'MonitePayableStatusChip',
    slot: 'root',
    shouldForwardProp: () => true,
  }
)({});
