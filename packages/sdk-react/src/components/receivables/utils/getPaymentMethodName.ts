import { components } from '@/api';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

export type PaymentMethod =
  components['schemas']['PaymentIntentResponse']['selected_payment_method'];

export const getPaymentMethodName = (
  paymentMethod: PaymentMethod,
  i18n: I18n
) => {
  switch (paymentMethod) {
    case 'sepa_credit':
      return t(i18n)`SEPA Credit`;
    case 'us_ach':
      return t(i18n)`US ACH`;
    case 'blik':
      return t(i18n)`BLIK`;
    case 'card':
      return t(i18n)`Card payment`;
    case 'bacs_direct_debit':
      return t(i18n)`Bacs Direct Debit`;
    case 'bancontact':
      return t(i18n)`Bancontact`;
    case 'eps':
      return t(i18n)`EPS`;
    case 'giropay':
      return t(i18n)`Giropay`;
    case 'ideal':
      return t(i18n)`iDEAL`;
    case 'p24':
      return t(i18n)`Przelewy24`;
    case 'sepa_debit':
      return t(i18n)`SEPA Debit`;
    case 'sofort':
      return t(i18n)`SOFORT`;
    case 'applepay':
      return t(i18n)`Apple Pay`;
    case 'googlepay':
      return t(i18n)`Google Pay`;
    case 'affirm':
      return t(i18n)`Affirm`;
    case 'klarna':
      return t(i18n)`Klarna`;
    default:
      return t(i18n)`Unknown payment method`;
  }
};
