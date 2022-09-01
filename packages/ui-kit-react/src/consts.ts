const breakpoints: any = ['576px', '768px', '992px', '1200px', '1400px']; // @see bootstrap

breakpoints.sm = breakpoints[0];
breakpoints.md = breakpoints[1];
breakpoints.lg = breakpoints[2];
breakpoints.xl = breakpoints[3];
breakpoints.xxl = breakpoints[4];

export const THEMES = {
  default: {
    colors: {
      black: '#111111',
      darkGrey: '#3B3B3B',
      grey: '#707070',
      lightGrey1: '#B8B8B8',
      lightGrey2: '#DDDDDD',
      lightGrey3: '#F3F3F3',
      white: '#FFFFFF',

      blue: '#246FFF',
      navy: '#062766',

      lime: '#CDFB7D',
      teal: '#00A9B9',
      purple: '#7A1A83',
      lavender: '#CDC1FF',
      orange: '#F9A03F',
      pink: '#FA78AF',
      red: '#FF475D',

      primary: '#246FFF',
      primaryDarker: '#1D59CC',
      primaryLighter: '#5790FF',
      primaryLightest: '#F4F8FF',

      secondary: '#F3F3F3',

      danger: '#FF475D',
      dangerDarker: '#CC394B',
      dangerLighter: '#FF7A8A',
      dangerLightest: '#FFF8F9',
      success: '#1FBCA0',
      successDarker: '#0DAA8E',
      successLighter: '#4DD6BE',
      successLightest: '#EEFBF9',
      warning: '#F9A03F',
      warningDarker: '#C78032',
      warningLighter: '#FFBC73',

      tagPink: '#FBF1FC',
      tagViolet: '#A06DC8',
      tagBeige: '#FFF3E9',
      tagOrange: '#E27E46',
      tagSalad: '#E1FBEB',
      tagGreen: '#1FBCA0',

      alertInfo: '#F4F8FF',
      alertSuccess: '#EEFBF9',
      alertError: '#FFF9F9',

      hoverAction: '#18191A',
    },
    breakpoints,
  },
};

export type ThemeType = keyof typeof THEMES.default.colors;
