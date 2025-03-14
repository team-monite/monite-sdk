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
 */
export const PayableStatusChip = forwardRef<
  HTMLDivElement,
  MonitePayableStatusChipProps
>((inProps, ref) => {
  const { status, icon, size, variant } = useThemeProps({
    props: inProps,
    name: 'MonitePayableStatusChip',
  });

  const { i18n } = useLingui();

  const Icon = PAYABLE_STATUS_TO_MUI_ICON_MAP[status];

  return (
    <StyledChip
      className="Monite-PayableStatusChip"
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
    ChipProps & Omit<MonitePayableStatusChipProps, 'icon'>
  >((props, ref) => <Chip ref={ref} {...props} />),
  {
    name: 'MonitePayableStatusChip',
    slot: 'root',
    shouldForwardProp: () => true,
  }
)({});
