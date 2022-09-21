import { AllowedCountriesCodes, CounterpartAddress } from '@monite/sdk-api';

export interface CounterpartAddressFormFields {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: AllowedCountriesCodes;
  postalCode: string;
}

export const prepareCounterpartAddress = (
  address?: CounterpartAddress
): CounterpartAddressFormFields => {
  return {
    city: address?.city ?? '',
    state: address?.state ?? '',
    // TODO set correct country
    country: address?.country ?? AllowedCountriesCodes.ES,
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
    country,
    line1,
    line2,
    postal_code,
  };
};
