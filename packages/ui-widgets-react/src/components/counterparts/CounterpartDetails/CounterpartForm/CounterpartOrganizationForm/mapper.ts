import { CounterpartOrganizationResponse } from '@team-monite/sdk-api';

export interface CounterpartOrganizationFields {
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
  };
};

export const prepareCounterpartOrganizationSubmit = ({
  companyName,
  email,
  phone,
  isCustomer,
  isVendor,
  ...address
}: CounterpartOrganizationFields): CounterpartOrganizationResponse => {
  return {
    legal_name: companyName,
    is_customer: isCustomer,
    is_vendor: isVendor,
    phone,
    email,
  };
};
