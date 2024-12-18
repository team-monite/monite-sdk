import chroma from 'chroma-js';

export interface MoniteNeutralColorOptions {
  '10': string;
  '50': string;
  '70': string;
  '80': string;
  '90': string;
  '95': string;
}

export const getNeutralColors = (mainColor: string) => {
  return {
    '10': chroma(mainColor).darken(2.5).hex(),
    '50': mainColor,
    '70': chroma(mainColor).brighten(0.7).hex(),
    '80': chroma(mainColor).brighten(1.3).hex(),
    '90': chroma(mainColor).brighten(1.7).hex(),
    '95': chroma(mainColor).brighten(2).hex(),
  };
};
