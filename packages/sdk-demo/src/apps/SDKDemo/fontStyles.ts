import { css } from '@emotion/react';

export const getFontFaceStyles = () => css`
  @font-face {
    font-family: 'Faktum';
    src: url(/fonts/Faktum/Faktum-Regular.woff2) format('woff2');
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: 'Faktum';
    src: url(/fonts/Faktum/Faktum-Medium.woff2) format('woff2');
    font-weight: 500;
    font-style: normal;
  }

  @font-face {
    font-family: 'Faktum';
    src: url(/fonts/Faktum/Faktum-SemiBold.woff2) format('woff2');
    font-weight: 600;
    font-style: normal;
  }

  @font-face {
    font-family: 'Faktum';
    src: url(/fonts/Faktum/Faktum-RegularItalic.woff2) format('woff2');
    font-weight: 400;
    font-style: italic;
  }

  @font-face {
    font-family: 'Faktum';
    src: url(/fonts/Faktum/Faktum-MediumItalic.woff2) format('woff2');
    font-weight: 500;
    font-style: italic;
  }

  @font-face {
    font-family: 'Faktum';
    src: url(/fonts/Faktum/Faktum-SemiBoldItalic.woff2) format('woff2');
    font-weight: 600;
    font-style: italic;
  }
`;
