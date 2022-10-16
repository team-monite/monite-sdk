import React from 'react';
import styled from '@emotion/styled';

import { Box } from '../Box';
import { Theme } from '../index';
import { ThemeColors } from '../theme_deprecated';

export type TextProps = {
  textSize?: keyof Theme['typographyStyles'];
  align?: 'initial' | 'inherit' | 'left' | 'center' | 'right' | 'justify';
  $color?: ThemeColors;
  children: React.ReactNode;
};

const Text = styled(Box)<TextProps>(
  ({ theme, textSize = 'regular', align, $color }) => ({
    ...theme.typographyStyles[textSize],
    align: align,
    color: $color && theme.colors[$color],
  })
);

export default Text;
