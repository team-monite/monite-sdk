import { approvalPoliciesHandlers } from './approvalPolicies';
import { approvalRequestsHandlers } from './approvalRequests';
import { authenticationHandlers } from './authentication';
import { bankAccountsHandlers } from './bankAccounts';
import {
  counterpartHandlers,
  counterpartBankHandlers,
  counterpartContactHandlers,
  counterpartVatHandlers,
  counterpartsAddressesHandlers,
} from './counterparts';
import { currenciesHandlers } from './currencies';
import { entitiesHandlers } from './entities';
import { entityOnboardingDataHandlers } from './entitiyOnboardingData';
import { entityUsersHandlers } from './entityUsers';
import { filesHandlers } from './files';
import { lineItemsHandlers } from './lineItems';
import { measureUnitsHandlers } from './measureUnits';
import { onboardingHandlers } from './onboarding';
import { onboardingDocumentsHandlers } from './onboardingDocuments';
import { payableHandlers } from './payables';
import { paymentHandlers } from './payment';
import { paymentTermsHandlers } from './paymentTerms';
import { personsHandlers } from './persons';
import { productsHandlers } from './products';
import { receivableHandlers } from './receivables';
import { remindersHandlers } from './reminders';
import { rolesHandlers } from './roles';
import { tagsHandlers } from './tags';
import { vatRatesHandlers } from './vatRates';

export const handlers = [
  ...counterpartHandlers,
  ...entitiesHandlers,
  ...entityOnboardingDataHandlers,
  ...paymentHandlers,
  ...remindersHandlers,
  ...productsHandlers,
  ...vatRatesHandlers,
  ...counterpartBankHandlers,
  ...counterpartContactHandlers,
  ...counterpartsAddressesHandlers,
  ...counterpartVatHandlers,
  ...onboardingHandlers,
  ...onboardingDocumentsHandlers,
  ...currenciesHandlers,
  ...filesHandlers,
  ...payableHandlers,
  ...paymentTermsHandlers,
  ...personsHandlers,
  ...tagsHandlers,
  ...receivableHandlers,
  ...entityUsersHandlers,
  ...lineItemsHandlers,
  ...authenticationHandlers,
  ...bankAccountsHandlers,
  ...approvalPoliciesHandlers,
  ...approvalRequestsHandlers,
  ...measureUnitsHandlers,
  ...rolesHandlers,
  ...filesHandlers,
];
