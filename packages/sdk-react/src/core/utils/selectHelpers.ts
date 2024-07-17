import type { AllowedCountries, CurrencyEnum } from '@monite/sdk-api';

import type { CountriesType } from './countries';
import type { CurrenciesType } from './currencies';

export type SelectOption = { label: string; value: string };

export const countriesToSelect = (countries: CountriesType): SelectOption[] =>
  Object.keys(countries).map((country) => ({
    value: country,
    label: countries[country as AllowedCountries],
  }));

export const currencyToSelect = (currencies: CurrenciesType): SelectOption[] =>
  Object.keys(currencies).map((currency) => ({
    value: currency,
    label: currencies[currency as CurrencyEnum],
  }));

export const currenciesToStringArray = (
  currencies: CurrenciesType
): Array<CurrencyEnum> =>
  Object.keys(currencies).map((currency) => currency as CurrencyEnum);
