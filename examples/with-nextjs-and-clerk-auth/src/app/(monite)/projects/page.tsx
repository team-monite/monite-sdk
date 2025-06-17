'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Box, Stack, Typography } from '@mui/material';

import stubSvg from './stub.svg';

export default function ProjectsPage() {
  return (
    <Box className="Monite-PageContainer Monite-Projects">
      <Stack direction="column" justifyContent="flex-start" alignItems="center">
        <Box className="Monite-Projects-Header">
          <Typography variant="h2">Projects</Typography>
        </Box>
        <Link href="https://docs.monite.com/common/projects" target="_blank">
          <Image priority src={stubSvg} alt="Projects" />
        </Link>
      </Stack>
    </Box>
  );
}
