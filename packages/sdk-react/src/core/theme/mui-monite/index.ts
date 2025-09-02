/* eslint lingui/no-unlocalized-strings: 0 */
import { getErrorColors } from '@/core/theme/mui-monite/colors/error';
import { getSuccessColors } from '@/core/theme/mui-monite/colors/success';
import { getWarningColors } from '@/core/theme/mui-monite/colors/warning';
import { MonitePalette, ThemeConfig } from '@/core/theme/types';
import { Components } from '@mui/material/styles';
import type { CSSProperties } from 'react';
import type {
  Palette,
  PaletteOptions,
} from '@mui/material/styles/createPalette.js';
import type { Theme, ThemeOptions } from '@mui/material/styles/createTheme.js';
import type { TypographyOptions } from '@mui/material/styles/createTypography.js';
// eslint-disable-next-line import/no-extraneous-dependencies
import { isPlainObject } from '@mui/utils';
import '@mui/x-data-grid/themeAugmentation';

import chroma from 'chroma-js';

import { getTheme as getMoniteTheme } from '../monite';
import {
  getPrimaryColors,
  getSecondaryColors,
  getNeutralColors,
  getSeverityColors,
  getTextColors,
} from './colors';
import { getFormControlStyles } from './components';

// Replaces color constant like 'divider', 'primary.main', 'neutral.80' with actual color value
function renderColor(strVal: string, palette: PaletteOptions): string {
  if (strVal.includes('.')) {
    let temporaryValue: { [key: string]: any } = palette;
    strVal.split('.').forEach((key) => {
      temporaryValue = temporaryValue && temporaryValue[key];
    });
    // noinspection SuspiciousTypeOfGuard
    if (temporaryValue && typeof temporaryValue === 'string')
      return temporaryValue;
  } else if (typeof palette[strVal as keyof PaletteOptions] === 'string')
    return palette[strVal as keyof PaletteOptions] as string;
  return strVal;
}

const colorProps = [
  'color',
  'backgroundColor',
  'bgcolor',
  'borderColor',
  'borderRightColor',
  'borderLeftColor',
  'borderTopColor',
  'borderBottomColor',
  'fill',
  '--DataGrid-rowBorderColor',
];

// Replaces color constants like 'divider', 'primary.main', 'neutral.80' with actual color values
function renderColors<T extends { [key: string]: any }>(
  components: T,
  palette: PaletteOptions
): T {
  const output: T = Array.isArray(components)
    ? ([] as unknown as T)
    : ({} as T);

  Object.keys(components).forEach((key) => {
    const prop = key as keyof T;
    if (!components.hasOwnProperty(prop)) return;
    const propValue = components[prop];
    // noinspection SuspiciousTypeOfGuard
    if (typeof propValue === 'string' && colorProps.includes(key)) {
      output[prop] = renderColor(propValue, palette) as typeof propValue;
    } else if (isPlainObject(propValue) || Array.isArray(propValue)) {
      output[prop] = renderColors(propValue, palette);
    } else {
      output[prop] = propValue;
    }
  });

  return output;
}

