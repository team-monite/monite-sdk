import { createTheme } from '@mui/material';
import { tokenizedTheme } from '@team-monite/ui-kit-react';

const materialTheme = createTheme({
  palette: {
    primary: {
      main: tokenizedTheme.primary50,
    },
  },
  typography: {
    fontFamily: tokenizedTheme.fontFamily,

    button: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true, // No more ripple, on the whole application 💣!
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          position: 'static',
          transform: 'none',
          color: tokenizedTheme.neutral10,
          fontWeight: 500,
          marginBottom: 8,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: '8px !important',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          paddingTop: 12.5,
          paddingBottom: 12.5,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderColor: tokenizedTheme.primary60,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          '& legend span': {
            display: 'none',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '11px 16px',
        },
      },
      defaultProps: {
        size: 'large',
        sx: {
          borderRadius: 8 / 4,
          boxShadow: 'none',
          textTransform: 'initial',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
  },
});

export default materialTheme;
