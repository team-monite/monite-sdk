'use client';

import React from 'react';

import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingFallbackProps {
  text?: string;
  size?: number;
  showText?: boolean;
  minimal?: boolean;
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  text = 'Loading...',
  size = 32,
  showText = true,
  minimal = false,
}) => {
  if (minimal) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={1}>
        <CircularProgress size={size} />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      p={3}
      minHeight="100px"
    >
      <CircularProgress size={size} />
      {showText && (
        <Typography variant="body2" color="text.secondary">
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingFallback;
