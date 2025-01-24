import { ReactNode } from 'react';

import { SvgIconProps, SxProps, Stack, Typography } from '@mui/material';

export interface PaymentTermSummaryItemProps {
  renderIcon: (props: SvgIconProps) => ReactNode;
  leftLine: string;
  rightLine: string;
  sx?: SxProps;
}

export const PaymentTermSummaryItem = ({
  renderIcon,
  leftLine,
  rightLine,
  sx,
}: PaymentTermSummaryItemProps) => {
  return (
    <Stack justifyContent="space-between" direction="row" sx={sx}>
      <Stack direction="row" alignItems="center">
        {renderIcon({ sx: { mr: 1, fontSize: 16 } })}
        <Typography variant="body1">{leftLine}</Typography>
      </Stack>
      <Typography variant="body1">{rightLine}</Typography>
    </Stack>
  );
};
