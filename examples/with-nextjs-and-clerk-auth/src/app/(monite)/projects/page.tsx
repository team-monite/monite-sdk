'use client';

import React from 'react';

import Image from 'next/image';

import { Box, Stack, Typography } from '@mui/material';

import stubSvg from './stub.svg';

export default function ProjectsPage() {
  return (
    <Box className="Monite-PageContainer Monite-Projects">
      <Stack direction="column" justifyContent="flex-start" alignItems="center">
        <Box className="Monite-Projects-Header">
          <Typography variant="h2">Projects</Typography>
        </Box>
        <Image priority src={stubSvg} alt="" />
      </Stack>
    </Box>
  );
}
