import { CSSProperties } from 'react';

import '@mui/material/styles';
import '@mui/x-data-grid/themeAugmentation';

declare module '@mui/material/styles/createPalette.js' {
  interface TypeBackground {
    default: string;
    paper: string;
    menu: string;
    highlight: string;
  }

  interface SimplePaletteColorOptions {
    '10'?: string;
    '50'?: string;
    '60'?: string;
    '70'?: string;
    '80'?: string;
    '90'?: string;
    '95'?: string;
  }

  interface Palette {
    neutral: {
      '10': string;
      '50': string;
      '70': string;
      '80': string;
      '90': string;
      '95': string;
    };
  }

  interface PaletteOptions {
    neutral?: {
      '10': string;
      '50': string;
      '70': string;
      '80': string;
      '90': string;
      '95': string;
    };
  }

  interface PaletteColor {
    light?: string;
    main: string;
    dark?: string;
    contrastText?: string;
    '90'?: string;
    '60'?: string;
    '80'?: string;
  }
}

declare module '@mui/material/styles/createTypography.js' {
  interface TypographyVariants {
    label2: CSSProperties;
    label3: CSSProperties;
  }

  interface TypographyVariantsOptions {
    label2: CSSProperties;
    label3: CSSProperties;
  }

  interface TypographyOptions {
    label2: CSSProperties;
    label3: CSSProperties;
  }
}

declare module '@mui/material/Typography.js' {
  interface TypographyPropsVariantOverrides {
    label2: true;
    label3: true;
  }
}
