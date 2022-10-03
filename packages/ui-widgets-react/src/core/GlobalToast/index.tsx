import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useTheme } from 'emotion-theming';
import { Theme } from '@team-monite/ui-kit-react';

const GlobalToast = () => {
  const theme = useTheme<Theme>();

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
          background: theme.colors.black,
          color: '#FFFFFF',
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

export default GlobalToast;
