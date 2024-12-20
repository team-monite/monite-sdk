import chroma from 'chroma-js';

export const getSeverityColors = (mainColor: string) => ({
  main: mainColor,
  light: chroma(mainColor).alpha(0.25).hex(),
  dark: chroma(mainColor).alpha(1).hex(),
});
