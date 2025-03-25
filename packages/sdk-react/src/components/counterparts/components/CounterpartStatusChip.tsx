import { forwardRef } from 'react';

import { CustomerType } from '@/components/counterparts/types';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Circle } from '@mui/icons-material';
import { Chip, ChipProps } from '@mui/material';
import { lighten } from '@mui/material/styles';
import { styled, useTheme, useThemeProps } from '@mui/material/styles';

export interface MoniteCounterpartStatusChipProps {
  /** The status of the invoice. */
  status: CustomerType;
  /** The variant of the Chip. */
  variant?: ChipProps['variant'];
  /** The size of the Chip. */
  size?: ChipProps['size'];
}

/**
 * Displays the status of a Counterpart.
 */

export const CounterpartStatusChip = forwardRef<
  HTMLDivElement,
  MoniteCounterpartStatusChipProps
>((inProps, ref) => {
  const { status, variant, size } = useThemeProps({
    props: inProps,
    name: 'MoniteCounterpartStatusChip',
  });
  const theme = useTheme();
  const { i18n } = useLingui();

  return (
    <StyledChip
      ref={ref}
      className="Monite-CounterpartStatusChip"
      label={getLabel(i18n, status)}
      status={status}
      size={size ?? 'small'}
      icon={<Circle sx={{ '&.MuiChip-icon': { fontSize: 10 } }} />}
      variant={variant ?? 'outlined'}
      sx={{
        background: lighten(theme.palette.text.primary, 0.9),
        color: theme.palette.text.primary,
        border: 'none',
      }}
    />
  );
});

const StyledChip = styled(
  forwardRef<HTMLDivElement, ChipProps & MoniteCounterpartStatusChipProps>(
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

const getLabel = (i18n: I18n, status: CustomerType): string => {
  switch (status) {
    case 'customer':
      return t(i18n)`Customer`;
    case 'vendor':
      return t(i18n)`Vendor`;
    default:
      console.error(`Unknown counterpart status: ${status}`);
      return t(i18n)`Unknown`;
  }
};
