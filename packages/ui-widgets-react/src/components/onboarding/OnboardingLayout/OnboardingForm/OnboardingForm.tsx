import React, { ReactNode } from 'react';
import { Box } from '@mui/material';

export type OnboardingFormProps = {
  children: ReactNode;
  formKey: string;
  onSubmit: () => void;
};

export default function OnboardingForm({
  children,
  formKey,
  onSubmit,
}: OnboardingFormProps) {
  return (
    <Box
      id={formKey}
      component="form"
      sx={{
        display: 'flex',
        gap: 1,
        flexDirection: 'column',
      }}
      noValidate
      onSubmit={onSubmit}
    >
      {children}
    </Box>
  );
}
