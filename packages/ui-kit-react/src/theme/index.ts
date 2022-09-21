const baseColors = {
  blue: '#246FFF',
  navy: '#062766',
  black: '#111111',
  white: '#FFFFFF',
  green: '#1FBCA0',
  orange: '#E27E46',
  error: '#CC394B',
  purple: '#A06DC8',
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
  neutral100: baseColors.white,
  success50: baseColors.green,
  success95: '#EEFBF9',
  warning50: baseColors.orange,
  warning95: '#FFF5EB',
  error50: baseColors.error,
  error95: '#FFF8F9',
  special50: baseColors.purple,
  special95: '#FBF1FC',
};

const shape = {
  borderRadiusMax: '100px',
  borderRadiusLarge: '16px',
  borderRadiusMedium: '12px',
  borderRadiusSmall: '8px',
};

const components = {
  datePicker: {
    filterTextColor: palette.neutral10,
    filterBackgroundColor: palette.neutral100,
    filterBorderColor: palette.neutral80,
    filterBorderRadius: shape.borderRadiusMax,

    filterTextColorHover: palette.neutral100,
    filterBackgroundColorHover: palette.neutral10,
    filterBorderColorHover: palette.neutral10,

    filterWithValueColor: palette.neutral10,
    filterWithValueBackgroundColor: palette.neutral90,

    selectedBackgroundColor: palette.primary50,
  },
  input: {
    filterTextColor: palette.neutral10,
    filterBackgroundColor: palette.neutral100,
    filterBorderColor: palette.neutral80,
    filterBorderRadius: shape.borderRadiusMax,

    filterTextColorHover: palette.neutral100,
    filterBackgroundColorHover: palette.primary95,
    filterBorderColorHover: palette.neutral10,

    filterWithValueColor: palette.neutral10,
    filterWithValueBackgroundColor: palette.neutral90,
  },
  search: {
    filterTextColor: palette.neutral10,
    filterBackgroundColor: palette.neutral100,
    filterBorderColor: palette.neutral80,
    filterBorderRadius: shape.borderRadiusMax,

    filterTextColorHover: palette.neutral100,
    filterBackgroundColorHover: palette.neutral10,
    filterBorderColorHover: palette.neutral10,

    filterTextColorDisabled: palette.neutral50,
    filterBackgroundColorDisabled: palette.neutral90,
  },
  select: {
    filterTextColor: palette.neutral10,
    filterBackgroundColor: palette.neutral100,
    filterBorderColor: palette.neutral80,
    filterBorderRadius: shape.borderRadiusMax,

    filterTextColorHover: palette.neutral100,
    filterBackgroundColorHover: palette.neutral10,
    filterBorderColorHover: palette.neutral10,

    filterWithValueTextColor: palette.neutral10,
    filterWithValueBackgroundColor: palette.neutral90,

    filterTextColorDisabled: palette.neutral50,
    filterBackgroundColorDisabled: palette.neutral90,
  },
  tableHeader: {
    textColor: palette.neutral50,

    backgroundColorHover: palette.neutral80,
    backgroundColorActive: palette.neutral70,
  },
  tableBody: {
    textColor: palette.neutral10,

    backgroundColorHover: palette.neutral80,
    backgroundColorActive: palette.neutral70,
  },
  tag: {
    primaryTextColor: palette.primary50,
    primaryBackgroundColor: palette.primary95,

    secondaryTextColor: palette.neutral10,
    secondaryBackgroundColor: palette.neutral90,

    disabledTextColor: palette.neutral100,
    disabledBackgroundColor: palette.neutral50,

    successTextColor: palette.success50,
    successBackgroundColor: palette.success95,

    warningTextColor: palette.warning50,
    warningBackgroundColor: palette.warning95,

    errorTextColor: palette.error50,
    errorBackgroundColor: palette.error95,

    specialTextColor: palette.special50,
    specialBackgroundColor: palette.special95,
  },
};

export const tokenizedTheme = {
  ...baseColors,
  ...palette,
  ...shape,
  ...components,
};

export type TokenizedThemeType = typeof tokenizedTheme;
