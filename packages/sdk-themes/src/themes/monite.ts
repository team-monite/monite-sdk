// noinspection JSAnnotator
/// <reference path="../../../sdk-react/mui-styles.d.ts" />
import type { Components } from '@mui/material/styles/components.js';
import type {
  Palette,
  PaletteOptions,
  SimplePaletteColorOptions,
} from '@mui/material/styles/createPalette.js';
import type { Theme, ThemeOptions } from '@mui/material/styles/createTheme.js';
import type { TypographyOptions } from '@mui/material/styles/createTypography.js';
import '@mui/x-data-grid/themeAugmentation';

interface MonitePaletteColorOptions extends SimplePaletteColorOptions {
  '90': string;
  '60': string;
  '80': string;
}

interface MoniteNeutralColorOptions {
  '10': string;
  '50': string;
  '70': string;
  '80': string;
  '90': string;
  '95': string;
}

interface MonitePaletteOptions extends PaletteOptions {
  primary: MonitePaletteColorOptions;
  neutral: MoniteNeutralColorOptions;
  menu: {
    background: string;
  };
}

export const paletteLight: MonitePaletteOptions = {
  primary: {
    dark: 'rgb(46, 46, 229)',
    main: '#3737FF',
    light: '#F4F8FF',
    '60': '#9999ff',
    '80': 'rgb(203, 203, 254)',
    '90': 'rgb(235, 235, 255)',
  },
  secondary: {
    main: '#707070',
  },
  menu: {
    background: '#F1F2F5',
  },
  neutral: {
    '10': '#111111',
    '50': '#707070',
    '70': 'rgb(184, 184, 184)',
    '80': '#DDDDDD',
    '90': 'rgb(242, 242, 242)',
    '95': '#f9f9f9',
  },
  divider: '#DDDDDD',
  text: {
    primary: 'rgba(0,0,0,0.84)',
    secondary: 'rgba(0,0,0,0.68)',
    disabled: 'rgba(0,0,0,0.52)',
  },
};

