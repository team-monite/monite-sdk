// @see https://github.com/rebassjs/rebass/blob/master/packages/reflexbox/src/index.js

import React from 'react';
import styled from '@emotion/styled';
import {
  compose,
  space,
  layout,
  typography,
  color,
  flexbox,
  border,
  grid,
  textAlign,
  BorderProps,
  GridProps,
  TextAlignProps,
} from 'styled-system';
import css, { get } from '@styled-system/css';
// @ts-ignore
import shouldForwardProp from '@styled-system/should-forward-prop';

import type { BoxProps as RebassBoxProps } from 'rebass/styled-components';

const sx: any = (props: any) => css(props.sx)(props.theme);
const base: any = (props: any) => css(props.__css)(props.theme);
const variant: any = ({ theme, variant, tx = 'variants' }: any) =>
  css(get(theme, tx + '.' + variant, get(theme, variant)))(theme);

export type BoxProps = Omit<RebassBoxProps, 'children'> &
  BorderProps &
  GridProps &
  TextAlignProps & {
    children?: any;
  };
export const Box = styled('div', {
  shouldForwardProp,
})(
  {
    boxSizing: 'border-box',
    // margin: 0,
    minWidth: 0,
  },
  base,
  variant,
  sx,
  (props) => props.css,
  compose(space, layout, typography, color, flexbox, border, grid, textAlign)
) as any as React.FC<BoxProps>;

export const Flex = styled(Box)({
  display: 'flex',
});
