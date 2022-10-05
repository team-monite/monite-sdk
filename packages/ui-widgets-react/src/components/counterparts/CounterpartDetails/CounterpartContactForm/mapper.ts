import {
  CreateCounterpartContactPayload,
  UpdateCounterpartContactPayload,
} from '@team-monite/sdk-api';
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
  contact?: CreateCounterpartContactPayload | UpdateCounterpartContactPayload
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
}: CounterpartContactFields):
  | CreateCounterpartContactPayload
  | UpdateCounterpartContactPayload => {
  return {
    first_name: firstName,
    last_name: lastName,
    phone,
    email,
    is_default: false,
    address: prepareCounterpartAddressSubmit(address),
  };
};
