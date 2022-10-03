import {
  AllowedCountriesCodes,
  CounterpartAddress,
} from '@team-monite/sdk-api';
import { countries } from 'core/utils/countries';
import { Option } from '../helpers';

export interface CounterpartAddressFormFields {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: Option;
  postalCode: string;
}

export const prepareCounterpartAddress = (
  address?: CounterpartAddress
): CounterpartAddressFormFields => {
  return {
    city: address?.city ?? '',
    state: address?.state ?? '',
    country: {
      value: (address?.country as AllowedCountriesCodes) ?? '',
      label: countries[address?.country as AllowedCountriesCodes] ?? '',
    },
    line1: address?.line1 ?? '',
    line2: address?.line2 ?? '',
    postalCode: address?.postal_code ?? '',
  };
};

export const prepareCounterpartAddressSubmit = ({
  city,
  state,
  country,
  line1,
  line2,
  postalCode: postal_code,
}: CounterpartAddressFormFields): CounterpartAddress => {
  return {
    city,
    state,
    country: country.value as AllowedCountriesCodes,
    line1,
    line2,
    postal_code,
  };
};

export function printAddress({
  line1,
  line2,
  postalCode,
  city,
  country,
  state,
}: CounterpartAddressFormFields): string {
  const street2 = line2 ? `${line2}, ` : '';

  return `${line1}, ${street2}${postalCode} ${city}, ${state}, ${
    countries[country.value as AllowedCountriesCodes]
  }`;
}
