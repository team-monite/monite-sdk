import { components } from '@/api';

import {
  CounterpartAddressFormFields,
  prepareCounterpartAddress,
  prepareCounterpartAddressSubmit,
} from '../CounterpartAddressForm';

export interface CounterpartContactFields extends CounterpartAddressFormFields {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const prepareCounterpartContact = (
  contact:
    | components['schemas']['CreateCounterpartContactPayload']
    | components['schemas']['UpdateCounterpartContactPayload']
    | undefined
): CounterpartContactFields => {
  return {
    firstName: contact?.first_name ?? '',
    lastName: contact?.last_name ?? '',
    email: contact?.email ?? '',
    phone: contact?.phone ?? '',
    ...prepareCounterpartAddress(contact?.address),
  };
};

export const prepareCounterpartContactSubmit = ({
  firstName,
  lastName,
  email,
  phone,
  ...address
}: CounterpartContactFields): components['schemas']['CreateCounterpartContactPayload'] => {
  return {
    first_name: firstName,
    last_name: lastName,
    phone,
    email,
    address: prepareCounterpartAddressSubmit(address),
  };
};
