import chroma from 'chroma-js';

export const getSecondaryColors = (mainColor: string) => {
  return {
    main: mainColor,
    dark: chroma(mainColor).darken(1.2).saturate(0.2).hex(),
  };
};
