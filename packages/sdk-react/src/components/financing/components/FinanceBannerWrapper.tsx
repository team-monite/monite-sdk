import { PropsWithChildren } from 'react';

import { Box, useTheme } from '@mui/material';

type Props = {
  shouldApplyFinanceStyles?: boolean;
};

export const FinanceBannerWrapper = ({
  children,
  shouldApplyFinanceStyles = false,
}: PropsWithChildren<Props>) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: `linear-gradient(180deg, ${theme.palette.primary.light} 0%, ${theme.palette.background.paper} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        px: 3,
        py: shouldApplyFinanceStyles ? 3 : 2.5,
        width: '100%',
        minHeight: 'auto',
        borderRadius: '16px',
        boxShadow: '0 16px 24px 0 rgba(0, 0, 0, 0.02)',
        border: shouldApplyFinanceStyles
          ? 'none'
          : `1px solid ${theme.palette.divider}`,
      }}
    >
      {children}
    </Box>
  );
};
