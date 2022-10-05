import { CountriesType } from 'core/utils/countries';
import { AllowedCountriesCodes } from '@team-monite/sdk-api';

export type Option = { label: string; value: string };

export const printCounterpartType = (
  customer?: string,
  vendor?: string
): string => {
  const types: string[] = [];

  if (customer) types.push(customer);
  if (vendor) types.push(vendor);

  return types.join(', ');
};

export const countriesToSelect = (countries: CountriesType): Option[] => {
  return Object.keys(countries).map((country) => ({
    value: country,
    label: countries[country as AllowedCountriesCodes],
  }));
};
