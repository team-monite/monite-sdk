import { PropsWithChildren } from 'react';

import { Box } from '@mui/material';

type Props = {
  shouldDisplayCustomBg: boolean;
  variant?: 'onboard' | 'finance' | 'finance_card';
};

export const FinanceBannerPlaceholder = ({
  children,
  shouldDisplayCustomBg,
  variant = 'onboard',
}: PropsWithChildren<Props>) => {
  const handleVariant = () => {
    switch (variant) {
      case 'onboard':
      default:
        return {
          width: '100%',
          height: '90px',
          boxWidth: '410px',
          boxHeight: '410px',
          boxBottom: '-290px',
          boxRight: '-70px',
          px: 3,
          py: 2.5,
        };
      case 'finance_card':
        return {
          width: '100%',
          height: '280px',
          boxWidth: '410px',
          boxHeight: '410px',
          boxBottom: '-290px',
          boxRight: '-70px',
          px: 4,
          py: 4,
        };
      case 'finance':
        return {
          width: '100%',
          height: '192px',
          boxWidth: '652px',
          boxHeight: '652px',
          boxBottom: '-520px',
          boxRight: '-120px',
          px: 3,
          py: 3,
        };
    }
  };

  const variantStyle = handleVariant();

  return (
    <Box
      width={variantStyle.width}
      minHeight={variantStyle.height}
      bgcolor="#FFF"
      px={variantStyle.px}
      py={variantStyle.py}
      boxSizing="border-box"
      position="relative"
      sx={{
        boxShadow: '0 16px 24px 0 rgba(0, 0, 0, 0.02)',
        borderRadius: '16px',
        border: `1px solid ${shouldDisplayCustomBg ? '#CBCBFE' : '#DEDEDE'}`,
      }}
    >
      {shouldDisplayCustomBg && (
        <Box
          width="100%"
          height="100%"
          overflow="hidden"
          borderRadius="16px"
          left={0}
          top={0}
          position="absolute"
        >
          <Box
            width={variantStyle.boxWidth}
            height={variantStyle.boxHeight}
            bgcolor="#fbfaff"
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={4}
            position="absolute"
            right={variantStyle.boxRight}
            bottom={variantStyle.boxBottom}
            zIndex={1}
            boxSizing="border-box"
            sx={{ transform: 'rotate(-30deg)', borderRadius: '8px' }}
          >
            <Box
              width="100%"
              height="100%"
              bgcolor="#f5f5ff"
              display="flex"
              alignItems="center"
              boxSizing="border-box"
              justifyContent="center"
              p={4}
              sx={{ borderRadius: '8px' }}
            >
              <Box
                width="100%"
                height="100%"
                bgcolor="#f1f1ff"
                boxSizing="border-box"
                sx={{ borderRadius: '8px' }}
              />
            </Box>
          </Box>
        </Box>
      )}
      {children}
    </Box>
  );
};
