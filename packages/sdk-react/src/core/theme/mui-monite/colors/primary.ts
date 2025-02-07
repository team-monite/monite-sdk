import chroma from 'chroma-js';

export const getPrimaryColors = (mainColor: string) => {
  return {
    dark: chroma(mainColor).darken(0.3).saturate(0.2).hex(),
    main: mainColor,
    light: chroma.mix(mainColor, '#ffffff', 0.94).hex(),
    '60': chroma.mix(mainColor, '#ffffff', 0.4).desaturate(0.2).hex(), // #9999FF
    '80': chroma.mix(mainColor, '#ffffff', 0.7).desaturate(0.4).hex(), // #CBCBFE
    '90': chroma.mix(mainColor, '#ffffff', 0.9).desaturate(0.6).hex(), // #EBEBFF
  };
};
