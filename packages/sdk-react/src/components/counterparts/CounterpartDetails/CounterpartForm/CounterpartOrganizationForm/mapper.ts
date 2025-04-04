import { components } from '@/api';
import type { CounterpartDefaultValues } from '@/components/counterparts/types';

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
  organization?: components['schemas']['CounterpartOrganizationResponse'],
  defaultValues?: CounterpartDefaultValues
): CounterpartOrganizationFields => {
  const isCustomer = !!(defaultValues?.isCustomer ?? organization?.is_customer);

  const isVendor = !!(defaultValues?.isVendor ?? organization?.is_vendor);

  return {
    companyName: organization?.legal_name ?? '',
    email: organization?.email ?? '',
    phone: organization?.phone ?? '',
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

export const prepareCounterpartOrganizationCreate = ({
  companyName,
  email,
  phone,
  isCustomer,
  isVendor,
  ...address
}: CounterpartOrganizationFields): components['schemas']['CounterpartOrganizationCreatePayload'] => {
  const { postalCode, ...restAddress } = address;
  return {
    legal_name: companyName,
    is_customer: isCustomer,
    is_vendor: isVendor,
    phone,
    email,
    address: {
      ...restAddress,
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
}: CounterpartOrganizationFields): components['schemas']['CounterpartOrganizationUpdatePayload'] => {
  return {
    legal_name: companyName,
    is_customer: isCustomer,
    is_vendor: isVendor,
    phone,
    email,
  };
};
