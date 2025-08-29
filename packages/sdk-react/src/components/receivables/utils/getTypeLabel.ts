import { components } from '@/api';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

export const getTypeLabel = (
  i18n: I18n,
  type: components['schemas']['ReceivableType']
) => {
  switch (type) {
    case 'invoice':
      return t(i18n)`Invoice`;
    case 'credit_note':
      return t(i18n)`Credit note`;
    case 'quote':
      return t(i18n)`Quote`;
  }
};
