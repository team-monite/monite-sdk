import React from 'react';
import styled from '@emotion/styled';

import { Box } from '../Box';

export const STYLES = {
  h2: {
    //styleName: Titles/H2;
    'font-size': '32px',
    'font-weight': '600',
    'line-height': '40px',
  },
  h3: {
    //styleName: Titles/H3;
    'font-size': '24px',
    'font-weight': '600',
    'line-height': '32px',
  },
  h4: {
    //styleName: Titles/H4;
    'font-size': '17px',
    'font-weight': '600',
    'line-height': '24px',
    'letter-spacing': '1px',
  },
  smallBold: {
    //styleName: Small/Bold;
    'font-size': '14px',
    'font-weight': '500',
    'line-height': '20px',
  },
  smallBoldLink: {
    //styleName: Small/Bold Link;
    'font-size': '14px',
    'font-weight': '500',
    'line-height': '20px',
    'text-decoration': 'underline',
  },
  small: {
    //styleName: Small/Small;
    'font-size': '14px',
    'font-weight': '400',
    'line-height': '20px',
  },
  bold: {
    //styleName: Regular/Bold;
    'font-size': '16px',
    'font-weight': '500',
    'line-height': '24px',
  },
  regular: {
    //styleName: Regular/Regular;
    'font-size': '16px',
    'font-weight': '400',
    'line-height': '24px',
  },
};

export type TextProps = {
  textSize?: keyof typeof STYLES;
  align?: 'initial' | 'inherit' | 'left' | 'center' | 'right' | 'justify';
  color?: string;
  children: React.ReactNode;
};

const Text = styled(Box)<TextProps>`
  ${({ textSize = 'regular' }) => STYLES[textSize]}
  ${({ align }) => align && `text-align: ${align};`};
  ${({ color, theme }) =>
    color && theme.colors[color] && `color: ${theme.colors[color]};`}
`;

export default Text;
