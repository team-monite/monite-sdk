import { getCountries } from '@/core/utils/countries';
import type { I18n } from '@lingui/core';
import { components } from '@monite/sdk-api/src/api';

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
    /**
     * @todo: Anashev. We have to split this types into 2.
     * More info in Jira task
     * @see {@link https://monite.atlassian.net/browse/DEV-7254}
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error - must be fixed in https://monite.atlassian.net/browse/DEV-7254
    country: address?.country ?? '',
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
