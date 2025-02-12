import { AllowedCountries } from '@/enums/AllowedCountries';

export enum CounterpartDataTestId {
  OrganizationView = 'OrganizationView',
  OrganizationForm = 'OrganizationForm',
  IndividualView = 'IndividualView',
  IndividualForm = 'IndividualForm',
  ContactPerson = 'ContactPerson',
  Address = 'Address',
  BankAccount = 'BankAccount',
  Vat = 'Vat',
}

/**
 * Default values for the form fields
 */
export type CounterpartDefaultValues = {
  isVendor?: boolean;
  isCustomer?: boolean;
};

export type CounterpartShowCategories = {
  /**
   * Show or hide `categories` section.
   * (
   *  `categories` section responsible for checks `isVendor` and `isCustomer`
   *  )
   *  Defaults to `true`.
   */
  showCategories: boolean;
};

interface BaseCounterpartOCR {
  email: string;
  phone?: string;
  isCustomer: boolean;
  isVendor: boolean;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country?: typeof AllowedCountries;
}

export interface DefaultValuesOCR<T extends BaseCounterpartOCR> {
  tax_id: string;
  counterpart: T;
}

export type DefaultValuesOCRIndividual = DefaultValuesOCR<
  BaseCounterpartOCR & { firstName?: string; lastName?: string }
>;

export type DefaultValuesOCROrganization = DefaultValuesOCR<
  BaseCounterpartOCR & { companyName: string }
>;
