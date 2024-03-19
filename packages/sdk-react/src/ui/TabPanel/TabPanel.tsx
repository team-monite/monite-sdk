import React from 'react';

import { Box, Typography } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  id: string;
  'aria-labelledby': string;
}

export const TabPanel = ({
  value,
  index,
  id,
  ['aria-labelledby']: ariaLabelBy,
  children,
}: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={id}
      aria-labelledby={ariaLabelBy}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};
