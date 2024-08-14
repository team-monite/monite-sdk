import '@monite/sdk-react/mui-styles.d.ts';
import { createTheme } from '@mui/material';
import type { Components } from '@mui/material/styles/components';
import {
  Palette,
  PaletteOptions,
  SimplePaletteColorOptions,
} from '@mui/material/styles/createPalette';
import type { Theme } from '@mui/material/styles/createTheme';
import type { TypographyOptions } from '@mui/material/styles/createTypography';
import { deepmerge } from '@mui/utils';
import '@mui/x-data-grid/themeAugmentation';
import {
  moniteDark as baseMoniteDark,
  moniteLight as baseMoniteLight,
} from '@team-monite/sdk-themes';

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
}

interface MonitePaletteOptions extends PaletteOptions {
  primary: MonitePaletteColorOptions;
  neutral: MoniteNeutralColorOptions;
}

const paletteLight: MonitePaletteOptions = {
  primary: {
    dark: 'rgb(46, 46, 229)',
    main: '#3737FF',
    light: '#F4F8FF',
    '60': '#9999ff',
    '80': 'rgb(203, 203, 254)',
    '90': 'rgb(235, 235, 255)',
  },
  background: {
    menu: '#F1F2F5',
    highlight: '#EBEBFF',
  },
  neutral: {
    '10': '#111111',
    '50': '#707070',
    '70': 'rgb(184, 184, 184)',
    '80': '#DDDDDD',
    '90': 'rgb(242, 242, 242)',
  },
  divider: '#DDDDDD',
};

