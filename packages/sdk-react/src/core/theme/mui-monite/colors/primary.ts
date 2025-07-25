import chroma from 'chroma-js';

export const getPrimaryColors = (
  mainColor: string,
  foregroundColor: string
) => {
  return {
    dark: chroma(mainColor).darken(0.3).saturate(0.2).hex(),
    main: mainColor,
    light: chroma.mix(mainColor, '#ffffff', 0.94).hex(),

    // Improved progression using mix/desaturate/darken approach
    10: chroma(mainColor).darken(2.2).saturate(0.5).hex(),
    20: chroma(mainColor).darken(1.8).saturate(0.3).hex(),
    25: chroma(mainColor).darken(1.4).saturate(0.2).hex(),
    30: chroma(mainColor).darken(1.0).saturate(0.1).hex(),
    40: chroma(mainColor).darken(0.5).hex(),
    50: mainColor,
    55: chroma(mainColor).brighten(0.3).desaturate(0.1).hex(),
    60: chroma.mix(mainColor, '#ffffff', 0.25).desaturate(0.1).hex(),
    65: chroma.mix(mainColor, '#ffffff', 0.4).desaturate(0.2).hex(),
    75: chroma.mix(mainColor, '#ffffff', 0.6).desaturate(0.3).hex(),
    80: chroma.mix(mainColor, '#ffffff', 0.7).desaturate(0.4).hex(),
    85: chroma.mix(mainColor, '#ffffff', 0.8).desaturate(0.5).hex(),
    90: chroma.mix(mainColor, '#ffffff', 0.85).desaturate(0.3).hex(),
    95: chroma.mix(mainColor, '#ffffff', 0.9).desaturate(0.4).hex(),
    100: chroma.mix(mainColor, '#ffffff', 0.95).desaturate(0.5).hex(),

    foreground: {
      main: foregroundColor,
    },
  };
};
