import '@emotion/react';
import { InterpolationWithTheme } from '@emotion/core';
import {
  BoxProps as BoxP,
  ButtonProps as ButtonP,
  FlexProps as FlexP,
  LinkProps as LinkP,
  TextProps as TextP,
} from 'rebass';
import {
  FormProps as FormP,
  InputProps as InputP,
  TextareaProps as TextareaP,
  LabelProps as LabelP,
} from '@rebass/forms';
import { THEMES } from '../consts';
import { TokenizedThemeType } from '../index';

declare module '@emotion/react' {
  export type FinalTheme = typeof THEMES.default & TokenizedThemeType;

  export interface Theme extends FinalTheme {}
}

declare module 'rebass' {
  interface BoxProps extends BoxP {
    css?: InterpolationWithTheme<any>;
  }
  interface ButtonProps extends ButtonP {
    css?: InterpolationWithTheme<any>;
  }
  interface FlexProps extends FlexP {
    css?: InterpolationWithTheme<any>;
  }
  interface LinkProps extends LinkP {
    css?: InterpolationWithTheme<any>;
  }
  interface TextProps extends TextP {
    css?: InterpolationWithTheme<any>;
  }
}

declare module '@rebass/forms' {
  interface FormProps extends FormP {
    css?: InterpolationWithTheme<any>;
  }
  interface InputProps extends InputP {
    css?: InterpolationWithTheme<any>;
  }
  interface TextareaProps extends TextareaP {
    css?: InterpolationWithTheme<any>;
  }
  interface LabelProps extends LabelP {
    css?: InterpolationWithTheme<any>;
  }
}
