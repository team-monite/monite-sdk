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
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: tokenizedTheme.neutral10,
          padding: '8px 12px',
        },
        arrow: {
          color: tokenizedTheme.neutral10,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          position: 'static',
          transform: 'none',
          color: tokenizedTheme.neutral10,
          fontWeight: 500,
          fontSize: '14px',
          marginBottom: 8,
          '&:not(.Mui-disabled):hover, &.Mui-focused': {
            color: tokenizedTheme.neutral10,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: '8px !important',
          '& .MuiOutlinedInput-notchedOutline': {
            transition:
              'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          },

          '&:not(.Mui-disabled):hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0, 0, 0, 0.23)',
          },

          '&:not(.Mui-disabled).Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: tokenizedTheme.primary50,
            boxShadow: '0px 0px 0px 4px rgba(36, 111, 255, 0.2)',
          },
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
    // MuiSelect: {
    //   styleOverrides: {
    //     root: {
    //       '& .MuiOutlinedInput-notchedOutline': {
    //         // top: 0,
    //         // background: '#F3F3F3',
    //         transition:
    //           'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    //       },
    //
    //     }
    //   }
    // },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          '& legend span': {
            display: 'none',
          },
        },
        input: {
          padding: '13px 16px',
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
