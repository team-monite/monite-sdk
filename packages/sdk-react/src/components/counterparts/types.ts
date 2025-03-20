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
  country?: keyof typeof AllowedCountries;
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

/**
 * Represents the type of a counterpart in the system.
 */
export type CustomerType = 'customer' | 'vendor';

/**
 * Array of available customer types, an array that should contain either customer, vendor, or both.
 * This array can't be empty and if only one option is passed, the customer type section will be hidden
 * and the default customer type will be the one passed.
 * It is set to undefined at component level but defaults to ['customer', 'vendor'] through componentSettings
 */
export type CustomerTypes = CustomerType[];