const paletteDark: MonitePaletteOptions = {
  primary: {
    dark: 'rgb(46, 46, 229)',
    main: '#3737FF',
    light: '#F4F8FF',
    '60': '#9999ff',
    '80': 'rgb(203, 203, 254)',
    '90': 'rgb(235, 235, 255)',
  },
  background: {
    menu: '#F1F2F5',
  },
  neutral: {
    '80': '#B8B8B8',
    '70': 'rgb(184, 184, 184)',
    '50': '#F3F3F3',
    '10': '#FFFFFF',
    '90': 'rgb(242, 242, 242)',
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

const typography:
  | TypographyOptions
  | ((palette: Palette) => TypographyOptions) = {
  subtitle2: {
    fontSize: '1.125rem',
    fontWeight: 600,
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  label2: {
    fontSize: '0.875rem',
    fontStyle: 'normal',
    fontWeight: 500,
  },
  label3: {
    fontSize: '0.75rem',
    fontStyle: 'normal',
    fontWeight: 600,
  },
};

const typographyLight = deepmerge(typography, {
  body2: {
    color: paletteLight.neutral && paletteLight.neutral['10'],
  },
  label3: {
    color: paletteLight.neutral && paletteLight.neutral['50'],
  },
});

const typographyDark = deepmerge(typography, {
  body2: {
    color: paletteDark.neutral && paletteDark.neutral['10'],
  },
  label3: {
    color: paletteDark.neutral && paletteDark.neutral['80'],
  },
});

const components: Components<Omit<Theme, 'components'>> = {
  MuiTypography: {
    styleOverrides: {
      body1: {
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '24px',
      },
      body2: {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
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
        borderRadius: `8px`,
        minHeight: '40px',
        '& .MuiInputBase-input': {
          height: '40px',
          padding: '0 14px', // Adjust padding if needed
          boxSizing: 'border-box',
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
        '&.Monite-FilterControl .MuiIconButton-root': {
          marginRight: '-6px',
        },
        '&.Monite-FilterControl .MuiInputAdornment-positionEnd': {
          marginRight: '6px',
        },
        '&.Monite-FilterControl .MuiInputAdornment-positionEnd .MuiSvgIcon-root, &.Monite-FilterControl .MuiIconButton-root .MuiSvgIcon-root':
          {
            width: '20px',
            height: '20px',
          },
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
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      InputLabelProps: {
        shrink: true,
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.background.menu,
      }),
      paper: ({ theme }) => ({
        backgroundColor: theme.palette.background.menu,
        borderRight: 0,
      }),
    },
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
  MuiButton: {
    styleOverrides: {
      root: {
        '&.ThemeSelect': {
          borderRadius: 8,
        },
        '&.ThemeSelect .ThemeSelect-modeLabel': {
          display: 'flex',
        },
      },
      containedPrimary: ({ theme }) => {
        const primary = theme.palette.primary as MonitePaletteColorOptions;
        const neutral = theme.palette.neutral as MoniteNeutralColorOptions;
        return {
          backgroundColor: primary.main,
          borderRadius: '8px',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: primary['60'],
            borderRadius: '8px',
            boxShadow: 'none',
          },
          '&:active': {
            backgroundColor: primary.dark,
            borderRadius: '8px',
            boxShadow: 'none',
          },
          '&:disabled': {
            color: neutral['70'],
            backgroundColor: neutral['90'],
            borderColor: neutral['90'],
          },
        };
      },
      outlinedPrimary: ({ theme }) => {
        const primary = theme.palette.primary as MonitePaletteColorOptions;
        const neutral = theme.palette.neutral as MoniteNeutralColorOptions;
        return {
          backgroundColor: primary['90'],
          borderColor: primary['90'],
          '&:hover': {
            backgroundColor: primary['80'],
            borderColor: primary['80'],
          },
          '&:active': {
            backgroundColor: primary['60'],
            borderColor: primary['60'],
          },
          '&:disabled': {
            color: neutral['70'],
            backgroundColor: neutral['90'],
            borderColor: neutral['90'],
          },
        };
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
      root: ({ theme }) => {
        return {
          backgroundColor: theme.palette.primary.light,
          borderRadius: '4px',
          color: theme.palette.primary.main,
          fontSize: '14px',
          lineHeight: '16px',
          fontWeight: 500,
          padding: '7px 8px',
        };
      },
      label: {
        padding: '0',
      },
    },
  },
  MoniteTablePagination: {
    defaultProps: {
      pageSizeOptions: [15],
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
      root: ({ theme }) => ({
        border: 0,
        borderColor: 'transparent',
        '--DataGrid-rowBorderColor': theme.palette.divider,
        '& .MuiDataGrid-columnHeaderTitle': {
          color: theme.palette.neutral['10'],
          fontWeight: 500,
          fontSize: '16px',
        },
      }),
      main: {
        paddingLeft: '12px',
      },
      cell: {
        fontWeight: 400,
        fontSize: '16px',
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
      root: ({ theme }) => ({
        '& .MuiTableCell-head': {
          fontWeight: 500,
          color: theme.palette.neutral['50'],
          verticalAlign: 'bottom',
          borderColor: theme.palette.neutral['80'],
        },
      }),
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiTableCell-body': {
          borderColor: theme.palette.neutral['80'],
        },
        '&:last-child .MuiTableCell-body': {
          borderStyle: 'none',
        },
      }),
    },
  },
  MuiTabs: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiTab-root': {
          padding: '16px',
        },
        '& .MuiTab-root.Mui-selected': {
          backgroundColor: theme.palette.primary.light,
          borderRadius: 10,
        },
      }),
      indicator: ({ theme }) => ({
        borderRadius: 10,
        backgroundColor: theme.palette.primary.main,
        height: '4px',
      }),
    },
  },
  MoniteInvoiceStatusChip: {
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
};

export const moniteLight = () =>
  createTheme(
    deepmerge(baseMoniteLight, {
      palette: paletteLight,
      typography: typographyLight,
      components,
    })
  );

export const moniteDark = () =>
  createTheme(
    deepmerge(baseMoniteDark, {
      palette: paletteDark,
      typography: typographyDark,
      components,
    })
  );
