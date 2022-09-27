import { CounterpartIndividual } from '@monite/sdk-api';
import {
  CounterpartAddressFormFields,
  prepareCounterpartAddress,
  prepareCounterpartAddressSubmit,
} from '../../CounterpartAddressForm';

export interface CounterpartIndividualFields
  extends CounterpartAddressFormFields {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isVendor: boolean;
  isCustomer: boolean;
  taxId: string;
}

export const prepareCounterpartIndividual = (
  individual?: CounterpartIndividual
): CounterpartIndividualFields => {
  return {
    firstName: individual?.first_name ?? '',
    lastName: individual?.last_name ?? '',
    email: individual?.email ?? '',
    phone: individual?.phone ?? '',
    isCustomer: individual?.is_customer ?? false,
    isVendor: individual?.is_vendor ?? false,
    taxId: individual?.tax_id ?? '',
    ...prepareCounterpartAddress(individual?.residential_address),
  };
};

export const prepareCounterpartIndividualSubmit = ({
  firstName,
  lastName,
  email,
  phone,
  isCustomer,
  isVendor,
  taxId,
  ...address
}: CounterpartIndividualFields): CounterpartIndividual => {
  return {
    first_name: firstName,
    last_name: lastName,
    tax_id: taxId,
    is_customer: isCustomer,
    is_vendor: isVendor,
    phone,
    email,
    residential_address: prepareCounterpartAddressSubmit(address),
  };
};
