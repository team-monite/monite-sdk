import { components } from '@/api';
import { getCountries } from '@/core/utils/countries';
import type { I18n } from '@lingui/core';

export interface CounterpartAddressFormFields {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: components['schemas']['AllowedCountries'];
  postalCode: string;
}

export const prepareCounterpartAddress = (
  address: components['schemas']['CounterpartAddress'] | undefined
): CounterpartAddressFormFields => {
  return {
    city: address?.city ?? '',
    state: address?.state ?? '',
    country: address?.country ?? 'US',
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
}: CounterpartAddressFormFields): components['schemas']['CounterpartAddress'] => {
  return {
    city,
    state,
    country,
    line1,
    line2,
    postal_code,
  };
};

export function printAddress(
  {
    line1,
    line2,
    postalCode,
    city,
    country,
    state,
  }: CounterpartAddressFormFields,
  i18n: I18n
): string {
  const street2 = line2 ? `${line2}, ` : '';

  return `${line1}, ${street2}${postalCode} ${city}, ${state}, ${
    getCountries(i18n)[country]
  }`;
}
