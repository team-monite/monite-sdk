import {
  counterpartHandlers,
  counterpartBankHandlers,
  counterpartContactHandlers,
} from './counterparts';
import { counterpartsAddressesHandlers } from './counterpartsAddresses';
import { currenciesHandlers } from './currencies';
import { payableHandlers } from './payables';
import { tagsHandlers } from './tags';
import { workflowsHandlers } from './workflows';
import { receivableHandlers } from './receivables';
import { entityUsersHandlers } from './entityUsers';
import { onboardingHandlers } from './onboarding';

export const handlers = [
  ...counterpartHandlers,
  ...counterpartBankHandlers,
  ...counterpartContactHandlers,
  ...counterpartsAddressesHandlers,
  ...currenciesHandlers,
  ...payableHandlers,
  ...tagsHandlers,
  ...workflowsHandlers,
  ...receivableHandlers,
  ...entityUsersHandlers,
  ...onboardingHandlers,
];
