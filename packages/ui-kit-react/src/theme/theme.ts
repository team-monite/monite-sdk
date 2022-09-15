const baseColors = {
  blue: '#246FFF',
  navy: '#062766',
  black: '#111111',
};

const palette = {
  primary30: '#1D59CC',
  primary50: baseColors.blue,
  primary60: '#5790FF',
  primary95: '#F4F8FF',
  neutral10: baseColors.black,
  neutral30: '#3B3B3B',
  neutral50: '#707070',
  neutral70: '#B8B8B8',
  neutral80: '#DDDDDD',
  neutral90: '#F3F3F3',
  neutral95: '#FAFAFA',
  neutral100: '#FFFFFF',
};

const components = {
  search: {
    textColor: palette.neutral10,
    backgroundColor: palette.neutral100,

    textColorHover: palette.neutral100,
    backgroundColorHover: palette.neutral10,
  },
  input: {
    textColor: palette.neutral10,
    backgroundColor: palette.neutral100,

    textColorHover: palette.neutral100,
    backgroundColorHover: palette.neutral10,
  },
  select: {
    textColor: palette.neutral10,
    textColorHover: palette.neutral100,
  },
  button: {
    primaryContainedTextColor: palette.neutral10,
    primaryContainedBackgroundColor: palette.neutral10,

    primaryContainedTextColorHover: palette.neutral10,

    primaryContainedTextColorActive: palette.neutral10,
  },
};

export const tokenizedTheme = { ...baseColors, ...palette, ...components };

export type TokenizedThemeType = typeof tokenizedTheme;
