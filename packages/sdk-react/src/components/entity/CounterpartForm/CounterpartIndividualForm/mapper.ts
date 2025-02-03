import { components } from '@/api';
import { CounterpartDefaultValues } from '@/components/counterparts/Counterpart.types';

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
    /**
     * @todo: Anashev. We have to split this types into 2.
     * More info in Jira task
     * @see {@link https://monite.atlassian.net/browse/DEV-7254}
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    country: '',
  };
};

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
      country,
      line1,
      line2,
      postal_code: postalCode,
      state,
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
