import { components } from '@/api';
import { getCountries } from '@/core/utils/countries';
import { getCurrencies } from '@/core/utils/currencies';
import { type I18n } from '@lingui/core';
import { t } from '@lingui/macro';

export const getBankAccountName = (
  i18n: I18n,
  bankAccount: components['schemas']['EntityBankAccountResponse']
) => {
  const bankAccountName = getBankAccountBaseName(i18n, bankAccount);

  if (bankAccount.is_default_for_currency) {
    return t(i18n)`${bankAccountName} (Default)`;
  }

  return bankAccountName;
};

const getBankAccountBaseName = (
  i18n: I18n,
  bankAccount: components['schemas']['EntityBankAccountResponse']
) => {
  if (bankAccount.display_name) {
    return bankAccount.display_name;
  }

  if (bankAccount.bank_name) {
    return bankAccount.bank_name;
  }

  if (bankAccount.country && bankAccount.currency) {
    return `${getCountries(i18n)[bankAccount.country]} (${
      getCurrencies(i18n)[bankAccount.currency]
    })`;
  }

  return bankAccount.id;
};
