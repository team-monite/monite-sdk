const baseColors = {
  blue: '#246FFF',
  navy: '#062766',
  black: '#111111',
  white: '#FFFFFF',
  green: '#1FBCA0',
  orange: '#E27E46',
  red: '#FF475D',
  purple: '#A06DC8',
};

export const palette = {
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
  error50: baseColors.red,
  error95: '#FFF8F9',
  special50: baseColors.purple,
  special95: '#FBF1FC',
};

const typography = {
  fontFamily:
    '"Faktum", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  fontSizeSm: '14px',
  fontSize: '16px',
  fontWeight: '400',
  fontWeightBold: '500',

  typographyStyles: {
    h1: {
      //styleName: Titles/H1;
      fontSize: '48px',
      fontWeight: '600',
      lineHeight: '64px',
    },
    h2: {
      //styleName: Titles/H2;
      fontSize: '32px',
      fontWeight: '600',
      lineHeight: '40px',
    },
    h3: {
      //styleName: Titles/H3;
      fontSize: '24px',
      fontWeight: '600',
      lineHeight: '36px',
    },
    h4: {
      //styleName: Titles/H4;
      fontSize: '18px',
      fontWeight: '600',
      lineHeight: '24px',
      letterSpacing: '1px',
    },
    regular: {
      //styleName: Regular/Regular;
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '24px',
    },
    bold: {
      //styleName: Regular/Bold;
      fontSize: '16px',
      fontWeight: '500',
      lineHeight: '24px',
    },
    regularLink: {
      //styleName: Regular/RegularLink;
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '24px',
      textDecoration: 'underline',
    },
    regularBoldLink: {
      //styleName: Regular/RegularBoldLink;
      fontSize: '16px',
      fontWeight: '500',
      lineHeight: '24px',
      textDecoration: 'underline',
    },
    small: {
      //styleName: Small/Small;
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '20px',
    },
    smallBold: {
      //styleName: Small/Bold;
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '20px',
    },
    smallLink: {
      //styleName: Small/SmallLink;
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '20px',
      textDecoration: 'underline',
    },
    smallBoldLink: {
      //styleName: Small/Bold Link;
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '20px',
      textDecoration: 'underline',
    },
  },
};

const shape = {
  borderRadiusMax: '100px',
  borderRadiusLarge: '16px',
  borderRadiusMedium: '12px',
  borderRadiusSmall: '8px',
};

type ComponentListType =
  | 'avatar'
  | 'button'
  | 'card'
  | 'checkbox'
  | 'datePicker'
  | 'header'
  | 'input'
  | 'labelText'
  | 'loading'
  | 'search'
  | 'select'
  | 'tableHeader'
  | 'tableBody'
  | 'tag'
  | 'tooltip';

export type ComponentTokens = Record<
  ComponentListType,
  { [key: string]: string | number }
>;

const components: ComponentTokens = {
  avatar: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeightBold,

    primaryColor: palette.primary50,
    secondaryColor: palette.neutral50,
    successColor: palette.success50,
    dangerColor: palette.error50,
    warningColor: palette.warning50,
    specialColor: palette.special50,

    textColor: palette.neutral100,
  },
  button: {
    fontFamily: typography.fontFamily,
    fontSizeSm: typography.fontSizeSm,
    fontSizeMd: typography.fontSize,
    fontWeightSm: typography.fontWeight,
    fontWeightMd: '500',

    primaryColor: palette.primary50,
    secondaryColor: palette.neutral90,
    successColor: palette.success50,
    dangerColor: palette.error50,
    warningColor: palette.warning50,
    specialColor: palette.special50,

    textColorContained: palette.neutral100,
    textColorContainedSecondary: palette.neutral10,
    backgroundColorOutlined: palette.neutral100,
    backgroundColorLink: palette.neutral100,
    borderColorOutlined: palette.neutral80,
    borderRadius: shape.borderRadiusSmall,

    textColorContainedSecondaryHover: palette.neutral100,
    backgroundContainedHover: palette.neutral10,
    backgroundContainedSecondaryHover: palette.neutral50,
    borderColorContainedHover: palette.neutral10,
    borderColorContainedSecondaryHover: palette.neutral50,
    borderColorLinkHover: palette.neutral50,

    textColorOutlinedHover: palette.neutral100,
  },
  card: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,

    backgroundColor: palette.neutral100,
    borderColor: palette.neutral80,
    borderRadius: shape.borderRadiusLarge,

    borderColorShadow: palette.neutral10,
    borderRadiusShadow: shape.borderRadiusSmall,
  },
  checkbox: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeight,

    textColor: palette.neutral10,

    textColorHover: palette.neutral10,

    checkMarkColor: palette.neutral80,
    checkMarkColorError: palette.error50,

    checkMarkColorHover: palette.primary50,
    checkMarkColorErrorHover: palette.error50,

    checkMarkBackgroundColorDisabled: palette.neutral90,

    borderColor: palette.neutral80,
    borderColorChecked: palette.neutral10,
    borderColorCheckedDisabled: palette.neutral80,
    borderColorInvalid: palette.error50,
    borderColorDisabled: palette.neutral80,

    borderColorHover: palette.primary50,
  },
  datePicker: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,

    iconColor: palette.neutral70,
    headerUnderline: palette.neutral80,

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
    selectedIconColor: palette.neutral10,
  },
  header: {
    backgroundColor: palette.neutral100,
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
    isInvalidBackgroundColor: palette.neutral100,
    isInvalidBorderColor: palette.error50,

    filterTextColor: palette.neutral10,
    filterBackgroundColor: palette.neutral100,
    filterBorderColor: palette.neutral80,
    filterBorderRadius: shape.borderRadiusMax,

    filterTextColorHover: palette.neutral100,
    filterBackgroundColorHover: palette.neutral10,
    filterBorderColorHover: palette.neutral10,

    filterWithValueColor: palette.neutral10,
    filterWithValueBackgroundColor: palette.neutral90,
  },
  labelText: {
    fontFamilyLabel: typography.fontFamily,
    fontSizeLabel: typography.fontSizeSm,
    fontWeightLabel: typography.fontWeight,

    textColorLabel: palette.neutral50,

    fontFamilyText: typography.fontFamily,
    fontSizeText: typography.fontSize,
    fontWeightText: typography.fontWeight,

    textColorText: palette.neutral10,
  },
  loading: {
    color: palette.primary50,
    backgroundColor: `${palette.neutral100}b8`,
    size: 45,
  },
  search: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,

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
    filterBackgroundColor: palette.neutral100,
    filterBorderColor: palette.neutral80,
    filterBorderRadius: shape.borderRadiusMax,

    filterTextColorHover: palette.neutral100,
    filterBackgroundColorHover: palette.neutral10,
    filterBorderColorHover: palette.neutral10,

    filterWithValueTextColor: palette.neutral10,
    filterWithValueBackgroundColor: palette.neutral90,
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
    fontWeight: typography.fontWeight,

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
  tooltip: {
    textColor: baseColors.white,
    backgroundColor: baseColors.black,
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
