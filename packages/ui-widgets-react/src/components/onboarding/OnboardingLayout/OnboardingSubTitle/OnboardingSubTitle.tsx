import React, { ReactNode } from 'react';
import { Typography } from '@mui/material';

export type OnboardingSubTitleProps = {
  children: ReactNode;
  action?: ReactNode;
};

export default function OnboardingSubTitle({
  children,
  action,
}: OnboardingSubTitleProps) {
  return (
    <Typography
      component={'h2'}
      sx={{
        fontWeight: 600,
        fontSize: 18,
        lineHeight: '24px',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      {children}
      {action}
    </Typography>
  );
}
