import { createTheme } from '@mui/material';
import { tokenizedTheme } from '@team-monite/ui-kit-react';

const materialTheme = createTheme({
  breakpoints: {
    values: {
      xs: 360,
      sm: 500,
      md: 720,
      lg: 1024,
      xl: 1536,
    },
  },
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
          padding: '13px 16px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderColor: tokenizedTheme.neutral80,
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
        root: ({ ownerState }) => ({
          padding: '11px 16px',
          ...(ownerState.color === 'primary' && {
            '&:hover': {
              backgroundColor: tokenizedTheme.neutral10,
            },
          }),
          ...(ownerState.color === 'secondary' && {
            backgroundColor: tokenizedTheme.neutral90,
            color: tokenizedTheme.neutral10,
            '&:hover': {
              backgroundColor: tokenizedTheme.neutral50,
              color: tokenizedTheme.neutral100,
            },
          }),
        }),
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
