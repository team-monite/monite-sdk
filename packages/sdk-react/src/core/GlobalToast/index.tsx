import React from 'react';
import { Toaster } from 'react-hot-toast';

import { grey } from '@mui/material/colors';

export const GlobalToast = () => {
  return (
    <Toaster
      toastOptions={{
        style: {
          padding: '8px 12px',
          borderRadius: '4px',
          fontFamily: "'Faktum', sans-serif",
          fontWeight: 500,
          fontSize: '14px',
          lineHeight: '20px',
          background: grey[900],
          color: grey[50],
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
