import { MonitePalette, ThemeConfig } from '@/core/theme/types';
import { Components } from '@mui/material/styles';
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
  const output: T = Array.isArray(components) ? ([] as any as T) : ({} as T);

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
    draft: '#000000D6',
    new: moniteTheme.colors.primary,
    approve_in_progress: '#E75300',
    paid: '#13705F',
    waiting_to_be_paid: moniteTheme.colors.primary,
    rejected: '#FF475D',
    partially_paid: '#A06DC8',
    canceled: '#E75300',
    all: '#F4F4FE',
  };

  const palette: MonitePalette = {
    primary: getPrimaryColors(moniteTheme.colors.primary),
    secondary: getSecondaryColors(moniteTheme.colors.secondary),
    neutral: getNeutralColors(moniteTheme.colors.neutral),

    info: getSeverityColors(moniteTheme.colors.info),
    success: getSeverityColors(moniteTheme.colors.success),
    warning: getSeverityColors(moniteTheme.colors.warning),
    error: getSeverityColors(moniteTheme.colors.error),

    background: {
      default: moniteTheme.colors.background,
      paper: '#ffffff',
    },

    text: getTextColors(moniteTheme.colors.text),

    divider: '#DDDDDD',
  };

  const statusColors: {
    [key: string]: { color: string; backgroundColor: string };
  } = {
    black: {
      color: '#292929',
      backgroundColor: '#F2F2F2',
    },
    blue: {
      color: moniteTheme.colors.primary,
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
      color: palette.text.primary,
    },
    h2: {
      fontSize: moniteTheme.typography.h2.fontSize,
      fontWeight: moniteTheme.typography.h2.fontWeight,
      lineHeight: moniteTheme.typography.h2.lineHeight,
      color: palette.text.primary,
    },
    h3: {
      fontSize: moniteTheme.typography.h3.fontSize,
      fontWeight: moniteTheme.typography.h3.fontWeight,
      lineHeight: moniteTheme.typography.h3.lineHeight,
      color: palette.text.primary,
    },
    subtitle1: {
      fontSize: moniteTheme.typography.subtitle1.fontSize,
      fontWeight: moniteTheme.typography.subtitle1.fontWeight,
      lineHeight: moniteTheme.typography.subtitle1.lineHeight,
    },
    subtitle2: {
      fontSize: moniteTheme.typography.subtitle2.fontSize,
      fontWeight: moniteTheme.typography.subtitle2.fontWeight,
      lineHeight: moniteTheme.typography.subtitle2.lineHeight,
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
          borderRadius: moniteTheme.borderRadius,

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
          '&.Monite-SummaryCard-StatusTypography-draft': {
            color: statusBackgroundColors.draft,
          },
          '&.Monite-SummaryCard-StatusTypography-new': {
            color: statusBackgroundColors.new,
          },
          '&.Monite-SummaryCard-StatusTypography-approve_in_progress': {
            color: statusBackgroundColors.approve_in_progress,
          },
          '&.Monite-SummaryCard-StatusTypography-paid': {
            color: statusBackgroundColors.paid,
          },
          '&.Monite-SummaryCard-StatusTypography-waiting_to_be_paid': {
            color: statusBackgroundColors.waiting_to_be_paid,
          },
          '&.Monite-SummaryCard-StatusTypography-rejected': {
            color: statusBackgroundColors.rejected,
          },
          '&.Monite-SummaryCard-StatusTypography-partially_paid': {
            color: statusBackgroundColors.partially_paid,
          },
          '&.Monite-SummaryCard-StatusTypography-canceled': {
            color: statusBackgroundColors.canceled,
          },
          '&.Monite-SummaryCard-StatusTypography-all': {
            color: statusBackgroundColors.all,
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
            backgroundColor: 'background.paper',
            padding: '14px',
            marginBottom: 0,
            borderTopLeftRadius: moniteTheme.borderRadius * 2,
            borderTopRightRadius: moniteTheme.borderRadius * 2,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'divider',
            borderBottomStyle: 'none',
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
          '&.Monite-FilterControl': {
            height: '40px',
            minHeight: '40px',
            maxHeight: '40px',
            maxWidth: filterControlWidth,
            width: '100%',
          },
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
          minWidth: '120px',
          backgroundColor: 'primary.main',
          borderRadius: moniteTheme.borderRadius,
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: 'primary.60',
            borderRadius: moniteTheme.borderRadius,
            boxShadow: 'none',
          },
          '&:active': {
            backgroundColor: 'primary.dark',
            borderRadius: moniteTheme.borderRadius,
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
          backgroundColor: 'primary.90',
          borderColor: 'primary.90',
          borderRadius: moniteTheme.borderRadius,
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: 'primary.80',
            borderColor: 'primary.80',
            boxShadow: 'none',
          },
          '&:active': {
            backgroundColor: 'primary.60',
            borderColor: 'primary.60',
            boxShadow: 'none',
          },
          '&:disabled': {
            color: 'neutral.70',
            backgroundColor: 'neutral.90',
            borderColor: 'neutral.90',
            boxShadow: 'none',
          },
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          border: 'none',
          borderRadius: moniteTheme.borderRadius * 5.33,
          width: 240,
        },
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
        rowHeight: 72,
        density: 'standard',
      },
      styleOverrides: {
        root: {
          backgroundColor: 'background.paper',
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: moniteTheme.borderRadius * 2,
          borderBottomRightRadius: moniteTheme.borderRadius * 2,
          '--DataGrid-rowBorderColor': 'divider',
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
          borderLeftStyle: 'solid',
          borderLeftWidth: '1px',
          borderLeftColor: 'divider',
          padding: '0 15.5px',
          '& .MuiDataGrid-columnHeaderTitle': {
            color: 'rgba(0, 0, 0, 0.77)',
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '17.57px',
          },
        },
        cell: {
          '&[role="gridcell"]': {
            borderLeftStyle: 'solid',
            borderLeftWidth: '1px',
            borderLeftColor: 'divider',
          },

          '.MuiDataGrid-cellOffsetLeft + &': {
            borderLeftStyle: 'none',
            borderLeftWidth: '0',
          },

          padding: '0 15.5px',
          fontWeight: 400,
          fontSize: '14px',
          '& span': {
            fontWeight: 400,
            fontSize: '14px',
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
        },
        footerContainer: {
          '& .Monite-RowsPerPageSelector div[role="combobox"]': {
            lineHeight: '40px',
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
          '&.Monite-CreateReceivable-ItemsSection-Table .MuiTableCell-root': {
            borderBottom: 'none',
            padding: '8px 12px',
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
          '& .MuiTab-root': {
            color: palette.neutral[50],
            padding: '16px',
            boxSizing: 'border-box',

            '&:hover': {
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: 4,
                backgroundColor: palette.neutral[50],
                borderRadius: 10,
              },
            },

            '&:active': {
              backgroundColor: palette.neutral[90],
              borderTopLeftRadius: moniteTheme.borderRadius * 2,
              borderTopRightRadius: moniteTheme.borderRadius * 2,
            },
          },
          '& .MuiTab-root.Mui-selected': {
            backgroundColor: chroma(palette.primary.main).alpha(0.05).hex(),
            color: palette.primary.main,
            borderTopLeftRadius: moniteTheme.borderRadius * 2,
            borderTopRightRadius: moniteTheme.borderRadius * 2,

            '&:hover': {
              backgroundColor: chroma(palette.primary.main).alpha(0.12).hex(),
            },

            '&:active': {
              backgroundColor: chroma(palette.primary.main).alpha(0.24).hex(),
            },
          },
        },
        indicator: {
          borderRadius: 6,
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
            borderRadius: moniteTheme.borderRadius,
            backgroundColor: '#ffffff',
            boxShadow: '0px 1px 1px 0px #0000000F, 0px 4px 4px -1px #00000005',
          },
          '&.Monite-SummaryCard-selected': {
            border: '2px solid #3737FF',
          },
          '&.Monite-SummaryCard-all': {
            minWidth: '118px',
            backgroundColor: '#F4F4FE',
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
          borderRadius: moniteTheme.borderRadius * 5.33,
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
              padding: '0 8px 0 24px',
            },
          },
          '& + .MuiDivider-root': {
            display: 'none',
          },
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          margin: 0,
          padding: '40px 32px',
          '> form': {
            maxWidth: 'min(940px, 100%)',
            margin: '0 auto',
          },
        },
      },
    },
    MonitePayableDetailsInfo: {
      defaultProps: {
        ocrMismatchFields: {
          amount_to_pay: false,
          counterpart_bank_account_id: false,
        },
      },
    },
    MonitePayableTable: {
      defaultProps: {
        isShowingSummaryCards: true,
        fieldOrder: [
          'document_id',
          'counterpart_id',
          'created_at',
          'issued_at',
          'due_date',
          'status',
          'amount',
          'pay',
        ],
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: '12px',
        },
      },
    },
    MoniteApprovalRequestStatusChip: {
      defaultProps: {
        icon: false,
        size: 'small',
      },
    },
    MoniteInvoiceStatusChip: {
      defaultProps: {
        icon: false,
        size: 'small',
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
        icon: false,
        size: 'small',
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
      defaultProps: {
        size: 'small',
      },
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
    },
    shape: {
      borderRadius: moniteTheme.borderRadius,
    },
    typography,
    components,
  };
};
