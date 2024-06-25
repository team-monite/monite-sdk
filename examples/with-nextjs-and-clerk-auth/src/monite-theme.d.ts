import * as React from 'react';

import '@mui/material/styles';
import '@mui/x-data-grid/themeAugmentation';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    label1: React.CSSProperties;
    label2: React.CSSProperties;
    label3: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    label1: React.CSSProperties;
    label2: React.CSSProperties;
    label3: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    label1: true;
    label2: true;
    label3: true;
  }
}
