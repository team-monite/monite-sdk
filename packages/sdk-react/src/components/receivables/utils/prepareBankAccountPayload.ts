import { components } from '@/api';

import { NO_ROUTING_NUMBER, NO_SORT_CODE } from '../consts';

export const prepareBankAccountCreatePayload = (
  reqPayload: components['schemas']['CreateEntityBankAccountRequest']
) => {
  const generalPayload = {
    is_default_for_currency: reqPayload.is_default_for_currency,
    country: reqPayload?.country,
    currency: reqPayload?.currency,
    display_name: reqPayload?.display_name,
    bank_name: reqPayload?.bank_name,
  };

  const defineCustomPayload = () => {
    switch (reqPayload?.currency) {
      case 'USD':
        return {
          account_holder_name: reqPayload?.account_holder_name,
          account_number: reqPayload?.account_number,
          routing_number: reqPayload?.routing_number,
        };
      case 'GBP':
        return {
          account_holder_name: reqPayload?.account_holder_name,
          account_number: reqPayload?.account_number,
          sort_code: reqPayload?.sort_code,
        };
      case 'EUR':
        return {
          bic: reqPayload?.bic,
          iban: reqPayload?.iban,
        };

      default:
        return {
          account_number: reqPayload?.account_number,
          routing_number:
            reqPayload?.routing_number === NO_ROUTING_NUMBER
              ? undefined
              : reqPayload?.routing_number,
          sort_code:
            reqPayload?.sort_code === NO_SORT_CODE
              ? undefined
              : reqPayload?.sort_code,
        };
    }
  };

  const payload = defineCustomPayload();

  return { ...generalPayload, ...payload };
};

export const prepareBankAccountUpdatePayload = (
  reqPayload: components['schemas']['UpdateEntityBankAccountRequest'],
  currency: components['schemas']['CurrencyEnum']
) => {
  const definePayload = () => {
    switch (currency) {
      case 'USD':
      case 'GBP':
        return {
          display_name: reqPayload?.display_name,
          account_holder_name: reqPayload?.account_holder_name,
        };
      default:
        return {
          display_name: reqPayload?.display_name,
        };
    }
  };

  const payload = definePayload();

  return payload;
};
