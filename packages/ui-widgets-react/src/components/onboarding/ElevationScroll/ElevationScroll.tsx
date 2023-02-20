import React from 'react';
import { useMediaQuery, useScrollTrigger, useTheme } from '@mui/material';

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children: React.ReactElement;
  startElevation?: number;
  endElevation?: number;
}

export default function ElevationScroll({
  children,
  window,
  startElevation = 0,
  endElevation = 4,
}: Props) {
  const theme = useTheme();
  const moreThanSM = useMediaQuery(theme.breakpoints.up('sm'));

  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger && moreThanSM ? endElevation : startElevation,
  });
}
