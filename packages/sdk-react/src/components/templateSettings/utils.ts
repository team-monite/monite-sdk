import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import { TemplateName } from './types';

export const formatTemplateName = (i18n: I18n, templateName: TemplateName) => {
  switch (templateName) {
    case 'classic':
      return t(i18n)`Classic`;
    case 'default_monite':
      return t(i18n)`Minimalist`;
    case 'modern':
      return t(i18n)`Modern`;
    case 'simple':
      return t(i18n)`Simple`;
    case 'stylish':
      return t(i18n)`Stylish`;
    case 'standard':
      return t(i18n)`Standard`;
    case 'unknown':
    default:
      return t(i18n)`Unknown`;
  }
};
