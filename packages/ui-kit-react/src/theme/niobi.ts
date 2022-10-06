const baseColors = {
  green: '#025041',
  black: '#111111',
  white: '#FFFFFF',
  blue: '#246FFF',
  navy: '#062766',
  orange: '#E27E46',
  red: '#CC394B',
  purple: '#A06DC8',
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
  fontSize: '16px',
  fontWeight: '400',
};

const shape = {
  borderRadiusMax: '100px',
  borderRadiusLarge: '16px',
  borderRadiusMedium: '12px',
  borderRadiusSmall: '8px',
};

const components = {
  datePicker: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,

    iconColor: palette.neutral70,
    headerUnderline: palette.neutral80,

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
    selectedIconColor: palette.neutral10,
  },
  input: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,

    textColor: palette.neutral10,
    backgroundColor: palette.neutral90,
    borderColor: palette.neutral90,
    borderRadius: shape.borderRadiusSmall,

    textColorHover: palette.neutral10,
    backgroundColorHover: palette.neutral100,
    borderColorHover: palette.primary50,
    borderShadowHover: palette.primary50,

    withValueBackgroundColor: palette.neutral100,
    withValueBorderColor: palette.neutral80,

    isReadonlyTextColor: palette.neutral70,
    isReadonlyBackgroundColor: palette.neutral100,
    isReadonlyBorderColor: palette.neutral80,

    isInvalidColor: palette.neutral10,
    isInvalidBackgroundColor: palette.error95,
    isInvalidBorderColor: palette.error50,

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
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,

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
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,

    textColor: palette.neutral10,
    backgroundColor: palette.neutral90,
    borderColor: 'transparent',
    borderRadius: shape.borderRadiusSmall,

    textColorHover: palette.neutral10,
    backgroundColorHover: palette.neutral100,
    borderColorHover: palette.primary50,
    borderShadowHover: palette.primary50,

    withValueBackgroundColor: palette.neutral100,

    isCreatableInputTagsBackground: palette.neutral90,

    isReadonlyTextColor: palette.neutral50,

    filterTextColor: palette.neutral10,
    filterBackgroundColor: palette.neutral90,
    filterBorderColor: 'transparent',
    filterBorderRadius: shape.borderRadiusSmall,

    filterTextColorHover: palette.neutral100,
    filterBackgroundColorHover: palette.primary95,
    filterBorderColorHover: 'transparent',

    filterWithValueTextColor: palette.neutral100,
    filterWithValueBackgroundColor: palette.primary60,
    filterWithValueBorderColor: palette.neutral80,

    filterTextColorDisabled: palette.neutral50,
    filterBackgroundColorDisabled: palette.neutral90,

    optionTextColor: palette.neutral10,
    optionBackgroundColor: palette.neutral100,

    optionTextColorHover: palette.neutral10,
    optionBackgroundColorHover: palette.neutral90,

    optionTextColorSelected: palette.neutral10,
    optionBackgroundColorSelected: palette.neutral90,

    creatableMessageTextColor: palette.primary50,
    creatableMessageTextColorSecondary: palette.neutral50,
  },
  tableHeader: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: '600',

    textColor: palette.neutral50,

    backgroundColorHover: palette.neutral80,
    backgroundColorActive: palette.neutral70,
  },
  tableBody: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,

    textColor: palette.neutral10,

    backgroundColorHover: palette.neutral80,
    backgroundColorActive: palette.neutral70,
  },
  tag: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,

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
