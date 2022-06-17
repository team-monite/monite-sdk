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
      secondary: '#F3F3F3',
      danger: '#FF475D',
      error: '#FF475D',
      hoverAction: '#18191A',
      primaryDarker: '#1D59CC',

      black: '#111111',
      white: '#ffffff',
      grey: '#707070',
      lightGrey1: '#B8B8B8',
      lightGrey2: '#DDDDDD',
      lightGrey3: '#F3F3F3',
      salad: '#E1FBEB',
      green: '#1FBCA0',
      orange: '#E27E46',
      orange2: '#F9A03F',
      beige: '#FFF3E9',
      violet: '#A06DC8',
      pink: '#FBF1FC',
      red: '#FF475D',
      blue: '#246FFF',
      darkGrey: '#3B3B3B',
    },
    breakpoints,
  },
};
