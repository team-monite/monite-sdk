'use client';

import { MoniteProvider, Onboarding } from '@monite/sdk-react';
import { Box } from '@mui/material';

export default async function CounterpartsPage() {
  return (
    <Box className="Monite-PageContainer Monite-Onboarding">
      <Onboarding />
    </Box>
  );
}
