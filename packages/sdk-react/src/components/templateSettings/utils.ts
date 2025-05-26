import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import { DocumentType } from './types';

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
