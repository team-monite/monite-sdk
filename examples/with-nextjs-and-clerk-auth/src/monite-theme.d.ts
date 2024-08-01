import { CSSProperties } from 'react';

import '@mui/material/styles';
import '@mui/x-data-grid/themeAugmentation';

declare module '@mui/material/styles' {
  interface TypeBackground {
    default: string;
    paper: string;
    menu: string;
    highlight: string;
  }

  interface Palette {
    neutral: {
      '10': string;
      '50': string;
      '80': string;
    };
  }

  interface PaletteOptions {
    neutral?: {
      '10': string;
      '50': string;
      '80': string;
    };
  }

  interface TypographyVariants {
    label2: CSSProperties;
    label3: CSSProperties;
  }

  interface TypographyVariantsOptions {
    label2: CSSProperties;
    label3: CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    label2: true;
    label3: true;
  }
}
