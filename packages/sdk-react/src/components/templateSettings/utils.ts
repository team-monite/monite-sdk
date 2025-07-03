import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import { TemplateName, DocumentType } from './types';

export const getDocumentLabel = (i18n: I18n, documentType: DocumentType) => {
  switch (documentType) {
    case 'invoice':
      return t(i18n)`Invoice`;
    case 'credit_note':
      return t(i18n)`Credit note`;
    case 'quote':
      return t(i18n)`Quote`;
    case 'delivery_note':
      return t(i18n)`Delivery note`;
    case 'purchase_order':
      return t(i18n)`Purchase order`;
  }
};

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
