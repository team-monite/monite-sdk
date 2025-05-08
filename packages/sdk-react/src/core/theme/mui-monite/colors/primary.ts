import chroma from 'chroma-js';

export const getPrimaryColors = (mainColor: string) => {
  return {
    dark: chroma(mainColor).darken(0.3).saturate(0.2).hex(),
    main: mainColor,
    light: chroma.mix(mainColor, '#ffffff', 0.94).hex(),
    10: '#24135e',
    20: '#311881',
    30: '#401da6',
    40: '#4a22bf',
    50: '#562bd6',
    55: '#a594fa',
    60: chroma.mix(mainColor, '#ffffff', 0.4).desaturate(0.2).hex(), // #9999FF
    65: '#edebff',
    80: chroma.mix(mainColor, '#ffffff', 0.7).desaturate(0.4).hex(), // #CBCBFE
    85: '#f7f9fb',
    90: chroma.mix(mainColor, '#ffffff', 0.92).hex(), // #EBEBFF
    95: '#f7f5ff',
  };
};
