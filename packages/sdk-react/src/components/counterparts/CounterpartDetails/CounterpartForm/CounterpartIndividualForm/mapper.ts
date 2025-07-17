import type { CounterpartAddressFormTypes } from '../../CounterpartAddressForm/validation';
import { components } from '@/api';
import { CounterpartDefaultValues } from '@/components/counterparts/types';

export interface CounterpartIndividualFields
  extends CounterpartAddressFormTypes {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isVendor: boolean;
  isCustomer: boolean;
}

/**
 * Prepares the individual object from the API response for use in the form by normalizing its fields.
 */
export const prepareCounterpartIndividual = (
  individual?: components['schemas']['CounterpartIndividualResponse'],
  defaultValues?: CounterpartDefaultValues
): CounterpartIndividualFields => {
  const isCustomer = !!(defaultValues?.isCustomer ?? individual?.is_customer);
  const isVendor = !!(defaultValues?.isVendor ?? individual?.is_vendor);

  return {
    firstName: individual?.first_name ?? '',
    lastName: individual?.last_name ?? '',
    email: individual?.email ?? '',
    phone: individual?.phone ?? '',
    isCustomer,
    isVendor,
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  };
};

/**
 * Prepares the individual object for submission by converting the form fields to the API format.
 */
export const prepareCounterpartIndividualCreate = ({
  firstName,
  lastName,
  email,
  phone,
  isCustomer,
  isVendor,
  city,
  country,
  line1,
  line2,
  postalCode,
  state,
}: CounterpartIndividualFields): components['schemas']['CounterpartIndividualCreatePayload'] => {
  return {
    first_name: firstName,
    last_name: lastName,
    is_customer: isCustomer,
    is_vendor: isVendor,
    phone,
    email,
    address: {
      city,
      country: country as components['schemas']['AllowedCountries'],
      line1,
      line2,
      postal_code: postalCode,
      state,
    },
  };
};

/**
 * Prepares the individual object for update by converting the form fields to the API format.
 */
export const prepareCounterpartIndividualUpdate = ({
  firstName,
  lastName,
  email,
  phone,
  isCustomer,
  isVendor,
}: CounterpartIndividualFields): components['schemas']['CounterpartIndividualUpdatePayload'] => {
  return {
    first_name: firstName,
    last_name: lastName,
    is_customer: isCustomer,
    is_vendor: isVendor,
    phone,
    email,
  };
};
