import React from 'react';

export type TooltipProps = {
  tip?: string | React.ReactNode;
  effect?: 'float' | 'solid';
  [key: string]: any;
};

export interface Theme {
  colors: {
    [key: string]: string;
  };
}

export interface ThemeProps {
  theme: Theme;
}

export type ThemedStyledProps<P> = P & ThemeProps;
