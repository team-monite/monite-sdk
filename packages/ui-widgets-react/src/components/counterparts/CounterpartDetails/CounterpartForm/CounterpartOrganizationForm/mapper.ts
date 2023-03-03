import {
  AllowedCountriesCodes,
  CounterpartOrganizationResponse,
  CounterpartOrganizationCreatePayload,
  CounterpartOrganizationUpdatePayload,
} from '@team-monite/sdk-api';

import { CounterpartAddressFormFields } from '../../CounterpartAddressForm';

export interface CounterpartOrganizationFields
  extends CounterpartAddressFormFields {
  companyName: string;
  email: string;
  phone?: string;
  isVendor: boolean;
  isCustomer: boolean;
}

export const prepareCounterpartOrganization = (
  organization?: CounterpartOrganizationResponse
): CounterpartOrganizationFields => {
  return {
    companyName: organization?.legal_name ?? '',
    email: organization?.email ?? '',
    phone: organization?.phone ?? '',
    isCustomer: organization?.is_customer ?? false,
    isVendor: organization?.is_vendor ?? false,
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: { label: '', value: '' },
  };
};

export const prepareCounterpartOrganizationCreate = ({
  companyName,
  email,
  phone,
  isCustomer,
  isVendor,
  ...address
}: CounterpartOrganizationFields): CounterpartOrganizationCreatePayload => {
  const { postalCode, ...restAddress } = address;
  return {
    legal_name: companyName,
    is_customer: isCustomer,
    is_vendor: isVendor,
    phone,
    email,
    registered_address: {
      ...restAddress,
      country: restAddress.country.value as AllowedCountriesCodes,
      postal_code: postalCode,
    },
  };
};

export const prepareCounterpartOrganizationUpdate = ({
  companyName,
  email,
  phone,
  isCustomer,
  isVendor,
}: CounterpartOrganizationFields): CounterpartOrganizationUpdatePayload => {
  return {
    legal_name: companyName,
    is_customer: isCustomer,
    is_vendor: isVendor,
    phone,
    email,
  };
};
