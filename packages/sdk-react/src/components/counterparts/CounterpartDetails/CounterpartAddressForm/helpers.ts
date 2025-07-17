import type { CounterpartAddressFormTypes } from './validation';
import { components } from '@/api';
import { getCountries } from '@/core/utils/countries';
import type { I18n } from '@lingui/core';

/**
 * Prepares the address object from the API response for use in the form by normalizing its fields.
 */
export const prepareCounterpartAddress = (
  address: components['schemas']['CounterpartAddress'] | undefined
): CounterpartAddressFormTypes => {
  return {
    city: address?.city ?? '',
    state: address?.state ?? '',
    country: address?.country ?? '',
    line1: address?.line1 ?? '',
    line2: address?.line2 ?? '',
    postalCode: address?.postal_code ?? '',
  };
};

/**
 * Prepares the address object for submission by converting the form fields to the API format.
 */
export const prepareCounterpartAddressSubmit = ({
  city,
  state,
  country,
  line1,
  line2,
  postalCode: postal_code,
}: CounterpartAddressFormTypes): components['schemas']['CounterpartAddress'] => {
  return {
    city,
    state,
    country: country as components['schemas']['AllowedCountries'],
    line1,
    line2,
    postal_code,
  };
};

/**
 * Prints the address in a human-readable format.
 */
export function printAddress(
  {
    line1,
    line2,
    postalCode,
    city,
    country,
    state,
  }: CounterpartAddressFormTypes,
  i18n: I18n
): string {
  const street2 = line2 ? `${line2}, ` : '';

  return `${line1}, ${street2}${postalCode} ${city}, ${state}, ${
    getCountries(i18n)[country]
  }`;
}
