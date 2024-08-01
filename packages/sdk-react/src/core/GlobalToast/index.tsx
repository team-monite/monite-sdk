import { Toaster } from 'react-hot-toast';

import { useTheme } from '@mui/material';

export const GlobalToast = () => {
  const theme = useTheme();

  return (
    <Toaster
      toastOptions={{
        style: {
          padding: '8px 12px',
          borderRadius: '4px',
          fontFamily: theme.typography.body1.fontFamily,
          fontWeight: 500,
          fontSize: '14px',
          lineHeight: '20px',
          background: theme.palette.grey[900],
          color: theme.palette.grey[50],
        },
      }}
      gutter={8}
      position="bottom-left"
      containerStyle={{
        top: 40,
        left: 40,
        bottom: 40,
        right: 40,
      }}
    />
  );
};
