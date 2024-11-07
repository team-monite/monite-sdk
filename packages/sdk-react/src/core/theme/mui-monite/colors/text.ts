import chroma from 'chroma-js';

export const getTextColors = (baseColor: string) => {
  const primaryAlpha = chroma(baseColor).alpha();

  return {
    primary: chroma(baseColor),
    secondary: chroma(baseColor)
      .alpha(primaryAlpha * 0.81)
      .css(),
    disabled: chroma(baseColor)
      .alpha(primaryAlpha * 0.62)
      .css(),
  };
};
