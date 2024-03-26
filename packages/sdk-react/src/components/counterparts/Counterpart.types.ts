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
