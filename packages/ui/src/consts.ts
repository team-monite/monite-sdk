const breakpoints: any = ['576px', '768px', '992px', '1200px', '1400px']; // @see bootstrap

breakpoints.sm = breakpoints[0];
breakpoints.md = breakpoints[1];
breakpoints.lg = breakpoints[2];
breakpoints.xl = breakpoints[3];
breakpoints.xxl = breakpoints[4];

export const THEMES = {
  default: {
    colors: {
      primary: '#246fff',
      primaryDarker: '#1D59CC',
      primaryLighter: '#5790FF',
      primaryLightest: 'rgba(36, 111, 255, 0.1)',
      danger: '#FF475D',
      dangerDarker: '#CC394B',
      dangerLighter: '#FF7A8A',
      success: '#1FBCA0',
      successDarker: '#0DAA8E',
      successLighter: '#4DD6BE',
      warning: '#F9A03F',
      warningDarker: '#C78032',
      warningLighter: '#FFBC73',
      secondary: '#F3F3F3',
      error: '#FF475D',
      hoverAction: '#18191A',
      black: '#111111',
      darkGrey: '#3B3B3B',
      grey: '#707070',
      lightGrey1: '#B8B8B8',
      lightGrey2: '#DDDDDD',
      lightGrey3: '#F3F3F3',
      white: '#ffffff',
      blue: '#246FFF',
      navy: '#062766',
      lime: '#CDFB7D',
      teal: '#00A9B9',
      purple: '#7A1A83',
      lavender: '#CDC1FF',
      orange: '#F9A03F',
      pink: '#FA78AF',
      red: '#FF475D',
      tagPink: '#FBF1FC',
      tagViolet: '#A06DC8',
      tagBeige: '#FFF3E9',
      tagOrange: '#E27E46',
      tagSalad: '#E1FBEB',
      tagGreen: '#1FBCA0',
      orange2: '#F9A03F',
      alertInfo: '#F4F8FF',
      alertSuccess: '#EEFBF9',
      alertError: '#FFF9F9',
    },
    breakpoints,
  },
};
