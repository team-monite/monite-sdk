import { CounterpartIndividualResponse } from '@team-monite/sdk-api';

export interface CounterpartIndividualFields {
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
  };
};

export const prepareCounterpartIndividualSubmit = ({
  firstName,
  lastName,
  email,
  phone,
  isCustomer,
  isVendor,
  ...address
}: CounterpartIndividualFields): CounterpartIndividualResponse => {
  return {
    first_name: firstName,
    last_name: lastName,
    is_customer: isCustomer,
    is_vendor: isVendor,
    phone,
    email,
  };
};
