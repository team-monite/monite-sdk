import {
  CounterpartIndividualResponse,
  AllowedCountriesCodes,
  CounterpartIndividualUpdatePayload,
  CounterpartIndividualCreatePayload,
} from '@team-monite/sdk-api';

import { CounterpartAddressFormFields } from '../../CounterpartAddressForm';

export interface CounterpartIndividualFields
  extends CounterpartAddressFormFields {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isVendor: boolean;
  isCustomer: boolean;
}

export const prepareCounterpartIndividual = (
  individual?: CounterpartIndividualResponse
): CounterpartIndividualFields => {
  return {
    firstName: individual?.first_name ?? '',
    lastName: individual?.last_name ?? '',
    email: individual?.email ?? '',
    phone: individual?.phone ?? '',
    isCustomer: individual?.is_customer ?? false,
    isVendor: individual?.is_vendor ?? false,
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: { label: '', value: '' },
  };
};

export const prepareCounterpartIndividualCreate = ({
  firstName,
  lastName,
  email,
  phone,
  isCustomer,
  isVendor,
  ...address
}: CounterpartIndividualFields): CounterpartIndividualCreatePayload => {
  const { postalCode, ...restAddress } = address;
  return {
    first_name: firstName,
    last_name: lastName,
    is_customer: isCustomer,
    is_vendor: isVendor,
    phone,
    email,
    residential_address: {
      ...restAddress,
      country: restAddress.country.value as AllowedCountriesCodes,
      postal_code: postalCode,
    },
  };
};

export const prepareCounterpartIndividualUpdate = ({
  firstName,
  lastName,
  email,
  phone,
  isCustomer,
  isVendor,
}: CounterpartIndividualFields): CounterpartIndividualUpdatePayload => {
  return {
    first_name: firstName,
    last_name: lastName,
    is_customer: isCustomer,
    is_vendor: isVendor,
    phone,
    email,
  };
};
