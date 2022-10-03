import React from 'react';
import styled from '@emotion/styled';

import { Box } from '../Box';
import { ThemeColors } from '../theme_deprecated';

export const STYLES = {
  h1: {
    //styleName: Titles/H1;
    fontSize: '48px',
    fontWeight: '600',
    lineHeight: '64px',
  },
  h2: {
    //styleName: Titles/H2;
    fontSize: '32px',
    fontWeight: '600',
    lineHeight: '40px',
  },
  h3: {
    //styleName: Titles/H3;
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '36px',
  },
  h4: {
    //styleName: Titles/H4;
    fontSize: '18px',
    fontWeight: '600',
    lineHeight: '24px',
    letterSpacing: '1px',
  },
  regular: {
    //styleName: Regular/Regular;
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '24px',
  },
  bold: {
    //styleName: Regular/Bold;
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '24px',
  },
  regularLink: {
    //styleName: Regular/RegularLink;
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '24px',
    textDecoration: 'underline',
  },
  regularBoldLink: {
    //styleName: Regular/RegularBoldLink;
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '24px',
    textDecoration: 'underline',
  },
  small: {
    //styleName: Small/Small;
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
  },
  smallBold: {
    //styleName: Small/Bold;
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '20px',
  },
  smallLink: {
    //styleName: Small/SmallLink;
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    textDecoration: 'underline',
  },
  smallBoldLink: {
    //styleName: Small/Bold Link;
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '20px',
    textDecoration: 'underline',
  },
};

export type TextProps = {
  textSize?: keyof typeof STYLES;
  align?: 'initial' | 'inherit' | 'left' | 'center' | 'right' | 'justify';
  $color?: ThemeColors;
  children: React.ReactNode;
};

// const Text = styled(Box)<TextProps>`
//   ${({ textSize = 'regular' }) => STYLES[textSize]}
//   ${({ align }) => align && `text-align: ${align};`};
//   ${({ $color, theme }) =>
//     $color && theme.colors[$color] && `color: ${theme.colors[$color]};`}
// `;

const Text = styled(Box)<TextProps>(
  ({ theme, textSize = 'regular', align, $color }) => ({
    ...STYLES[textSize],
    align: align,
    color: $color && theme.colors[$color],
  })
);

export default Text;
