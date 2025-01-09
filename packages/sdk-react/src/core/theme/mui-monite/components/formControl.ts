import { getTheme as getMoniteTheme } from '@/core/theme/monite';
import type { MonitePalette, ThemeConfig } from '@/core/theme/types';

import chroma from 'chroma-js';

export const getFormControlStyles = (
  palette: MonitePalette,
  theme: ThemeConfig,
  filterControlWidth: string
) => {
  const moniteTheme = getMoniteTheme(theme);

  return {
    styleOverrides: {
      root: {
        '&[hidden]': {
          display: 'none',
          visibility: 'hidden',
          opacity: 0,
        },
        '& .MuiInputBase-root': {
          minHeight: '48px',
          backgroundColor: palette.neutral['95'],
          borderRadius: moniteTheme.borderRadius * 2,

          '.MuiSelect-icon': {
            color: palette.text.primary,
          },

          '&.Mui-focused': {
            backgroundColor: palette.neutral['80'],
            border: `1px solid ${palette.primary.main}`,
            boxShadow: `0 0 0 4px ${chroma(palette.primary.main)
              .alpha(0.24)
              .hex()}`,
          },

          '&.Mui-error': {
            border: `1px solid ${palette.error.main}`,
            boxShadow: `0 0 0 4px ${chroma(palette.error.main)
              .alpha(0.24)
              .hex()}`,
          },
        },

        '&:hover': {
          '& .MuiInputBase-root:not(.Mui-disabled):not(.Mui-focused)': {
            backgroundColor: palette.neutral['90'],
            border: `1px solid ${palette.primary.main}`,
          },

          '& .MuiFormLabel-root.MuiFormLabel-filled': {
            '+ .MuiInputBase-root:not(.Mui-disabled):not(.Mui-focused)': {
              backgroundColor: 'transparent',
              border: `1px solid ${palette.primary.main}`,
            },
          },
        },

        '& .MuiFormLabel-root.MuiFormLabel-filled': {
          '+ .MuiInputBase-root:not(.Mui-disabled):not(.Mui-focused)': {
            backgroundColor: 'transparent',
            border: `1px solid ${palette.neutral['80']}`,
          },

          '+ .MuiInputBase-root.Mui-focused': {
            backgroundColor: 'transparent',
            border: `1px solid ${palette.primary.main}`,
          },
        },

        '& .MuiOutlinedInput-notchedOutline': {
          top: 0,
        },
        // Hide border cutout
        '& .MuiOutlinedInput-notchedOutline legend': {
          display: 'none',
        },
        '& .MuiOutlinedInput-root': {
          left: 0,
          top: 0,
        },

        // Monite Filter Control styles
        '&.Monite-FilterControl': {
          height: '40px',
          minHeight: '40px',
          maxHeight: '40px',
          maxWidth: filterControlWidth,
          width: '100%',

          '& .MuiInputBase-root': {
            marginTop: 0,
            height: '40px',
            minHeight: '40px',
            maxHeight: '40px',
            borderRadius: moniteTheme.borderRadius * 2,
            color: palette.text.primary,
            fontWeight: 500,
            backgroundColor: palette.neutral['95'],
            padding: '0 6px',

            '&.Mui-focused': {
              backgroundColor: chroma(palette.primary.main).alpha(0.05).hex(),
            },
          },

          '&:hover': {
            '& .MuiInputBase-root:not(.Mui-disabled):not(.Mui-focused)': {
              border: 'none',
            },

            '.MuiFormLabel-root.MuiFormLabel-filled': {
              opacity: 0,

              '+ .MuiInputBase-root:not(.Mui-disabled):not(.Mui-focused)': {
                backgroundColor: chroma(palette.primary.main).alpha(0.12).hex(),
              },
            },
          },

          '& .MuiSelect-select': {
            fontSize: '14px',

            '&:focus': {
              backgroundColor: 'transparent',
            },
          },

          '& .MuiFormLabel-root': {
            position: 'absolute',
            zIndex: 1,
            left: '45px',
            top: '10px',
            fontSize: '14px',
            maxWidth: 'calc(100% - 52px)',
            textOverflow: 'ellipsis',
            pointerEvents: 'none',

            '&.MuiFormLabel-filled': {
              opacity: 0,

              '+ .MuiInputBase-root': {
                color: palette.primary.main,
                backgroundColor: chroma(palette.primary.main).alpha(0.05).hex(),

                '.MuiSelect-icon, .MuiSvgIcon-root, .MuiSvgIcon-root>*': {
                  color: palette.primary.main,
                },
              },
            },
          },

          '& .MuiInputLabel-root': {
            fontWeight: 500,
            color: palette.text.secondary,
          },

          '& .MuiIconButton-root': {
            marginRight: '-6px',
          },
          '& .MuiInputAdornment-positionEnd .MuiSvgIcon-root, & .MuiIconButton-root .MuiSvgIcon-root':
            {
              width: '20px',
              height: '20px',
              '> *': {
                color: palette.text.primary,
              },
            },

          '&.Monite-DateFilterControl': {
            'input::placeholder': {
              opacity: 0,
            },
          },

          '& .MuiInputBase-input:not(.MuiSelect-select)': {
            padding: '0 0 0 8px',
            fontSize: '14px',
            textOverflow: 'ellipsis',

            '& + .MuiInputAdornment-root': {
              marginLeft: 0,
            },
          },
        },
        '&.Monite-SearchField': {
          maxWidth: '400px',
          width: '100%',
          '& label': {
            color: 'secondary.main',
          },
        },
      },
    },
  };
};
