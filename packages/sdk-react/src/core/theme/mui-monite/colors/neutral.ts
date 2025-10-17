import chroma from 'chroma-js';

export const getNeutralColors = (mainColor: string) => {
  return {
    main: mainColor,
    '10': chroma(mainColor).darken(2.5).hex(),
    '30': chroma(mainColor).darken(1.5).hex(),
    '50': mainColor,
    '70': chroma(mainColor).brighten(0.7).hex(),
    '80': chroma(mainColor).brighten(2.3).hex(),
    '90': chroma(mainColor).brighten(2.68).hex(),
    '95': chroma(mainColor).brighten(2.84).hex(),
  };
};
