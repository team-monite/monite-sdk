/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { ButtonThemeResponse } from './ButtonThemeResponse';
import type { CardThemeResponse } from './CardThemeResponse';

export type PaymentPageThemeResponse = {
  background_color?: string;
  border_radius?: string;
  button?: ButtonThemeResponse;
  card?: CardThemeResponse;
  font_color?: string;
  font_family?: string;
  font_link_href?: string;
  logo_src?: string;
};
