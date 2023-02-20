import React, { ReactNode } from 'react';
import { Typography } from '@mui/material';

export type OnboardingSubTitleProps = {
  children: ReactNode;
};

export default function OnboardingSubTitle({
  children,
}: OnboardingSubTitleProps) {
  return (
    <Typography
      component={'h2'}
      sx={{
        fontWeight: 600,
        fontSize: 18,
        lineHeight: '24px',
      }}
    >
      {children}
    </Typography>
  );
}
