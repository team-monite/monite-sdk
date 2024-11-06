import chroma from 'chroma-js';

export const getPrimaryColors = (mainColor: string) => {
  return {
    dark: chroma(mainColor).darken(0.8).hex(),
    main: mainColor,
    light: chroma(mainColor).brighten(2.5).desaturate(1).hex(),
    '60': chroma(mainColor).alpha(0.6).hex(),
    '80': chroma(mainColor).brighten(1.8).desaturate(0.3).hex(),
    '90': chroma(mainColor).brighten(2.2).desaturate(0.2).hex(),
  };
};