export const getTheme = (theme: ThemeConfig): ThemeOptions => {
  const moniteTheme = getMoniteTheme(theme);

  const statusBackgroundColors = {
    draft: '#000',
    new: '#3737FF',
    approve_in_progress: '#3737FF',
    paid: '#007F33',
    waiting_to_be_paid: '#3737FF',
    rejected: '#CC394B',
    partially_paid: '#9033D9',
    canceled: '#E75300',
    all: '#F4F4FE',
  };

  const palette: MonitePalette = {
    primary: getPrimaryColors(
      moniteTheme.colors.primary,
      moniteTheme.colors.primaryForeground
    ),
    secondary: getSecondaryColors(moniteTheme.colors.secondary),
    neutral: getNeutralColors(moniteTheme.colors.neutral),

    info: getSeverityColors(moniteTheme.colors.info),
    success: getSuccessColors(moniteTheme.colors.success),
    warning: getWarningColors(moniteTheme.colors.warning),
    error: getErrorColors(moniteTheme.colors.error),

    background: {
      default: moniteTheme.colors.background,
      paper: '#ffffff',
    },

    text: getTextColors(moniteTheme.colors.text),
    status: statusBackgroundColors,
    divider: getNeutralColors(moniteTheme.colors.neutral)['80'],
  };

  const statusColors: {
    [key: string]: { color: string; backgroundColor: string };
  } = {
    black: {
      color: '#292929',
      backgroundColor: '#F2F2F2',
    },
    blue: {
      color: '#3737FF',
      backgroundColor: '#F4F4FE',
    },
    violet: {
      color: '#A06DC8',
      backgroundColor: '#FBF1FC',
    },
    green: {
      color: '#0DAA8E',
      backgroundColor: '#EEFBF9',
    },
    orange: {
      color: '#E27E46',
      backgroundColor: '#FFF5EB',
    },
    red: {
      color: '#CC394B',
      backgroundColor: '#FFE0E4',
    },
  };

  // Array of colours for counterpart 'logos'. A random color will be used
  // from the array. See: calculateColorIndex
  const counterpartColors: string[] = [
    'rgba(0,0,255,0.05)',
    'rgba(255,0,32,0.05)',
    'rgba(0,255,220,0.05)',
    'rgba(225,1,251,0.05)',
    'rgba(255,123,0,0.05)',
  ];

  const defaultMoniteTypography:
    | TypographyOptions
    | ((palette: Palette) => TypographyOptions) = {
    fontFamily: moniteTheme.typography.fontFamily,
    fontSize: moniteTheme.typography.fontSize,
    fontWeightMedium: 400,
    fontWeightBold: 500,
    h1: {
      fontSize: moniteTheme.typography.h1.fontSize,
      fontWeight: moniteTheme.typography.h1.fontWeight,
      lineHeight: moniteTheme.typography.h1.lineHeight,
      textTransform:
        moniteTheme.typography.h1
          .textTransform as CSSProperties['textTransform'],
      color: palette.text.primary,
    },
    h2: {
      fontSize: moniteTheme.typography.h2.fontSize,
      fontWeight: moniteTheme.typography.h2.fontWeight,
      lineHeight: moniteTheme.typography.h2.lineHeight,
      textTransform:
        moniteTheme.typography.h2
          .textTransform as CSSProperties['textTransform'],
      color: palette.text.primary,
    },
    h3: {
      fontSize: moniteTheme.typography.h3.fontSize,
      fontWeight: moniteTheme.typography.h3.fontWeight,
      lineHeight: moniteTheme.typography.h3.lineHeight,
      textTransform:
        moniteTheme.typography.h3
          .textTransform as CSSProperties['textTransform'],
      color: palette.text.primary,
    },
    subtitle1: {
      fontSize: moniteTheme.typography.subtitle1.fontSize,
      fontWeight: moniteTheme.typography.subtitle1.fontWeight,
      lineHeight: moniteTheme.typography.subtitle1.lineHeight,
      textTransform:
        moniteTheme.typography.subtitle1
          .textTransform as CSSProperties['textTransform'],
    },
    subtitle2: {
      fontSize: moniteTheme.typography.subtitle2.fontSize,
      fontWeight: moniteTheme.typography.subtitle2.fontWeight,
      lineHeight: moniteTheme.typography.subtitle2.lineHeight,
      textTransform:
        moniteTheme.typography.subtitle2
          .textTransform as CSSProperties['textTransform'],
    },
    body1: {
      fontSize: moniteTheme.typography.body1?.fontSize,
      fontWeight: moniteTheme.typography.body1?.fontWeight,
      lineHeight: moniteTheme.typography.body1?.lineHeight,
    },
    body2: {
      fontSize: moniteTheme.typography.body2?.fontSize,
      fontWeight: moniteTheme.typography.body2?.fontWeight,
      lineHeight: moniteTheme.typography.body2?.lineHeight,
      color: 'rgba(0, 0, 0, 0.56)',
    },
    caption: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    overline: {
      fontSize: '1.5rem',
      lineHeight: 1,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  };

  const typography = Object.assign({}, defaultMoniteTypography, {});

  const filterControlWidth = '160px';

  const defaultMoniteComponents: Components<Omit<Theme, 'components'>> = {
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '.5em',

          '&.MuiAlert-colorInfo': {
            backgroundColor: chroma(palette.info.main).alpha(0.05).hex(),

            '.MuiAlert-icon, .MuiAlert-message': {
              color: palette.info.main,
            },
          },

          '&.MuiAlert-colorSuccess': {
            backgroundColor: chroma(palette.success.main).alpha(0.05).hex(),

            '.MuiAlert-icon, .MuiAlert-message': {
              color: palette.success.main,
            },
          },
          '&.MuiAlert-colorWarning': {
            backgroundColor: chroma(palette.warning.main).alpha(0.05).hex(),

            '.MuiAlert-icon, .MuiAlert-message': {
              color: palette.warning.main,
            },
          },
          '&.MuiAlert-colorError': {
            backgroundColor: chroma(palette.error.main).alpha(0.05).hex(),

            '.MuiAlert-icon, .MuiAlert-message': {
              color: palette.error.main,
            },
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.Monite-SummaryCard-StatusTypography': {
            fontSize: 14,
          },
          '&.Monite-SummaryCard-AmountTypography': {
            fontSize: 20,
            marginTop: 4,
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            color: 'black',
          },
        },
      },
    },
    MuiInputLabel: {
      defaultProps: {
        shrink: true,
      },
      styleOverrides: {
        root: {
          fontSize: '14px',
          transform: 'none',
          position: 'static',
          color: 'black',
          minHeight: '28px',
          '&.Mui-disabled': {
            color: 'black',
          },
        },
        asterisk: {
          color: statusColors.red.color,
          transform: 'scale(2) translate(6px, 2px)',
          display: 'inline-block',
          width: '20px',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontWeight: 400,
          borderRadius: moniteTheme.borderRadius * 2.67,
          minHeight: '40px',
          border: '1px solid transparent',
          '&:before, &:after': {
            display: 'none',
            content: 'none',
            visibility: 'hidden',
          },
          '& .MuiInputBase-input': {
            height: '40px',
            lineHeight: '40px',
            padding: '0 14px', // Adjust padding if needed
            boxSizing: 'border-box',
          },

          '& .MuiInputBase-inputAdornedStart': {
            display: 'flex',
            alignItems: 'center',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        // Editor borders
        notchedOutline: {
          borderColor: 'neutral.80',
        },
        root: {
          '&.Mui-disabled .MuiOutlinedInput-notchedOutline, .MuiOutlinedInput-notchedOutline':
            {
              borderColor: 'neutral.80',
            },
        },
      },
    },
    MuiFormControl: getFormControlStyles(palette, theme, filterControlWidth),
    MuiSelect: {
      styleOverrides: {
        root: {
          '&.Monite-NakedField': {
            '& .MuiSelect-select': {
              paddingLeft: '0',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderStyle: 'none',
            },
          },
          '&.Monite-RecipientSelector': {
            '& .MuiChip-root': {
              backgroundColor: 'transparent',
              borderColor: 'divider',
              borderWidth: '1px',
              borderStyle: 'solid',
              padding: '7px 8px',
              '& .MuiChip-label': {
                color: 'text.primary',
              },
            },
            '& .MuiSelect-icon': {
              backgroundColor: 'primary.80',
              borderRadius: moniteTheme.borderRadius * 2.67,
              width: '32px',
              height: '32px',
              transform: 'translate(7px, -2px)',
              path: {
                fill: 'primary.main',
                transform: 'scale(0.6) translate(8px, 8px)',
              },
            },
          },
        },
      },
    },
    MuiStack: {
      styleOverrides: {
        root: {
          '&.Monite-Filters': {
            backgroundColor: moniteTheme.colors.background,
            padding: moniteTheme.spacing * 1.8,
            marginBottom: 0,
            '& > *': {
              flexBasis: 'fit-content',
              flexGrow: 1,
            },

            '& .Monite-Filters-Group': {
              marginLeft: '16px',
            },
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          // Align checkbox with the label next to if the label occupies multiple lines
          '&.MuiFormControlLabel-labelPlacementEnd': {
            alignItems: 'flex-start',
            '.MuiFormControlLabel-label': {
              padding: '9px 0',
            },
          },

          '&.Monite-FilterControl': {
            marginLeft: 0,
            marginRight: 0,
            alignItems: 'center',
            width: 'auto',
            '& .MuiTypography-root': {
              fontSize: '14px',
              lineHeight: '20px',
            },
          },
        },
        label: {
          fontWeight: 400,
          fontSize: '16px',
          lineHeight: '24px',
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& > .MuiFormControl-root > .MuiInputBase-root': {
            paddingTop: 0,
            paddingBottom: 0,
          },
          '& .MuiInput-root .MuiInput-input, & .MuiInput-root.MuiInputBase-sizeSmall':
            {
              padding: '0 14px',
            },
          '& > .Monite-Selector': {
            '& > .MuiInputBase-root': {
              border: '1px solid transparent',
              '&:hover': {
                '&:not(.Mui-disabled):not(.Mui-focused)': {
                  boxShadow: `0 0 0 4px ${chroma(palette.primary.main)
                    .alpha(0.24)
                    .hex()}`,
                },
              },
              '& > .MuiInputAdornment-root': {
                '&.MuiInputAdornment-positionStart': {
                  marginRight: '16px',
                },
                '&.MuiInputAdornment-positionEnd': {
                  marginLeft: '0',
                  '& + input:not(:placeholder-shown)': {
                    opacity: 0,
                  },
                  '& + input::placeholder': {
                    color: 'rgba(184, 184, 184, 1)',
                  },
                },
              },
              '&.MuiInputBase-adornedStart.MuiInputBase-formControl': {
                padding: '16px',
                height: '70px',
                lineHeight: '70px',
                backgroundColor: 'transparent',
                '&.Mui-focused > .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                },
              },
              '&:hover > .MuiOutlinedInput-notchedOutline': {
                borderColor: '#dedede',
              },
              '& > .MuiOutlinedInput-notchedOutline': {
                top: 0,
                '> legend': {
                  display: 'none',
                },
              },
            },

            '& > .MuiFormLabel-root': {
              fontSize: '1.25rem',
              paddingBottom: '1rem',
              '& > .MuiInputLabel-asterisk': {
                display: 'none',
              },
            },
            '&.isSimplified': {
              marginBottom: '2rem',
              background: 'transparent',
              '& > .MuiInputBase-root': {
                paddingRight: '1rem',
              },
              '& > .MuiInputLabel-root': {
                fontSize: '14px',
                color: 'rgba(112, 112, 112, 1)',
                paddingBottom: '0',
                '&::after': {
                  content: '"●"',
                  position: 'relative',
                  bottom: '2px',
                  left: '4px',
                  color: 'rgba(255, 71, 93, 1)',
                },
              },
              '& > .MuiInputLabel-root > .MuiFormLabel-asterisk': {
                display: 'none',
              },
            },
          },
          '& > .Item-Selector > .MuiInputBase-root.MuiInputBase-formControl.MuiAutocomplete-inputRoot':
            {
              paddingRight: '1em',
              '&.MuiInputBase-adornedStart.MuiInputBase-formControl': {
                padding: '8px 12px',
                height: '40px',
                lineHeight: '40px',
              },
            },
          '&.Monite-FilterControl': {
            height: '40px',
            minHeight: '40px',
            maxHeight: '40px',
            maxWidth: filterControlWidth,
            width: '100%',
          },
          '&.Monite-Label-Hidden .MuiInputLabel-root.MuiFormLabel-root': {
            display: 'none',
          },
        },
        popper: {
          paddingTop: '0.5rem',
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        InputLabelProps: {
          shrink: true,
        },
      },
      styleOverrides: {
        root: {
          '&.Monite-NakedField': {
            '& .MuiInputBase-root': {
              minHeight: '32px',
              padding: 0,

              '& .MuiInputBase-input': {
                height: '32px',
                lineHeight: '32px',
                padding: 0,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderStyle: 'none',
              },
            },
            '& .MuiFormHelperText-root.Mui-error': {
              marginLeft: 0,
            },
          },
          '&.Monite-AiSearchField': {
            '& .MuiInputBase-root': {
              paddingRight: '12px',

              '& .MuiInputBase-input': {
                '&::placeholder': {
                  opacity: 0.88,
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '16px',
                  padding: '16px 10px',
                },
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderStyle: 'none',
              },
            },
          },
        },
      },
    },
    MuiDrawer: {
      variants: [
        {
          props: { variant: 'permanent' },
          style: {
            backgroundColor: 'menu.background',
            '& .MuiPaper-root': {
              backgroundColor: 'menu.background',
              borderRight: 0,
            },
          },
        },
      ],
    },
    MuiList: {
      styleOverrides: {
        root: {
          '&.NavigationList': {
            margin: '0px 12px',

            '& .MuiListItem-root': {
              marginTop: 8,

              '& .Mui-selected': {
                '& span': {
                  color: 'secondary.dark',
                },
              },
            },

            '.MuiListItemButton-root': {
              borderRadius: moniteTheme.borderRadius * 2,
              padding: '8px 12px',
            },

            '.MuiListItemIcon-root': {
              minWidth: 25,
            },

            '.MuiListItemIcon-root .MuiSvgIcon-root': {
              width: '20px',
              height: '20px',
              marginRight: '5px',
            },

            '.MuiCollapse-root': {
              marginTop: -8,
              marginLeft: 12,
            },

            '& .MuiSvgIcon-root': {
              color: 'secondary.dark',

              '& > path': {
                color: 'secondary.dark',
              },
            },
          },
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          // Button shouldn't grow inside containers that force it to grow
          maxHeight: '48px',

          '&.ThemeSelect': {
            borderRadius: moniteTheme.borderRadius,
          },
          '&.ThemeSelect .ThemeSelect-modeLabel': {
            display: 'flex',
          },
          '&.MuiButton-sizeSmall': {
            fontSize: '14px',
          },
          '&.Monite-withShadow, &.Monite-withShadow:hover': {
            boxShadow: '0px 1px 1px 0px rgba(0, 0, 0, 0.1)',
          },
        },
        containedPrimary: {
          padding: '.75em 1.25em',
          backgroundColor: 'primary.main',
          lineHeight: '1.4',
          borderRadius: moniteTheme.buttonBorderRadius,
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: 'primary.60',
            borderRadius: moniteTheme.buttonBorderRadius,
            boxShadow: 'none',
          },
          '&:active': {
            backgroundColor: 'primary.dark',
            borderRadius: moniteTheme.buttonBorderRadius,
            boxShadow: 'none',
          },
          '&:disabled': {
            color: 'neutral.70',
            backgroundColor: 'neutral.90',
            borderColor: 'neutral.90',
            boxShadow: 'none',
          },
        },
        outlinedPrimary: {
          padding: '.75em 1.25em',
          color: 'primary.30',
          backgroundColor: 'primary.90',
          border: 'none',
          borderRadius: moniteTheme.buttonBorderRadius,
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: 'primary.80',
            border: 'none',
            boxShadow: 'none',
          },
          '&:active': {
            backgroundColor: 'primary.70',
            border: 'none',
            boxShadow: 'none',
          },
          '&:disabled': {
            color: 'neutral.70',
            backgroundColor: 'neutral.90',
            border: 'none',
            boxShadow: 'none',
          },
        },
        textPrimary: {
          padding: '.75em 1.25em',
          color: 'primary.30',
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: 'primary.90',
            border: 'none',
            boxShadow: 'none',
          },
          '&:active': {
            backgroundColor: 'primary.70',
            border: 'none',
            boxShadow: 'none',
          },
          '&:disabled': {
            color: 'neutral.70',
            backgroundColor: 'neutral.90',
            border: 'none',
            boxShadow: 'none',
          },
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          border: 'none',
          width: 240,
        },
      },
    },
    MuiPopper: {
      defaultProps: {
        disablePortal: true,
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          '&.MuiAvatar-colored': {
            margin: 0,
            color: 'text.primary',
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: '40px',
            width: '40px',
            height: '40px',

            '&.MuiAvatar-0': {
              backgroundColor: counterpartColors[0],
            },
            '&.MuiAvatar-1': {
              backgroundColor: counterpartColors[1],
            },
            '&.MuiAvatar-2': {
              backgroundColor: counterpartColors[2],
            },
            '&.MuiAvatar-3': {
              backgroundColor: counterpartColors[3],
            },
            '&.MuiAvatar-4': {
              backgroundColor: counterpartColors[4],
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: 'primary.light',
          borderRadius: moniteTheme.borderRadius * 1.33,
          color: 'primary.main',
          fontSize: '14px',
          lineHeight: '16px',
          fontWeight: 500,
          padding: '7px 8px',
          '& .MuiChip-avatar': {
            marginLeft: 0,
            marginRight: '4px',
          },
          gap: 8,
        },
        label: {
          padding: '0',
        },
        deleteIcon: {
          margin: '0 -2px 0 6px',
        },
      },
    },
    MuiDataGrid: {
      defaultProps: {
        columnHeaderHeight: 55,
        rowHeight: 48,
        density: 'standard',
      },
      styleOverrides: {
        root: {
          color: palette.text.primary,
          backgroundColor: palette.background.default,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderWidth: 0,
          borderBottomLeftRadius: moniteTheme.borderRadius * 2,
          borderBottomRightRadius: moniteTheme.borderRadius * 2,
          '--DataGrid-rowBorderColor': 'divider',
          '--DataGrid-containerBackground': moniteTheme.colors.background,
          '& .MuiDataGrid-withBorderColor': {
            borderColor: 'divider',
          },
          '&.MuiDataGrid-withBorderColor': {
            borderColor: 'divider',
          },
          '& div[role="presentation"] + .MuiDataGrid-cell, & div[role="presentation"] + .MuiDataGrid-columnHeader':
            {
              borderLeftStyle: 'none',
              borderLeftWidth: '0',
            },
        },
        columnHeader: {
          overflow: 'visible',
          borderLeftStyle: 'solid',
          borderLeftWidth: '0px',
          borderLeftColor: 'divider',
          padding: '0 15.5px',
          background: moniteTheme.colors.background,
          '& .MuiDataGrid-columnHeaderTitle': {
            color: palette.text,
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '17.57px',
          },
        },
        columnSeparator: {
          border: 0,
        },
        cell: {
          '&[role="gridcell"]': {
            borderLeftStyle: 'solid',
            borderLeftWidth: '0px',
            borderLeftColor: 'divider',
          },
          '&.Monite-Cell-Highlight': {
            color: 'neutral.10',
          },

          '.MuiDataGrid-cellOffsetLeft + &': {
            borderLeftStyle: 'none',
            borderLeftWidth: '0',
          },

          padding: '0 12px',
          fontWeight: 400,
          fontSize: '15px',

          '& span.Monite-DueDateCell-OverdueDays': {
            fontSize: '12px',
          },
          // Align counterpart avatar with the cell header
          '&[data-field="counterpart_id"], &[data-field="counterpart_name"], &[data-field="was_created_by_user_id"]':
            {
              '.MuiChip-root': {
                paddingLeft: 0,
              },
            },
          '&[data-field="actions"]': {
            textOverflow: 'clip', // Hide ... after action buttons
          },
          '& .Monite-TextOverflowContainer': {
            display: 'block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
          '&:focus': {
            outline: 'none',
          },
          '& .MuiChip-label': {
            fontWeight: 600,
            fontSize: '13px',
            letterSpacing: '0.098px',
          },
        },
        footerContainer: {
          padding: '8px 0',
          '& .Monite-RowsPerPageSelector div[role="combobox"]': {
            lineHeight: '40px',
            fontSize: '13px',
            color: 'text.secondary',
          },
          '& .Monite-TablePagination-PreviousPageButton': {
            padding: '8px',
            border: '1px solid',
            borderColor: 'neutral.80',
            borderRadius: '4px',
            marginRight: '6px',
          },
          '& .Monite-TablePagination-NextPageButton': {
            padding: '8px',
            border: '1px solid',
            borderColor: 'neutral.80',
            borderRadius: '4px',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 500,
            color: 'neutral.50',
            verticalAlign: 'bottom',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:not(.Monite-CreateReceivable-ItemsSection-Table) .MuiTableCell-root':
            {
              borderColor: 'neutral.80',
            },
          '&.Monite-CreateReceivable-ItemsSection-Table': {
            '.MuiTableCell-root': {
              borderBottom: 'none',
              padding: '8px 12px 8px 0',
              '& .MuiFormControl-root .MuiInputBase-root': {
                backgroundColor: '#fff',
              },
            },

            'th.MuiTableCell-root': {
              padding: '0 12px 0 0',
            },

            '+ .MuiTableRow-root .MuiTableCell-root': {
              paddingLeft: 0,
            },
          },
          '&:last-child .MuiTableCell-body': {
            borderBottom: 'none',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid',
          borderColor: 'neutral.80',
          minHeight: 'unset',
          '& .MuiTab-root': {
            backgroundColor: 'transparent',
            color: 'text.primary',
            padding: '16px',
            minHeight: 'unset',
            boxSizing: 'border-box',
            textTransform: 'none',

            '&:hover': {
              backgroundColor: 'transparent',
            },

            '&:active': {
              backgroundColor: 'transparent',
            },
          },
          '& .MuiTab-root.Mui-selected': {
            backgroundColor: 'transparent',
            color: 'text.primary',

            '&:hover': {
              backgroundColor: 'transparent',
            },

            '&:active': {
              backgroundColor: 'transparent',
            },
          },
        },
        indicator: {
          borderRadius: 10,
          backgroundColor: palette.primary.main,
          height: '4px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          '&.Monite-SummaryCard': {
            display: 'flex',
            borderRadius: moniteTheme.borderRadius * 1.67, //10px
            backgroundColor: palette.background.default,
            outline: '3px solid',
            outlineColor: 'transparent',
            border: '1px solid',
            borderColor: palette.neutral['90'],
            transition:
              'border-color 0.1s ease-in-out, outline-color 0.2s ease-in-out',

            boxShadow: 'none',
          },
          '&.Monite-SummaryCard-selected, &.Monite-SummaryCard:hover, &.Monite-SummaryCard:active, &.Monite-SummaryCard:focus':
            {
              borderColor: palette.primary.main,
              borderWidth: '1px',
              outlineColor: palette.primary['80'],
            },
          '&.Monite-SummaryCard-all': {
            minWidth: '118px',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px 32px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: moniteTheme.borderRadius * 2.67,
          borderColor: 'neutral.80',
        },
        elevation: {
          '&.MuiTableContainer-root': {
            boxShadow: 'none',
          },
        },
        rounded: {
          '&.Monite-PayableDetailsForm-Items': {
            // Align delete button with the editor
            'button[aria-label="delete"]': {
              width: '40px',
              height: '40px',
              marginTop: '24px',

              svg: {
                width: '20px',
                height: 'auto',
              },
            },
            // Align total with the editor right side
            '.Monite-PayableDetailsForm-Item .Monite-PayableDetailsForm-Item-Total':
              {
                marginRight: '10.8%',
              },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '1em 1.5em',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          '&.MuiTypography-h6': {
            padding: '12px 24px',
            '.MuiToolbar-root': {
              padding: '0 0 0 16px',
            },
          },
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          margin: 0,
          padding: '24px 32px 40px',
          '> form': {
            maxWidth: 'min(940px, 100%)',
            margin: '0 auto',
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: '12px',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: '55px',
          height: '40px',
          '& > .MuiButtonBase-root.Mui-checked': {
            left: '-10px',
          },
          '& > .MuiSwitch-track': {
            height: '20px',
            position: 'relative',
            bottom: '3px',
            width: '40px',
            left: '-2px',
            borderRadius: '12px',
          },
          '& > .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(25px)',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '12px',
              left: '11px',
              width: '16px',
              height: '16px',
              color: '#fff',
              backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodeURIComponent(
                '#fff'
              )}'><path d='M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z'/></svg>")`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
            },
          },
          '& > .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            background: 'rgba(203, 203, 254, 1)',
            opacity: 1,
          },
          '& > .MuiSwitch-input': {
            left: 0,
          },
        },
      },
    },
    MoniteApprovalRequestStatusChip: {
      defaultProps: {
        icon: moniteTheme.components.approvalRequestStatusChip.icon,
        size: moniteTheme.components.approvalRequestStatusChip.size,
        variant: moniteTheme.components.approvalRequestStatusChip.variant,
      },
    },
    MoniteInvoiceRecurrenceStatusChip: {
      defaultProps: {
        icon: moniteTheme.components.invoiceRecurrenceStatusChip.icon,
        size: moniteTheme.components.invoiceRecurrenceStatusChip.size,
        variant: moniteTheme.components.invoiceRecurrenceStatusChip.variant,
      },
    },
    MoniteInvoiceRecurrenceIterationStatusChip: {
      defaultProps: {
        icon: moniteTheme.components.invoiceRecurrenceIterationStatusChip.icon,
        size: moniteTheme.components.invoiceRecurrenceIterationStatusChip.size,
        variant:
          moniteTheme.components.invoiceRecurrenceIterationStatusChip.variant,
      },
    },
    MoniteInvoiceStatusChip: {
      defaultProps: {
        icon: moniteTheme.components.invoiceStatusChip.icon,
        size: moniteTheme.components.invoiceStatusChip.size,
        variant: moniteTheme.components.invoiceStatusChip.variant,
      },
      styleOverrides: {
        root: {
          fontSize: '13px',
        },
      },
      variants: [
        {
          props: { status: 'draft' },
          style: statusColors.black,
        },
        {
          props: { status: 'issued' },
          style: statusColors.blue,
        },
        {
          props: { status: 'accepted' },
          style: statusColors.green,
        },
        {
          props: { status: 'expired' },
          style: statusColors.red,
        },
        {
          props: { status: 'declined' },
          style: statusColors.red,
        },
        {
          props: { status: 'recurring' },
          style: statusColors.green,
        },
        {
          props: { status: 'partially_paid' },
          style: statusColors.violet,
        },
        {
          props: { status: 'paid' },
          style: statusColors.green,
        },
        {
          props: { status: 'overdue' },
          style: statusColors.orange,
        },
        {
          props: { status: 'uncollectible' },
          style: statusColors.red,
        },
        {
          props: { status: 'canceled' },
          style: statusColors.orange,
        },
        {
          props: { status: 'deleted' },
          style: statusColors.black,
        },
      ],
    },
    MonitePayableStatusChip: {
      defaultProps: {
        icon: moniteTheme.components.payableStatusChip.icon,
        size: moniteTheme.components.payableStatusChip.size,
        variant: moniteTheme.components.payableStatusChip.variant,
      },
      styleOverrides: {
        root: {
          fontSize: '13px',
        },
      },
      variants: [
        {
          props: { status: 'draft' },
          style: statusColors.black,
        },
        {
          props: { status: 'new' },
          style: statusColors.blue,
        },
        {
          props: { status: 'approve_in_progress' },
          style: statusColors.orange,
        },
        {
          props: { status: 'waiting_to_be_paid' },
          style: statusColors.blue,
        },
        {
          props: { status: 'partially_paid' },
          style: statusColors.violet,
        },
        {
          props: { status: 'paid' },
          style: statusColors.green,
        },
        {
          props: { status: 'canceled' },
          style: statusColors.orange,
        },
        {
          props: { status: 'rejected' },
          style: statusColors.red,
        },
      ],
    },
    MoniteCounterpartStatusChip: {
      defaultProps: {},
      styleOverrides: {
        root: {
          height: '24px',
          padding: '7px 8px',
          backgroundColor: 'transparent',
          color: 'text.primary',
          borderColor: 'neutral.80',
        },
      },
    },
  };

  const components = renderColors(defaultMoniteComponents, palette);

  return {
    spacing: moniteTheme.spacing,
    palette: {
      ...palette,
      status: statusBackgroundColors,
    },
    shape: {
      borderRadius: moniteTheme.borderRadius,
    },
    typography,
    components,
  };
};
