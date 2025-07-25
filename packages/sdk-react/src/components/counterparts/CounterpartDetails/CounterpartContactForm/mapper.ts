import {
  prepareCounterpartAddress,
  prepareCounterpartAddressSubmit,
} from '../CounterpartAddressForm';
import { type CounterpartContactFormFields } from './validation';
import { components } from '@/api';

/**
 * Prepares the contact object from the API response for use in the form by normalizing its fields.
 */
export const prepareCounterpartContact = (
  contact:
    | components['schemas']['CreateCounterpartContactPayload']
    | components['schemas']['UpdateCounterpartContactPayload']
    | undefined
): CounterpartContactFormFields => {
  return {
    firstName: contact?.first_name ?? '',
    lastName: contact?.last_name ?? '',
    email: contact?.email ?? '',
    phone: contact?.phone ?? '',
    ...prepareCounterpartAddress(contact?.address),
  };
};

/**
 * Prepares the contact object for submission by converting the form fields to the API format.
 */
export const prepareCounterpartContactSubmit = ({
  firstName,
  lastName,
  email,
  phone,
  ...address
}: CounterpartContactFormFields): components['schemas']['CreateCounterpartContactPayload'] => {
  return {
    first_name: firstName,
    last_name: lastName,
    phone,
    email,
    address: prepareCounterpartAddressSubmit(address),
  };
};