export const paletteDark: MonitePaletteOptions = {
  primary: {
    dark: 'rgb(46, 46, 229)',
    main: '#3737FF',
    light: '#F4F8FF',
    '60': '#9999ff',
    '80': 'rgb(203, 203, 254)',
    '90': 'rgb(235, 235, 255)',
  },
  secondary: {
    main: '#707070',
  },
  menu: {
    background: '#202020',
  },
  neutral: {
    '10': '#FFFFFF',
    '50': '#F3F3F3',
    '70': 'rgb(184, 184, 184)',
    '80': '#B8B8B8',
    '90': 'rgb(242, 242, 242)',
    '95': '#f9f9f9',
  },
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

export const defaultMoniteTypography:
  | TypographyOptions
  | ((palette: Palette) => TypographyOptions) = {
  fontFamily:
    '"Faktum", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  fontSize: 16,
  fontWeightMedium: 400,
  fontWeightBold: 500,
  h1: {
    fontWeight: 600,
    fontSize: '48px',
    lineHeight: '68px',
  },
  h2: {
    fontWeight: 600,
    fontSize: '32px',
    lineHeight: '40px',
  },
  h3: {
    fontWeight: 600,
    fontSize: '24px',
    lineHeight: '32px',
  },
  subtitle1: {
    fontWeight: 600,
    fontSize: '20px',
    lineHeight: '24px',
  },
  subtitle2: {
    fontWeight: 600,
    fontSize: '18px',
    lineHeight: '24px',
  },
  body1: {
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '24px',
  },
  body2: {
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '20px',
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

const typographyLight = Object.assign({}, defaultMoniteTypography, {
  body2: {
    color: paletteLight.neutral && paletteLight.neutral['10'],
  },
});

const typographyDark = Object.assign({}, defaultMoniteTypography, {
  body2: {
    color: paletteDark.neutral && paletteDark.neutral['10'],
  },
});

const filterControlWidth = '160px';

export const defaultMoniteComponents: Components<Omit<Theme, 'components'>> = {
  MoniteOptions: {
    defaultProps: {
      dateFormat: {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      },
      dateTimeFormat: {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      },
    },
  },
  MuiTypography: {
    styleOverrides: {
      body2: defaultMoniteTypography.body2, // It's unclear why body2 doesn't pickup from the typography config itself
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
        borderRadius: `8px`,
        minHeight: '40px',
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
  MuiFormControl: {
    styleOverrides: {
      root: {
        '& .MuiInputBase-root': {
          minHeight: '48px',
          borderRadius: '8px',
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
        '&.Monite-FilterControl': {
          height: '40px',
          minHeight: '40px',
          maxHeight: '40px',
          maxWidth: filterControlWidth,
          width: '100%',

          '.MuiInputBase-root': {
            marginTop: 0,
            height: '40px',
            minHeight: '40px',
            maxHeight: '40px',
            borderRadius: '20px',
            color: 'black',
            backgroundColor: 'neutral.95',
            padding: '0 6px',

            '.MuiOutlinedInput-notchedOutline': {
              borderStyle: 'none',
            },
          },

          '.MuiSelect-select': {
            fontSize: '14px',
          },

          '.MuiFormLabel-root': {
            position: 'absolute',
            left: '20px',
            top: '10px',
            fontSize: '14px',
            maxWidth: 'calc(100% - 52px)',
            textOverflow: 'ellipsis',

            '&.MuiFormLabel-filled': {
              opacity: 0,
            },
          },

          '.MuiIconButton-root': {
            marginRight: '-6px',
          },
          '.MuiInputAdornment-positionEnd .MuiSvgIcon-root, .MuiIconButton-root .MuiSvgIcon-root':
            {
              width: '20px',
              height: '20px',
              '> *': {
                color: 'black',
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
        },
      },
    },
  },
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
            borderRadius: '8px',
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

          '.MuiListItem-root': {
            marginTop: 8,
          },

          '.MuiListItemButton-root': {
            borderRadius: 6,
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

          '.Mui-selected': {
            color: 'primary.main',
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
          borderRadius: 8,
        },
        '&.ThemeSelect .ThemeSelect-modeLabel': {
          display: 'flex',
        },
      },
      containedPrimary: {
        minWidth: '120px',
        backgroundColor: 'primary.main',
        borderRadius: '8px',
        boxShadow: 'none',
        '&:hover': {
          backgroundColor: 'primary.60',
          borderRadius: '8px',
          boxShadow: 'none',
        },
        '&:active': {
          backgroundColor: 'primary.dark',
          borderRadius: '8px',
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
        borderRadius: '8px',
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
        borderRadius: 16,
        width: 240,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        backgroundColor: 'primary.light',
        borderRadius: '4px',
        color: 'primary.main',
        fontSize: '14px',
        lineHeight: '16px',
        fontWeight: 500,
        padding: '7px 8px',
        '& .MuiChip-avatar': {
          marginLeft: 0,
          marginRight: '4px',
        },
        '&.Monite-CounterpartCell, &.Monite-UserCell': {
          '& .MuiChip-avatar': {
            margin: 0,
            color: 'text.primary',
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: '40px',
            width: '40px',
            height: '40px',
          },
        },
      },
      label: {
        padding: '0',
      },
      avatar: {
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
  MoniteTablePagination: {
    defaultProps: {
      pageSizeOptions: [15, 30, 100],
    },
  },
  MuiDataGrid: {
    defaultProps: {
      columnHeaderHeight: 40,
      rowHeight: 56,
      density: 'standard',
      showCellVerticalBorder: false,
      showColumnVerticalBorder: false,
    },
    styleOverrides: {
      root: {
        border: 0,
        borderColor: 'transparent',
        '--DataGrid-rowBorderColor': 'divider',
        '& .MuiDataGrid-columnHeaderTitle': {
          color: 'neutral.10',
          fontWeight: 500,
          fontSize: '16px',
        },
      },
      main: {
        paddingLeft: '12px',
      },
      cell: {
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
          padding: '16px',
        },
        '& .MuiTab-root.Mui-selected': {
          backgroundColor: 'primary.light',
          borderRadius: 10,
        },
      },
      indicator: {
        borderRadius: 10,
        backgroundColor: 'primary.main',
        height: '4px',
      },
    },
  },
  MuiCard: {
    defaultProps: {
      variant: 'outlined',
    },
    // styleOverrides: {
    //   root: {
    //     backgroundColor: 'neutral.90',
    //   },
    // },
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
        borderRadius: '8px',
        borderColor: 'neutral.80',
      },
      elevation: {
        '&.MuiTableContainer-root': {
          boxShadow: 'none',
        },
      },
      rounded: {
        borderRadius: '16px',
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
          maxWidth: '940px',
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
  MoniteApprovalRequestStatusChip: {
    defaultProps: {
      icon: false,
    },
  },
  MoniteInvoiceStatusChip: {
    defaultProps: {
      icon: false,
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
        style: statusColors.orange,
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

// Copied from mui/utils sourcecode since we cannot import external libraries in this file
function isPlainObject(item: unknown) {
  if (typeof item !== 'object' || item === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(item);
  return (
    (prototype === null ||
      prototype === Object.prototype ||
      Object.getPrototypeOf(prototype) === null) &&
    !(Symbol.toStringTag in item) &&
    !(Symbol.iterator in item)
  );
}

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

const lightComponents = renderColors(defaultMoniteComponents, paletteLight);
export const moniteLight: ThemeOptions = {
  palette: {
    mode: 'light',
    ...paletteLight,
  },
  typography: typographyLight,
  components: lightComponents,
};

const darkComponents = renderColors(defaultMoniteComponents, paletteDark);
export const moniteDark: ThemeOptions = {
  palette: {
    mode: 'dark',
    ...paletteDark,
  },
  typography: typographyDark,
  components: darkComponents,
};
