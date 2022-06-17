import React from 'react';

export type TooltipProps = {
  tip?: string | React.ReactNode;
  effect?: 'float' | 'solid';
  [key: string]: any;
};
