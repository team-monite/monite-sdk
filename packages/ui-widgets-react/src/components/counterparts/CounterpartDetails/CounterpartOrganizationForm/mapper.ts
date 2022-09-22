import { CounterpartOrganization } from '@monite/sdk-api';
import {
  CounterpartAddressFormFields,
  prepareCounterpartAddress,
  prepareCounterpartAddressSubmit,
} from '../CounterpartAddressForm';

export interface CounterpartOrganizationFields
  extends CounterpartAddressFormFields {
  companyName: string;
  email: string;
  phone?: string;
  isVendor: boolean;
  isCustomer: boolean;
  vatNumber: string;
}

export const prepareCounterpartOrganization = (
  organization?: CounterpartOrganization
): CounterpartOrganizationFields => {
  return {
    companyName: organization?.legal_name ?? '',
    email: organization?.email ?? '',
    phone: organization?.phone ?? '',
    isCustomer: organization?.is_customer ?? false,
    isVendor: organization?.is_vendor ?? false,
    vatNumber: organization?.vat_number ?? '',
    ...prepareCounterpartAddress(organization?.registered_address),
  };
};

export const prepareCounterpartOrganizationSubmit = ({
  companyName,
  email,
  phone,
  isCustomer,
  isVendor,
  vatNumber,
  ...address
}: CounterpartOrganizationFields): CounterpartOrganization => {
  return {
    legal_name: companyName,
    vat_number: vatNumber,
    is_customer: isCustomer,
    is_vendor: isVendor,
    phone,
    email,
    registered_address: prepareCounterpartAddressSubmit(address),
    contacts: [],
  };
};
