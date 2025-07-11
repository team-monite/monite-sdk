/* eslint lingui/no-unlocalized-strings: 0 */
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
          '& > .MuiOutlinedInput-notchedOutline': {
            top: 0,
            '> legend': {
              display: 'none',
            },
          },

          '&:not(.Mui-disabled):hover fieldset.MuiOutlinedInput-notchedOutline':
            {
              borderColor: 'transparent',
            },

          '.MuiSelect-icon': {
            color: palette.text.primary,
          },

          '&.Mui-focused': {
            backgroundColor: palette.neutral['80'],
            borderColor: 'transparent',
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

          '&.MuiInputBase-adornedEnd': {
            paddingRight: 8,
          },
        },

        'label+.MuiInputBase-root': {
          marginTop: 0,
        },
        '&:hover': {
          '&.MuiInputBase-root:not(.Mui-disabled):not(.Mui-focused)': {
            backgroundColor: palette.neutral['90'],
            border: `1px solid ${palette.primary['40']}`,
          },

          '& .MuiFormLabel-root.MuiFormLabel-filled': {
            '+ .MuiInputBase-root:not(.Mui-disabled):not(.Mui-focused)': {
              backgroundColor: 'transparent',
              border: `1px solid ${palette.primary['40']}`,
            },
          },
        },
        '&:not(.Monite-FilterControl):not(.Monite-Selector):hover': {
          '& .MuiInputBase-root:not(.Mui-disabled):not(.Mui-focused)': {
            border: `1px solid ${palette.primary['40']}`,
          },

          '& .MuiInputAdornment-root .MuiInputBase-root:not(.Mui-disabled):not(.Mui-focused)':
            {
              borderColor: 'transparent',
            },

          '& .MuiFormLabel-root': {
            '+ .MuiInputBase-root:not(.Mui-focused)': {
              backgroundColor: 'transparent',
              border: `1px solid ${palette.primary['40']}`,
            },
          },
        },

        '&:not(.Monite-Selector):not(.Monite-FilterControl) .MuiFormLabel-root':
          {
            fontSize: '14px',
            color: ' rgba(112, 112, 112, 1)',
            backgroundColor: 'transparent',

            '&:hover, &.Mui-focused': {
              backgroundColor: 'transparent',
              '& > .MuiOutlinedInput-notchedOutline': {
                backgroundColor: 'transparent',
              },
            },
            '&.Mui-required > .MuiFormLabel-asterisk': {
              display: 'none',
            },
            '&.Mui-required::after': {
              content: '"●"',
              position: 'relative',
              bottom: '2px',
              left: '4px',
              color: ' rgba(255, 71, 93, 1)',
            },
            '+ .MuiInputBase-root:not(.Mui-disabled):not(.Mui-focused)': {
              backgroundColor: 'transparent',
              border: `1px solid ${palette.neutral['80']}`,
            },

            '+ .MuiInputBase-root.Mui-focused': {
              backgroundColor: 'transparent',
              border: `1px solid ${palette.primary.main}`,
            },

            '&:not(.Monite-Selector) > .MuiInputLabel-root > .MuiFormLabel-asterisk':
              {
                display: 'none',
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
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent',
              },
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
                  backgroundColor: chroma(palette.primary.main)
                    .alpha(0.05)
                    .hex(),
                },
              },

              '&:hover': {
                '& .MuiInputBase-root:not(.Mui-disabled):not(.Mui-focused)': {
                  border: 'none',
                },

                '.MuiFormLabel-root.MuiFormLabel-filled': {
                  opacity: 0,

                  '+ .MuiInputBase-root:not(.Mui-disabled):not(.Mui-focused)': {
                    backgroundColor: chroma(palette.primary.main)
                      .alpha(0.12)
                      .hex(),
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
                    backgroundColor: chroma(palette.primary.main)
                      .alpha(0.05)
                      .hex(),

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
    },
  };
};
