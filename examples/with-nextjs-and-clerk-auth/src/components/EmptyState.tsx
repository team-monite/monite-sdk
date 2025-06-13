import { ReactNode } from 'react';

import {
  Box,
  Typography,
  type SxProps,
  type SvgIconProps,
} from '@mui/material';

interface EmptyStateProps {
  children: ReactNode;
  vertical?: boolean;
  // eslint-disable-next-line no-unused-vars
  renderIcon?: (props: SvgIconProps) => ReactNode;
}

const boxHorizontalStyles: SxProps = {
  backgroundColor: '#fafafa',
  borderRadius: '12px',
  p: 2,
  display: 'flex',
  alignItems: 'center',
  gap: 2,
} as const;

const boxVerticalStyles: SxProps = {
  p: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
} as const;

const iconStyles: SxProps = {
  width: 40,
  height: 40,
  fill: '#b8b8b8',
} as const;

export default function EmptyState({
  children,
  vertical,
  renderIcon,
}: EmptyStateProps) {
  return (
    <Box sx={vertical ? boxVerticalStyles : boxHorizontalStyles}>
      {renderIcon?.({ sx: iconStyles })}
      <Typography variant="body1" color="rgba(0, 0, 0, 0.5)">
        {children}
      </Typography>
    </Box>
  );
}
