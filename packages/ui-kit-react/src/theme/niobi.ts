const baseColors = {
  green: '#025041',
  black: '#111111',
  white: '#FFFFFF',
};

const palette = {
  primary30: '#153329',
  primary50: baseColors.green,
  primary60: '#358068',
  primary95: '#CFE5DE',
  neutral10: baseColors.black,
  neutral30: '#3B3B3B',
  neutral50: '#707070',
  neutral70: '#B8B8B8',
  neutral80: '#DDDDDD',
  neutral90: '#F3F3F3',
  neutral95: '#FAFAFA',
  neutral100: baseColors.white,
  success50: '#80A46D',
  success95: '#ECF7E7',
  warning50: '#EECC76',
  warning95: '#FCF6D4',
  error50: '#CF443D',
  error95: '#FFF8F9',
  special50: '#CF443D',
  special95: '#F4D8D7',
};

const typography = {
  fontFamily:
    '"Faktum", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
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
    filterBackgroundColor: palette.neutral90,
    filterBorderColor: 'transparent',
    filterBorderRadius: shape.borderRadiusSmall,

    filterTextColorHover: palette.neutral100,
    filterBackgroundColorHover: palette.primary95,
    filterBorderColorHover: 'transparent',

    filterWithValueColor: palette.neutral100,
    filterWithValueBackgroundColor: palette.primary60,

    selectedBackgroundColor: palette.primary95,
  },
  input: {
    filterTextColor: palette.neutral10,
    filterBackgroundColor: palette.neutral90,
    filterBorderColor: 'transparent',
    filterBorderRadius: shape.borderRadiusSmall,

    filterTextColorHover: palette.neutral100,
    filterBackgroundColorHover: palette.primary95,
    filterBorderColorHover: 'transparent',

    filterWithValueColor: palette.neutral100,
    filterWithValueBackgroundColor: palette.primary60,
  },
  search: {
    fontFamily: typography.fontFamily,

    filterTextColor: palette.neutral10,
    filterBackgroundColor: palette.neutral90,
    filterBorderColor: 'transparent',
    filterBorderRadius: shape.borderRadiusSmall,

    filterTextColorHover: palette.neutral100,
    filterBackgroundColorHover: palette.primary95,
    filterBorderColorHover: 'transparent',

    filterTextColorDisabled: palette.neutral50,
    filterBackgroundColorDisabled: palette.neutral90,
  },
  select: {
    filterTextColor: palette.neutral10,
    filterBackgroundColor: palette.neutral90,
    filterBorderColor: 'transparent',
    filterBorderRadius: shape.borderRadiusSmall,

    filterTextColorHover: palette.neutral100,
    filterBackgroundColorHover: palette.primary95,
    filterBorderColorHover: 'transparent',

    filterWithValueTextColor: palette.neutral100,
    filterWithValueBackgroundColor: palette.primary60,

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
  ...typography,
  ...shape,
  ...components,
};

export type TokenizedThemeType = typeof tokenizedTheme;
