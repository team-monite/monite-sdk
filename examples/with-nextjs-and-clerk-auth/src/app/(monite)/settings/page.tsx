'use client';

import stubSvg from './stub.svg';
import { Box, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';

export default function ProjectsPage() {
  return (
    <Box className="Monite-PageContainer Monite-Settings">
      <Stack direction="column" justifyContent="flex-start" alignItems="center">
        <Box className="Monite-Projects-Header">
          <Typography variant="h2">Settings</Typography>
        </Box>
        <Image priority src={stubSvg} alt="" />
      </Stack>
    </Box>
  );
}
