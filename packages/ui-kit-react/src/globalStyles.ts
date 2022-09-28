import { css } from '@emotion/react';
import { Theme } from './theme_deprecated';

import FaktumRegular from './assets/fonts/Faktum/Faktum-Regular.woff2';
import FaktumMedium from './assets/fonts/Faktum/Faktum-Medium.woff2';
import FaktumSemiBold from './assets/fonts/Faktum/Faktum-SemiBold.woff2';
import FaktumRegularItalic from './assets/fonts/Faktum/Faktum-RegularItalic.woff2';
import FaktumMediumItalic from './assets/fonts/Faktum/Faktum-MediumItalic.woff2';
import FaktumSemiBoldItalic from './assets/fonts/Faktum/Faktum-SemiBoldItalic.woff2';

export const getStyles = (theme: Theme) => css`
  @font-face {
    font-family: 'Faktum';
    src: url(${FaktumRegular}) format('woff2');
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: 'Faktum';
    src: url(${FaktumMedium}) format('woff2');
    font-weight: 500;
    font-style: normal;
  }

  @font-face {
    font-family: 'Faktum';
    src: url(${FaktumSemiBold}) format('woff2');
    font-weight: 600;
    font-style: normal;
  }

  @font-face {
    font-family: 'Faktum';
    src: url(${FaktumRegularItalic}) format('woff2');
    font-weight: 400;
    font-style: italic;
  }

  @font-face {
    font-family: 'Faktum';
    src: url(${FaktumMediumItalic}) format('woff2');
    font-weight: 500;
    font-style: italic;
  }

  @font-face {
    font-family: 'Faktum';
    src: url(${FaktumSemiBoldItalic}) format('woff2');
    font-weight: 600;
    font-style: italic;
  }

  body {
    margin: 0;
    font-family: ${theme.fontFamily};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
`;
