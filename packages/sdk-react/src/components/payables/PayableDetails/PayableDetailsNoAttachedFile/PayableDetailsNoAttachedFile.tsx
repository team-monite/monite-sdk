'use client';

import React from 'react';

import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Box, Typography } from '@mui/material';

export const PayableDetailsNoAttachedFile = () => {
  const { i18n } = useLingui();
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          margin: 'auto',
        }}
      >
        <AttachFileIcon
          color="primary"
          fontSize="large"
          sx={{ marginBottom: 2 }}
        />
        <Typography color="secondary">{t(
          i18n
        )`This invoice doesn't have a file attached.`}</Typography>
      </Box>
    </Box>
  );
};
