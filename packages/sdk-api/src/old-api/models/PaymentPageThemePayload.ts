/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { ButtonThemePayload } from './ButtonThemePayload';
import type { CardThemePayload } from './CardThemePayload';

export type PaymentPageThemePayload = {
  background_color?: string;
  border_radius?: string;
  button?: ButtonThemePayload;
  card?: CardThemePayload;
  font_color?: string;
  font_family?: string;
  font_link_href?: string;
  logo_src?: string;
};
