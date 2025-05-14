import { ReactNode } from 'react';

import { Box, SxProps, Theme } from '@mui/material';

type FormSelectProps = {
  children: ReactNode;
  sx?: SxProps<Theme>;
};

export const FormSelect = ({ children, sx }: FormSelectProps) => {
  return (
    <Box
      sx={{
        flex: 1,
        '& .MuiInputBase-root': {
          height: '56px',
        },
        '& .MuiOutlinedInput-root': {
          paddingRight: '14px',
        },
        '& .MuiInputAdornment-positionEnd': {
          marginLeft: 0,
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};
