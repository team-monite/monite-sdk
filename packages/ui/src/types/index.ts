import React from 'react';
import type { Theme } from '@emotion/react';

export type TooltipProps = {
  tip?: string | React.ReactNode;
  effect?: 'float' | 'solid';
  [key: string]: any;
};

export interface ThemeProps {
  theme: Theme;
}

export type ThemedStyledProps<P> = P & ThemeProps;
